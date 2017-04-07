import { ActionTypes } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  bettingMarketsById: {},
  getBettingMarketsByIdsLoadingStatus: {}
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.BETTING_MARKET_ADD_OR_UPDATE_BETTING_MARKETS: {
      let bettingMarketsById = Immutable.Map();
      action.bettingMarkets.forEach( bettingMarket => {
        bettingMarketsById = bettingMarketsById.set(bettingMarket.get('id'), bettingMarket);
      })
      return state.mergeIn(['bettingMarketsById'], bettingMarketsById);
    }
    case ActionTypes.BETTING_MARKET_GROUP_SET_GET_BETTING_MARKETS_BY_IDS_LOADING_STATUS: {
      let getBettingMarketsByIdsLoadingStatus = Immutable.Map();
      action.bettingMarketGroupIds.forEach( id => {
        getBettingMarketsByIdsLoadingStatus = getBettingMarketsByIdsLoadingStatus.set(id, action.loadingStatus);
      })
      return state.mergeIn(['getBettingMarketsByIdsLoadingStatus'], getBettingMarketsByIdsLoadingStatus);
    }
    case ActionTypes.BETTING_MARKET_REMOVE_BETTING_MARKETS_BY_IDS: {
      let nextState = state;
      action.bettingMarketIds.forEach((bettingMarketId) => {
        nextState = nextState.deleteIn(['bettingMarketsById', bettingMarketId]);
      });
      return nextState;
    }
    default:
      return state;
  }
}
