import { Apis } from 'peerplaysjs-ws';
import { BlockchainUtils, ObjectUtils } from '../utility';
import {
  AssetActions,
  AppActions,
  AuthActions,
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
  LiquidityActions
} from '../actions';
import Immutable from 'immutable';
import { ObjectPrefix, Config, ChainTypes } from '../constants';
import { ChainValidation } from 'peerplaysjs-lib';
import _ from 'lodash';
import dummyData from '../dummyData';
import log from 'loglevel';
import DrawerActions from '../actions/DrawerActions';
import { I18n } from 'react-redux-i18n';
const TIMEOUT_LENGTH = 500;
const SYNC_MIN_INTERVAL = 1000; // 1 seconds
const { blockchainTimeStringToDate, getObjectIdPrefix, isRelevantObject, getObjectIdInstanceNumber } = BlockchainUtils;

class CommunicationService {
  static dispatch = null;
  static getState = null;
  static PING_TIMEOUT = null;
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
  static updatedObjectsByObjectIdByObjectIdPrefix = Immutable.Map();
  /**
   * Deleted blockchain object ids has the following structure
   * {
   *   objectIdPrefix1: [deletedObjectIds1],
   *   objectIdPrefix2: [deletedObjectIds2],
   *   ...
   */
  static deletedObjectIdsByObjectIdPrefix = Immutable.Map();
  static syncReduxStoreWithBlockchainTime;

  /**
   * Callback for change in the blockchain
   */
  static onUpdate(data) {
    // Split and categorize updated data from blockchain
    // We flatten it since the updatd data from blockchain is an array of array
    this.categorizeUpdatedDataFromBlockchain(_.flatten(data));
    // Only sync the data every given period
    if (!this.syncReduxStoreWithBlockchainTime || (new Date().getTime() - this.syncReduxStoreWithBlockchainTime) > SYNC_MIN_INTERVAL ) {
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

        // TODO: remove dummy data later
        if (Config.useDummyData) {
          // If we are using dummy data, ignore any real time update for dummy data object
          // which is sport, event_group, event, rule, bmg, bm
          // Coz it will generate conflict
          if (objectIdPrefix === ObjectPrefix.SPORT_PREFIX ||
              objectIdPrefix === ObjectPrefix.EVENT_GROUP_PREFIX ||
              objectIdPrefix === ObjectPrefix.EVENT_PREFIX ||
              objectIdPrefix === ObjectPrefix.RULE_PREFIX ||
              objectIdPrefix === ObjectPrefix.BETTING_MARKET_GROUP_PREFIX ||
              objectIdPrefix === ObjectPrefix.BETTING_MARKET_PREFIX) {
            return true;
          }
        }

        // Add this to the list if it is relevant
        if (isRelevantObject(objectIdPrefix)) {
          this.deletedObjectIdsByObjectIdPrefix = this.deletedObjectIdsByObjectIdPrefix.update(objectIdPrefix, list => {
            if (!list) list = Immutable.List();
            return list.push(deletedObjectId);
          })
        }

      } else {
        const updatedObjectId = object.id;
        const objectIdPrefix = getObjectIdPrefix(updatedObjectId);

        // TODO: remove dummy data later
        if (Config.useDummyData) {
          // If we are using dummy data, ignore any real time update for dummy data object
          // which is sport, event_group, event, rule, bmg, bm
          // Coz it will generate conflict
          if (objectIdPrefix === ObjectPrefix.SPORT_PREFIX ||
              objectIdPrefix === ObjectPrefix.EVENT_GROUP_PREFIX ||
              objectIdPrefix === ObjectPrefix.EVENT_PREFIX ||
              objectIdPrefix === ObjectPrefix.RULE_PREFIX ||
              objectIdPrefix === ObjectPrefix.BETTING_MARKET_GROUP_PREFIX ||
              objectIdPrefix === ObjectPrefix.BETTING_MARKET_PREFIX) {
            return true;
          }
        }

        // Add this to the list if it is relevant
        if (isRelevantObject(objectIdPrefix)) {
          this.updatedObjectsByObjectIdByObjectIdPrefix = this.updatedObjectsByObjectIdByObjectIdPrefix.update(objectIdPrefix, map => {
            // Use map instead of list for more efficient duplicate detection
            if (!map) map = Immutable.Map();
            return map.set(updatedObjectId, Immutable.fromJS(object));
          })
        }
      }
    })
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
          const softwareUpdateRefAccId = this.getState().getIn(['softwareUpdate', 'referenceAccount', 'id']);
          updatedObjects.forEach((updatedObject) => {
            const accountId = updatedObject.get('id');
            // Check if this account is related to my account or software update account
            if (accountId === myAccountId) {
              this.dispatch(AccountActions.setAccountAction(updatedObject));
            } else if (accountId === softwareUpdateRefAccId) {
              this.dispatch(SoftwareUpdateActions.setReferenceAccountAction(updatedObject));
            }
          })
          break;
        }
        case ObjectPrefix.ASSET_PREFIX: {
          this.dispatch(AssetActions.addOrUpdateAssetsAction(updatedObjects));
          break;
        }
        case ObjectPrefix.OPERATION_HISTORY_PREFIX: {
          // For each bet matched/ bet placed/ canceled happened on a betting market, refresh the binned order book and total matched bets
          let bettingMarketIdsOfBinnedOrderBooksToBeRefreshed = Immutable.List();
          let matchedBetIds = Immutable.List();
          let canceledBetIds = Immutable.List();
          updatedObjects.forEach(updatedObject => {
            const operationType = updatedObject.getIn(['op', 0]);
            if (operationType === ChainTypes.operations.bet_matched) {
              const betId = updatedObject.getIn(['op', 1, 'bet_id']);
              matchedBetIds = matchedBetIds.push(betId);
            } else if (operationType === ChainTypes.operations.bet_canceled) {
              const betId = updatedObject.getIn(['op', 1, 'bet_id']);
              canceledBetIds = canceledBetIds.push(betId);
            } else if (operationType === ChainTypes.operations.bet_place) {
              const bettingMarketId = updatedObject.getIn(['op', 1, 'betting_market_id']);
              bettingMarketIdsOfBinnedOrderBooksToBeRefreshed = bettingMarketIdsOfBinnedOrderBooksToBeRefreshed.push(bettingMarketId);
            }
          })

          const betIds = matchedBetIds.concat(canceledBetIds);
          this.getPersistedBookieObjectsByIds(betIds).then(bets => {
            const bettingMarketIds = bets.map(bet => bet.get('betting_market_id'));
            bettingMarketIdsOfBinnedOrderBooksToBeRefreshed = bettingMarketIdsOfBinnedOrderBooksToBeRefreshed.concat(bettingMarketIds).toSet().toList();
            // Refresh binned order books
            this.dispatch(BinnedOrderBookActions.refreshBinnedOrderBooksByBettingMarketIds(bettingMarketIdsOfBinnedOrderBooksToBeRefreshed));

            const bettingMarketIdsOfMatchedBets = bets.filter(bet => matchedBetIds.contains(bet.get('id'))).map(bet => bet.get('betting_market_id'));
            // Update total matched bets
            this.dispatch(LiquidityActions.updateTotalMatchedBetsGivenBettingMarketIds(bettingMarketIdsOfMatchedBets))
          });
          break;
        }
        case ObjectPrefix.GLOBAL_PROPERTY_PREFIX: {
          // Update global property
          const globalProperty = updatedObjects.get(0);
          if (globalProperty) this.dispatch(AppActions.setBlockchainGlobalPropertyAction(globalProperty));
          break;
        }
        case ObjectPrefix.DYNAMIC_GLOBAL_PROPERTY_PREFIX: {
          // Update dynamic global property
          const dynamicGlobalProperty = updatedObjects.get(0);
          if (dynamicGlobalProperty) this.dispatch(AppActions.setBlockchainDynamicGlobalPropertyAction(dynamicGlobalProperty));
          break;
        }
        case ObjectPrefix.ACCOUNT_STAT_PREFIX: {
          const myAccountId = this.getState().getIn(['account', 'account', 'id']);
          const softwareUpdateRefAccId = this.getState().getIn(['softwareUpdate', 'referenceAccount', 'id']);
          updatedObjects.forEach((updatedObject) => {
            const ownerId = updatedObject.get('owner');
            // Check if this statistic is related to my account or software update account
            if (ownerId === myAccountId) {
              // Set the newest statistic
              this.dispatch(AccountActions.setStatistics(updatedObject)); // Retrieves new raw history
            } else if (ownerId === softwareUpdateRefAccId) {
              // Set the newest statistic
              this.dispatch(SoftwareUpdateActions.setReferenceAccountStatistics(updatedObject)); // Retrieves new raw history
            }
          })
          break;
        }
        case ObjectPrefix.ACCOUNT_BALANCE_PREFIX: {
          const myAccountId = this.getState().getIn(['account', 'account', 'id']);
          // Filter the balances related to the account
          const myAvailableBalances = updatedObjects.filter( balance => balance.get('owner') === myAccountId);
          this.dispatch(BalanceActions.addOrUpdateAvailableBalances(myAvailableBalances));

          break;
        }
        case ObjectPrefix.SPORT_PREFIX: {
          // Localize name
          const localizedUpdatedObject = ObjectUtils.localizeArrayOfObjects(updatedObjects, ['name']);
          this.dispatch(SportActions.addOrUpdateSportsAction(localizedUpdatedObject));
          break;
        }
        case ObjectPrefix.EVENT_GROUP_PREFIX: {
          // Localize name
          const localizedUpdatedObject = ObjectUtils.localizeArrayOfObjects(updatedObjects, ['name']);
          this.dispatch(EventGroupActions.addOrUpdateEventGroupsAction(localizedUpdatedObject));
          break;
        }
        case ObjectPrefix.EVENT_PREFIX: {
          // Localize name
          const localizedUpdatedObject = ObjectUtils.localizeArrayOfObjects(updatedObjects, ['name']);
          this.dispatch(EventActions.addOrUpdateEventsAction(localizedUpdatedObject));
          break;
        }
        case ObjectPrefix.RULE_PREFIX: {
          // Localize name
          const localizedUpdatedObject = ObjectUtils.localizeArrayOfObjects(updatedObjects, ['name', 'description']);
          this.dispatch(RuleActions.addOrUpdateRulesAction(localizedUpdatedObject));
          break;
        }
        case ObjectPrefix.BETTING_MARKET_GROUP_PREFIX: {
          // Localize name
          const localizedUpdatedObject = ObjectUtils.localizeArrayOfObjects(updatedObjects, ['description']);
          this.dispatch(BettingMarketGroupActions.addOrUpdateBettingMarketGroupsAction(localizedUpdatedObject));
          break;
        }
        case ObjectPrefix.BETTING_MARKET_PREFIX: {
          // Localize name
          const localizedUpdatedObject = ObjectUtils.localizeArrayOfObjects(updatedObjects, ['description', 'payout_condition']);
          this.dispatch(BettingMarketActions.addOrUpdateBettingMarketsAction(localizedUpdatedObject));
          // Get betting market id
          const bettingMarketIds = localizedUpdatedObject.map(object => object.get('id'));
          // Delete the bets
          this.dispatch(DrawerActions.deleteBets(bettingMarketIds));
          // Get related binned order books
          this.dispatch(BinnedOrderBookActions.getBinnedOrderBooksByBettingMarketIds(bettingMarketIds));
          break;
        }
        default: break;
      }

    })

  }

  /**
   * Delete objects from redux store
   */
  static deleteObjects(deletedObjectIdsByObjectIdPrefix) {
    log.debug('Sync - deleting', deletedObjectIdsByObjectIdPrefix.toJS());
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
          this.dispatch(BettingMarketGroupActions.removeBettingMarketGroupsByIdsAction(deletedObjectIds));
          break;
        }
        case ObjectPrefix.BETTING_MARKET_PREFIX: {
          // Delete the bets
          this.dispatch(DrawerActions.deleteBets(deletedObjectIds));
          this.dispatch(BettingMarketActions.removeBettingMarketsByIdsAction(deletedObjectIds));
          break;
        }
        default: break;
      }

    });
  }

  /**
   * Call blokchain api
   * Route every call to blockchain api through this function, so we can see the logging
   * Also ensure the returned data is immutable
   */
  static callBlockchainApi(apiPluginName, methodName, params=[]) {
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
      default: break;
    }
    if (apiPlugin) {
      return apiPlugin.exec(methodName, params).then((result) => {
        // Intercept and log
        if(methodName !== 'get_binned_order_book' && methodName !== "list_betting_market_groups" && methodName !== "list_betting_markets" ){ //&& JSON.stringify(params[0]) === "1.20.1688"){
          log.debug(`Call blockchain ${apiPluginName}\nMethod: ${methodName}\nParams: ${JSON.stringify(params)}\nResult: `, result);
        }
        return Immutable.fromJS(result);
      }).catch((error) => {
        // Intercept and log
        log.error(`Error in calling ${apiPluginName}\nMethod: ${methodName}\nParams: ${JSON.stringify(params)}\nError: `, error);
        // Return an empty response rather than throwing an error.
        return Immutable.fromJS({});
      });
    } else {
      // If it is not yet connected to blockchain, retry again after 3 seconds
      return new Promise((resolve, reject) => {
        setTimeout(() =>{
          resolve(this.callBlockchainApi(apiPluginName, methodName, params))
        }, 3000)
      })
    }
  }

  /**
   * Call blokchain bookie api
   * Route every call to blockchain bookie api through this function, so we can see the logging
   * Also ensure the returned data is immutable
   */
  static callBlockchainBookieApi(methodName, params=[]) {
    return this.callBlockchainApi('bookie_api', methodName, params);
  }


  /**
   * Call blokchain db api
   * Route every call to blockchain db api through this function, so we can see the logging
   * Also ensure the returned data is immutable
   */
  static callBlockchainDbApi(methodName, params=[]) {
    return this.callBlockchainApi('db_api', methodName, params);
  }

  /**
   * Call blokchain history api
   * Route every call to blockchain history api through this function, so we can see the logging
   */
  static callBlockchainHistoryApi(methodName, params=[]) {
    return this.callBlockchainApi('history_api', methodName, params);
  }

  /**
   * Recursive timer to monitor the connection to the blockchain.
   */
  static ping() {
    // Clear the timeout, this will help prevent zombie timeout loops.
    if (CommunicationService.PING_TIMEOUT) {
      clearTimeout(CommunicationService.PING_TIMEOUT);
    }

    CommunicationService.PING_TIMEOUT = setTimeout(CommunicationService.ping, Config.pingInterval)
    CommunicationService.callBlockchainDbApi('get_objects', [['2.1.0']]);
  } 

  /**
   * Sync communication service with blockchain, so it always has the latest data
   */
  static syncWithBlockchain(dispatch, getState, attempt=3) {
    return new Promise((resolve, reject) => {
      // Check if db api is ready
      let db_api = Apis.instance().db_api();
      if (!db_api) {
        return reject(new Error('Api not found, please ensure Apis from peerplaysjs-ws is initialized first'));
      }

      // Get current blockchain data (dynamic global property and global property), to ensure blockchain time is in sync
      // Also ask for core asset here
      this.callBlockchainDbApi('get_objects', [['2.1.0', '2.0.0', Config.coreAsset]]).then( result => {
        const blockchainDynamicGlobalProperty = result.get(0);
        const blockchainGlobalProperty = result.get(1);
        const coreAsset = result.get(2);
        const now = new Date().getTime();
        const headTime = blockchainTimeStringToDate(blockchainDynamicGlobalProperty.get('time')).getTime();
        const delta = (now - headTime)/1000;
        // Continue only if delta of computer current time and the blockchain time is less than a minute
        let isBlockchainTimeDifferenceAcceptable = Math.abs(delta) < 60;
        // const isBlockchainTimeDifferenceAcceptable = true;
        if (isBlockchainTimeDifferenceAcceptable) {
          // Subscribe to blockchain callback so the store is always has the latest data
          const onUpdate = this.onUpdate.bind(this);
          return Apis.instance().db_api().exec( 'set_subscribe_callback', [ onUpdate, true ] ).then(() => {            
            // Sync success
            log.debug('Sync with Blockchain Success');
            // Set reference to dispatch and getState
            this.dispatch = dispatch;
            this.getState = getState;
            // Save dynamic global property
            dispatch(AppActions.setBlockchainDynamicGlobalPropertyAction(blockchainDynamicGlobalProperty));
            // Save global property
            dispatch(AppActions.setBlockchainGlobalPropertyAction(blockchainGlobalProperty));
            // Save core asset
            dispatch(AssetActions.addOrUpdateAssetsAction([coreAsset]));

            // Set the ping up.
            CommunicationService.ping();

            // Attach an error handler to the socket.
            CommunicationService.addSocketCloseListener();

            resolve();
          });
        } else {
          throw new Error(I18n.t('connectionErrorModal.outOfSyncClock'));
        }
      }).catch( error => {
        log.error('Sync with Blockchain Fail', error);
        let desyncError = I18n.t('connectionErrorModal.outOfSyncClock'),
          failToSyncError = I18n.t('connectionErrorModal.failToSync');

        // Retry if needed
        if (attempt > 0) {
          // Retry to connect
          log.info('Retry syncing with blockchain');
          return CommunicationService.syncWithBlockchain(dispatch, getState, attempt-1);
        } else {
          if (error.message === desyncError){
            throw new Error(desyncError);
          } else {
            // Give up, throw an error to be caught by the outer promise handler
            throw new Error(failToSyncError);
          }
        }
      }).catch( error => {
        // Caught any error thrown by the recursive promise and reject it
        reject(error);
      });
    });
  }

  /**
   * Attach an event listener to the socket so we can listen for it to close the connection.
   * 
   * @static
   * @memberof CommunicationService
   */
  static addSocketCloseListener () {
    let api = Apis.instance();

    // Make sure it has an instance of chainsocket, and a websocket attached to it.
    if (api && api.ws_rpc && api.ws_rpc.ws) {
      let socket = api.ws_rpc.ws;
      // Remove it first to make sure there is only ever one listener firing on close.
      socket.removeEventListener('close', CommunicationService.onSocketClose);
      socket.addEventListener('close', CommunicationService.onSocketClose);
    }
  }

  /**
   * Handle the closure of the socket connection.
   * 
   * @static
   * @param {any} error 
   * @memberof CommunicationService
   */
  static onSocketClose (error) {
    // Call the action to redirect the user to the logged out screen.
    CommunicationService.dispatch(AuthActions.confirmLogout());
  }

  /**
   * Get full account
   */
  static getFullAccount(accountNameOrId) {
    return this.callBlockchainDbApi('get_full_accounts', [[accountNameOrId], true]).then( result => {
      const fullAccount = result.getIn([0, 1]);
      // Return the full account
      return fullAccount;
    });
  }

  /**
   * Fetch transaction history of an account given object id of the transaction
   * This function do the fetch recursively if there is more than 100 transactions between startTxHistoryId and stopTxHistoryId
   */
  static fetchTransactionHistory(accountId, startTxHistoryId, stopTxHistoryId, limit=Number.MAX_SAFE_INTEGER) {
    // Upper limit for getting transaction is 100
    const fetchUpperLimit = 100;
      // If the limit given is higher than upper limit, we need to call the api recursively
    let adjustedLimit = Math.min(Math.max(limit,0), fetchUpperLimit);
    // 1.11.0 denotes the current time
    const currentTimeTransactionId = ObjectPrefix.OPERATION_HISTORY_PREFIX + '.0';
    startTxHistoryId = startTxHistoryId || currentTimeTransactionId;
    stopTxHistoryId = stopTxHistoryId || currentTimeTransactionId;

    let result = Immutable.List();
    // Note that startTxHistoryId is inclusive but stopTxHistoryId is not
    return this.callBlockchainHistoryApi('get_account_history',
                  [ accountId, stopTxHistoryId, adjustedLimit, startTxHistoryId]).then((history) => {
                    // Concat to the result
                    result = result.concat(history);
                    const remainingLimit = limit-adjustedLimit;
                    if (history.size === adjustedLimit && remainingLimit > 0) {
                      // if we still haven't got all the data, do this again recursively
                      // Use the latest transaction id as new startTxHistoryId
                      const newStartTxHistoryId = history.last().get('id');
                      return this.fetchTransactionHistory(accountId, newStartTxHistoryId, stopTxHistoryId, remainingLimit).then((nextHistory) => {
                        // Append the result, don't forget to remove the first one since it's inclusive
                        return result.concat(nextHistory.shift());
                      })
                    } else {
                      return history;
                    }
                  })
  }
 /**
  * Fetch recent history of an account  given object id of the transaction
  */
  static fetchRecentHistory(accountId, stopTxHistoryId, limit=Number.MAX_SAFE_INTEGER) {
    // TODO: remove dummy data later
    if (Config.useDummyData) {
      return this.fetchDummyTransactionHistory(accountId, stopTxHistoryId);
    } else {
      // 1.11.0 denotes the current time
      const currentTimeTransactionId = ObjectPrefix.OPERATION_HISTORY_PREFIX + '.0';
      const startTxHistoryId = currentTimeTransactionId;
      return this.fetchTransactionHistory(accountId, startTxHistoryId, stopTxHistoryId, limit);
    }

  }

  /**
   * Get any blockchain object given their id
   */
  static getObjectsByIds(arrayOfObjectIds = []) {
    return this.callBlockchainDbApi('get_objects', [arrayOfObjectIds]).then(result => {
      // Remove empty object
      return result.filter(object => !!object);
    });
  }

  /**
   * Get persisted bookie objects given their ids
   * This applies to event, betting market group, betting market, and bet
   */
  static getPersistedBookieObjectsByIds(arrayOfObjectIds = []) {
    return this.callBlockchainBookieApi('get_objects', [arrayOfObjectIds]).then(result => {
      // Remove empty object
      return result.filter(object => !!object);
    });
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
    if (Config.useDummyData) {
      return this.getDummyAllSports();
    } else {
      return this.callBlockchainDbApi('list_sports').then((sports) => {
        // Replace name with english name
        return ObjectUtils.localizeArrayOfObjects(sports, ['name']);
      });
    }
  }

  /**
   * Get event group given sport ids
   */
  static getEventGroupsBySportIds(sportIds) {
    if (Config.useDummyData) {
      return this.getDummyEventGroupsBySportIds(sportIds);
    } else {
      if (sportIds instanceof Immutable.List) sportIds = sportIds.toJS();
      let promises = sportIds.map((sportId) => {
        return this.callBlockchainDbApi('list_event_groups', [sportId]).then(eventGroups => {
          // Replace name with english name
          return ObjectUtils.localizeArrayOfObjects(eventGroups, ['name']);
        });
      })
      return Promise.all(promises).then((result) => {
        // Return in immutable format
        return Immutable.fromJS(result).flatten(true);
      })
    }
  }

  /**
   * Get events given array of event group ids (can be immutable)
   */
  static getEventsByEventGroupIds(eventGroupIds) {
    if (Config.useDummyData) {
      return this.getDummyEventsByEventGroupIds(eventGroupIds);
    } else {
      if (eventGroupIds instanceof Immutable.List) eventGroupIds = eventGroupIds.toJS();
      let promises = eventGroupIds.map((eventGroupId) => {
        return this.callBlockchainDbApi('list_events_in_group', [eventGroupId]).then(events => {
          const ids = events.toJS().map(event => event.id);
          const localizedEvents = ObjectUtils.localizeArrayOfObjects(events, ['name', 'season']);
          
          // If there are no events, returned an empty object
          if (ids.length <= 0) {
            return localizedEvents;
          }

          // Subscribe to changes on the blockchain.
          return this.getEventsByIds(ids).then(() => {
            // Replace name with english name
            return localizedEvents;
          })
        });
      })
      return Promise.all(promises).then((result) => {
        // Return in immutable format
        return Immutable.fromJS(result).flatten(true);
      })
    }
  }

  /**
   * Get betting market group given event ids
   */
  static getBettingMarketGroupsByEventIds(eventIds) {
    if (Config.useDummyData) {
      return this.getDummyBettingMarketGroupsByEventIds(eventIds);
    } else {
      if (eventIds instanceof Immutable.List) eventIds = eventIds.toJS();
      let promises = eventIds.map((eventId) => {
        return this.callBlockchainDbApi('list_betting_market_groups', [eventId]).then(bettingMarketGroups => {
          const ids = bettingMarketGroups.toJS().map(bmg => bmg.id);
          const localizedMarketGroups = ObjectUtils.localizeArrayOfObjects(bettingMarketGroups, ['description']);

          // If there are no Betting Market Groups, returned an empty object
          if (ids.length <= 0) {
            return localizedMarketGroups;
          }

          // Subscribe to changes on the blockchain.
          return this.getBettingMarketGroupsByIds(ids).then(() => {
            // Replace name with english name
            return localizedMarketGroups;
          });
        });
      })
      return Promise.all(promises).then((result) => {
        // Return in immutable format
        return Immutable.fromJS(result).flatten(true);
      })
    }
  }

  /**
   * Get betting market given betting market group ids
   */
  static getBettingMarketsByBettingMarketGroupIds(bettingMarketGroupIds) {
    if (Config.useDummyData) {
      return this.getDummyBettingMarketsByBettingMarketGroupIds(bettingMarketGroupIds);
    } else {
      if (bettingMarketGroupIds instanceof Immutable.List) bettingMarketGroupIds = bettingMarketGroupIds.toJS();
      let promises = bettingMarketGroupIds.map((bettingMarketGroupId) => {
        return this.callBlockchainDbApi('list_betting_markets', [bettingMarketGroupId]).then(bettingMarkets => {
          // Call get_objects here so that we can subscribe to updates
          const ids = bettingMarkets.toJS().map(market => market.id);
          const localizedBettingMarkets = ObjectUtils.localizeArrayOfObjects(bettingMarkets, ['description', 'payout_condition']);

          // If there are no betting markets, returned an empty object
          if (ids.length <= 0) {
            return localizedBettingMarkets;
          }

          // Subscribe to changes on the blockchain.
          return this.getBettingMarketsByIds(ids).then(() => {
            // Replace name with english name
            return localizedBettingMarkets;
          })
        });
      })
      return Promise.all(promises).then((result) => {
        // Return in immutable format
        return Immutable.fromJS(result).flatten(true);
      })
    }
  }


  /**
   * Get binned order books
   */
  static getBinnedOrderBooksByBettingMarketIds(bettingMarketIds, binningPrecision) {
    if (Config.useDummyData) {
      return this.getDummyBinnedOrderBooksByBettingMarketIds(bettingMarketIds, binningPrecision);
    } else {
      // return this.getGeneratedBinnedOrderBooksByBettingMarketIds(bettingMarketIds, binningPrecision);
      if (bettingMarketIds instanceof Immutable.List) bettingMarketIds = bettingMarketIds.toJS();
      // Create promises of getting binned order book for each betting market
      const promises = bettingMarketIds.map( (bettingMarketId) => {
        return this.callBlockchainBookieApi('get_binned_order_book', [bettingMarketId, binningPrecision]);
      });
      return Promise.all(promises).then( (result) => {
        let finalResult = Immutable.Map();
        // Modify the data structure of return objects, from list of binnedOrderBooks into dictionary of binnedOrderBooks with betting market id as the key
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
  }

  /**
   * Get total matched bets given array of betting market group ids (can be immutable)
   */
  static getTotalMatchedBetsByBettingMarketGroupIds(bettingMarketGroupIds) {
    if (Config.useDummyData) {
      return this.getDummyTotalMatchedBetsByBettingMarketGroupIds(bettingMarketGroupIds);
    } else {
      if (bettingMarketGroupIds instanceof Immutable.List) bettingMarketGroupIds = bettingMarketGroupIds.toJS();
      let promises = bettingMarketGroupIds.map((bettingMarketGroupId) => {
        return this.callBlockchainBookieApi('get_total_matched_bet_amount_for_betting_market_group', [bettingMarketGroupId]);
      })

      return Promise.all(promises).then((result) => {
        // Map the result with betting market groupIds
        let totalMatchedBetsByMarketGroupId = Immutable.Map();
        _.forEach(result, (totalMatchedBet, index) => {
          if (totalMatchedBet) {
            const bettingMarketGroupId = bettingMarketGroupIds[index];
            totalMatchedBetsByMarketGroupId = totalMatchedBetsByMarketGroupId.set(bettingMarketGroupId, totalMatchedBet);
          }
        })
        return totalMatchedBetsByMarketGroupId;
      })
    }
  }

  /**
   * Get betting market by id
   */
  static getBettingMarketsByIds(bettingMarketIds) {
    if (Config.useDummyData) {
      return this.getDummyObjectsByIds(bettingMarketIds);
    } else {
      return this.getObjectsByIds(bettingMarketIds).then(result => {
        // Localize string
        return ObjectUtils.localizeArrayOfObjects(result, ['description', 'payout_condition']);
      });
    }
  }

  /**
   * Get persisted betting market by id
   */
  static getPersistedBettingMarketsByIds(bettingMarketIds) {
    if (Config.useDummyData) {
      return this.getDummyObjectsByIds(bettingMarketIds);
    } else {
      return this.getPersistedBookieObjectsByIds(bettingMarketIds).then(result => {
        // Localize string
        return ObjectUtils.localizeArrayOfObjects(result, ['description', 'payout_condition']);
      });
    }
  }

  /**
   * Get betting market group by id
   */
  static getBettingMarketGroupsByIds(bettingMarketGroupIds) {
    if (Config.useDummyData) {
      return this.getDummyObjectsByIds(bettingMarketGroupIds);
    } else {
      return this.getObjectsByIds(bettingMarketGroupIds).then(result => {
        // Localize string
        return ObjectUtils.localizeArrayOfObjects(result, ['description']);
      });
    }
  }

  /**
   * Get persisted betting market group by id
   */
  static getPersistedBettingMarketGroupsByIds(bettingMarketGroupIds) {
    if (Config.useDummyData) {
      return this.getDummyObjectsByIds(bettingMarketGroupIds);
    } else {
      return this.getPersistedBookieObjectsByIds(bettingMarketGroupIds).then(result => {
        // Localize string
        return ObjectUtils.localizeArrayOfObjects(result, ['description']);
      });
    }
  }


  /**
   * Get event by id
   */
  static getEventsByIds(eventIds) {
    if (Config.useDummyData) {
      return this.getDummyObjectsByIds(eventIds);
    } else {
      return this.getObjectsByIds(eventIds).then(result => {
        // Localize string
        return ObjectUtils.localizeArrayOfObjects(result, ['name']);
      });
    }
  }


  /**
   * Get event by id
   */
  static getPersistedEventsByIds(eventIds) {
    if (Config.useDummyData) {
      return this.getDummyObjectsByIds(eventIds);
    } else {
      return this.getPersistedBookieObjectsByIds(eventIds).then(result => {
        // Localize string
        return ObjectUtils.localizeArrayOfObjects(result, ['name']);
      });
    }
  }

  /**
   * Get event group by id
   */
  static getEventGroupsByIds(eventGroupIds) {
    if (Config.useDummyData) {
      return this.getDummyObjectsByIds(eventGroupIds);
    } else {
      return this.getObjectsByIds(eventGroupIds).then(result => {
        // Localize string
        return ObjectUtils.localizeArrayOfObjects(result, ['name']);
      });
    }
  }

  /**
   * Get sport by id
   */
  static getSportsByIds(sportIds) {
    if (Config.useDummyData) {
      return this.getDummyObjectsByIds(sportIds);
    } else {
      return this.getObjectsByIds(sportIds).then(result => {
        // Localize string
        return ObjectUtils.localizeArrayOfObjects(result, ['name']);
      });
    }
  }

  /**
   * Get rules
   */
  static getRulesByIds(ruleIds) {
    if (Config.useDummyData) {
      return this.getDummyObjectsByIds(ruleIds);
    } else {
      return this.getObjectsByIds(ruleIds).then(result => {
        // Localize string
        return ObjectUtils.localizeArrayOfObjects(result, ['description', 'name']);
      });
    }
  }

  /**
   * Get global betting statistics
   */
  static getGlobalBettingStatistics() {
    if (Config.useDummyData) {
      return this.getDummyGlobalBettingStatistics();
    } else {
      return this.callBlockchainDbApi('get_global_betting_statistics');
    }
  }

  /**
   * Get the transaction free for the provided operation 
   * 
   * @static
   * @param {string} operation ID of the operation
   * @param {string} asset ID of the asset to describe the fee with
   * @memberof CommunicationService
   */
  static getOperationFee (operation, asset) {

    // Default to PPY.
    if (!asset) {
      asset = Config.coreAsset;
    }

    return this.callBlockchainDbApi('get_required_fees', [[[operation]], asset]);
  }

  //========================================================================
  // FETCH DUMMY OBJECT IMPLEMENTATION  - BEGINNING
  //========================================================================
  /**
   * Fetch dummy transaction history
   */
  static fetchDummyTransactionHistory(accountId, stopTxHistoryId) {
    // TODO: remove later
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let history = Immutable.fromJS(dummyData.history.generateHistory(accountId));
        if (stopTxHistoryId) {
          history = history.filter((transaction) => {
            const transactionIdInstanceNumber = getObjectIdInstanceNumber(transaction.get('id'));
            const stopTxHistoryIdInstanceNumber = getObjectIdInstanceNumber(stopTxHistoryId);
            return transactionIdInstanceNumber > stopTxHistoryIdInstanceNumber;
          })
        }
        resolve(history);
      }, TIMEOUT_LENGTH);
    });
  }

  /**
   * Get all sports
   */
  static getDummyAllSports() {
    // TODO: Replace later
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(Immutable.fromJS(dummyData.sports));
      }, TIMEOUT_LENGTH);
    });
  }

  /**
   * Get event groups given array of sport ids (can be immutable)
   */
  static getDummyEventGroupsBySportIds(sportIds) {
    // TODO: Replace later
    const promises = sportIds.map( (sportId) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const filteredResult = _.filter(dummyData.eventGroups, (item) => {
            return (item.sport_id === sportId);
          });
          resolve(filteredResult);
        }, TIMEOUT_LENGTH);
      });
    });
    return Promise.all(promises).then( result => {
      return Immutable.fromJS(_.flatten(result));
    });
  }

  /**
   * Get active events given array of sport ids (can be immutable)
   */
  static getDummyActiveEventsBySportIds(sportIds) {
    // TODO: Remove later
    const promises = sportIds.map( (sportId) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const currentTime = new Date().getTime();
          const eventGroupsById = _.keyBy(dummyData.eventGroups, (eventGroup) => eventGroup.id);
          const filteredResult = _.filter(dummyData.events, (item) => {
            const isActive = (item.start_time - currentTime > 0);
            const eventGroup = eventGroupsById[item.event_group_id];
            const isSportRelated = eventGroup && eventGroup.sport_id === sportId;
            return isActive && isSportRelated;
          });
          resolve(filteredResult);
        }, TIMEOUT_LENGTH);
      });
    });
    return Promise.all(promises).then( result => {
      return Immutable.fromJS(_.flatten(result));
    });
  }

  /**
   * Get events given array of event group ids (can be immutable)
   */
  static getDummyEventsByEventGroupIds(eventGroupIds) {
    // TODO: Remove later
    const promises = eventGroupIds.map( (eventGroupId) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const currentTime = new Date().getTime();
          const filteredResult = _.filter(dummyData.events, (item) => {
            const isActive = (item.start_time - currentTime > 0);;
            const isRelated = item.event_group_id === eventGroupId;
            return isActive && isRelated;
          });
          resolve(filteredResult);
        }, TIMEOUT_LENGTH);
      });
    });
    return Promise.all(promises).then( result => {
      return Immutable.fromJS(_.flatten(result));
    });
  }


  /**
   * Get betting market groups given event ids
   */
  static getDummyBettingMarketGroupsByEventIds(eventIds) {
    // TODO: Remove later
    const promises = eventIds.map( (eventId) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const filteredResult = _.filter(dummyData.bettingMarketGroups, (item) => {
            return (item.event_id === eventId);
          });
          resolve(filteredResult);
        }, TIMEOUT_LENGTH);
      });
    });
    return Promise.all(promises).then( result => {
      return Immutable.fromJS(_.flatten(result));
    });
  }

  /**
   * Get betting markets given betting market group ids
   */
  static getDummyBettingMarketsByBettingMarketGroupIds(bettingMarketGroupIds) {
    // TODO: Remove later
    const promises = bettingMarketGroupIds.map( (bettingMarketGroupId) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const filteredResult = _.filter(dummyData.bettingMarkets, (item) => {
            return (item.group_id === bettingMarketGroupId);
          });
          resolve(filteredResult);
        }, TIMEOUT_LENGTH);
      });
    });
    return Promise.all(promises).then( result => {
      return Immutable.fromJS(_.flatten(result));
    });
  }


  /**
   * Get dummy blockchain objects given their ids
   */
  static getDummyObjectsByIds(arrayOfObjectIds = []) {
    // TODO: Remove later
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const filteredResult = [];
        // Iterate every object in dummy data to find the matching object
        let allObjects = [];
        _.forEach(dummyData, (item) => {
          allObjects = _.concat(allObjects, item);
        })
        _.forEach(allObjects, (item) => {
          if (arrayOfObjectIds.includes(item.id)) {
            filteredResult.push(item);
          }
        })
        resolve(Immutable.fromJS(filteredResult));
      }, TIMEOUT_LENGTH);
    });
  }

  /*
   * Generate random binned order books for betting market
   */
  static generateRandomBinnedOrderBook(bettingMarketId) {
    let binnedOrderBook = {
      betting_market_id: bettingMarketId,
      aggregated_back_bets: [],
      aggregated_lay_bets: []
    };
    const createRandomOrderBookBin = () => {
      return {
        odds: Number((1.01 + Math.round(Math.random() * 100) / 100).toFixed(2)),
        price: Number((Math.round(Math.random() * 100) / 100).toFixed(2)),
      };
    }
    for(let i = 0; i < 10; i++) {
      binnedOrderBook.aggregated_back_bets.push(createRandomOrderBookBin());
      binnedOrderBook.aggregated_lay_bets.push(createRandomOrderBookBin());
    }
    return Immutable.fromJS(binnedOrderBook);
  }

   /**
    * Get generated binned order books by betting market ids
    */
  static getGeneratedBinnedOrderBooksByBettingMarketIds(bettingMarketIds, binningPrecision) {
    // TODO: Remove later
    // Create promises of getting binned order book for each betting market
    const promises = bettingMarketIds.map( (bettingMarketId) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(this.generateRandomBinnedOrderBook(bettingMarketId));
        }, TIMEOUT_LENGTH);
      });
    });
    return Promise.all(promises).then( (result) => {
      let finalResult = Immutable.Map();
      // Modify the data structure of return objects, from list of binnedOrderBooks into dictionary of binnedOrderBooks with betting market id as the key
      _.forEach(result, (item, index) => {
        const bettingMarketId = item.get('betting_market_id');
        finalResult = finalResult.set(bettingMarketId, item);
      });
      return Immutable.fromJS(finalResult);
    });
  }

  /**
   * Get binned order books
   */
  static getDummyBinnedOrderBooksByBettingMarketIds(bettingMarketIds, binningPrecision) {
    // TODO: Remove later
    // Create promises of getting binned order book for each betting market
    const promises = bettingMarketIds.map( (bettingMarketId) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Get related binned order book from dummy data
          let filteredResult = _.find(dummyData.binnedOrderBooks, (item) => {
            return item.betting_market_id === bettingMarketId;
          });
          // TODO: the real binned_order_book object shouldn't have betting_market_id, append betting_market_id to binnedOrderBook here when blockchain is ready
          resolve(filteredResult);
        }, TIMEOUT_LENGTH);
      });
    });
    return Promise.all(promises).then( (result) => {
      const finalResult = {};
      // Modify the data structure of return objects, from list of binnedOrderBooks into dictionary of binnedOrderBooks with betting market id as the key
      _.forEach(result, (item, index) => {
        if (!_.isEmpty(item)) {
          const bettingMarketId = item['betting_market_id'];
          finalResult[bettingMarketId] = result[index];
        }
      });
      return Immutable.fromJS(finalResult);
    });
  }

  /**
   * Get total matched bets given array of betting market group ids (can be immutable)
   */
  static getDummyTotalMatchedBetsByBettingMarketGroupIds(bettingMarketGroupIds) {
    // TODO: Remove later
    const promises = bettingMarketGroupIds.map( (bettingMarketGroupId) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const amountObject = {
            amount: Math.floor((Math.random() * 1000000) + 100000),
            asset_id: Config.coreAsset
          }
          resolve(amountObject);
        }, TIMEOUT_LENGTH);
      });
    });
    return Promise.all(promises).then( result => {
      const finalResult = {};
      bettingMarketGroupIds.forEach((bettingMarketGroupId, index) => {
        if (result[index]) {
          finalResult[bettingMarketGroupId] = result[index];
        }
      })
      return Immutable.fromJS(finalResult);
    });
  }

  /**
   * Get global betting statistics
   */
  static getDummyGlobalBettingStatistics() {
    // TODO: Remove later
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(Immutable.fromJS(dummyData.globalBettingStatistics));
      }, TIMEOUT_LENGTH);
    });
  }

  //========================================================================
  // FETCH DUMMY OBJECT IMPLEMENTATION - END
  //========================================================================

  /**
   * Withdraw money
   */
  static withdraw(withdrawAmount, walletAddress) {
    // TODO: Replace later
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, TIMEOUT_LENGTH);
    });
  }

  /**
   * Get deposit address
   */
  static getDepositAddress(accountId) {
    // TODO: Replace later
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('THISISDUMMYDEPOSITADDRESSFORANYACCOUNTID');
      }, TIMEOUT_LENGTH);
    });
  }

}

export default CommunicationService;
