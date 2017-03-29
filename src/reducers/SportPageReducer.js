import { ActionTypes } from '../constants';
import Immutable from 'immutable';
import _ from 'lodash';

let initialState = Immutable.fromJS({
  eventIds: [],
  eventGroupIds: [],
  binnedOrderBooksByEvent: {}
});

export default function(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SPORT_PAGE_SET_DATA: {
      return state.merge({
        eventIds: action.eventIds,
        eventGroupIds: action.eventGroupIds,
        binnedOrderBooksByEvent: action.binnedOrderBooksByEvent
      });
    }
    default:
      return state;
  }
};
