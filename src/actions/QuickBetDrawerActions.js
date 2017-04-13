import { ActionTypes } from '../constants';
import Immutable from 'immutable';
import moment from 'moment';

class QuickBetDrawerPrivateActions {
  static addQuickBet(bet) {
    return {
      type: ActionTypes.QUICK_BET_DRAWER_ADD_QUICK_BET,
      bet
    };
  }

  static deleteQuickBet(quickBetId) {
    return {
      type: ActionTypes.QUICK_BET_DRAWER_DELETE_QUICK_BET,
      quickBetId
    }
  }
}

class QuickBetDrawerActions {
  static createBet(record, team, betType, offer) {
    return (dispatch) => {
      const bet = Immutable.fromJS({
        event_id: record.get('id'),
        event_name: record.get('name'),
        team_name: team,
        bet_type: betType,
        offer: offer,
        id: parseInt(moment().format('x'), 10)  // unix millisecond timestamp
      });
      dispatch(QuickBetDrawerPrivateActions.addQuickBet(bet));
    };
  }

  static deleteBet(bet) {
    // NOTE the bet object is a vanilla JS object stored in a ant-design table
    return (dispatch) => {
      dispatch(QuickBetDrawerPrivateActions.deleteQuickBet(bet.id));
    }
  }
}

export default QuickBetDrawerActions;
