import { ActionTypes } from '../constants';
import { LoadingStatus } from '../constants';
import _ from 'lodash';

let initialState = {
  getCompetitorsLoadingStatus: LoadingStatus.DEFAULT,
  competitors: []
};

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.COMPETITOR_SET_GET_COMPETITORS_LOADING_STATUS: {
      return Object.assign({}, state, {
        getCompetitorsLoadingStatus: action.loadingStatus
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
