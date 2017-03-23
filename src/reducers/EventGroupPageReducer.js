import { ActionTypes } from '../constants';

let initialState = {
  sportName: '',
  eventGroupName: '',
  eventIds: [],
  binnedOrderBooks: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.EVENT_GROUP_PAGE_SET_DATA: {
      const newBinnedOrderBooksState = Object.assign({}, state.binnedOrderBooks);
      action.binnedOrderBooks.forEach((binnedOrderBook) => {
        const betting_market_id = binnedOrderBook.betting_market_id;
        newBinnedOrderBooksState[betting_market_id] = binnedOrderBook;
      })

      return {
        sportName: action.sportName,
        eventGroupName: action.eventGroupName,
        eventIds: action.eventIds.slice(),
        binnedOrderBooks: newBinnedOrderBooksState
      };
    }
    default:
      return state;
  }
};
