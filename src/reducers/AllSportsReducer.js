import { ActionTypes } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  eventIds: [],
  binnedOrderBooks: {}
});

export default function(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.ALL_SPORTS_SET_DATA: {
      return state.merge({
        eventsIds: action.eventIds,
        binnedOrderBooks: action.binnedOrderBooks
      });
    }
    default:
      return state;
  }
};
