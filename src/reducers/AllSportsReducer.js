import { ActionTypes } from '../constants';

let initialState = {
  sports: [],
  eventIds: [],
  binnedOrderBooks: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.ALL_SPORTS_SET_EVENT_IDS: {
      return Object.assign({}, state, { eventIds: action.eventIds.slice() });
    }
    case ActionTypes.ALL_SPORTS_SET_BINNED_ORDER_BOOKS: {
      const newbinnedOrderBooksState = Object.assign({}, state.binnedOrderBooks);
      const binnedOrderBooks = action.binnedOrderBooks.slice();
      binnedOrderBooks.forEach((binnedOrderBook) => {
        const betting_market_id = binnedOrderBook.betting_market_id;
        newbinnedOrderBooksState[betting_market_id] = binnedOrderBook;
      })
      return Object.assign({}, state, { binnedOrderBooks: newbinnedOrderBooksState });
    }
    default:
      return state;
  }
};
