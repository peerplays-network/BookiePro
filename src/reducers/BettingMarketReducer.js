import { ActionTypes } from '../constants';
import _ from 'lodash';

let initialState = {
  bettingMarkets: []
};

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.BETTING_MARKET_ADD_BETTING_MARKETS: {
      return Object.assign({}, state, {
        bettingMarkets: _.unionBy(action.bettingMarkets, state.bettingMarkets, 'id')
      });
    }
    default:
      return state;
  }
}
