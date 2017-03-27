import { ActionTypes } from '../constants';
import Immutable from 'immutable';
import _ from 'lodash';

let initialState = Immutable.fromJS({
  eventIds: [],
  eventGroupIds: [],
  binnedOrderBooks: {}
});

export default function(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SPORT_PAGE_SET_DATA: {
      return state.merge({
        eventIds: action.eventIds,
        eventGroupIds: action.eventGroupIds,
        binnedOrderBooks: action.binnedOrderBooks
      });
    }
    default:
      return state;
  }
};
