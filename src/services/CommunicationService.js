import {Apis} from 'peerplaysjs-ws';
import {BlockchainUtils, ObjectUtils} from '../utility';
import {
  AssetActions,
  AppActions,
  AccountActions,
  SoftwareUpdateActions,
  SportActions,
  EventGroupActions,
  EventActions,
  BettingMarketActions,
  BettingMarketGroupActions,
  BinnedOrderBookActions,
  BalanceActions,
  RuleActions,
  LiquidityActions,
  MarketDrawerActions
} from '../actions';
import Immutable from 'immutable';
import {ObjectPrefix, Config, ChainTypes, LoadingStatus} from '../constants';
import {ChainValidation} from 'peerplaysjs-lib';
import _ from 'lodash';
import log from 'loglevel';
import DrawerActions from '../actions/DrawerActions';
import {I18n} from 'react-redux-i18n';
const TIMEOUT_LENGTH = 500;
const SYNC_MIN_INTERVAL = 1000; // 1 seconds

const {blockchainTimeStringToDate, getObjectIdPrefix, isRelevantObject} = BlockchainUtils;

// An array that holds all the objects that the application is currently subscribed to.
let subscriptions = [];

class CommunicationService {
  /**
   * Callback for change in the blockchain
   */
  static onUpdate(data) {
    // Split and categorize updated data from blockchain
    // We flatten it since the updatd data from blockchain is an array of array
    this.categorizeUpdatedDataFromBlockchain(_.flatten(data));

    // Only sync the data every given period
    if (
      !this.syncReduxStoreWithBlockchainTime ||
      new Date().getTime() - this.syncReduxStoreWithBlockchainTime > SYNC_MIN_INTERVAL
    ) {
      // Update and delete objects
      if (!this.updatedObjectsByObjectIdByObjectIdPrefix.isEmpty()) {
        this.updateObjects(this.updatedObjectsByObjectIdByObjectIdPrefix);
      }

      if (!this.deletedObjectIdsByObjectIdPrefix.isEmpty()) {
        this.deleteObjects(this.deletedObjectIdsByObjectIdPrefix);
      }

      // Clear data, after we have sync them
      this.updatedObjectsByObjectIdByObjectIdPrefix = Immutable.Map();
      this.deletedObjectIdsByObjectIdPrefix = Immutable.Map();
      // Set new time
      this.syncReduxStoreWithBlockchainTime = new Date().getTime();
    }
  }

  /**
   * Categorize the updated data from blockchain depending on the object id prefix
   */
  static categorizeUpdatedDataFromBlockchain(data) {
    // Parse the data given by blockchain and categorize them
    _.forEach(data, (object) => {
      // If updatedObject is object_id instead of an object, it means that object is deleted
      if (ChainValidation.is_object_id(object)) {
        const deletedObjectId = object;
        const objectIdPrefix = getObjectIdPrefix(deletedObjectId);

        // Add this to the list if it is relevant
        if (isRelevantObject(objectIdPrefix)) {
          this.deletedObjectIdsByObjectIdPrefix = this.deletedObjectIdsByObjectIdPrefix.update(
            objectIdPrefix,
            (list) => {
              if (!list) {
                list = Immutable.List();
              }

              return list.push(deletedObjectId);
            }
          );
        }
      } else {
        const updatedObjectId = object.id;
        const objectIdPrefix = getObjectIdPrefix(updatedObjectId);

        // Add this to the list if it is relevant
        if (isRelevantObject(objectIdPrefix)) {
          this.updatedObjectsByObjectIdByObjectIdPrefix = this.updatedObjectsByObjectIdByObjectIdPrefix.update( // eslint-disable-line
            objectIdPrefix,
            (map) => {
              // Use map instead of list for more efficient duplicate detection
              if (!map) {
                map = Immutable.Map();
              }

              return map.set(updatedObjectId, Immutable.fromJS(object));
            }
          );
        }
      }
    });
  }

  /**
   * Update objects in redux store
   */
  static updateObjects(updatedObjectsByObjectIdByObjectIdPrefix) {
    log.debug('Sync - updating', updatedObjectsByObjectIdByObjectIdPrefix.toJS());
    updatedObjectsByObjectIdByObjectIdPrefix.forEach((updatedObjectsByObjectId, objectIdPrefix) => {
      const updatedObjects = updatedObjectsByObjectId.toList();

      switch (objectIdPrefix) {
        case ObjectPrefix.ACCOUNT_PREFIX: {
          const myAccountId = this.getState().getIn(['account', 'account', 'id']);
          const softwareUpdateRefAccId = this.getState().getIn([
            'softwareUpdate',
            'referenceAccount',
            'id'
          ]);
          updatedObjects.forEach((updatedObject) => {
            const accountId = updatedObject.get('id');

            // Check if this account is related to my account or software update account
            if (accountId === myAccountId) {
              this.dispatch(AccountActions.setAccountAction(updatedObject));
            } else if (accountId === softwareUpdateRefAccId) {
              this.dispatch(SoftwareUpdateActions.setReferenceAccountAction(updatedObject));
            }
          });
          break;
        }

        case ObjectPrefix.ASSET_PREFIX: {
          this.dispatch(AssetActions.addOrUpdateAssetsAction(updatedObjects));
          break;
        }

        case ObjectPrefix.OPERATION_HISTORY_PREFIX: {
          // For each bet matched/ bet placed/ canceled happened on a betting market, refresh
          // the binned order book and total matched bets
          let bettingMarketIdsOfBinnedOrderBooksToBeRefreshed = Immutable.List();
          let matchedBetIds = Immutable.List();
          let canceledBetIds = Immutable.List();
          updatedObjects.forEach((updatedObject) => {
            const operationType = updatedObject.getIn(['op', 0]);

            if (operationType === ChainTypes.operations.bet_matched) {
              const betId = updatedObject.getIn(['op', 1, 'bet_id']);
              matchedBetIds = matchedBetIds.push(betId);
            } else if (operationType === ChainTypes.operations.bet_canceled) {
              const betId = updatedObject.getIn(['op', 1, 'bet_id']);
              canceledBetIds = canceledBetIds.push(betId);

              const currentRoute = this.getState()
                .getIn(['routing', 'locationBeforeTransitions']).pathname;
              let currentBMG;
              
              if (currentRoute) {
                let splitRoute = currentRoute.split('/');

                if (splitRoute.length === 4) {
                  currentBMG = splitRoute[splitRoute.length - 1];
                }
              }

              // Check to see if the deleted bet belongs to the current user and the bet belongs to
              //  the currently viewed BMG
              if (ObjectUtils.isMyBet(this.getState(), betId) &&
                  ObjectUtils.betBelongsToBMG(this.getState(), betId, currentBMG)) {
                // If it does, then trigger a loading screen on the placed bets tab.
                this.dispatch(
                  MarketDrawerActions.updateOpenBetsLoadingStatus(LoadingStatus.BET_DELETE)
                );
              }
            } else if (operationType === ChainTypes.operations.bet_place) {
              const bettingMarketId = updatedObject.getIn(['op', 1, 'betting_market_id']);
              bettingMarketIdsOfBinnedOrderBooksToBeRefreshed = bettingMarketIdsOfBinnedOrderBooksToBeRefreshed.push( // eslint-disable-line
                bettingMarketId
              );
            }
          });

          const betIds = matchedBetIds.concat(canceledBetIds);
          this.getPersistedBookieObjectsByIds(betIds).then((bets) => {
            const bettingMarketIds = bets.map((bet) => bet.get('betting_market_id'));
            bettingMarketIdsOfBinnedOrderBooksToBeRefreshed = bettingMarketIdsOfBinnedOrderBooksToBeRefreshed // eslint-disable-line
              .concat(bettingMarketIds)
              .toSet()
              .toList();
            // Refresh binned order books
            this.dispatch(
              BinnedOrderBookActions.refreshBinnedOrderBooksByBettingMarketIds(
                bettingMarketIdsOfBinnedOrderBooksToBeRefreshed
              )
            );

            const bettingMarketIdsOfMatchedBets = bets
              .filter((bet) => matchedBetIds.contains(bet.get('id')))
              .map((bet) => bet.get('betting_market_id'));
            // Update total matched bets
            this.dispatch(
              LiquidityActions.updateTotalMatchedBetsGivenBettingMarketIds(
                bettingMarketIdsOfMatchedBets
              )
            );
          });
          break;
        }

        case ObjectPrefix.GLOBAL_PROPERTY_PREFIX: {
          // Update global property
          const globalProperty = updatedObjects.get(0);

          if (globalProperty) {
            this.dispatch(AppActions.setBlockchainGlobalPropertyAction(globalProperty));
          }

          break;
        }

        case ObjectPrefix.DYNAMIC_GLOBAL_PROPERTY_PREFIX: {
          // Update dynamic global property
          const dynamicGlobalProperty = updatedObjects.get(0);

          if (dynamicGlobalProperty) {
            this.dispatch(
              AppActions.setBlockchainDynamicGlobalPropertyAction(dynamicGlobalProperty)
            );
          }

          break;
        }

        case ObjectPrefix.ACCOUNT_STAT_PREFIX: {
          const myAccountId = this.getState().getIn(['account', 'account', 'id']);
          const softwareUpdateRefAccId = this.getState().getIn([
            'softwareUpdate',
            'referenceAccount',
            'id'
          ]);
          updatedObjects.forEach((updatedObject) => {
            const ownerId = updatedObject.get('owner');

            // Check if this statistic is related to my account or software update account
            if (ownerId === myAccountId) {
              // Set the newest statistic
              // Retrieves new raw history
              this.dispatch(AccountActions.setStatistics(updatedObject));
            } else if (ownerId === softwareUpdateRefAccId) {
              // Set the newest statistic
              // Retrieves new raw history
              this.dispatch(SoftwareUpdateActions.setReferenceAccountStatistics(updatedObject));
            }
          });
          break;
        }

        case ObjectPrefix.ACCOUNT_BALANCE_PREFIX: {
          const myAccountId = this.getState().getIn(['account', 'account', 'id']);
          // Filter the balances related to the account
          const myAvailableBalances = updatedObjects.filter(
            (balance) => balance.get('owner') === myAccountId
          );
          this.dispatch(BalanceActions.addOrUpdateAvailableBalances(myAvailableBalances));

          break;
        }

        case ObjectPrefix.SPORT_PREFIX: {
          // Localize name
          const localizedUpdatedObject = ObjectUtils.localizeArrayOfObjects(updatedObjects, [
            'name'
          ]);
          this.dispatch(SportActions.addOrUpdateSportsAction(localizedUpdatedObject));
          break;
        }

        case ObjectPrefix.EVENT_GROUP_PREFIX: {
          // Localize name
          const localizedUpdatedObject = ObjectUtils.localizeArrayOfObjects(updatedObjects, [
            'name'
          ]);
          this.dispatch(EventGroupActions.addOrUpdateEventGroupsAction(localizedUpdatedObject));
          break;
        }

        case ObjectPrefix.EVENT_PREFIX: {
          // Localize name
          const localizedUpdatedObject = ObjectUtils.localizeArrayOfObjects(updatedObjects, [
            'name'
          ]);
          this.dispatch(EventActions.addOrUpdateEventsAction(localizedUpdatedObject));
          break;
        }

        case ObjectPrefix.RULE_PREFIX: {
          // Localize name
          const localizedUpdatedObject = ObjectUtils.localizeArrayOfObjects(updatedObjects, [
            'name',
            'description'
          ]);
          this.dispatch(RuleActions.addOrUpdateRulesAction(localizedUpdatedObject));
          break;
        }

        case ObjectPrefix.BETTING_MARKET_GROUP_PREFIX: {
          // Localize name
          const localizedUpdatedObject = ObjectUtils.localizeArrayOfObjects(updatedObjects, [
            'description'
          ]);
          this.dispatch(
            BettingMarketGroupActions.addOrUpdateBettingMarketGroupsAction(localizedUpdatedObject)
          );
          break;
        }

        case ObjectPrefix.BETTING_MARKET_PREFIX: {
          // Localize name
          const localizedUpdatedObject = ObjectUtils.localizeArrayOfObjects(updatedObjects, [
            'description',
            'payout_condition'
          ]);
          this.dispatch(
            BettingMarketActions.addOrUpdateBettingMarketsAction(localizedUpdatedObject)
          );
          // Get betting market id
          const bettingMarketIds = localizedUpdatedObject.map((object) => object.get('id'));
          // Delete the bets
          this.dispatch(DrawerActions.deleteBets(bettingMarketIds));
          // Get related binned order books
          this.dispatch(
            BinnedOrderBookActions.getBinnedOrderBooksByBettingMarketIds(bettingMarketIds)
          );
          break;
        }

        default:
          break;
      }
    });
  }

  /**
   * Delete objects from redux store
   */
  static deleteObjects(deletedObjectIdsByObjectIdPrefix) {
    log.debug('Sync - deleting', deletedObjectIdsByObjectIdPrefix.toJS());

    // Loop through the subscriptions and remove the ids of the deleted objects.

    // Reduce the results down to their ids and turn it into a vanilla js array.
    let deletedIds = deletedObjectIdsByObjectIdPrefix
      .reduce((accumulator, current) => accumulator.concat(current))
      .toJS();

    // Filter out the items that are being deleted.
    subscriptions = subscriptions.filter((item) => !deletedIds.includes(item));

    deletedObjectIdsByObjectIdPrefix.forEach((deletedObjectIds, objectIdPrefix) => {
      switch (objectIdPrefix) {
        case ObjectPrefix.ACCOUNT_PREFIX: {
          const myAccountId = this.getState().getIn(['account', 'account', 'id']);
          deletedObjectIdsByObjectIdPrefix.forEach((deletedObjectId) => {
            // Check if this account is related to my account
            if (deletedObjectId === myAccountId) {
              // If it is, logout the user
              // This normally shouldn't happen
              this.dispatch(AccountActions.logout());
            }
          });
          break;
        }

        case ObjectPrefix.ACCOUNT_BALANCE_PREFIX: {
          this.dispatch(BalanceActions.removeAvailableBalancesByIdsAction(deletedObjectIds));
          break;
        }

        case ObjectPrefix.SPORT_PREFIX: {
          this.dispatch(SportActions.removeSportsByIdsAction(deletedObjectIds));
          break;
        }

        case ObjectPrefix.EVENT_GROUP_PREFIX: {
          this.dispatch(EventGroupActions.removeEventGroupsByIdsAction(deletedObjectIds));
          break;
        }

        case ObjectPrefix.EVENT_PREFIX: {
          this.dispatch(EventActions.removeEventsByIdsAction(deletedObjectIds));
          break;
        }

        case ObjectPrefix.RULE_PREFIX: {
          this.dispatch(RuleActions.removeRulesByIdsAction(deletedObjectIds));
          break;
        }

        case ObjectPrefix.BETTING_MARKET_GROUP_PREFIX: {
          this.dispatch(
            BettingMarketGroupActions.removeBettingMarketGroupsByIdsAction(deletedObjectIds)
          );
          break;
        }

        case ObjectPrefix.BETTING_MARKET_PREFIX: {
          // Delete the bets
          this.dispatch(DrawerActions.deleteBets(deletedObjectIds));
          this.dispatch(BettingMarketActions.removeBettingMarketsByIdsAction(deletedObjectIds));
          break;
        }

        default:
          break;
      }
    });
  }

  /**
   * Call blokchain api
   * Route every call to blockchain api through this function, so we can see the logging
   * Also ensure the returned data is immutable
   */
  static callBlockchainApi(apiPluginName, methodName, params = []) {
    let apiPlugin;

    switch (apiPluginName) {
      case 'bookie_api': {
        apiPlugin = Apis.instance().bookie_api();
        break;
      }

      case 'history_api': {
        apiPlugin = Apis.instance().history_api();
        break;
      }

      case 'db_api': {
        apiPlugin = Apis.instance().db_api();
        break;
      }

      default:
        break;
    }

    if (apiPlugin) {
      // If it is get_objects, we want to push the id's into an array.
      if (methodName === 'get_objects') {
        let ids = params[0];

        // There are cases where an immutable list is passed instead of an array.
        // This converts it to an array.
        if (!Array.isArray(ids)) {
          ids = ids.toJS();
        }

        // Add the ids to the subscriptions array.
        // this code will create an array of unique ids, that way we don't need to duplicate
        // the same item if its requested more than once.
        subscriptions = Array.from(new Set(subscriptions.concat(ids)));
      }

      return apiPlugin
        .exec(methodName, params)
        .then((result) => {
          // Intercept and log
          if (
            methodName !== 'get_binned_order_book' &&
            methodName !== 'list_betting_market_groups' &&
            methodName !== 'list_betting_markets'
          ) {
            //&& JSON.stringify(params[0]) === "1.20.1688"){
            log.debug(
              `Call blockchain ${apiPluginName}\nMethod: ${methodName}\nParams: ${JSON.stringify(
                params
              )}\nResult: `,
              result
            );
          }

          return Immutable.fromJS(result);
        })
        .catch((error) => {
          // Intercept and log
          log.error(
            `Error in calling ${apiPluginName}\nMethod: ${methodName}\nParams: ${JSON.stringify(
              params
            )}\nError: `,
            error
          );
          // Return an empty response rather than throwing an error.
          return Immutable.fromJS({});
        });
    } else {
      // If it is not yet connected to blockchain, retry again after 3 seconds
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(this.callBlockchainApi(apiPluginName, methodName, params));
        }, 3000);
      });
    }
  }

  /**
   * Call blokchain bookie api
   * Route every call to blockchain bookie api through this function, so we can see the logging
   * Also ensure the returned data is immutable
   */
  static callBlockchainBookieApi(methodName, params = []) {
    return this.callBlockchainApi('bookie_api', methodName, params);
  }

  /**
   * Call blokchain db api
   * Route every call to blockchain db api through this function, so we can see the logging
   * Also ensure the returned data is immutable
   */
  static callBlockchainDbApi(methodName, params = []) {
    return this.callBlockchainApi('db_api', methodName, params);
  }

  /**
   * Call blokchain history api
   * Route every call to blockchain history api through this function, so we can see the logging
   */
  static callBlockchainHistoryApi(methodName, params = []) {
    return this.callBlockchainApi('history_api', methodName, params);
  }

  /**
   * Recursive timer to monitor the connection to the blockchain.
   *
   * @static
   * @memberof CommunicationService
   */
  static ping() {
    // Clear the timeout, this will help prevent zombie timeout loops.
    if (CommunicationService.PING_TIMEOUT) {
      CommunicationService.clearPing();
    }

    CommunicationService.PING_TIMEOUT = setTimeout(CommunicationService.ping, Config.pingInterval);
    CommunicationService.callBlockchainDbApi('get_objects', [['2.1.0']]);
  }

  /**
   * Clear the timeout for the websocket health check.
   *
   * @static
   * @memberof CommunicationService
   */
  static clearPing() {
    clearTimeout(CommunicationService.PING_TIMEOUT);
    CommunicationService.PING_TIMEOUT = null;
  }

  /**
   * Sync communication service with blockchain, so it always has the latest data
   */
  static syncWithBlockchain(dispatch, getState, attempt = 3) {
    // Check if db api is ready
    let db_api = Apis.instance().db_api();

    if (!db_api) {
      return Promise.reject(
        new Error('Api not found, please ensure Apis from peerplaysjs-ws is initialized first')
      );
    }

    // Get current blockchain data (dynamic global property and global property),
    // to ensure blockchain time is in sync
    // Also ask for core asset here
    return this.callBlockchainDbApi('get_objects', [['2.1.0', '2.0.0', Config.coreAsset]])
      .then((result) => {
        const blockchainDynamicGlobalProperty = result.get(0);
        const blockchainGlobalProperty = result.get(1);
        const coreAsset = result.get(2);
        const now = new Date().getTime();
        const headTime = blockchainTimeStringToDate(
          blockchainDynamicGlobalProperty.get('time')
        ).getTime();
        const delta = (now - headTime) / 1000;
        // Continue only if delta of computer current time and the blockchain time
        // is less than a minute
        const isBlockchainTimeDifferenceAcceptable = Math.abs(delta) < 60;

        // const isBlockchainTimeDifferenceAcceptable = true;
        if (isBlockchainTimeDifferenceAcceptable) {
          // Subscribe to blockchain callback so the store is always has the latest data
          const onUpdate = this.onUpdate.bind(this);
          return Apis.instance()
            .db_api()
            .exec('set_subscribe_callback', [onUpdate, true])
            .then(() => {
              // Sync success
              log.debug('Sync with Blockchain Success');
              // Set reference to dispatch and getState
              this.dispatch = dispatch;
              this.getState = getState;
              // Save dynamic global property
              dispatch(
                AppActions.setBlockchainDynamicGlobalPropertyAction(blockchainDynamicGlobalProperty)
              );
              // Save global property
              dispatch(AppActions.setBlockchainGlobalPropertyAction(blockchainGlobalProperty));
              // Save core asset
              dispatch(AssetActions.addOrUpdateAssetsAction([coreAsset]));

              // If there are no subscriptions we can return early.
              if (subscriptions.length <= 0) {
                return;
              }

              // Request all of the objects that are currently stored in the subscriptions array.
              // This will resubscribe to updates from the BlockChain.
              this.getObjectsByIds(subscriptions).then((results) => {
                let resultsByPrefix = Immutable.Map();

                results.map((item) => {
                  let id = item.get('id');
                  // Get the id prefix
                  let prefix = id
                    .split('.')
                    .slice(0, -1)
                    .join('.');

                  // get the current map
                  let current = resultsByPrefix.get(prefix);

                  // If the item doesn't exist create a new immutable map.
                  if (!current) {
                    current = Immutable.Map();
                  }

                  // Add the current item to the prefix map.
                  current = current.set(id, item);

                  // Update the resultsByPrefix map with the new or updated mapped objects.
                  resultsByPrefix = resultsByPrefix.set(prefix, current);

                  return item;
                });

                // Call update objects so the application can properly refresh its data.
                this.updateObjects(resultsByPrefix);
              });
            });
        } else {
          // throw new Error();
          throw new Error(I18n.t('connectionErrorModal.outOfSyncClock'));
        }
      })
      .catch((error) => {
        log.error('Sync with Blockchain Fail', error);
        let desyncError = I18n.t('connectionErrorModal.outOfSyncClock'),
          failToSyncError = I18n.t('connectionErrorModal.failToSync');

        // Retry if needed
        if (attempt > 0) {
          // Retry to connect
          log.info('Retry syncing with blockchain');
          return CommunicationService.syncWithBlockchain(dispatch, getState, attempt - 1);
        } else {
          if (error.message === desyncError) {
            throw new Error(desyncError);
          } else {
            // Give up, throw an error to be caught by the outer promise handler
            throw new Error(failToSyncError);
          }
        }
      });
  }

  /**
   * Get full account
   */
  static getFullAccount(accountNameOrId) {
    return this.callBlockchainDbApi('get_full_accounts', [[accountNameOrId], true]).then(
      (result) => {
        const fullAccount = result.getIn([0, 1]);
        // Return the full account
        return fullAccount;
      }
    );
  }

  /**
   * Fetch transaction history of an account given object id of the transaction
   * This function do the fetch recursively if there is more than 100 transactions between
   * startTxHistoryId and stopTxHistoryId
   */
  static fetchTransactionHistory(
    accountId,
    startTxHistoryId,
    stopTxHistoryId,
    limit = Number.MAX_SAFE_INTEGER
  ) {
    // Upper limit for getting transaction is 100
    const fetchUpperLimit = 100;
    // If the limit given is higher than upper limit, we need to call the api recursively
    let adjustedLimit = Math.min(Math.max(limit, 0), fetchUpperLimit);
    // 1.11.0 denotes the current time
    const currentTimeTransactionId = ObjectPrefix.OPERATION_HISTORY_PREFIX + '.0';
    startTxHistoryId = startTxHistoryId || currentTimeTransactionId;
    stopTxHistoryId = stopTxHistoryId || currentTimeTransactionId;

    let result = Immutable.List();
    // Note that startTxHistoryId is inclusive but stopTxHistoryId is not
    return this.callBlockchainHistoryApi('get_account_history', [
      accountId,
      stopTxHistoryId,
      adjustedLimit,
      startTxHistoryId
    ]).then((history) => {
      // Concat to the result
      result = result.concat(history);
      const remainingLimit = limit - adjustedLimit;

      if (history.size === adjustedLimit && remainingLimit > 0) {
        // if we still haven't got all the data, do this again recursively
        // Use the latest transaction id as new startTxHistoryId
        const newStartTxHistoryId = history.last().get('id');
        return this.fetchTransactionHistory(
          accountId,
          newStartTxHistoryId,
          stopTxHistoryId,
          remainingLimit
        ).then((nextHistory) => result.concat(nextHistory.shift()));
      } else {
        return history;
      }
    });
  }
  /**
   * Fetch recent history of an account  given object id of the transaction
   */
  static fetchRecentHistory(accountId, stopTxHistoryId, limit = Number.MAX_SAFE_INTEGER) {
    // 1.11.0 denotes the current time
    const currentTimeTransactionId = ObjectPrefix.OPERATION_HISTORY_PREFIX + '.0';
    const startTxHistoryId = currentTimeTransactionId;
    return this.fetchTransactionHistory(accountId, startTxHistoryId, stopTxHistoryId, limit);
  }

  /**
   * Get any blockchain object given their id
   */
  static getObjectsByIds(arrayOfObjectIds = []) {
    return this.callBlockchainDbApi('get_objects', [arrayOfObjectIds]).then((result) => result.filter((object) => !!object)); // eslint-disable-line
  }

  /**
   * Get persisted bookie objects given their ids
   * This applies to event, betting market group, betting market, and bet
   */
  static getPersistedBookieObjectsByIds(arrayOfObjectIds = []) {
    return this.callBlockchainBookieApi('get_objects', [arrayOfObjectIds]).then((result) => result.filter((object) => !!object)); // eslint-disable-line
  }

  /**
   * Get assets by id
   */
  static getAssetsByIds(assetIds) {
    return this.getObjectsByIds(assetIds);
  }

  /**
   * Get all sports
   */
  static getAllSports() {
    return this.callBlockchainDbApi('list_sports').then((sports) => ObjectUtils.localizeArrayOfObjects(sports, ['name'])); // eslint-disable-line
  }

  /**
   * Get event group given sport ids
   */
  static getEventGroupsBySportIds(sportIds) {
    if (sportIds instanceof Immutable.List) {
      sportIds = sportIds.toJS();
    }

    let promises = sportIds.map((sportId) => {
      let promise = this.callBlockchainDbApi('list_event_groups', [sportId]).then((eventGroups) => ObjectUtils.localizeArrayOfObjects(eventGroups, ['name'])); // eslint-disable-line

      return promise;
    });

    return Promise.all(promises).then((result) => Immutable.fromJS(result).flatten(true));
  }

  /**
   * Get events given array of event group ids (can be immutable)
   */
  static getEventsByEventGroupIds(eventGroupIds) {
    if (eventGroupIds instanceof Immutable.List) {
      eventGroupIds = eventGroupIds.toJS();
    }

    let promises = eventGroupIds.map((eventGroupId) => this.callBlockchainDbApi('list_events_in_group', [eventGroupId]).then((events) => { // eslint-disable-line
      const ids = events.toJS().map((event) => event.id);
      const localizedEvents = ObjectUtils.localizeArrayOfObjects(events, ['name', 'season']);

      // If there are no events, returned an empty object
      if (ids.length <= 0) {
        return localizedEvents;
      }

      // Subscribe to changes on the blockchain.
      return this.getEventsByIds(ids).then(() => localizedEvents);
    })
    );
    return Promise.all(promises).then((result) => Immutable.fromJS(result).flatten(true));
  }

  /**
   * Get betting market group given event ids
   */
  static getBettingMarketGroupsByEventIds(eventIds) {
    if (eventIds instanceof Immutable.List) {
      eventIds = eventIds.toJS();
    }

    let promises = eventIds.map((eventId) => this.callBlockchainDbApi(
      'list_betting_market_groups', [eventId]).then(
      (bettingMarketGroups) => {
        const ids = bettingMarketGroups.toJS().map((bmg) => bmg.id);
        const localizedMarketGroups = ObjectUtils.localizeArrayOfObjects(bettingMarketGroups, [
          'description'
        ]);

        // If there are no Betting Market Groups, returned an empty object
        if (ids.length <= 0) {
          return localizedMarketGroups;
        }

        // Subscribe to changes on the blockchain.
        return this.getBettingMarketGroupsByIds(ids).then(() => localizedMarketGroups);
      }
    )
    );
    return Promise.all(promises).then((result) => Immutable.fromJS(result).flatten(true));
  }

  /**
   * Get betting market given betting market group ids
   */
  static getBettingMarketsByBettingMarketGroupIds(bettingMarketGroupIds) {
    if (bettingMarketGroupIds instanceof Immutable.List) {
      bettingMarketGroupIds = bettingMarketGroupIds.toJS();
    }

    let promises = bettingMarketGroupIds.map((bettingMarketGroupId) =>
      this.callBlockchainDbApi('list_betting_markets', [bettingMarketGroupId]) // eslint-disable-line
        .then((bettingMarkets) => {
          // Call get_objects here so that we can subscribe to updates
          const ids = bettingMarkets.toJS().map((market) => market.id);
          const localizedBettingMarkets = ObjectUtils.localizeArrayOfObjects(bettingMarkets, [
            'description',
            'payout_condition'
          ]);

          // If there are no betting markets, returned an empty object
          if (ids.length <= 0) {
            return localizedBettingMarkets;
          }

          // Subscribe to changes on the blockchain.
          return this.getBettingMarketsByIds(ids).then(() => localizedBettingMarkets);
        })
    );
    return Promise.all(promises).then((result) => Immutable.fromJS(result).flatten(true));
  }

  /**
   * Get binned order books
   */
  static getBinnedOrderBooksByBettingMarketIds(bettingMarketIds, binningPrecision) {
    if (bettingMarketIds instanceof Immutable.List) {
      bettingMarketIds = bettingMarketIds.toJS();
    }

    // Create promises of getting binned order book for each betting market
    const promises = bettingMarketIds.map((bettingMarketId) => this.callBlockchainBookieApi(
      'get_binned_order_book', [bettingMarketId, binningPrecision])
    ); // eslint-disable-line

    return Promise.all(promises).then((result) => {
      let finalResult = Immutable.Map();
      // Modify the data structure of return objects, from list of binnedOrderBooks into
      // dictionary of binnedOrderBooks with betting market id as the key
      _.forEach(result, (binnedOrderBook, index) => {
        if (binnedOrderBook) {
          const bettingMarketId = bettingMarketIds[index];
          binnedOrderBook = binnedOrderBook.set('betting_market_id', bettingMarketId);
          finalResult = finalResult.set(bettingMarketId, binnedOrderBook);
        }
      });
      return Immutable.fromJS(finalResult);
    });
  }

  /**
   * Get total matched bets given array of betting market group ids (can be immutable)
   */
  static getTotalMatchedBetsByBettingMarketGroupIds(bettingMarketGroupIds) {
    if (bettingMarketGroupIds instanceof Immutable.List) {
      bettingMarketGroupIds = bettingMarketGroupIds.toJS();
    }

    let promises = bettingMarketGroupIds.map((bettingMarketGroupId) => this.callBlockchainBookieApi('get_total_matched_bet_amount_for_betting_market_group', [ // eslint-disable-line
      bettingMarketGroupId
    ])
    );

    return Promise.all(promises).then((result) => {
      // Map the result with betting market groupIds
      let totalMatchedBetsByMarketGroupId = Immutable.Map();
      _.forEach(result, (totalMatchedBet, index) => {
        if (totalMatchedBet) {
          const bettingMarketGroupId = bettingMarketGroupIds[index];
          totalMatchedBetsByMarketGroupId = totalMatchedBetsByMarketGroupId.set(
            bettingMarketGroupId,
            totalMatchedBet
          );
        }
      });
      return totalMatchedBetsByMarketGroupId;
    });
  }

  /**
   * Get betting market by id
   */
  static getBettingMarketsByIds(bettingMarketIds) {
    return this.getObjectsByIds(bettingMarketIds).then((result) => ObjectUtils.localizeArrayOfObjects(result, ['description', 'payout_condition'])); // eslint-disable-line
  }

  /**
   * Get persisted betting market by id
   */
  static getPersistedBettingMarketsByIds(bettingMarketIds) {
    return this.getPersistedBookieObjectsByIds(bettingMarketIds).then((result) => ObjectUtils.localizeArrayOfObjects(result, ['description', 'payout_condition'])); // eslint-disable-line
  }

  /**
   * Get betting market group by id
   */
  static getBettingMarketGroupsByIds(bettingMarketGroupIds) {
    return this.getObjectsByIds(bettingMarketGroupIds).then((result) => ObjectUtils.localizeArrayOfObjects(result, ['description']) // eslint-disable-line
    );
  }

  /**
   * Get persisted betting market group by id
   */
  static getPersistedBettingMarketGroupsByIds(bettingMarketGroupIds) {
    return this.getPersistedBookieObjectsByIds(bettingMarketGroupIds).then((result) => ObjectUtils.localizeArrayOfObjects(result, ['description'])); // eslint-disable-line
  }

  /**
   * Get event by id
   */
  static getEventsByIds(eventIds) {
    return this.getObjectsByIds(eventIds).then((result) => ObjectUtils.localizeArrayOfObjects(result, ['name'])); // eslint-disable-line
  }

  /**
   * Get event by id
   */
  static getPersistedEventsByIds(eventIds) {
    return this.getPersistedBookieObjectsByIds(eventIds).then((result) => ObjectUtils.localizeArrayOfObjects(result, ['name'])); // eslint-disable-line
  }

  /**
   * Get event group by id
   */
  static getEventGroupsByIds(eventGroupIds) {
    return this.getObjectsByIds(eventGroupIds).then((result) => ObjectUtils.localizeArrayOfObjects(result, ['name'])); // eslint-disable-line
  }

  /**
   * Get sport by id
   */
  static getSportsByIds(sportIds) {
    return this.getObjectsByIds(sportIds).then((result) => ObjectUtils.localizeArrayOfObjects(result, ['name'])); // eslint-disable-line
  }

  /**
   * Get rules
   */
  static getRulesByIds(ruleIds) {
    return this.getObjectsByIds(ruleIds).then((result) => ObjectUtils.localizeArrayOfObjects(result, ['description', 'name'])); // eslint-disable-line
  }

  /**
   * Get global betting statistics
   */
  static getGlobalBettingStatistics() {
    return this.callBlockchainDbApi('get_global_betting_statistics');
  }

  /**
   * Get the transaction free for the provided operation
   *
   * @static
   * @param {string} operation ID of the operation
   * @param {string} asset ID of the asset to describe the fee with
   * @memberof CommunicationService
   */
  static getOperationFee(operation, asset) {
    // Default to PPY.
    if (!asset) {
      asset = Config.coreAsset;
    }

    return this.callBlockchainDbApi('get_required_fees', [[[operation]], asset]);
  }

  /**
   * Withdraw money
   */
  static withdraw() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, TIMEOUT_LENGTH);
    });
  }

  /**
   * Get deposit address
   */
  static getDepositAddress() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('THISISDUMMYDEPOSITADDRESSFORANYACCOUNTID');
      }, TIMEOUT_LENGTH);
    });
  }
}

CommunicationService.dispatch = null;
CommunicationService.getState = null;
CommunicationService.PING_TIMEOUT = null;

/**
 * Updated blockchain objects in the following structure
 * {
 *   objectIdPrefix1: {
 *     objectId1: object1,
 *     objectId2: object2,
 *     ....
 *   },
 *   objectIdPrefix2: {
 *     objectId3: object3
 *     objectId4: object4
 *     ...
 *   },
 *   ...
 * }
 *
 */
CommunicationService.updatedObjectsByObjectIdByObjectIdPrefix = Immutable.Map();
/**
 * Deleted blockchain object ids has the following structure
 * {
 *   objectIdPrefix1: [deletedObjectIds1],
 *   objectIdPrefix2: [deletedObjectIds2],
 *   ...
 */
CommunicationService.deletedObjectIdsByObjectIdPrefix = Immutable.Map();
CommunicationService.syncReduxStoreWithBlockchainTime = null;

export default CommunicationService;
