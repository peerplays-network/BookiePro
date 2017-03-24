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
      return Object.assign({}, state, {
        eventIds: action.eventIds,
        eventGroupIds: action.eventGroupIds,
        binnedOrderBooks: action.binnedOrderBooks
      });
    }
    default:
      return state;
  }
};
