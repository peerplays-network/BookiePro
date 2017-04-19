import { ActionTypes } from '../constants';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  bets: Immutable.List(),
});

export default function(state = initialState, action) {
  const oldBets = state.get('bets');
  switch (action.type) {
    case ActionTypes.QUICK_BET_DRAWER_ADD_ONE_BET: {
      const newBet = action.bet;
      // If no match, returns -1
      const index = oldBets.findIndex(
        b => b.get('bet_type') === newBet.get('bet_type') &&
             b.get('betting_market_id') === newBet.get('betting_market_id')
      );
      // IF there exists a bet with the same bet type from the same betting market, REPLACE it.
      if (index >= 0) {
        return state.merge({
          bets: oldBets.splice(index, 1, newBet)
        });
      }
      // ELSE just append
      return state.merge({
        bets: oldBets.push(newBet)
      });
    }
    case ActionTypes.QUICK_BET_DRAWER_DELETE_ONE_BET: {
      return state.merge({
        bets: oldBets.filterNot(b => b.get('id') === action.betId)
      });
    }
    case ActionTypes.QUICK_BET_DRAWER_DELETE_MANY_BETS: {
      return state.merge({
        bets: oldBets.filterNot(b => action.listOfBetIds.includes(b.get('id')))
      });
    }
    case ActionTypes.QUICK_BET_DRAWER_DELETE_ALL_BETS: {
      return state.merge({
        bets: Immutable.List()
      });
    }
    default:
      return state;
  }
};
