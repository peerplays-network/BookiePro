import { ActionTypes } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  eventIds: [],
  binnedOrderBooksByEvent: {}
});

export default function(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.ALL_SPORTS_SET_DATA: {
      return state.merge({
        eventIds: action.eventIds,
        binnedOrderBooksByEvent: action.binnedOrderBooksByEvent
      });
    }
    default:
      return state;
  }
};
