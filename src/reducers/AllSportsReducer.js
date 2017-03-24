import { ActionTypes } from '../constants';

let initialState = {
  sports: [],
  eventIds: [],
  binnedOrderBooks: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.ALL_SPORTS_SET_DATA: {
      const newbinnedOrderBooksState = Object.assign({}, state.binnedOrderBooks);
      action.binnedOrderBooks.forEach((binnedOrderBook) => {
        const betting_market_id = binnedOrderBook.betting_market_id;
        newbinnedOrderBooksState[betting_market_id] = binnedOrderBook;
      })
      return Object.assign({}, state, {
        eventIds: action.eventIds.slice(),
        binnedOrderBooks: newbinnedOrderBooksState
      });
    }
    default:
      return state;
  }
};
