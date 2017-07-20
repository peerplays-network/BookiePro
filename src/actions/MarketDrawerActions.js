import { ActionTypes, ConnectionStatus } from '../constants';
import Immutable from 'immutable';
import moment from 'moment';
import BetActions from './BetActions';
import { CurrencyUtils } from '../utility';

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

  static showInsufficientBalanceError() {
    return {
      type: ActionTypes.MARKET_DRAWER_SHOW_INSUFFICIENT_BALANCE_ERROR,
    }
  }

  static hideInsufficientBalanceError() {
    return {
      type: ActionTypes.MARKET_DRAWER_HIDE_INSUFFICIENT_BALANCE_ERROR,
    }
  }

  static showDisconnectedError() {
    return {
      type: ActionTypes.MARKET_DRAWER_SNOW_DISCONNECTED_ERROR,
    }
  }

  static hideDisconnectedError() {
    return {
      type: ActionTypes.MARKET_DRAWER_HIDE_DISCONNECTED_ERROR,
    }
  }

  static getPlacedBets(placedUnmatchedBets, placedMatchedBets, bettingMarketGroupId, currencyFormat) {
    return {
      type: ActionTypes.MARKET_DRAWER_GET_PLACED_BETS,
      placedUnmatchedBets,
      placedMatchedBets,
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
  static createBet(team, bet_type, betting_market_id, odds = '') {
    return (dispatch, getState) => {
      const bettingMarket = getState().getIn(['bettingMarket', 'bettingMarketsById', betting_market_id]);
      const bettingMarketGroupId = bettingMarket && bettingMarket.get('betting_market_group_id');
      const bettingMarketGroup = getState().getIn(['bettingMarketGroup', 'bettingMarketGroupsById', bettingMarketGroupId]);
      const bettingMarketDescription = bettingMarket && bettingMarket.get('description');
      const bettingMarketGroupDescription = bettingMarketGroup && bettingMarketGroup.get('description');
      const bet = Immutable.fromJS({
        team,
        bet_type,
        betting_market_id,
        odds,
        betting_market_description: bettingMarketDescription,
        betting_market_group_description: bettingMarketGroupDescription,
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

  static clickPlaceBet(totalBetAmount, currencyFormat) {
    console.warn('The totalBetAmount is not the final version.')
    return (dispatch, getState) => {
      const isDisconnected = getState().getIn(['app', 'connectionStatus']) !== ConnectionStatus.CONNECTED;
      if (isDisconnected) {
        dispatch(MarketDrawerPrivateActions.showDisconnectedError());
      } else {
        const balance = getState().getIn(['balance', 'availableBalancesByAssetId', '1.3.0', 'balance']);
        const precision = getState().getIn(['asset', 'assetsById', '1.3.0', 'precision']);
        const normalizedBalance = balance / Math.pow(10, precision);
        const formattedBalance = parseFloat(CurrencyUtils.formatFieldByCurrencyAndPrecision('stake', normalizedBalance, currencyFormat));
        if (formattedBalance < totalBetAmount) {
          dispatch(MarketDrawerPrivateActions.showInsufficientBalanceError());
        } else {
          dispatch(MarketDrawerPrivateActions.showBetSlipConfirmation());
        }
      }
    }
  }

  static cancelPlaceBet() {
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.hideBetSlipConfirmation());
      dispatch(MarketDrawerPrivateActions.hideBetSlipError());
    }
  }

  static hideInsufficientBalanceError() {
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.hideInsufficientBalanceError());
    }
  }

  static hideDisconnectedError() {
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.hideDisconnectedError());
    }
  }

  static getPlacedBets(bettingMarketGroupId) {
    return (dispatch, getState) => {
      const unmatchedBetsById = getState().getIn(['bet', 'unmatchedBetsById']);
      const matchedBetsById = getState().getIn(['bet', 'matchedBetsById']);
      const bettingMarketGroup = getState().getIn(['bettingMarketGroup', 'bettingMarketGroupsById', bettingMarketGroupId]);
      const bettingMarketIds= bettingMarketGroup.get('betting_market_ids');
      const bettingMarketsById = getState().getIn(['bettingMarket', 'bettingMarketsById']);
      const assetsById = getState().getIn(['asset', 'assetsById']);
      const bettingMarketGroupDescription = bettingMarketGroup && bettingMarketGroup.get('description');
      const getBets = (collection) =>
        collection.filter(bet => bettingMarketIds.includes(bet.get('betting_market_id'))).map(bet => {
          const bettingMarket = bettingMarketsById.get(bet.get('betting_market_id'));
          const bettingMarketDescription = bettingMarket && bettingMarket.get('description');
          const precision = assetsById.get(bettingMarket.get('bet_asset_type')).get('precision');
          return bet.set('betting_market_description', bettingMarketDescription)
                    .set('betting_market_group_description', bettingMarketGroupDescription)
                    .set('asset_precision', precision);     // set this and use in reducer
        });

      const placedUnmatchedBets = getBets(unmatchedBetsById);
      const placedMatchedBets = getBets(matchedBetsById);

      const account = getState().get('account');
      const accountId = account.getIn(['account','id']);
      const setting = getState().getIn(['setting', 'settingByAccountId', accountId]) || getState().getIn(['setting', 'defaultSetting'])
      dispatch(MarketDrawerPrivateActions.getPlacedBets(placedUnmatchedBets, placedMatchedBets, bettingMarketGroupId, setting.get('currencyFormat')));
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
