import { ActionTypes } from '../constants';
import { LoadingStatus } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  getAllSportsLoadingStatus: LoadingStatus.DEFAULT,
  getSportsByIdsLoadingStatus: {},
  sportsById: {}
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.SPORT_SET_GET_ALL_SPORTS_LOADING_STATUS: {
      return state.merge({
        getAllSportsLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.SPORT_SET_GET_SPORTS_BY_IDS_LOADING_STATUS: {
      let getSportsByIdsLoadingStatus = Immutable.Map();
      action.sportIds.forEach( sportId => {
        getSportsByIdsLoadingStatus = getSportsByIdsLoadingStatus.set(sportId, action.loadingStatus);
      })
      return state.mergeIn(['getSportsByIdsLoadingStatus'], getSportsByIdsLoadingStatus);
    }
    case ActionTypes.SPORT_ADD_SPORTS: {
      let sportsById = state.get('sportsById');
      action.sports.forEach( sport => {
        const sportId = sport.get('id');
        // Set sports by id
        sportsById = sportsById.set(sportId, sport);
      });

      return state.merge({
        sportsById
      });
    }
    default:
      return state;
  }
}
