import { Apis } from 'graphenejs-ws';
import { BlockchainUtils } from '../utility';
import {
  AssetActions,
  AppActions,
  AccountActions,
  NotificationActions,
  SoftwareUpdateActions,
  SportActions,
  EventGroupActions,
  CompetitorActions,
  EventActions,
  BettingMarketActions,
  BettingMarketGroupActions,
  BinnedOrderBookActions,
  BetActions,
  BalanceActions,
  HistoryActions
} from '../actions';
import Immutable from 'immutable';
import { ObjectPrefix } from '../constants';
import { ChainValidation } from 'graphenejs-lib';
import _ from 'lodash';
import dummyData from '../dummyData';
import log from 'loglevel';
const TIMEOUT_LENGTH = 500;
const SYNC_MIN_INTERVAL = 1000; // 1 seconds
const { blockchainTimeStringToDate, getObjectIdPrefix, isRelevantObject } = BlockchainUtils;

class CommunicationService {
  static dispatch = null;
  static getState = null;
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
          // TODO:
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
              // Check if this account made new transaction, if that's the case update the notification
              const mostRecentOp = this.getState().getIn(['account', 'statistics', 'most_recent_op']);
              const updatedMostRecentOp = updatedObject.get('most_recent_op')
              const hasMadeNewTransaction = updatedMostRecentOp !== mostRecentOp;
              if (hasMadeNewTransaction) {
                this.dispatch(NotificationActions.checkForNewNotification());
                this.dispatch(HistoryActions.checkForNewTransactionHistory());
              }
              // Set the newest statistic
              this.dispatch(AccountActions.setStatisticsAction(updatedObject));
            } else if (ownerId === softwareUpdateRefAccId) {
              // Check if this account made new transaction, if that's the case check for software update
              const mostRecentOp = this.getState().getIn(['softwareUpdate', 'referenceAccountStatistics', 'most_recent_op']);
              const updatedMostRecentOp = updatedObject.get('most_recent_op')
              const hasMadeNewTransaction = updatedMostRecentOp !== mostRecentOp;
              if (hasMadeNewTransaction) {
                this.dispatch(SoftwareUpdateActions.checkForSoftwareUpdate());
              }
              // Set the newest statistic
              this.dispatch(SoftwareUpdateActions.setReferenceAccountStatisticsAction(updatedObject));
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
          this.dispatch(SportActions.addOrUpdateSportsAction(updatedObjects));
          break;
        }
        case ObjectPrefix.COMPETITOR_PREFIX: {
          this.dispatch(CompetitorActions.addOrUpdateCompetitorsAction(updatedObjects));
          break;
        }
        case ObjectPrefix.EVENT_GROUP_PREFIX: {
          this.dispatch(EventGroupActions.addOrUpdateEventGroupsAction(updatedObjects));
          break;
        }
        case ObjectPrefix.EVENT_PREFIX: {
          this.dispatch(EventActions.addOrUpdateEventsAction(updatedObjects));
          break;
        }
        case ObjectPrefix.BETTING_MARKET_GROUP_PREFIX: {
          this.dispatch(BettingMarketGroupActions.addOrUpdateBettingMarketGroupsAction(updatedObjects));
          break;
        }
        case ObjectPrefix.BETTING_MARKET_PREFIX: {
          this.dispatch(BettingMarketActions.addOrUpdateBettingMarketsAction(updatedObjects));
          break;
        }
        case ObjectPrefix.BET_PREFIX: {
          const myAccountId = this.getState().getIn(['account', 'account', 'id']);
          let bettingMarketIds = Immutable.List();
          updatedObjects.forEach((updatedObject) => {
            const bettorId = updatedObject.get('bettor_id');
            const bettingMarketId = updatedObject.get('betting_market_id');
            bettingMarketIds = bettingMarketIds.push(bettingMarketId);
            // Check if this bet is related to me
            if (bettorId === myAccountId) {
              // Assume all bet to be ongoing for now, resolved bets should not be able to be deleted or updated
              this.dispatch(BetActions.addOrUpdateOngoingBetsAction([updatedObject]));
            }
          });

          // Update related binned order books
          this.dispatch(BinnedOrderBookActions.refreshBinnedOrderBooksByBettingMarketIds(bettingMarketIds));
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
        case ObjectPrefix.OPERATION_HISTORY_PREFIX: {
          break;
        }
        case ObjectPrefix.SPORT_PREFIX: {
          this.dispatch(SportActions.removeSportsByIdsAction(deletedObjectIds));
          break;
        }
        case ObjectPrefix.COMPETITOR_PREFIX: {
          this.dispatch(CompetitorActions.removeCompetitorsByIdsAction(deletedObjectIds));
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
        case ObjectPrefix.BETTING_MARKET_GROUP_PREFIX: {
          this.dispatch(BettingMarketGroupActions.removeBettingMarketGroupsByIdsAction(deletedObjectIds));
          break;
        }
        case ObjectPrefix.BETTING_MARKET_PREFIX: {
          this.dispatch(BettingMarketActions.removeBettingMarketsByIdsAction(deletedObjectIds));
          break;
        }
        case ObjectPrefix.BET_PREFIX: {
          // Assume all bet to be ongoing for now, resolved bets should not be able to be deleted or updated
          this.dispatch(BetActions.removeBetsByIdsAction(deletedObjectIds));
          break;
        }
        case ObjectPrefix.ACCOUNT_BALANCE_PREFIX: {
          this.dispatch(BalanceActions.removeAvailableBalancesByIdsAction(deletedObjectIds));
          break;
        }
        default: break;
      }

    });
  }

  /**
   * Call blokchain db api
   * Route every call to blockchain db api through this function, so we can see the logging
   * Also ensure the returned data is immutable
   */
  static callBlockchainDbApi(methodName, params) {
    return Apis.instance().db_api().exec(methodName, params).then((result) => {
      // Intercept and log
      log.debug(`Call blockchain DB Api\nMethod: ${methodName}\nParams: ${JSON.stringify(params)}\nResult: `, result);
      return Immutable.fromJS(result);
    }).catch((error) => {
      // Intercept and log
      log.error(`Error in calling DB Api\nMethod: ${methodName}\nParams: ${JSON.stringify(params)}\nError: `, error);
      throw error;
    })
  }

  /**
   * Call blokchain history api
   * Route every call to blockchain history api through this function, so we can see the logging
   */
  static callBlockchainHistoryApi(methodName, params) {
    return Apis.instance().history_api().exec(methodName, params).then((result) => {
      // Intercept and log
      log.debug(`Call blockchain History Api\nMethod: ${methodName}\nParams: ${JSON.stringify(params)}\nResult: `, result);
      return Immutable.fromJS(result);
    }).catch((error) => {
      // Intercept and log
      log.error(`Error in calling History Api\nMethod: ${methodName}\nParams: ${JSON.stringify(params)}\nError: `, error);
      throw error;
    })
  }

  /**
   * Sync communication service with blockchain, so it always has the latest data
   */
  static syncWithBlockchain(dispatch, getState, attempt=3) {
    return new Promise((resolve, reject) => {
      // Check if db api is ready
      let db_api = Apis.instance().db_api();
      if (!db_api) {
        return reject(new Error('Api not found, please ensure Apis from graphenejs-ws is initialized first'));
      }

      // Get current blockchain data (dynamic global property and global property), to ensure blockchain time is in sync
      // Also ask for core asset here
      this.callBlockchainDbApi('get_objects', [['2.1.0', '2.0.0', '1.3.0']]).then( result => {
        const blockchainDynamicGlobalProperty = result.get(0);
        const blockchainGlobalProperty = result.get(1);
        const coreAsset = result.get(2);
        const now = new Date().getTime();
        const headTime = blockchainTimeStringToDate(blockchainDynamicGlobalProperty.get('time')).getTime();
        const delta = (now - headTime)/1000;
        // Continue only if delta of computer current time and the blockchain time is less than a minute
        if (delta < 60) {
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
            resolve();
          });
        } else {
          throw new Error();
        }
      }).catch( error => {
        log.error('Sync with Blockchain Fail', error);
        // Retry if needed
        if (attempt > 0) {
          // Retry to connect
          log.info('Retry syncing with blockchain');
          return CommunicationService.syncWithBlockchain(dispatch, getState, attempt-1);
        } else {
          // Give up, reject an error to be caught by the outer promise handler
          reject(new Error('Fail to Sync with Blockchain.'));
        }
      });
    });
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
    // 1.11.0 denotes the current time
    const currentTimeTransactionId = ObjectPrefix.OPERATION_HISTORY_PREFIX + '.0';
    const startTxHistoryId = currentTimeTransactionId;
    return this.fetchTransactionHistory(accountId, startTxHistoryId, stopTxHistoryId, limit);
  }

  /**
   * Get all sports
   */
  static getAllSports() {
    // TODO: Replace later
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(Immutable.fromJS(dummyData.sports));
      }, TIMEOUT_LENGTH);
    });
  }


  /**
   * Get active events given array of sport ids (can be immutable)
   */
  static getActiveEventsBySportIds(sportIds) {
    // TODO: Replace later
    const promises = sportIds.map( (sportId) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const currentTime = new Date().getTime();
          const filteredResult = _.filter(dummyData.events, (item) => {
            return (item.sport_id === sportId) && (item.start_time - currentTime > 0);
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
   * Get comeptitors given array of sport ids (can be immutable)
   */
  static getCompetitorsBySportIds(sportIds) {
    // TODO: Replace later
    const promises = sportIds.map( (sportId) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const filteredResult = _.filter(dummyData.competitors, (item) => {
            return item.sport_id === sportId;
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
   * Search events given keyword
   */
  static searchEvents(keyword) {
    // TODO: Replace Later
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const filteredResult = _.filter(dummyData.events, (item) => {
          const team1Name = item.name.split(' vs ')[0];
          const team2Name = item.name.split(' vs ')[1];

          const keywordLowerCase = keyword.toLowerCase();

          const team1FirstName = team1Name.split(' ')[0].toLowerCase();
          const team2FirstName = team2Name.split(' ')[0].toLowerCase();
          return team1FirstName.startsWith(keywordLowerCase) || team2FirstName.startsWith(keywordLowerCase);

        });
        resolve(Immutable.fromJS(filteredResult));
      }, TIMEOUT_LENGTH);
    });
  }

  /**
   * Get any blockchain object given their id
   */
  static getObjectsByIds(arrayOfObjectIds = []) {
    return this.callBlockchainDbApi('get_objects', [arrayOfObjectIds]);
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

  /**
   * Get assets by id
   */
  static getAssetsByIds(assetIds) {
    return this.getObjectsByIds(assetIds);
  }

  /**
   * Get betting market by id
   */
  static getBettingMarketsByIds(bettingMarketIds) {
    // TODO: Replace later
    return this.getDummyObjectsByIds(bettingMarketIds);
  }

  /**
   * Get betting market group by id
   */
  static getBettingMarketGroupsByIds(bettingMarketGroupIds) {
    // TODO: Replace later
    return this.getDummyObjectsByIds(bettingMarketGroupIds);
  }

  /**
   * Get competitors by id
   */
  static getCompetitorsByIds(competitorIds) {
    // TODO: Replace later
    return this.getDummyObjectsByIds(competitorIds);
  }

  /**
   * Get event by id
   */
  static getEventsByIds(eventIds) {
    // TODO: Replace later
    return this.getDummyObjectsByIds(eventIds);
  }

  /**
   * Get event group by id
   */
  static getEventGroupsByIds(eventGroupIds) {
    // TODO: Replace later
    return this.getDummyObjectsByIds(eventGroupIds);
  }

  /**
   * Get sport by id
   */
  static getSportsByIds(sportIds) {
    // TODO: Replace later
    return this.getDummyObjectsByIds(sportIds);
  }

  /**
   * Get ongoing bets (unmatched and matched bets)
   */
  static getOngoingBets(accountId) {
    // TODO: Replace later
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const filteredResult = _.filter(dummyData.bets, (item) => {
          return item.bettor_id === accountId;
        });
        resolve(Immutable.fromJS(filteredResult));
      }, TIMEOUT_LENGTH);
    });
  }

  /**
   * Get resolved bets
   */
  static getResolvedBets(accountId, startTime, stopTime) {
    // TODO: Replace later
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const filteredResult = _.filter(dummyData.bets, (item) => {
          return item.bettor_id === accountId;
        });
        // TODO: still pending the format of resolved bets
        resolve(Immutable.fromJS(filteredResult));
      }, TIMEOUT_LENGTH);
    });
  }

  /**
   * Get binned order books
   */
  static getBinnedOrderBook(bettingMarketId, binning_precision) {
    // TODO: Replace later
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let result = null;
        dummyData.binnedOrderBooks.forEach((orderBook) => {
          if (orderBook.betting_market_id === bettingMarketId) {
            result = orderBook;
            return false;
          }
        });

        resolve(Immutable.fromJS(result));
      }, TIMEOUT_LENGTH);
    })
  }

  /**
   * Get binned order books
   */
  static getBinnedOrderBooksByBettingMarketIds(bettingMarketIds, binningPrecision) {
    // TODO: Replace later
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
  static getTotalMatchedBetsByBettingMarketGroupIds(bettingMarketGroupIds) {
    // TODO: Replace later
    const promises = bettingMarketGroupIds.map( (bettingMarketGroupId) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const amountObject = {
            amount: Math.floor((Math.random() * 1000000) + 100000),
            asset_id: '1.3.0'
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
   * Withdraw money
   */
  static withdraw(walletAddress) {
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

  /**
   * Get global betting statistics
   */
  static getGlobalBettingStatistics() {
    // TODO: Replace later
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(Immutable.fromJS(dummyData.globalBettingStatistics));
      }, TIMEOUT_LENGTH);
    });
  }

  /**
   * Get transaction history of an account given time range
   */
  static getTransactionHistoryGivenTimeRange(accountId, startDate, endDate) {
    // TODO: Replace later
    return new Promise((resolve, reject) => {
      if(startDate !== undefined && endDate !== undefined){
        const filteredHistory =  _.filter(dummyData.transactionHistory, (hist) => {
          return (hist.time >= startDate && hist.time <= endDate)
        });
        resolve(Immutable.fromJS(_.orderBy(filteredHistory,
          function(value) {
            return (value.time +''
          )}, 'desc'
        )));
      }
      resolve(Immutable.fromJS(_.orderBy(dummyData.transactionHistory,
        function(value) {
          return (value.time +''
        )}, 'desc'
      )));
    });

  }



}

export default CommunicationService;
