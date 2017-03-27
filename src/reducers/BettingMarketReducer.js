import { ActionTypes } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  bettingMarketsById: {}
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.BETTING_MARKET_ADD_BETTING_MARKETS: {
      const bettingMarketsById = _.keyBy(action.bettingMarkets, bettingMarket => bettingMarket.get('id'));
      return state.merge({
        bettingMarketsById
      });
    }
    default:
      return state;
  }
}
