import { ActionTypes } from '../constants';
import Immutable from 'immutable';
import moment from 'moment';
import BetActions from './BetActions';
import { resolveMarketTypeValue } from './dataUtils';

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

  static showDeleteUnconfirmedBetsConfirmation(bets) {
    return {
      type: ActionTypes.MARKET_DRAWER_SHOW_DELETE_UNCONFIRMED_BETS_CONFIRMATION,
      bets
    }
  }

  static hideDeleteUnconfirmedBetsConfirmation() {
    return {
      type: ActionTypes.MARKET_DRAWER_HIDE_DELETE_UNCONFIRMED_BETS_CONFIRMATION,
    }
  }

  static deleteManyUnconfirmedBets(listOfBetIds) {
    return {
      type: ActionTypes.MARKET_DRAWER_DELETE_MANY_UNCONFIRMED_BETS,
      listOfBetIds
    };
  }

  static deleteAllUnconfirmedBets() {
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

  static getPlacedBets(placedBets, bettingMarketGroupId, currencyFormat) {
    return {
      type: ActionTypes.MARKET_DRAWER_GET_PLACED_BETS,
      placedBets,
      bettingMarketGroupId,
      currencyFormat
    }
  }

  static updateOneUnmatchedBet(delta) {
    return {
      type: ActionTypes.MARKET_DRAWER_UPDATE_ONE_UNMATCHED_BET,
      delta
    };
  }

  static deleteOneUnmatchedBet(betId) {
    return {
      type: ActionTypes.MARKET_DRAWER_DELETE_ONE_UNMATCHED_BET,
      betId
    };
  }

  static showDeleteUnmatchedBetsConfirmation(bets) {
    return {
      type: ActionTypes.MARKET_DRAWER_SHOW_DELETE_UNMATCHED_BETS_CONFIRMATION,
      bets
    }
  }

  static hideDeleteUnmatchedBetsConfirmation() {
    return {
      type: ActionTypes.MARKET_DRAWER_HIDE_DELETE_UNMATCHED_BETS_CONFIRMATION,
    }
  }

  static deleteManyUnmatchedBets(listOfBetIds) {
    return {
      type: ActionTypes.MARKET_DRAWER_DELETE_MANY_UNMATCHED_BETS,
      listOfBetIds
    };
  }

  static showPlacedBetsConfirmation() {
    return {
      type: ActionTypes.MARKET_DRAWER_SHOW_PLACED_BETS_CONFIRMATION,
    }
  }

  static hidePlacedBetsConfirmation() {
    return {
      type: ActionTypes.MARKET_DRAWER_HIDE_PLACED_BETS_CONFIRMATION,
    }
  }

  static hidePlacedBetsError() {
    return {
      type: ActionTypes.MARKET_DRAWER_HIDE_PLACED_BETS_ERROR,
    }
  }

  static resetUnmatchedBets() {
    return {
      type: ActionTypes.MARKET_DRAWER_RESET_UNMATCHED_BETS,
    }
  }

  static setGroupByAverageOdds(groupByAverageOdds) {
    return {
      type: ActionTypes.MARKET_DRAWER_SET_GROUP_BY_AVERAGE_ODDS,
      groupByAverageOdds
    }
  }
}

class MarketDrawerActions {
  static createBet(team, bet_type, betting_market_id, market_type_id, market_type_value, odds = '') {
    return (dispatch) => {
      const bet = Immutable.fromJS({
        team,
        bet_type,
        betting_market_id,
        market_type_id,
        market_type_value,
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

  static clickDeleteUnconfirmedBets(bets) {
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.showDeleteUnconfirmedBetsConfirmation(bets));
    }
  }

  static cancelDeleteUnconfirmedBets() {
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.hideDeleteUnconfirmedBetsConfirmation());
    }
  }

  static deleteUnconfirmedBets(bets) {
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.deleteManyUnconfirmedBets(bets.map(b => b.get('id'))));
    }
  }

  static deleteAllUnconfirmedBets() {
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.deleteAllUnconfirmedBets());
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
        const placedBets = bets.filter(bet => bettingMarketIds.includes(bet.get('betting_market_id')))
                               .map(bet =>
                                 bet.set('market_type_id', bettingMarketGroup.get('market_type_id'))
                                    .set('market_type_value', resolveMarketTypeValue(bettingMarketGroup, bet.get('betting_market_id')))
                               );
        const account = getState().get('account');
        const accountId = account.getIn(['account','id']);
        const setting = getState().getIn(['setting', 'settingByAccountId', accountId]) || getState().getIn(['setting', 'defaultSetting'])
        dispatch(MarketDrawerPrivateActions.getPlacedBets(placedBets, bettingMarketGroupId, setting.get('currencyFormat')));
      })
    }
  }

  static updateUnmatchedBet(delta) {
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.updateOneUnmatchedBet(delta));
    }
  }

  static deleteUnmatchedBet(bet) {
    return (dispatch) => {
      dispatch(BetActions.cancelBets(Immutable.List([bet])));
      // TODO DEPRECATE: Once the Blockchain is ready we SHOULD NOT manually remove an unmatched bet
      console.warn("Warning    Manual removal of unmatched bets in UI should be prohibited once Bet cancellation is available in Blockchain");
      dispatch(MarketDrawerPrivateActions.deleteOneUnmatchedBet(bet.get('id')));
    }
  }

  static clickDeleteUnmatchedBets(bets) {
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.showDeleteUnmatchedBetsConfirmation(bets));
    }
  }

  static cancelDeleteUnmatchedBets() {
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.hideDeleteUnmatchedBetsConfirmation());
    }
  }

  static deleteUnmatchedBets(bets) {
    return (dispatch) => {
      dispatch(BetActions.cancelBets(Immutable.List(bets)));
      // TODO DEPRECATE: Once the Blockchain is ready we SHOULD NOT manually remove an unmatched bet
      console.warn("Warning    Manual removal of unmatched bets in UI should be prohibited once Bet cancellation is available in Blockchain");
      dispatch(MarketDrawerPrivateActions.deleteManyUnmatchedBets(bets.map(b => b.get('id'))));
    }
  }

  static clickUpdateBet() {
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.showPlacedBetsConfirmation());
    }
  }

  static cancelUpdateBet() {
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.hidePlacedBetsConfirmation());
      dispatch(MarketDrawerPrivateActions.hidePlacedBetsError());
    }
  }

  static clickReset() {
    return (dispatch)  => {
      dispatch(MarketDrawerPrivateActions.resetUnmatchedBets());
    }
  }

  static clickAverageOdds(groupByAverageOdds) {
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.setGroupByAverageOdds(groupByAverageOdds));
    }
  }
}

export default MarketDrawerActions;
