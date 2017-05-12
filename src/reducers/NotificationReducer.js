import { ActionTypes, LoadingStatus } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  notifications: [],
  latestTransactionHistoryIdByAccountId: {},
  initNotificationLoadingStatus: LoadingStatus.DEFAULT,
  initNotificationError: null,
  updateNotificationLoadingStatus: LoadingStatus.DEFAULT,
  updateNotificationError: null,
  lastNotificationCheckTime: new Date()
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.NOTIFICATION_PREPEND_NOTIFICATIONS: {
      const notificationsToBePrepended = action.notifications || Immutable.List();
      return state.update('notifications', notifications => notificationsToBePrepended.concat(notifications));
    }
    case ActionTypes.NOTIFICATION_REMOVE_NOTIFICATIONS: {
      let nextState = state;
      nextState = nextState.update('notifications', (notifications) => {
        return notifications.filterNot(notification => action.notificationIds.includes(notification.get('id')));
      });
      return nextState;
    }
    case ActionTypes.NOTIFICATION_SET_LATEST_TRANSACTION_HISTORY_ID: {
      return state.setIn(['latestTransactionHistoryIdByAccountId', action.accountId], action.latestTransactionHistoryId);
    }
    case ActionTypes.NOTIFICATION_SET_INIT_NOTIFICATION_ERROR: {
      return state.merge({
        initNotificationError: action.error,
        initNotificationLoadingStatus: LoadingStatus.ERROR
      })
    }
    case ActionTypes.NOTIFICATION_SET_INIT_NOTIFICATION_LOADING_STATUS: {
      return state.merge({
        initNotificationLoadingStatus: action.loadingStatus
      })
    }
    case ActionTypes.NOTIFICATION_SET_UPDATE_NOTIFICATION_ERROR: {
      return state.merge({
        updateNotificationError: action.error,
        updateNotificationLoadingStatus: LoadingStatus.ERROR
      })
    }
    case ActionTypes.NOTIFICATION_SET_UPDATE_NOTIFICATION_LOADING_STATUS: {
      return state.merge({
        updateNotificationLoadingStatus: action.loadingStatus
      })
    }
    case ActionTypes.AUTH_LOGOUT: {
      return initialState;
    }
    case ActionTypes.NOTIFICATION_MARK_NOTIFICATIONS_AS_READ: {
      return state.update('notifications', (notifications) => {
        return notifications.map((notification) => {
          return notification.set('isRead', true);
        })
      })
    }
    default:
      return state;
  }
}
