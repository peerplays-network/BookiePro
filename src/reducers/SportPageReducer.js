import { ActionTypes } from '../constants';

let initialState = {
  sport: '',
  eventIds: [],
  eventGroupIds: [],
  binnedOrderBooks: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SPORT_PAGE_SET_DATA: {
      const newBinnedOrderBooksState = Object.assign({}, state.binnedOrderBooks);
      action.binnedOrderBooks.forEach((binnedOrderBook) => {
        const betting_market_id = binnedOrderBook.betting_market_id;
        newBinnedOrderBooksState[betting_market_id] = binnedOrderBook;
      })
      return Object.assign({}, state, {
        eventIds: action.eventIds.slice(),
        eventGroupIds: action.eventGroupIds.slice(),
        binnedOrderBooks: newBinnedOrderBooksState
      });
    }
    default:
      return state;
  }
};
