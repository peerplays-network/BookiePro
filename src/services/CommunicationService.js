import { Apis } from 'graphenejs-ws';
import { BlockchainUtils } from '../utility';
import { AppActions, AccountActions, NotificationActions } from '../actions';
import Immutable from 'immutable';
import KeyGeneratorService from './KeyGeneratorService';
import AccountService from './AccountService';
import { I18n } from 'react-redux-i18n';
import { ObjectPrefix, Config } from '../constants';
import { ChainValidation } from 'graphenejs-lib';
import _ from 'lodash';
const { blockchainTimeStringToDate, getObjectIdPrefix } = BlockchainUtils;

class CommunicationService {
  static dispatch = null;
  static getState = null;

  static onUpdate(data) {
    // The resulted data is an array of array
    let updatedObjects = Immutable.fromJS(_.flatten(data));
    // console.log('updated', updatedObjects);
    updatedObjects.forEach((updatedObject) => {
      // If updatedObject is object_id instead of an object, it means that object is deleted
      if (ChainValidation.is_object_id(updatedObject)) {
        const deletedObjectId = updatedObject;
        this.deleteObject(deletedObjectId);
      } else {
        this.updateObject(updatedObject);
      }
    });
  }

  static updateObject(updatedObject) {
    const updatedObjectId = updatedObject.get('id');
    const updatedObjectIdPrefix = getObjectIdPrefix(updatedObjectId);
    switch (updatedObjectIdPrefix) {
      case ObjectPrefix.ACCOUNT_PREFIX: {
        const accountId = updatedObject.get('id');
        const myAccountId = this.getState().getIn(['account', 'account', 'id']);
        // Check if this account is related to my account
        if (accountId === myAccountId) {
          this.dispatch(AccountActions.setAccountAction(updatedObject));
        }
        break;
      }
      case ObjectPrefix.ASSET_PREFIX: {
        break;
      }
      case ObjectPrefix.OPERATION_HISTORY_PREFIX: {
        // TODO:
        break;
      }
      case ObjectPrefix.GLOBAL_PROPERTY_PREFIX: {
        // Update global property
        this.dispatch(AppActions.setBlockchainGlobalPropertyAction(updatedObject));
        break;
      }
      case ObjectPrefix.DYNAMIC_GLOBAL_PROPERTY_PREFIX: {
        // Update dynamic global property
        this.dispatch(AppActions.setBlockchainDynamicGlobalPropertyAction(updatedObject));
        break;
      }
      case ObjectPrefix.ACCOUNT_STAT_PREFIX: {
        const ownerId = updatedObject.get('owner');
        const myAccountId = this.getState().getIn(['account', 'account', 'id']);
        // Check if this statistic is related to my account
        if (ownerId === myAccountId) {
          // Check if this account made new transaction, if that's the case update the notification
          const mostRecentOp = this.getState().getIn(['account', 'statistics', 'most_recent_op']);
          const updatedMostRecentOp = updatedObject.get('most_recent_op')
          const hasMadeNewTransaction = updatedMostRecentOp !== mostRecentOp;
          if (hasMadeNewTransaction) {
            this.dispatch(NotificationActions.updateNotification());
          }
          // Set the newest statistic
          this.dispatch(AccountActions.setStatisticsAction(updatedObject));
        }
        break;
      }
      case ObjectPrefix.ACCOUNT_BALANCE_PREFIX: {
        const ownerId = updatedObject.get('owner');
        const myAccountId = this.getState().getIn(['account', 'account', 'id']);
        // Check if this balance related to my account
        if (ownerId === myAccountId) {
          this.dispatch(AccountActions.updateAvailableBalance(updatedObject));
        }
        break;
      }
      default: break;
    }

  }

  static deleteObject(deletedObjectId) {
    const deletedObjectIdPrefix = getObjectIdPrefix(deletedObjectId);
    switch (deletedObjectIdPrefix) {
      case ObjectPrefix.ACCOUNT_PREFIX: {
        // Check if this account is related to my account
        const myAccountId = this.getState().getIn(['account', 'account', 'id']);
        if (deletedObjectId === myAccountId) {
          // If it is, logout the user
          // This normally shouldn't happen
          this.dispatch(AccountActions.logout());
        }
        break;
      }
      case ObjectPrefix.ASSET_PREFIX: {
        break;
      }
      case ObjectPrefix.OPERATION_HISTORY_PREFIX: {
        break;
      }
      case ObjectPrefix.ACCOUNT_BALANCE_PREFIX: {
        this.dispatch(AccountActions.removeAvailableBalanceByIdAction(deletedObjectId));
        break;
      }
      default: break;
    }

  }

  /**
   * Sync communication service with blockchain, so it always has the latest data
   */
  static syncWithBlockchain(dispatch, getState) {
    return new Promise((resolve, reject) => {
      // Check if db api is ready
      let db_api = Apis.instance().db_api();
      if (!db_api) {
        return reject(new Error('Api not found, please ensure Apis from graphenejs-ws is initialized first'));
      }

      // Get current blockchain data (dynamic global property and global property), to ensure blockchain time is in sync
      db_api.exec('get_objects', [['2.1.0', '2.0.0']]).then( result => {
        const blockchainDynamicGlobalProperty = Immutable.fromJS(result[0]);
        const blockchainGlobalProperty = Immutable.fromJS(result[1]);
        const now = new Date().getTime();
        const headTime = blockchainTimeStringToDate(blockchainDynamicGlobalProperty.get('time')).getTime();
        const delta = (now - headTime)/1000;
        // Continue only if delta of computer current time and the blockchain time is less than a minute
        if (delta < 60) {
          // Subscribe to blockchain callback so the store is always has the latest data
          const onUpdate = this.onUpdate.bind(this);
          return Apis.instance().db_api().exec( 'set_subscribe_callback', [ onUpdate, true ] ).then(() => {
            // Sync success
            // Set reference to dispatch and getState
            this.dispatch = dispatch;
            this.getState = getState;
            // Save dynamic global property
            dispatch(AppActions.setBlockchainDynamicGlobalPropertyAction(blockchainDynamicGlobalProperty));
            // Save global property
            dispatch(AppActions.setBlockchainGlobalPropertyAction(blockchainGlobalProperty));
            resolve();
          });
        } else {
          throw new Error();
        }
      }).catch( error => {
        // Fail, return
        reject(new Error('Fail to Sync with Blockchain.'));
      })
    });
  }

  /**
   * Get full account
   */
  static getFullAccount(accountNameOrId) {
    return Apis.instance().db_api().exec("get_full_accounts", [[accountNameOrId], true]).then( result => {
      const fullAccount = result && result[0] && result[0][1];
      // Return the full account
      return Immutable.fromJS(fullAccount);
    });
  }

 /**
  * Fetch recent history of an account
  */
  static fetchRecentHistory(accountId, stopTxHistoryId, limit=100) {
    // 0 denotes the current time
    const startTxHistoryId = ObjectPrefix.OPERATION_HISTORY_PREFIX + '.0';
    return Apis.instance().history_api().exec('get_account_history',
                  [ accountId, stopTxHistoryId, limit, startTxHistoryId]).then((history) => {
                    // Return immutable object to make it consistent with other functions
                    return Immutable.fromJS(history);
                  });
  }
}

export default CommunicationService;
