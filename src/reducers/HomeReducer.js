import { ActionTypes } from '../constants';
import { LoadingStatus } from '../constants';

let initialState = {
  sports: [],
  eventIds: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.HOME_ADD_EVENT_IDS: {
      return {
        eventIds: action.eventIds.slice()
      }
    }
    default:
      return state;
  }
};
