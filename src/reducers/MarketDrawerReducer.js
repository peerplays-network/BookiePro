import { ActionTypes } from '../constants';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  unconfirmedBets: Immutable.List(),
  unmatchedBets: Immutable.List(),
  matchedBets: Immutable.List()
});

export default function(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.MARKET_DRAWER_ADD_UNCONFIRMED_BET: {
      const oldBets = state.get('unconfirmedBets');
      const newBet = action.bet;
      // If no match, returns -1
      const index = oldBets.findIndex(
        b => b.get('bet_type') === newBet.get('bet_type') &&
             b.get('betting_market_id') === newBet.get('betting_market_id')
      );
      // IF there exists a bet with the same bet type from the same betting market, REPLACE it.
      if (index >= 0) {
        return state.merge({
          unconfirmedBets: oldBets.splice(index, 1, newBet)
        });
      }
      // ELSE just append
      return state.merge({
        unconfirmedBets: oldBets.push(newBet)
      });
    }
    case ActionTypes.MARKET_DRAWER_DELETE_ALL_UNCONFIRMED_BETS: {
      return state.merge({
        unconfirmedBets: Immutable.List()
      });
    }
    default:
      return state;
  }
};
