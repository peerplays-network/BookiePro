import { ActionTypes, LoadingStatus } from '../constants';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  complete_tree: [],
  display_tree: null,
  objectId: null,
  level: null,
  loadingStatus: LoadingStatus.DEFAULT,
  error: null
});

export default function (state = initialState, action) {
  switch(action.type) {

    case ActionTypes.SIDEBAR_UPDATE_COMPLETE_TREE: {
      return state.merge({
        complete_tree: action.complete_tree
      });
    }
    case ActionTypes.SIDEBAR_SET_LOADING_STATUS: {
      return state.merge({
        loadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.SIDEBAR_SET_ERROR: {
      return state.merge({
        error: action.error,
        loadingStatus: LoadingStatus.ERROR
      });
    }

    default:
      return state;
  }
}
