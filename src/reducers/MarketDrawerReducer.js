import Immutable from 'immutable';
import { LoadingStatus, ActionTypes } from '../constants';
import { BettingModuleUtils, CurrencyUtils } from '../utility';
import { transformBetObject } from './dataUtils';

let initialState = Immutable.fromJS({
  unconfirmedBets: Immutable.List(),
  unmatchedBets: Immutable.List(),
  matchedBets: Immutable.List(),
  showBetSlipConfirmation: false,
  showBetSlipWaiting: false,
  showBetSlipError: false,
  showBetSlipSuccess: false,
  showPlacedBetsConfirmation: false,
  showPlacedBetsError: false,
  showPlacedBetsWaiting: false,
  showPlacedBetsSuccess: false,
  groupByAverageOdds: false,
  unconfirmedbetsToBeDeleted: Immutable.List(),
  showDeleteUnconfirmedBetsConfirmation: false,
});

export default function(state = initialState, action) {
  const unconfirmedBets = state.get('unconfirmedBets');
  const unmatchedBets = state.get('unmatchedBets');
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
    case ActionTypes.MARKET_DRAWER_SHOW_DELETE_UNCONFIRMED_BETS_CONFIRMATION: {
      return state.merge({
        unconfirmedbetsToBeDeleted: action.bets,
        showDeleteUnconfirmedBetsConfirmation: true,
      })
    }
    case ActionTypes.MARKET_DRAWER_HIDE_DELETE_UNCONFIRMED_BETS_CONFIRMATION: {
      return state.merge({
        unconfirmedbetsToBeDeleted: Immutable.List(),
        showDeleteUnconfirmedBetsConfirmation: false,
      })
    }
    case ActionTypes.MARKET_DRAWER_DELETE_MANY_UNCONFIRMED_BETS: {
      return state.merge({
        unconfirmedBets: unconfirmedBets.filterNot(b => action.listOfBetIds.includes(b.get('id'))),
        showBetSlipSuccess: false,
        unconfirmedbetsToBeDeleted: Immutable.List(),
        showDeleteUnconfirmedBetsConfirmation: false,
      });
    }
    case ActionTypes.MARKET_DRAWER_DELETE_ALL_UNCONFIRMED_BETS: {
      return state.merge({
        unconfirmedBets: Immutable.List(),
        showBetSlipConfirmation: false,
        showBetSlipWaiting: false,
        showBetSlipError: false,
        showBetSlipSuccess: false,
        unconfirmedbetsToBeDeleted: Immutable.List(),
        showDeleteUnconfirmedBetsConfirmation: false,
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
    // TODO: Once the Blockchain is ready, we also need to listen to bet update events
    case ActionTypes.MARKET_DRAWER_GET_PLACED_BETS: {
      let unmatchedBets = Immutable.List();
      let matchedBets = Immutable.List();
      // NOTE In order to show the initial Odds and Stake values correctly before
      // the components are displayed, this ONE-OFF action is the best place to
      // perform the formatting. Doing this in mapStateToProps function of a React
      // component will lead undesirable effects where user's input may be
      // constantly modified on the fly (e.g. in the middle of an edit action)
      action.placedBets.forEach(bet => {
        let transformed = transformBetObject(bet);
        if (transformed.has('matched')) {
          let matchedBet = transformed.get('matched');
          matchedBet = matchedBet
                         .update('odds', odds => CurrencyUtils.formatByCurrencyAndPrecision('odds', odds, action.currencyFormat).toString())
                         .update('stake', stake => CurrencyUtils.formatByCurrencyAndPrecision('stake', stake, action.currencyFormat).toString())
          matchedBets = matchedBets.push(matchedBet);
        }
        if (transformed.has('unmatched')) {
          let unmatchedBet = transformed.get('unmatched');
          // store odds and stake values as String for easier comparison
          unmatchedBet = unmatchedBet
                           .update('odds', odds => CurrencyUtils.formatByCurrencyAndPrecision('odds', odds, action.currencyFormat).toString())
                           .update('stake', stake => CurrencyUtils.formatByCurrencyAndPrecision('stake', stake, action.currencyFormat).toString());
          // NOTE: The old values MUST be based on the formatted values, not the original.
          unmatchedBet = unmatchedBet
                           .set('updated', false)
                           .set('original_odds', unmatchedBet.get('odds').toString())
                           .set('original_stake', unmatchedBet.get('stake').toString());
          unmatchedBets = unmatchedBets.push(unmatchedBet);
        }
      });
      return state.merge({
        unmatchedBets,
        matchedBets,
        bettingMarketGroupId: action.bettingMarketGroupId,
      });
    }
    case ActionTypes.MARKET_DRAWER_UPDATE_ONE_UNMATCHED_BET: {
      const { delta } = action;
      const index = unmatchedBets.findIndex(b => b.get('id') === delta.get('id'));
      let bet = unmatchedBets.get(index).set(delta.get('field'), delta.get('value'));
      // Calculate the profit/liability of a bet based on the latest odds and stake value
      if (bet.has('stake')) {
        const profit = BettingModuleUtils.getProfitOrLiability(bet.get('stake'), bet.get('odds'));
        bet = bet.set('profit', profit).set('liability', profit);
      }
      // Check if the bet needs to be marked as updated
      // NOTE: For unmatched bets, the original stake and odds MUST exist
      const updated = (bet.has('stake') && bet.get('stake') !== bet.get('original_stake')) ||
                      (bet.has('odds') && bet.get('odds') !== bet.get('original_odds'));
      bet = bet.set('updated', updated);
      return state.merge({
        unmatchedBets: unmatchedBets.set(index, bet)
      })
    }
    case ActionTypes.MARKET_DRAWER_DELETE_ONE_UNMATCHED_BET: {
      return state.merge({
        unmatchedBets: unmatchedBets.filterNot(b => b.get('id') === action.betId),
      });
    }
    case ActionTypes.MARKET_DRAWER_DELETE_MANY_UNMATCHED_BETS: {
      return state.merge({
        unmatchedBets: unmatchedBets.filterNot(b => action.listOfBetIds.includes(b.get('id'))),
      });
    }
    case ActionTypes.MARKET_DRAWER_SHOW_PLACED_BETS_CONFIRMATION: {
      return state.merge({
        showPlacedBetsConfirmation: true
      });
    }
    case ActionTypes.MARKET_DRAWER_HIDE_PLACED_BETS_CONFIRMATION: {
      return state.merge({
        showPlacedBetsConfirmation: false
      });
    }
    case ActionTypes.MARKET_DRAWER_HIDE_PLACED_BETS_ERROR: {
      return state.merge({
        showPlacedBetsError: false
      });
    }
    case ActionTypes.BET_SET_EDIT_BETS_BY_IDS_LOADING_STATUS: {
      return state.merge({
        showPlacedBetsWaiting: action.loadingStatus === LoadingStatus.LOADING,
        showPlacedBetsError: false,
        showPlacedBetsConfirmation: false,
        showPlacedBetsSuccess: action.loadingStatus === LoadingStatus.DONE,
      })
    }
    case ActionTypes.BET_SET_EDIT_BETS_ERROR_BY_BET_ID: {
      return state.merge({
        showPlacedBetsWaiting: false,
        showPlacedBetsError: true,
        showPlacedBetsConfirmation: false,
        showPlacedBetsSuccess: false,
      })
    }
    case ActionTypes.MARKET_DRAWER_RESET_UNMATCHED_BETS: {
      // Just reset every bet to their original values
      // It is a small list anyway
      const restoredBets = unmatchedBets.map(bet =>
        bet.set('updated', false)
           .set('odds', bet.get('original_odds'))
           .set('stake', bet.get('original_stake'))
      );
      return state.merge({
        unmatchedBets: restoredBets,
      })
    }
    case ActionTypes.MARKET_DRAWER_SET_GROUP_BY_AVERAGE_ODDS: {
      return state.merge({
        groupByAverageOdds: action.groupByAverageOdds,
      })
    }
    default:
      return state;
  }
};
