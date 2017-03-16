import { ActionTypes } from '../constants';
import { LoadingStatus } from '../constants';
import _ from 'lodash';

let initialState = {
  notifications: []
};

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.NOTIFICATION_ADD_NOTIFICATIONS: {
      return Object.assign({}, state, {
        notifications: _.unionWith(action.notifications, state.notifications, _.isEqual)
      });
    }
    case ActionTypes.NOTIFICATION_REMOVE_NOTIFICATIONS: {
      return Object.assign({}, state, {
        notifications: _.differenceWith(state.notifications, action.notifications, _.isEqual)
      });
    }
    default:
      return state;
  }
}
