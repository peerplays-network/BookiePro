import { ActionTypes } from '../constants';
import { LoadingStatus } from '../constants';
import _ from 'lodash';

let initialState = {
  loadingStatus: LoadingStatus.DEFAULT,
  sports: []
};

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.SPORT_SET_LOADING_STATUS: {
      return Object.assign({}, state, {
        loadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.SPORT_ADD_SPORTS: {
      return Object.assign({}, state, {
        sports: _.unionBy(action.sports, state.sports, 'id')
      });
    }
    default:
      return state;
  }
}
