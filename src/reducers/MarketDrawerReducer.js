import Immutable from 'immutable';
import {LoadingStatus, ActionTypes, BettingDrawerStates, BetTypes} from '../constants';
import {BettingModuleUtils} from '../utility';

let initialState = Immutable.fromJS({
  unconfirmedBets: Immutable.List(),
  unmatchedBets: Immutable.List(),
  matchedBets: Immutable.List(),
  overlay: BettingDrawerStates.NO_OVERLAY,
  groupByAverageOdds: false,
  unconfirmedbetsToBeDeleted: Immutable.List(),
  unmatchedbetsToBeDeleted: Immutable.List(),
  bettingMarketGroupId: null,
  unmatchedBetsLoadingStatus: LoadingStatus.DEFAULT
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
        .update('odds', (odds) => (odds !== '' ? odds.toFixed(2) : ''));
      // If no match, returns -1
      const index = unconfirmedBets.findIndex(
        (b) => b.get('bet_type') === newBet.get('bet_type') &&
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

    case ActionTypes.MARKET_DRAWER_UPDATE_PLACED_BETS_LOADING_STATUS: {
      return state.merge({
        unmatchedBetsLoadingStatus: action.loadingStatus
      });
    }

    case ActionTypes.MARKET_DRAWER_DELETE_ONE_UNCONFIRMED_BET: {
      return state.merge({
        unconfirmedBets: unconfirmedBets.filterNot((b) => b.get('id') === action.betId),
        overlay: BettingDrawerStates.NO_OVERLAY
      });
    }

    case ActionTypes.MARKET_DRAWER_SHOW_DELETE_UNCONFIRMED_BETS_CONFIRMATION: {
      return state.merge({
        unconfirmedbetsToBeDeleted: action.bets,
        overlay: BettingDrawerStates.DELETE_BETS_CONFIRMATION
      });
    }

    case ActionTypes.MARKET_DRAWER_HIDE_DELETE_UNCONFIRMED_BETS_CONFIRMATION: {
      return state.merge({
        unconfirmedbetsToBeDeleted: Immutable.List(),
        overlay: BettingDrawerStates.NO_OVERLAY
      });
    }

    case ActionTypes.MARKET_DRAWER_DELETE_MANY_UNCONFIRMED_BETS: {
      return state.merge({
        unconfirmedBets: unconfirmedBets.filterNot((b) => action.listOfBetIds.includes(b.get('id'))), // eslint-disable-line
        overlay: BettingDrawerStates.NO_OVERLAY,
        unconfirmedbetsToBeDeleted: Immutable.List()
      });
    }

    case ActionTypes.MARKET_DRAWER_DELETE_ALL_UNCONFIRMED_BETS: {
      return state.merge({
        unconfirmedBets: Immutable.List(),
        overlay: BettingDrawerStates.NO_OVERLAY,
        unconfirmedbetsToBeDeleted: Immutable.List()
      });
    }

    case ActionTypes.MARKET_DRAWER_UPDATE_ONE_UNCONFIRMED_BET: {
      const index = unconfirmedBets.findIndex((b) => b.get('id') === action.delta.get('id'));
      const {delta} = action;
      let bet = unconfirmedBets.get(index).set(delta.get('field'), delta.get('value'));
      const betType = bet.get('bet_type');

      // Calculate the profit/liability of a bet based on the latest odds and stake value
      if (bet.has('stake')) {
        const profit = BettingModuleUtils.getProfitOrLiability(
          bet.get('stake'),
          bet.get('odds'),
          action.currencyFormat,
          betType === BetTypes.BACK ? 'profit' : 'liability'
        );
        bet = bet.set('profit', profit).set('liability', profit);
      }

      return state.merge({
        unconfirmedBets: unconfirmedBets.set(index, bet)
      });
    }

    case ActionTypes.MARKET_DRAWER_SHOW_BETSLIP_CONFIRMATION: {
      return state.merge({
        overlay: BettingDrawerStates.SUBMIT_BETS_CONFIRMATION
      });
    }

    case ActionTypes.MARKET_DRAWER_HIDE_BETSLIP_CONFIRMATION: {
      return state.merge({
        overlay: BettingDrawerStates.NO_OVERLAY
      });
    }

    case ActionTypes.MARKET_DRAWER_HIDE_BETSLIP_ERROR: {
      return state.merge({
        overlay: BettingDrawerStates.NO_OVERLAY
      });
    }

    case ActionTypes.BET_SET_MAKE_BETS_LOADING_STATUS: {
      let overlay = state.overlay;

      if (action.loadingStatus === LoadingStatus.LOADING) {
        overlay = BettingDrawerStates.SUBMIT_BETS_WAITING;
      } else if (action.loadingStatus === LoadingStatus.DONE) {
        overlay = BettingDrawerStates.SUBMIT_BETS_SUCCESS;
      }

      return state.merge({
        unconfirmedBets:
          action.loadingStatus === LoadingStatus.DONE ? Immutable.List() : unconfirmedBets,
        overlay
      });
    }

    case ActionTypes.BET_SET_MAKE_BETS_ERROR: {
      return state.merge({
        overlay: BettingDrawerStates.SUBMIT_BETS_ERROR
      });
    }

    case ActionTypes.MARKET_DRAWER_SHOW_INSUFFICIENT_BALANCE_ERROR: {
      return state.merge({
        overlay: BettingDrawerStates.INSUFFICIENT_BALANCE_ERROR
      });
    }

    case ActionTypes.MARKET_DRAWER_HIDE_INSUFFICIENT_BALANCE_ERROR: {
      return state.merge({
        overlay: BettingDrawerStates.NO_OVERLAY
      });
    }

    case ActionTypes.MARKET_DRAWER_SNOW_DISCONNECTED_ERROR: {
      return state.merge({
        overlay: BettingDrawerStates.DISCONNECTED_ERROR
      });
    }

    case ActionTypes.MARKET_DRAWER_HIDE_DISCONNECTED_ERROR: {
      return state.merge({
        overlay: BettingDrawerStates.NO_OVERLAY
      });
    }

    case ActionTypes.MARKET_DRAWER_GET_PLACED_BETS: {
      return state.merge({
        unmatchedBets: action.placedUnmatchedBets,
        matchedBets: action.placedMatchedBets,
        bettingMarketGroupId: action.bettingMarketGroupId
      });
    }

    case ActionTypes.MARKET_DRAWER_UPDATE_ONE_UNMATCHED_BET: {
      const {delta} = action;
      const index = unmatchedBets.findIndex((b) => b.get('id') === delta.get('id'));
      let bet = unmatchedBets.get(index).set(delta.get('field'), delta.get('value'));
      const betType = bet.get('bet_type');

      // Check whether or not to update first, then make decisions on how to alter the bet after
      const updated =
        (bet.has('stake') &&
          bet.get('stake').toString() !== bet.get('original_stake').toString()) ||
        (bet.has('odds') && bet.get('odds') !== bet.get('original_odds'));

      bet = bet.set('updated', updated); // Set the updated value

      if (updated) {
        // If the bet has odds or stake that is different from the original, recalculate 
        // the new profit or liability
        // Calculate the profit/liability of a bet based on the latest odds and stake value
        if (bet.has('stake')) {
          const profitLiability = BettingModuleUtils.getProfitOrLiability(
            bet.get('stake'),
            bet.get('odds'),
            action.currencyFormat,
            betType === BetTypes.BACK ? 'profit' : 'liability'
          );
          bet = bet.set(betType === 'back' ? 'profit' : 'liability', profitLiability);
        }
      } else {
        // Use the original profit or liability if the odds and the stake are the same as 
        // the original
        bet = bet.set(
          betType === 'back' ? 'profit' : 'liability',
          betType === 'back' ? bet.get('original_profit') : bet.get('original_liability')
        );
      }

      return state.merge({
        unmatchedBets: unmatchedBets.set(index, bet)
      });
    }

    case ActionTypes.MARKET_DRAWER_DELETE_ONE_UNMATCHED_BET: {
      return state.merge({
        unmatchedBets: unmatchedBets.filterNot((b) => b.get('id') === action.betId)
      });
    }

    case ActionTypes.MARKET_DRAWER_SHOW_DELETE_UNMATCHED_BETS_CONFIRMATION: {
      return state.merge({
        unmatchedbetsToBeDeleted: action.bets,
        overlay: BettingDrawerStates.DELETE_BETS_CONFIRMATION
      });
    }

    case ActionTypes.MARKET_DRAWER_SHOW_DELETE_UNMATCHED_BET_CONFIRMATION: {
      return state.merge({
        unmatchedBetToBeDeleted: action.bet,
        overlay: BettingDrawerStates.DELETE_BET_CONFIRMATION
      });
    }

    case ActionTypes.MARKET_DRAWER_HIDE_DELETE_UNMATCHED_BETS_CONFIRMATION: {
      return state.merge({
        unmatchedbetsToBeDeleted: Immutable.List(),
        overlay: BettingDrawerStates.NO_OVERLAY
      });
    }

    case ActionTypes.MARKET_DRAWER_DELETE_MANY_UNMATCHED_BETS: {
      return state.merge({
        unmatchedBets: unmatchedBets.filterNot((b) => action.listOfBetIds.includes(b.get('id'))),
        unmatchedbetsToBeDeleted: Immutable.List(),
        overlay: BettingDrawerStates.NO_OVERLAY
      });
    }

    case ActionTypes.MARKET_DRAWER_SHOW_PLACED_BETS_CONFIRMATION: {
      return state.merge({
        overlay: BettingDrawerStates.SUBMIT_BETS_CONFIRMATION,
        showOpenBetsConfirmation: true
      });
    }

    case ActionTypes.MARKET_DRAWER_HIDE_PLACED_BETS_CONFIRMATION: {
      return state.merge({
        overlay: BettingDrawerStates.NO_OVERLAY
      });
    }

    case ActionTypes.MARKET_DRAWER_HIDE_PLACED_BETS_ERROR: {
      return state.merge({
        overlay: BettingDrawerStates.NO_OVERLAY
      });
    }

    case ActionTypes.BET_SET_EDIT_BETS_BY_IDS_LOADING_STATUS: {
      let overlay = state.overlay;

      if (action.loadingStatus === LoadingStatus.LOADING) {
        overlay = BettingDrawerStates.SUBMIT_BETS_WAITING;
      } else if (action.loadingStatus === LoadingStatus.DONE) {
        overlay = BettingDrawerStates.SUBMIT_BETS_SUCCESS;
      }

      return state.merge({
        overlay
      });
    }

    case ActionTypes.BET_SET_EDIT_BETS_ERROR_BY_BET_ID: {
      return state.merge({
        overlay: BettingDrawerStates.SUBMIT_BETS_ERROR
      });
    }

    case ActionTypes.MARKET_DRAWER_RESET_UNMATCHED_BETS: {
      // Just reset every bet to their original values
      // It is a small list anyway
      const restoredBets = unmatchedBets.map((bet) => bet
        .set('updated', false)
        .set('odds', bet.get('original_odds'))
        .set('stake', bet.get('original_stake'))
        .set('profit', bet.get('original_profit'))
        .set('liability', bet.get('original_liability'))
      );
      return state.merge({
        unmatchedBets: restoredBets
      });
    }

    case ActionTypes.MARKET_DRAWER_SET_GROUP_BY_AVERAGE_ODDS: {
      return state.merge({
        groupByAverageOdds: action.groupByAverageOdds
      });
    }

    case ActionTypes.MARKET_DRAWER_HIDE_OVERLAY: {
      return state.merge({
        overlay: BettingDrawerStates.NO_OVERLAY
      });
    }

    default:
      return state;
  }
}
