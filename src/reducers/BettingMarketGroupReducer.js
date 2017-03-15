import { ActionTypes } from '../constants';
import _ from 'lodash';

let initialState = {
  bettingMarketGroups: []
};

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.BETTING_MARKET_GROUP_ADD_BETTING_MARKET_GROUPS: {
      return Object.assign({}, state, {
        bettingMarketGroups: _.unionBy(action.bettingMarketGroups, state.bettingMarketGroups, 'id')
      });
    }
    default:
      return state;
  }
}
