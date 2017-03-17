import { ActionTypes } from '../constants';

let initialState = {
  sports: [],
  eventIds: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.ALL_SPORTS_SET_EVENT_IDS: {
      return {
        eventIds: action.eventIds.slice()
      }
    }
    default:
      return state;
  }
};
