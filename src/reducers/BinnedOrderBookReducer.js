import { ActionTypes } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  binnedOrderBooksByBettingMarketId: {},
  getBinnedOrderBooksByBettingMarketIdsLoadingStatus: {}
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.BINNED_ORDER_BOOK_ADD_OR_UPDATE_BINNED_ORDER_BOOKS_BY_BETTING_MARKET_ID: {
      let binnedOrderBooksByBettingMarketId = Immutable.Map();
      return state.mergeIn(['binnedOrderBooksByBettingMarketId'], binnedOrderBooksByBettingMarketId);
    }
    case ActionTypes.BINNED_ORDER_BOOK_SET_GET_BINNED_ORDER_BOOKS_BY_BETTING_MARKET_IDS_LOADING_STATUS: {
      let getBinnedOrderBooksByBettingMarketIdsLoadingStatus = Immutable.Map();
      action.bettingMarketIds.forEach( (id) => {
        getBinnedOrderBooksByBettingMarketIdsLoadingStatus = getBinnedOrderBooksByBettingMarketIdsLoadingStatus.set(id, action.loadingStatus);
      })
      return state.mergeIn(['getBinnedOrderBooksByBettingMarketIdsLoadingStatus'], getBinnedOrderBooksByBettingMarketIdsLoadingStatus);
    }
    default:
      return state;
  }
}
