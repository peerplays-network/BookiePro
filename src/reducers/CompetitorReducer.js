import { ActionTypes } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  getCompetitorsBySportIdsLoadingStatus: {},
  getCompetitorsByIdsLoadingStatus: {},
  competitorsById: {}
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.COMPETITOR_SET_GET_COMPETITORS_BY_SPORT_IDS_LOADING_STATUS: {
      let getCompetitorsBySportIdsLoadingStatus = Immutable.Map();
      action.sportIds.forEach( sportId => {
        getCompetitorsBySportIdsLoadingStatus = getCompetitorsBySportIdsLoadingStatus.set(sportId, action.loadingStatus);
      })
      return state.mergeIn(['getCompetitorsBySportIdsLoadingStatus'], getCompetitorsBySportIdsLoadingStatus);
    }
    case ActionTypes.COMPETITOR_SET_GET_COMPETITORS_BY_IDS_LOADING_STATUS: {
      let getCompetitorsByIdsLoadingStatus = Immutable.Map();
      action.competitorIds.forEach( competitorId => {
        getCompetitorsByIdsLoadingStatus = getCompetitorsByIdsLoadingStatus.set(competitorId, action.loadingStatus);
      })
      return state.mergeIn(['getCompetitorsByIdsLoadingStatus'], getCompetitorsByIdsLoadingStatus);
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
