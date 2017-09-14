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
    case ActionTypes.SPORT_ADD_OR_UPDATE_SPORTS: {
      let sportsById = Immutable.Map();
      action.sports.forEach( sport => {
        sportsById = sportsById.set(sport.get('id'), sport);
      });
      return state.mergeIn(['sportsById'], sportsById);
    }
    case ActionTypes.SPORT_REMOVE_SPORTS_BY_IDS: {
      let nextState = state;
      action.sportIds.forEach((sportId) => {
        nextState = nextState.deleteIn(['sportsById', sportId]);
        nextState = nextState.deleteIn(['getSportsByIdsLoadingStatus', sportId]);
      })
      return nextState;
    }
    default:
      return state;
  }
}
