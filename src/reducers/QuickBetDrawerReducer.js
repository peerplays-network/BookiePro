import { ActionTypes } from '../constants';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  bets: [],
});

export default function(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.QUICK_BET_DRAWER_ADD_ONE_BET: {
      return state.merge({
        bets: state.get('bets').push(action.bet)
      });
    }
    case ActionTypes.QUICK_BET_DRAWER_DELETE_ONE_BET: {
      return state.merge({
        bets: state.get('bets').filterNot(b => b.get('id') === action.betId)
      });
    }
    case ActionTypes.QUICK_BET_DRAWER_DELETE_MANY_BETS: {
      return state.merge({
        bets: state.get('bets').filterNot(b => action.listOfBetIds.includes(b.get('id')))
      });
    }
    default:
      return state;
  }
};
