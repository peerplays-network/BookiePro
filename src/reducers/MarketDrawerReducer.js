import Immutable from 'immutable';
import { LoadingStatus, ActionTypes } from '../constants';
import { BettingModuleUtils } from '../utility';

let initialState = Immutable.fromJS({
  unconfirmedBets: Immutable.List(),
  unmatchedBets: Immutable.List(),
  matchedBets: Immutable.List(),
  showBetSlipConfirmation: false,
  showBetSlipWaiting: false,
  showBetSlipError: false,
  showBetSlipSuccess: false,
});

export default function(state = initialState, action) {
  const unconfirmedBets = state.get('unconfirmedBets');
  switch (action.type) {
    case ActionTypes.MARKET_DRAWER_ADD_UNCONFIRMED_BET: {
      const newBet = action.bet
                     .set('stake', undefined)
                     .set('profit', undefined)
                     .set('liability', undefined)
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
        unconfirmedBets: unconfirmedBets.filterNot(b => b.get('id') === action.betId),
        showBetSlipSuccess: false,
      });
    }
    case ActionTypes.MARKET_DRAWER_DELETE_MANY_UNCONFIRMED_BETS: {
      return state.merge({
        unconfirmedBets: unconfirmedBets.filterNot(b => action.listOfBetIds.includes(b.get('id'))),
        showBetSlipSuccess: false,
      });
    }
    case ActionTypes.MARKET_DRAWER_DELETE_ALL_UNCONFIRMED_BETS: {
      return state.merge({
        unconfirmedBets: Immutable.List(),
        showBetSlipSuccess: false,
      });
    }
    case ActionTypes.MARKET_DRAWER_UPDATE_ONE_UNCONFIRMED_BET: {
      const index = unconfirmedBets.findIndex(b => b.get('id') === action.delta.get('id'));
      const { delta } = action;
      let bet = unconfirmedBets.get(index).set(delta.get('field'), delta.get('value'));
      // Calculate the profit/liability of a bet based on the latest odds and stake value
      if (bet.has('stake')) {
        const profit = BettingModuleUtils.getProfitOrLiability(bet.get('stake'), bet.get('odds'));
        bet = bet.set('profit', profit).set('liability', profit);
      }
      return state.merge({
        unconfirmedBets: unconfirmedBets.set(index, bet)
      })
    }
    case ActionTypes.MARKET_DRAWER_SHOW_BETSLIP_CONFIRMATION: {
      return state.merge({
        showBetSlipConfirmation: true
      });
    }
    case ActionTypes.MARKET_DRAWER_HIDE_BETSLIP_CONFIRMATION: {
      return state.merge({
        showBetSlipConfirmation: false
      });
    }
    case ActionTypes.MARKET_DRAWER_HIDE_BETSLIP_ERROR: {
      return state.merge({
        showBetSlipError: false
      });
    }
    case ActionTypes.BET_SET_MAKE_BETS_LOADING_STATUS: {
      return state.merge({
        unconfirmedBets: action.loadingStatus === LoadingStatus.DONE ? Immutable.List() : unconfirmedBets,
        showBetSlipWaiting: action.loadingStatus === LoadingStatus.LOADING,
        showBetSlipError: false,
        showBetSlipConfirmation: false,
        showBetSlipSuccess: action.loadingStatus === LoadingStatus.DONE,
      })
    }
    case ActionTypes.BET_SET_MAKE_BETS_ERROR: {
      return state.merge({
        showBetSlipWaiting: false,
        showBetSlipError: true,
        showBetSlipConfirmation: false,
        showBetSlipSuccess: false,
      })
    }
    default:
      return state;
  }
};
