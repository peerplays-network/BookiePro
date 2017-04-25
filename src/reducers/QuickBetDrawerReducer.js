import Immutable from 'immutable';
import { LoadingStatus, ActionTypes } from '../constants';
import { BettingModuleUtils } from '../utility';

let initialState = Immutable.fromJS({
  bets: Immutable.List(),
  showBetSlipConfirmation: false,
  showBetSlipWaiting: false,
  showBetSlipError: false,
});

export default function(state = initialState, action) {
  const oldBets = state.get('bets');
  switch (action.type) {
    case ActionTypes.QUICK_BET_DRAWER_ADD_ONE_BET: {
      const newBet = action.bet
                     .set('stake', undefined)
                     .set('profit', undefined)
                     .set('liability', undefined);
      // If no match, returns -1
      const index = oldBets.findIndex(
        b => b.get('bet_type') === newBet.get('bet_type') &&
             b.get('betting_market_id') === newBet.get('betting_market_id')
      );
      // IF there exists a bet with the same bet type from the same betting market, REPLACE it.
      if (index >= 0) {
        return state.merge({
          bets: oldBets.set(index, newBet)
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
    case ActionTypes.QUICK_BET_DRAWER_UPDATE_ONE_BET: {
      const index = oldBets.findIndex(b => b.get('id') === action.delta.get('id'));
      const { delta } = action;
      let bet = oldBets.get(index).set(delta.get('field'), delta.get('value'));
      // Calculate the profit/liability of a bet based on the latest odds and stake value
      if (bet.has('stake')) {
        const profit = BettingModuleUtils.getProfitOrLiability(bet.get('stake'), bet.get('odds'));
        bet = bet.set('profit', profit).set('liability', profit);
      }
      return state.merge({
        bets: oldBets.set(index, bet)
      })
    }
    case ActionTypes.QUICK_BET_DRAWER_SHOW_BETSLIP_CONFIRMATION: {
      return state.merge({
        showBetSlipConfirmation: true
      });
    }
    case ActionTypes.QUICK_BET_DRAWER_HIDE_BETSLIP_CONFIRMATION: {
      return state.merge({
        showBetSlipConfirmation: false
      });
    }
    case ActionTypes.QUICK_BET_DRAWER_HIDE_BETSLIP_ERROR: {
      return state.merge({
        showBetSlipError: false
      });
    }
    case ActionTypes.BET_SET_MAKE_BETS_LOADING_STATUS: {
      return state.merge({
        bets: action.loadingStatus === LoadingStatus.DONE ? Immutable.List() : oldBets,
        showBetSlipWaiting: action.loadingStatus === LoadingStatus.LOADING,
        showBetSlipError: false,
        showBetSlipConfirmation: false
      })
    }
    case ActionTypes.BET_SET_MAKE_BETS_ERROR: {
      return state.merge({
        showBetSlipWaiting: false,
        showBetSlipError: true,
        showBetSlipConfirmation: false
      })
    }
    default:
      return state;
  }
};
