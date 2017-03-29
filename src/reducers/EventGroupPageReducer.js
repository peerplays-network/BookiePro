import { ActionTypes } from '../constants';
import Immutable from 'immutable';
import _ from 'lodash';

let initialState = Immutable.fromJS({
  sportName: '',
  eventGroupName: '',
  eventIds: [],
  binnedOrderBooksByEvent: {}
});

export default function(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.EVENT_GROUP_PAGE_SET_DATA: {
      return state.merge({
        sportName: action.sportName,
        eventGroupName: action.eventGroupName,
        eventIds: action.eventIds,
        binnedOrderBooksByEvent: action.binnedOrderBooksByEvent
      })
    }
    default:
      return state;
  }
};
