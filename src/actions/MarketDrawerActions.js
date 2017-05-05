import { ActionTypes } from '../constants';
import Immutable from 'immutable';
import moment from 'moment';
import BetActions from './BetActions';

class MarketDrawerPrivateActions {
  static addUnconfirmedBet(bet) {
    return {
      type: ActionTypes.MARKET_DRAWER_ADD_UNCONFIRMED_BET,
      bet
    };
  }

  static updateOneUnconfirmedBet(delta) {
    return {
      type: ActionTypes.MARKET_DRAWER_UPDATE_ONE_UNCONFIRMED_BET,
      delta
    };
  }

  static deleteOneUnconfirmedBet(betId) {
    return {
      type: ActionTypes.MARKET_DRAWER_DELETE_ONE_UNCONFIRMED_BET,
      betId
    };
  }

  static deleteManyUnconfirmedBets(listOfBetIds) {
    return {
      type: ActionTypes.MARKET_DRAWER_DELETE_MANY_UNCONFIRMED_BETS,
      listOfBetIds
    };
  }

  static deleteAllConfirmedBets() {
    return {
      type: ActionTypes.MARKET_DRAWER_DELETE_ALL_UNCONFIRMED_BETS,
    }
  }

  static showBetSlipConfirmation() {
    return {
      type: ActionTypes.MARKET_DRAWER_SHOW_BETSLIP_CONFIRMATION,
    }
  }

  static hideBetSlipConfirmation() {
    return {
      type: ActionTypes.MARKET_DRAWER_HIDE_BETSLIP_CONFIRMATION,
    }
  }

  static hideBetSlipError() {
    return {
      type: ActionTypes.MARKET_DRAWER_HIDE_BETSLIP_ERROR,
    }
  }

  static getPlacedBets(placedBets) {
    return {
      type: ActionTypes.MARKET_DRAWER_GET_PLACED_BETS,
      placedBets
    }
  }

  static updateOneUnmatchedBet(delta) {
    return {
      type: ActionTypes.MARKET_DRAWER_UPDATE_ONE_UNMATCHED_BET,
      delta
    };
  }
}

class MarketDrawerActions {
  static createBet(team, bet_type, betting_market_id, odds = '') {
    return (dispatch) => {
      const bet = Immutable.fromJS({
        team,
        bet_type,
        betting_market_id,
        odds,
        id: parseInt(moment().format('x'), 10)  // unix millisecond timestamp
      });
      dispatch(MarketDrawerPrivateActions.addUnconfirmedBet(bet));
    };
  }

  static updateUnconfirmedBet(delta) {
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.updateOneUnconfirmedBet(delta));
    }
  }

  static deleteUnconfirmedBet(bet) {
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.deleteOneUnconfirmedBet(bet.get('id')));
    }
  }

  static deleteUnconfirmedBets(bets) {
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.deleteManyUnconfirmedBets(bets.map(b => b.get('id'))));
    }
  }

  static deleteAllUnconfirmedBets() {
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.deleteAllConfirmedBets());
    }
  }

  static clickPlaceBet() {
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.showBetSlipConfirmation());
    }
  }

  static cancelPlaceBet() {
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.hideBetSlipConfirmation());
      dispatch(MarketDrawerPrivateActions.hideBetSlipError());
    }
  }

  static getPlacedBets(bettingMarketGroupId) {
    return (dispatch, getState) => {
      dispatch(BetActions.getOngoingBets()).then(bets => {
        const bettingMarketGroup = getState().getIn(['bettingMarketGroup', 'bettingMarketGroupsById', bettingMarketGroupId]);
        const bettingMarketIds= bettingMarketGroup.get('betting_market_ids');
        const placedBets = bets.filter(bet => bettingMarketIds.includes(bet.get('betting_market_id')));
        dispatch(MarketDrawerPrivateActions.getPlacedBets(placedBets));
      })
    }
  }

  static updateUnmatchedBet(delta) {
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.updateOneUnmatchedBet(delta));
    }
  }
}

export default MarketDrawerActions;
