import { ActionTypes } from '../constants';
import Immutable from 'immutable';
import _ from 'lodash';

let initialState = Immutable.fromJS({
  bettingMarketGroup: {},
  bettingMarkets: [],
  binnedOrderBooks: [],
});

export default function(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.BETTING_MARKET_GROUP_PAGE_SET_DATA: {
      return state.merge({
        bettingMarketGroup: action.bettingMarketGroup,
        bettingMarkets: action.bettingMarkets,
        binnedOrderBooks: action.binnedOrderBooks,
      })
    }
    default:
      return state;
  }
};
