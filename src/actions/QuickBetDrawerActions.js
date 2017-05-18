import { ActionTypes } from '../constants';
import Immutable from 'immutable';
import moment from 'moment';

class QuickBetDrawerPrivateActions {
  static addOneBet(bet) {
    return {
      type: ActionTypes.QUICK_BET_DRAWER_ADD_ONE_BET,
      bet
    };
  }

  static updateOneBet(delta) {
    return {
      type: ActionTypes.QUICK_BET_DRAWER_UPDATE_ONE_BET,
      delta
    };
  }

  static deleteOneBet(betId) {
    return {
      type: ActionTypes.QUICK_BET_DRAWER_DELETE_ONE_BET,
      betId
    }
  }

  static deleteManyBets(listOfBetIds) {
    return {
      type: ActionTypes.QUICK_BET_DRAWER_DELETE_MANY_BETS,
      listOfBetIds
    }
  }

  static deleteAllBets() {
    return {
      type: ActionTypes.QUICK_BET_DRAWER_DELETE_ALL_BETS,
    }
  }

  static showBetSlipConfirmation() {
    return {
      type: ActionTypes.QUICK_BET_DRAWER_SHOW_BETSLIP_CONFIRMATION,
    }
  }

  static hideBetSlipConfirmation() {
    return {
      type: ActionTypes.QUICK_BET_DRAWER_HIDE_BETSLIP_CONFIRMATION,
    }
  }

  static hideBetSlipError() {
    return {
      type: ActionTypes.QUICK_BET_DRAWER_HIDE_BETSLIP_ERROR,
    }
  }
}

class QuickBetDrawerActions {
  static createBet(event_id, event_name, team, bet_type, betting_market_id, odds) {
    return (dispatch) => {
      const bet = Immutable.fromJS({
        event_id,
        event_name,
        team,
        bet_type,
        betting_market_id,
        market_type_id: 'Moneyline',      // QuickBetDrawer only handles Moneyline
        market_type_value: 'Moneyline',   // Moneyline does not require extra option
        odds,
        id: parseInt(moment().format('x'), 10)  // unix millisecond timestamp
      });
      dispatch(QuickBetDrawerPrivateActions.addOneBet(bet));
    };
  }

  static updateBet(delta) {
    return (dispatch) => {
      dispatch(QuickBetDrawerPrivateActions.updateOneBet(delta));
    }
  }

  static deleteBet(bet) {
    return (dispatch) => {
      dispatch(QuickBetDrawerPrivateActions.deleteOneBet(bet.get('id')));
    }
  }

  static deleteBets(bets) {
    return (dispatch) => {
      dispatch(QuickBetDrawerPrivateActions.deleteManyBets(bets.map(b => b.get('id'))));
    }
  }

  static deleteAllBets() {
    return (dispatch) => {
      dispatch(QuickBetDrawerPrivateActions.deleteAllBets());
    }
  }

  static clickPlaceBet() {
    return (dispatch) => {
      dispatch(QuickBetDrawerPrivateActions.showBetSlipConfirmation());
    }
  }

  static cancelPlaceBet() {
    return (dispatch) => {
      dispatch(QuickBetDrawerPrivateActions.hideBetSlipConfirmation());
      dispatch(QuickBetDrawerPrivateActions.hideBetSlipError());
    }
  }
}

export default QuickBetDrawerActions;
