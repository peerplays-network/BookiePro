import { ActionTypes } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  notifications: [],
  latestTransactionHistoryId: null
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.NOTIFICATION_ADD_NOTIFICATIONS: {
      return state.update('notifications', notifications => notifications.concat(action.notifications));
    }
    case ActionTypes.NOTIFICATION_REMOVE_NOTIFICATIONS: {
      return state.update('notifications', (notifications) => {
        notifications.filterNot(notification => _.includes(action.notifications, notification));
      });
    }
    case ActionTypes.NOTIFICATION_SET_LATEST_TRANSACTION_HISTORY_ID: {
      return state.merge({
        latestTransactionHistoryId: action.latestTransactionHistoryId
      });
    }
    case ActionTypes.ACCOUNT_LOGOUT: {
      return initialState;
    }
    default:
      return state;
  }
}
