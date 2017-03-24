import { ActionTypes } from '../constants';
import _ from 'lodash';

let initialState = {
  sports: [],
  eventIds: [],
  binnedOrderBooks: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.ALL_SPORTS_SET_DATA: {
      return Object.assign({}, state, {
        eventIds: action.eventIds,
        binnedOrderBooks: action.binnedOrderBooks
      });
    }
    default:
      return state;
  }
};
