import { ActionTypes } from '../constants';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  events: [],
});

export default function(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.CREATE_QUICK_BET: {
      return state.merge({
        events: action.events
      });
    }
    default:
      return state;
  }
};
