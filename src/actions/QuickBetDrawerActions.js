import { ActionTypes, ConnectionStatus, Config } from '../constants';
import Immutable from 'immutable';
import moment from 'moment';
import { CurrencyUtils } from '../utility';

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

  static showDeleteBetsConfirmation(bets, eventName) {
    return {
      type: ActionTypes.QUICK_BET_DRAWER_SHOW_DELETE_BETS_CONFIRMATION,
      bets,
      eventName
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

  static showInsufficientBalanceError() {
    return {
      type: ActionTypes.QUICK_BET_DRAWER_SHOW_INSUFFICIENT_BALANCE_ERROR,
    }
  }

  static showDisconnectedError() {
    return {
      type: ActionTypes.QUICK_BET_DRAWER_SNOW_DISCONNECTED_ERROR,
    }
  }

  static hideOverlay() {
    return {
      type: ActionTypes.QUICK_BET_DRAWER_HIDE_OVERLAY,
    }
  }
}

class QuickBetDrawerActions {
  static createBet(event_id, event_name, bet_type, betting_market_id, odds) {
    return (dispatch, getState) => {
      const bettingMarket = getState().getIn(['bettingMarket', 'bettingMarketsById', betting_market_id]);
      const bettingMarketGroupId = bettingMarket && bettingMarket.get('group_id');
      const bettingMarketGroup = getState().getIn(['bettingMarketGroup', 'bettingMarketGroupsById', bettingMarketGroupId]);
      const bettingMarketDescription = bettingMarket && bettingMarket.get('description');
      const bettingMarketGroupDescription = bettingMarketGroup && bettingMarketGroup.get('description');
      const bet = Immutable.fromJS({
        event_id,
        event_name,
        bet_type,
        betting_market_id,
        odds,
        betting_market_description: bettingMarketDescription,
        betting_market_group_description: bettingMarketGroupDescription,
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

  static clickDeleteBets(bets, eventName) {
    return (dispatch) => {
      dispatch(QuickBetDrawerPrivateActions.showDeleteBetsConfirmation(bets, eventName));
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

  static clickPlaceBet(totalBetAmount, currencyFormat) {
    console.warn('The totalBetAmount is not the final version.')
    return (dispatch, getState) => {
      const isDisconnected = getState().getIn(['app', 'connectionStatus']) !== ConnectionStatus.CONNECTED;
      if (isDisconnected) {
        dispatch(QuickBetDrawerPrivateActions.showDisconnectedError());
      } else {
        const balance = getState().getIn(['balance', 'availableBalancesByAssetId', Config.coreAsset, 'balance']);
        const precision = getState().getIn(['asset', 'assetsById', Config.coreAsset, 'precision']);
        const normalizedBalance = balance / Math.pow(10, precision);
        const formattedBalance = parseFloat(CurrencyUtils.formatFieldByCurrencyAndPrecision('stake', normalizedBalance, currencyFormat));
        if (formattedBalance < totalBetAmount) {
          dispatch(QuickBetDrawerPrivateActions.showInsufficientBalanceError());
        } else {
          dispatch(QuickBetDrawerPrivateActions.showBetSlipConfirmation());
        }
      }
    }
  }

  static hideOverlay() {
    return (dispatch) => {
      dispatch(QuickBetDrawerPrivateActions.hideOverlay());
    }
  }
}

export default QuickBetDrawerActions;
