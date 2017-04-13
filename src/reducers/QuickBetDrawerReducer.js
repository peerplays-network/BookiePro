import { ActionTypes } from '../constants';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  bets: [],
});

export default function(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.QUICK_BET_DRAWER_ADD_QUICK_BET: {
      return state.merge({
        bets: state.get('bets').push(action.bet)
      });
    }
    case ActionTypes.QUICK_BET_DRAWER_DELETE_QUICK_BET: {
      const index = state.get('bets').findIndex((bet) => bet.get('id') === action.quickBetId);
      return state.merge({
        bets: state.get('bets').delete(index)
      });
    }
    default:
      return state;
  }
};
