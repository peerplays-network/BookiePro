import { ActionTypes } from '../constants';
import { NotificationService, CommunicationService } from '../services';
import { ObjectPrefix } from '../constants';
import log from 'loglevel';

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

  static setLatestTransactionHistoryId(latestTransactionHistoryId) {
    return {
      type: ActionTypes.NOTIFICATION_SET_LATEST_TRANSACTION_HISTORY_ID,
      latestTransactionHistoryId
    }
  }

  static setInitNotificationsErrorAction(error) {
    return {
      type: ActionTypes.NOTIFICATION_SET_INIT_NOTIFICATIONS_ERROR,
      error
    }
  }

  static setInitNotificationsLoadingStatus(loadingStatus) {
    return {
      type: ActionTypes.NOTIFICATION_SET_INIT_NOTIFICATIONS_LOADING_STATUS,
      loadingStatus
    }
  }

  static setUpdateNotificationsErrorAction(error) {
    return {
      type: ActionTypes.NOTIFICATION_SET_UPDATE_NOTIFICATIONS_ERROR,
      error
    }
  }

  static setUpdateNotificationsLoadingStatus(loadingStatus) {
    return {
      type: ActionTypes.NOTIFICATION_SET_UPDATE_NOTIFICATIONS_LOADING_STATUS,
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
      // Get the latest transaction history
      const stopTxHistoryId = ObjectPrefix.OPERATION_HISTORY_PREFIX + '.0';
      CommunicationService.fetchRecentHistory(accountId, stopTxHistoryId, 1).then((history) => {
        // Set latest transaction history id
        // This is the pivot point for us to determine notification
        // Since by the agreed definition: notifications are transactions that happen when the app is open
        const latestTxHistoryId = history && history.getIn([0, 'id']);
        dispatch(NotificationPrivateActions.setLatestTransactionHistoryId(latestTxHistoryId));
      }).catch((error) => {
        if (attempt > 0) {
          log.warn('Retry initializing notification', error);
          return dispatch(NotificationActions.initNotification(attempt-1));
        } else {
          log.error('Fail to init notification', error);
        }
      });
    }
  }

  static updateNotification() {
    return (dispatch, getState) => {
      const latestTxHistoryId = getState().getIn(['notification', 'latestTransactionHistoryId']);
      // If latest tx history is not set yet, init notification first
      if (!latestTxHistoryId) {
        return dispatch(NotificationActions.initNotification());
      } else {
        const accountId = getState().getIn(['account', 'account', 'id']);
        CommunicationService.fetchRecentHistory(accountId, latestTxHistoryId).then(history => {
          // Create notifications and store it
          const notifications = NotificationService.convertTxHistoriesToNotifications(history, latestTxHistoryId);
          if (notifications.length > 0) {
            dispatch(NotificationPrivateActions.addNotificationsAction(notifications));
          }
          // Set latest tx history id
          const updatedLatestTxHistoryId = history && history.getIn([0, 'id']);
          dispatch(NotificationPrivateActions.setLatestTransactionHistoryId(updatedLatestTxHistoryId));
        });
      }
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
