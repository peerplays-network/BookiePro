import { ActionTypes, LoadingStatus } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  notifications: [],
  latestTransactionHistoryId: null,
  initNotificationLoadingStatus: LoadingStatus.DEFAULT,
  initNotificationError: null,
  updateNotificationLoadingStatus: LoadingStatus.DEFAULT,
  updateNotificationError: null
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.NOTIFICATION_ADD_NOTIFICATIONS: {
      return state.update('notifications', notifications => notifications.concat(action.notifications));
    }
    case ActionTypes.NOTIFICATION_REMOVE_NOTIFICATIONS: {
      return state.update('notifications', (notifications) => {
        notifications.filterNot(notification => notifications.includes(notification));
      });
    }
    case ActionTypes.NOTIFICATION_SET_LATEST_TRANSACTION_HISTORY_ID: {
      return state.merge({
        latestTransactionHistoryId: action.latestTransactionHistoryId
      });
    }
    case ActionTypes.NOTIFICATION_SET_INIT_NOTIFICATIONS_ERROR: {
      return state.merge({
        initNotificationError: action.error,
        initNotificationLoadingStatus: LoadingStatus.ERROR
      })
    }
    case ActionTypes.NOTIFICATION_SET_INIT_NOTIFICATIONS_LOADING_STATUS: {
      return state.merge({
        initNotificationLoadingStatus: action.loadingStatus
      })
    }
    case ActionTypes.NOTIFICATION_SET_UPDATE_NOTIFICATIONS_ERROR: {
      return state.merge({
        updateNotificationError: action.error,
        updateNotificationLoadingStatus: LoadingStatus.ERROR
      })
    }
    case ActionTypes.NOTIFICATION_SET_UPDATE_NOTIFICATIONS_LOADING_STATUS: {
      return state.merge({
        updateNotificationLoadingStatus: action.loadingStatus
      })
    }
    case ActionTypes.ACCOUNT_LOGOUT: {
      return initialState;
    }
    default:
      return state;
  }
}
