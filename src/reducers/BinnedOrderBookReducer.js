import {ActionTypes} from '../constants';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  binnedOrderBooksByBettingMarketId: {},
  getBinnedOrderBooksByBettingMarketIdsLoadingStatus: {}
});

export default function(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.BINNED_ORDER_BOOK_ADD_OR_UPDATE_BINNED_ORDER_BOOKS_BY_BETTING_MARKET_ID: {
      return state.mergeIn(
        ['binnedOrderBooksByBettingMarketId'],
        action.binnedOrderBooksByBettingMarketId
      );
    }

    case ActionTypes.BINNED_ORDER_BOOK_SET_GET_BINNED_ORDER_BOOKS_BY_BETTING_MARKET_IDS_LOADING_STATUS: { // eslint-disable-line
      let getBinnedOrderBooksByBettingMarketIdsLoadingStatus = Immutable.Map();
      action.bettingMarketIds.forEach(id => {
        getBinnedOrderBooksByBettingMarketIdsLoadingStatus = getBinnedOrderBooksByBettingMarketIdsLoadingStatus.set( // eslint-disable-line
          id,
          action.loadingStatus
        );
      });
      return state.mergeIn(
        ['getBinnedOrderBooksByBettingMarketIdsLoadingStatus'],
        getBinnedOrderBooksByBettingMarketIdsLoadingStatus
      );
    }

    default:
      return state;
  }
}
