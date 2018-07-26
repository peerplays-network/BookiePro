import {ActionTypes} from '../constants';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  bettingMarketsById: {},
  persistedBettingMarketsById: {},
  getBettingMarketsByIdsLoadingStatus: {},
  getBettingMarketsByBettingMarketGroupIdsLoadingStatus: {}
});

export default function(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.BETTING_MARKET_ADD_OR_UPDATE_BETTING_MARKETS: {
      let bettingMarketsById = Immutable.Map();
      action.bettingMarkets.forEach(bettingMarket => {
        bettingMarketsById = bettingMarketsById.set(bettingMarket.get('id'), bettingMarket);
      });
      return state.mergeIn(['bettingMarketsById'], bettingMarketsById);
    }

    case ActionTypes.BETTING_MARKET_ADD_PERSISTED_BETTING_MARKETS: {
      let bettingMarketsById = Immutable.Map();
      action.bettingMarkets.forEach(bettingMarket => {
        bettingMarketsById = bettingMarketsById.set(bettingMarket.get('id'), bettingMarket);
      });
      return state.mergeIn(['persistedBettingMarketsById'], bettingMarketsById);
    }

    case ActionTypes.BETTING_MARKET_SET_GET_BETTING_MARKETS_BY_IDS_LOADING_STATUS: {
      let getBettingMarketsByIdsLoadingStatus = Immutable.Map();
      action.bettingMarketIds.forEach(id => {
        getBettingMarketsByIdsLoadingStatus = getBettingMarketsByIdsLoadingStatus.set(
          id,
          action.loadingStatus
        );
      });
      return state.mergeIn(
        ['getBettingMarketsByIdsLoadingStatus'],
        getBettingMarketsByIdsLoadingStatus
      );
    }

    case ActionTypes.BETTING_MARKET_REMOVE_BETTING_MARKETS_BY_IDS: {
      let nextState = state;
      action.bettingMarketIds.forEach(bettingMarketId => {
        // Since we want to have persistent bm list
        // Move bettingMarket from bettingMarketsById to persistedBettingMarketsById
        const bettingMarket = state.getIn(['bettingMarketsById', bettingMarketId]);
        nextState = nextState.setIn(
          ['persistedBettingMarketsById', bettingMarketId],
          bettingMarket
        );
        nextState = nextState.deleteIn(['bettingMarketsById', bettingMarketId]);
      });
      return nextState;
    }

    case ActionTypes.BETTING_MARKET_SET_GET_BETTING_MARKETS_BY_BETTING_MARKET_GROUP_IDS_LOADING_STATUS: { // eslint-disable-line
      let getBettingMarketsByBettingMarketGroupIdsLoadingStatus = Immutable.Map();
      action.bettingMarketGroupIds.forEach(bettingMarketGroupId => {
        getBettingMarketsByBettingMarketGroupIdsLoadingStatus = getBettingMarketsByBettingMarketGroupIdsLoadingStatus.set( // eslint-disable-line
          bettingMarketGroupId,
          action.loadingStatus
        );
      });
      return state.mergeIn(
        ['getBettingMarketsByBettingMarketGroupIdsLoadingStatus'],
        getBettingMarketsByBettingMarketGroupIdsLoadingStatus
      );
    }

    default:
      return state;
  }
}
