import { ActionTypes } from '../constants';
import { LoadingStatus } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  getSportsLoadingStatus: LoadingStatus.DEFAULT,
  sportsById: {}
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.SPORT_SET_GET_SPORTS_LOADING_STATUS: {
      return state.merge({
        getSportsLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.SPORT_ADD_SPORTS: {
      const sportsById = _.keyBy(action.sports, sport => sport.get('id'));
      return state.merge({
        sportsById
      });
    }
    default:
      return state;
  }
}
