import { ActionTypes } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  bettingMarketsById: {},
  getBettingMarketsByIdsLoadingStatus: {}
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.BETTING_MARKET_ADD_BETTING_MARKETS: {
      const bettingMarketsById = _.keyBy(action.bettingMarkets, bettingMarket => bettingMarket.get('id'));
      return state.merge({
        bettingMarketsById
      });
    }
    case ActionTypes.BETTING_MARKET_GROUP_SET_GET_BETTING_MARKETS_BY_IDS_LOADING_STATUS: {
      let getBettingMarketsByIdsLoadingStatus = Immutable.Map();
      action.bettingMarketGroupIds.forEach( id => {
        getBettingMarketsByIdsLoadingStatus = getBettingMarketsByIdsLoadingStatus.set(id, action.loadingStatus);
      })
      return state.merge({
        getBettingMarketsByIdsLoadingStatus
      });
    }
    default:
      return state;
  }
}
