import { ActionTypes } from '../constants';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  unconfirmedBets: Immutable.List(),
  unmatchedBets: Immutable.List(),
  matchedBets: Immutable.List()
});

export default function(state = initialState, action) {
  const unconfirmedBets = state.get('unconfirmedBets');
  switch (action.type) {
    case ActionTypes.MARKET_DRAWER_ADD_UNCONFIRMED_BET: {
      const newBet = action.bet;
      // If no match, returns -1
      const index = unconfirmedBets.findIndex(
        b => b.get('bet_type') === newBet.get('bet_type') &&
             b.get('betting_market_id') === newBet.get('betting_market_id')
      );
      // IF there exists a bet with the same bet type from the same betting market, REPLACE it.
      if (index >= 0) {
        return state.merge({
          unconfirmedBets: unconfirmedBets.set(index, newBet)
        });
      }
      // ELSE just append
      return state.merge({
        unconfirmedBets: unconfirmedBets.push(newBet)
      });
    }
    case ActionTypes.MARKET_DRAWER_DELETE_ONE_UNCONFIRMED_BET: {
      return state.merge({
        unconfirmedBets: unconfirmedBets.filterNot(b => b.get('id') === action.betId)
      });
    }
    case ActionTypes.MARKET_DRAWER_DELETE_MANY_UNCONFIRMED_BETS: {
      return state.merge({
        unconfirmedBets: unconfirmedBets.filterNot(b => action.listOfBetIds.includes(b.get('id')))
      });
    }
    case ActionTypes.MARKET_DRAWER_DELETE_ALL_UNCONFIRMED_BETS: {
      return state.merge({
        unconfirmedBets: Immutable.List()
      });
    }
    case ActionTypes.MARKET_DRAWER_UPDATE_ONE_UNCONFIRMED_BET: {
      const index = unconfirmedBets.findIndex(b => b.get('id') === action.delta.get('id'));
      const offer = unconfirmedBets.getIn([index, 'offer']);
      const changes = Immutable.Map().set(action.delta.get('field'), action.delta.get('value'));
      return state.merge({
        unconfirmedBets: unconfirmedBets.setIn([index, 'offer'], offer.merge(changes))
      })
    }
    default:
      return state;
  }
};
