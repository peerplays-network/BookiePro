import { ActionTypes } from '../constants';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  unconfirmedBets: [],
  unmatchedBets: [],
  matchedBets: []
});

export default function(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.MARKET_DRAWER_ADD_UNCONFIRMED_BET: {
      return state.merge({
        unconfirmedBets: state.get('unconfirmedBets').push(action.bet)
      });
    }
    default:
      return state;
  }
};
