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
      return Object.assign({}, state, {
        sportName: action.sportName,
        eventGroupName: action.eventGroupName,
        eventIds: action.eventIds,
        binnedOrderBooks: action.binnedOrderBooks
      });
    }
    default:
      return state;
  }
};
