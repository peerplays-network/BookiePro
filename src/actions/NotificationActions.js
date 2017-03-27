import { ActionTypes } from '../constants';
import { NotificationService } from '../services';

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

  static setLatestTransactionHistoryId(recentTransactionHistoryId) {
    return {
      type: ActionTypes.NOTIFICATION_SET_LATEST_TRANSACTION_HISTORY_ID,
      recentTransactionHistoryId
    }
  }
}

/**
 * Public actions
 */
class NotificationActions {

  static updateNotifications(account) {
    return (dispatch, getState) => {
      const txHistories = getState().getIn(['account', 'account', 'history']);
      // Check if there is history
      if (txHistories && txHistories.length > 0) {
        // Check if we have previous latest transaction history id
        // This is the pivot point for us to determine notification
        // Since by the agreed definition: notifications are transactions that happen when the app is open
        const prevLatestTxHistoryId = getState().notification.latestTxHistoryId;
        if (prevLatestTxHistoryId) {
          const notifications = NotificationService.convertTxHistoriesToNotifications(txHistories, prevLatestTxHistoryId);
          if (notifications.length > 0) {
            dispatch(NotificationPrivateActions.addNotificationsAction(notifications));
          }
        }
        // Store latestTransactionHistoryId
        const latestTxHistoryId = txHistories[0].get('id');
        dispatch(NotificationPrivateActions.setLatestTransactionHistoryId(latestTxHistoryId));
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
