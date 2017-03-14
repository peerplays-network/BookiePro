import { ActionTypes } from '../constants';
import { LoadingStatus } from '../constants';
import _ from 'lodash';

let initialState = {
  loadingStatus: LoadingStatus.DEFAULT,
  competitors: []
};

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.COMPETITOR_SET_LOADING_STATUS: {
      return Object.assign({}, state, {
        loadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.COMPETITOR_ADD_COMPETITORS: {
      return Object.assign({}, state, {
        competitors: _.unionBy(action.competitors, state.competitors, 'id')
      });
    }
    default:
      return state;
  }
}
