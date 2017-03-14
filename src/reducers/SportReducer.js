import { ActionTypes } from '../constants';
import { LoadingStatus } from '../constants';
import _ from 'lodash';

let initialState = {
  getSportsLoadingStatus: LoadingStatus.DEFAULT,
  sports: []
};

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.SPORT_SET_GET_SPORTS_LOADING_STATUS: {
      return Object.assign({}, state, {
        getSportsLoadingStatus: action.loadingStatus
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
