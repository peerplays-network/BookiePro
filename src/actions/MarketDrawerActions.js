import { ActionTypes, ConnectionStatus, Config, BetCategories } from '../constants';
import Immutable from 'immutable';
import moment from 'moment';
import BetActions from './BetActions';
import { CurrencyUtils, ObjectUtils, BettingModuleUtils } from '../utility';

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

  static showInsufficientBalanceError() {
    return {
      type: ActionTypes.MARKET_DRAWER_SHOW_INSUFFICIENT_BALANCE_ERROR,
    }
  }

  static showDisconnectedError() {
    return {
      type: ActionTypes.MARKET_DRAWER_SNOW_DISCONNECTED_ERROR,
    }
  }

  static getPlacedBets(placedUnmatchedBets, placedMatchedBets, bettingMarketGroupId) {
    return {
      type: ActionTypes.MARKET_DRAWER_GET_PLACED_BETS,
      placedUnmatchedBets,
      placedMatchedBets,
      bettingMarketGroupId
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

  static hideOverlay() {
    return {
      type: ActionTypes.MARKET_DRAWER_HIDE_OVERLAY,
    }
  }
}

class MarketDrawerActions {
  static createBet(bet_type, betting_market_id, odds = '') {
    return (dispatch, getState) => {
      const bettingMarket = getState().getIn(['bettingMarket', 'bettingMarketsById', betting_market_id]);
      const bettingMarketGroupId = bettingMarket && bettingMarket.get('group_id');
      const bettingMarketGroup = getState().getIn(['bettingMarketGroup', 'bettingMarketGroupsById', bettingMarketGroupId]);
      const bettingMarketDescription = bettingMarket && bettingMarket.get('description');
      const bettingMarketGroupDescription = bettingMarketGroup && bettingMarketGroup.get('description');
      const bet = Immutable.fromJS({
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
        const balance = getState().getIn(['balance', 'availableBalancesByAssetId', Config.coreAsset, 'balance']);
        const precision = getState().getIn(['asset', 'assetsById', Config.coreAsset, 'precision']);
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

  static updatePlacedBets() {
    return (dispatch, getState) => {
      const currentPlacedBetsBettingMarketGroupId = getState().getIn(['marketDrawer', 'bettingMarketGroupId']);
      if (currentPlacedBetsBettingMarketGroupId) {
        dispatch(MarketDrawerActions.getPlacedBets(currentPlacedBetsBettingMarketGroupId));
      }
    }
  }

  static getPlacedBets(bettingMarketGroupId) {
    return (dispatch, getState) => {
      const bettingMarketGroup = getState().getIn(['bettingMarketGroup', 'bettingMarketGroupsById', bettingMarketGroupId]);

      if (!bettingMarketGroup || bettingMarketGroup.isEmpty()) {
        // If betting market group doesn't exist, clear placed bets
        dispatch(MarketDrawerActions.clearPlacedBets());
      } else {
        const unmatchedBetsById = getState().getIn(['bet', 'unmatchedBetsById']);
        const matchedBetsById = getState().getIn(['bet', 'matchedBetsById']);

        const bettingMarketsById = getState().getIn(['bettingMarket', 'bettingMarketsById']);
        const assetsById = getState().getIn(['asset', 'assetsById']);
        const bettingMarketGroupDescription = bettingMarketGroup && bettingMarketGroup.get('description');

        // Helper function to filter related bet
        const filterRelatedBet = (bet) => {
          // Only get bet that belongs to this betting market group
          const bettingMarket = bettingMarketsById.get(bet.get('betting_market_id'));
          return bettingMarket && (bettingMarket.get('group_id') === bettingMarketGroupId);
        };

        // Helper function to format bets to market drawer bet object structure
        const formatBet = (bet) => {
          const bettingMarket = bettingMarketsById.get(bet.get('betting_market_id'));
          const bettingMarketDescription = bettingMarket && bettingMarket.get('description');
          const precision = assetsById.get(bettingMarketGroup.get('asset_id')).get('precision') || 0;
          const odds = bet.get('backer_multiplier');
          let stake = ObjectUtils.getStakeFromBetObject(bet) / Math.pow(10, precision);

          const accountId = getState().getIn(['account','account','id']);
          const setting = getState().getIn(['setting', 'settingByAccountId', accountId]) || getState().getIn(['setting', 'defaultSetting']);
          const currencyFormat = setting.get('currencyFormat');

          // store odds and stake values as String for easier comparison
          const oddsAsString = CurrencyUtils.formatFieldByCurrencyAndPrecision('odds', odds, currencyFormat).toString();

          stake = bet.get('back_or_lay') === 'lay' ?
                            CurrencyUtils.layBetStakeModifier(stake, odds) :
                            stake


          const stakeAsString = CurrencyUtils.formatFieldByCurrencyAndPrecision('stake',
                                  stake,
                                  currencyFormat).toString();


          let formattedBet = Immutable.fromJS({
            id: bet.get('id'),
            original_bet_id: bet.get('original_bet_id'),
            bet_type: bet.get('back_or_lay'),
            bettor_id: bet.get('bettor_id'),
            betting_market_id: bet.get('betting_market_id'),
            betting_market_description: bettingMarketDescription,
            betting_market_group_description: bettingMarketGroupDescription,
            odds: oddsAsString,
            stake: stakeAsString,
          });

          if (bet.get('category') === BetCategories.UNMATCHED_BET) {
            // Additional field for unmatched bets
            formattedBet = formattedBet.set('original_odds', oddsAsString)
                                       .set('original_stake', stakeAsString)
                                       .set('updated', false);

            if (bet.get('back_or_lay') === 'lay') {
              const profit = BettingModuleUtils.getProfitOrLiability(formattedBet.get('original_stake'), formattedBet.get('original_odds'));
              formattedBet = formattedBet.set('profit', profit).set('liability', profit)
            }
          }

          return formattedBet;
        };

        const placedUnmatchedBets = unmatchedBetsById.filter(filterRelatedBet).map(formatBet).toList();
        const placedMatchedBets =  matchedBetsById.filter(filterRelatedBet).map(formatBet).toList();

        dispatch(MarketDrawerPrivateActions.getPlacedBets(placedUnmatchedBets, placedMatchedBets, bettingMarketGroupId));
      }

    }
  }

  static clearPlacedBets() {
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.getPlacedBets(Immutable.List(), Immutable.List(), null));
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
      if (Config.useDummyData) {
        console.warn("Warning    Manual removal of unmatched bets in UI should be prohibited once Bet cancellation is available in Blockchain");
        dispatch(MarketDrawerPrivateActions.deleteOneUnmatchedBet(bet.get('id')));
      }
    }
  }

  static clickDeleteUnmatchedBets(bets) {
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.showDeleteUnmatchedBetsConfirmation(bets));
    }
  }

  static deleteUnmatchedBets(bets) {
    return (dispatch) => {
      dispatch(BetActions.cancelBets(Immutable.List(bets)));
      // TODO DEPRECATE: Once the Blockchain is ready we SHOULD NOT manually remove an unmatched bet
      if (Config.useDummyData) {
        console.warn("Warning    Manual removal of unmatched bets in UI should be prohibited once Bet cancellation is available in Blockchain");
        dispatch(MarketDrawerPrivateActions.deleteManyUnmatchedBets(bets.map(b => b.get('id'))));
      }
    }
  }

  static clickUpdateBet(totalBetAmount, currencyFormat) {
    console.warn('The totalBetAmount is not the final version.')
    return (dispatch, getState) => {
      const isDisconnected = getState().getIn(['app', 'connectionStatus']) !== ConnectionStatus.CONNECTED;
      if (isDisconnected) {
        dispatch(MarketDrawerPrivateActions.showDisconnectedError());
      } else {
        const balance = getState().getIn(['balance', 'availableBalancesByAssetId', Config.coreAsset, 'balance']);
        const precision = getState().getIn(['asset', 'assetsById', Config.coreAsset, 'precision']);
        const normalizedBalance = balance / Math.pow(10, precision);
        const formattedBalance = parseFloat(CurrencyUtils.formatFieldByCurrencyAndPrecision('stake', normalizedBalance, currencyFormat));
        if (formattedBalance < totalBetAmount) {
          dispatch(MarketDrawerPrivateActions.showInsufficientBalanceError());
        } else {
          dispatch(MarketDrawerPrivateActions.showPlacedBetsConfirmation());
        }
      }
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

  static hideOverlay() {
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.hideOverlay());
    }
  }
}

export default MarketDrawerActions;
