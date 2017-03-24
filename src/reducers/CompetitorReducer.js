import { ActionTypes } from '../constants';
import { LoadingStatus } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  getCompetitorsLoadingStatus: LoadingStatus.DEFAULT,
  competitorsById: {}
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.COMPETITOR_SET_GET_COMPETITORS_LOADING_STATUS: {
      return state.merge({
        getCompetitorsLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.COMPETITOR_ADD_COMPETITORS: {
      const competitorsById = _.keyBy(action.competitors, competitor => competitor.get('id'));
      return state.merge({
        competitorsById
      });
    }
    default:
      return state;
  }
}
