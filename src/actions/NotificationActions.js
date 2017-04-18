import { ActionTypes, LoadingStatus } from '../constants';
import { NotificationService, CommunicationService } from '../services';
import AssetActions from './AssetActions';
import BettingMarketActions from './BettingMarketActions';
import { ObjectPrefix } from '../constants';
import log from 'loglevel';
import Immutable from 'immutable';

/**
 * Private actions
 */
class NotificationPrivateActions {
  static addNotificationsAction(notifications) {
    return {
      type: ActionTypes.NOTIFICATION_ADD_NOTIFICATIONS,
      notifications
    }
  }

  static setLatestTransactionHistoryId(latestTransactionHistoryId, accountId) {
    return {
      type: ActionTypes.NOTIFICATION_SET_LATEST_TRANSACTION_HISTORY_ID,
      latestTransactionHistoryId,
      accountId
    }
  }

  static setInitNotificationErrorAction(error) {
    return {
      type: ActionTypes.NOTIFICATION_SET_INIT_NOTIFICATION_ERROR,
      error
    }
  }

  static setInitNotificationLoadingStatus(loadingStatus) {
    return {
      type: ActionTypes.NOTIFICATION_SET_INIT_NOTIFICATION_LOADING_STATUS,
      loadingStatus
    }
  }

  static setUpdateNotificationErrorAction(error) {
    return {
      type: ActionTypes.NOTIFICATION_SET_UPDATE_NOTIFICATION_ERROR,
      error
    }
  }

  static setUpdateNotificationLoadingStatus(loadingStatus) {
    return {
      type: ActionTypes.NOTIFICATION_SET_UPDATE_NOTIFICATION_LOADING_STATUS,
      loadingStatus
    }
  }
}

/**
 * Public actions
 */
class NotificationActions {
  static initNotification(attempt=3) {
    return (dispatch, getState) => {
      const accountId = getState().getIn(['account', 'account', 'id']);
      const latestTxHistoryId = getState().getIn(['notification', 'latestTransactionHistoryIdByAccountId', accountId]);

      // If latest tx history id is not set yet, try to get the user latest transaction history id
      // For us, latest tx history id is the pivot point for us to determine notification
      // Since by the agreed definition: notifications are transactions that happen after the user login for the first time
      if (!latestTxHistoryId) {
        dispatch(NotificationPrivateActions.setInitNotificationLoadingStatus(LoadingStatus.LOADING));
        const stopTxHistoryId = ObjectPrefix.OPERATION_HISTORY_PREFIX + '.0';
        CommunicationService.fetchRecentHistory(accountId, stopTxHistoryId, 1).then((history) => {
          // Set latest transaction history id
          const latestTxHistoryId = history && history.getIn([0, 'id']);
          dispatch(NotificationPrivateActions.setLatestTransactionHistoryId(latestTxHistoryId, accountId));
          dispatch(NotificationPrivateActions.setInitNotificationLoadingStatus(LoadingStatus.DONE));
          log.debug('Init notification succeeds.');
        }).catch((error) => {
          if (attempt > 0) {
            log.warn('Retry initializing notification', error);
            return dispatch(NotificationActions.initNotification(attempt-1));
          } else {
            log.error('Fail to init notification', error);
            dispatch(NotificationPrivateActions.setInitNotificationErrorAction(error));
          }
        });
      } else {
        // If the pivot point already exists, update notification
        dispatch(NotificationActions.updateNotification())
      }

    }
  }

  /**
   * Check for new transaction histories and set notification accordingly
   */
  static updateNotification(attempt=3) {
    return (dispatch, getState) => {
      const accountId = getState().getIn(['account', 'account', 'id']);
      const latestTxHistoryId = getState().getIn(['notification', 'latestTransactionHistoryIdByAccountId', accountId]);
      // If latest tx history is not set yet, init notification first
      if (!latestTxHistoryId) {
        return dispatch(NotificationActions.initNotification());
      } else {
        dispatch(NotificationPrivateActions.setUpdateNotificationLoadingStatus(LoadingStatus.LOADING));
        const accountId = getState().getIn(['account', 'account', 'id']);

        let updatedLatestTxHistoryId, relevantTransactions, relevantAdditionalInfo, relevantAssetsById, relevantBettingMarketsById;
        CommunicationService.fetchRecentHistory(accountId, latestTxHistoryId).then((transactions) => {
          // Filter history and extract relevant info
          relevantTransactions = NotificationService.filterRelevantTransactions(transactions, latestTxHistoryId);
          relevantAdditionalInfo = NotificationService.extractRelevantInfo(relevantTransactions)

          // Set reference to updated latest transaction history
          updatedLatestTxHistoryId = transactions && transactions.getIn([0, 'id']);

          // Fetch relevant assets
          return dispatch(AssetActions.getAssetsByIds(relevantAdditionalInfo.relevantAssetIds));
        }).then((assets) => {
          relevantAssetsById = Immutable.Map(assets.map( asset => [asset.get('id'), asset]));
          // Fetch relevant betting markets
          return dispatch(BettingMarketActions.getBettingMarketsByIds(relevantAdditionalInfo.relevantBettingMarketIds));
        }).then((bettingMarkets) => {
          relevantBettingMarketsById = Immutable.Map(bettingMarkets.map( bettingMarket => [bettingMarket.get('id'), bettingMarket]));;

          // Create notifications and store it
          const notifications = NotificationService.convertTransactionsToNotifications(getState(),
                                                                                        relevantTransactions,
                                                                                        relevantAssetsById,
                                                                                        relevantBettingMarketsById);
          dispatch(NotificationPrivateActions.addNotificationsAction(notifications));
          // Set latest tx history id
          dispatch(NotificationPrivateActions.setLatestTransactionHistoryId(updatedLatestTxHistoryId, accountId));
          log.debug('Update notification succeeds.');
          dispatch(NotificationPrivateActions.setUpdateNotificationLoadingStatus(LoadingStatus.DONE));
        }).catch((error) => {
          if (attempt > 0) {
            log.warn('Retry updating notification', error);
            return dispatch(NotificationActions.updateNotification(attempt-1));
          } else {
            log.error('Fail to update notification', error);
            dispatch(NotificationPrivateActions.setUpdateNotificationErrorAction(error));
          }
        })
      }
    }
  }

  /**
   * Add soft update notification
   */
  static addSoftUpdateNotification(version) {
    return (dispatch) => {

    }
  }

  static removeNotificationsAction(notifications) {
    return {
      type: ActionTypes.NOTIFICATION_REMOVE_NOTIFICATIONS,
      notifications
    }
  }
}

export default NotificationActions;
