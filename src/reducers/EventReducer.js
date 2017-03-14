import { ActionTypes } from '../constants';
import { LoadingStatus } from '../constants';
import _ from 'lodash';

let initialState = {
  loadingStatus: LoadingStatus.DEFAULT,
  events: []
};

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.EVENT_SET_LOADING_STATUS: {
      return Object.assign({}, state, {
        loadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.EVENT_ADD_EVENTS: {
      return Object.assign({}, state, {
        events: _.unionBy(action.events, state.events, 'id')
      });
    }
    default:
      return state;
  }
}
