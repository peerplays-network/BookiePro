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
}

class QuickBetDrawerActions {
  static createBet(record, team, betType, betting_market_id, offer) {
    return (dispatch) => {
      const bet = Immutable.fromJS({
        event_id: record.get('id'),
        event_name: record.get('name'),
        team_name: team,
        bet_type: betType,
        betting_market_id: betting_market_id,
        offer: offer,
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
}

export default QuickBetDrawerActions;
