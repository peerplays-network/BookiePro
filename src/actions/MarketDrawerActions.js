import {
  ActionTypes, 
  ConnectionStatus, 
  Config, 
  BetCategories, 
  BetTypes, 
  LoadingStatus
} from '../constants';
import Immutable from 'immutable';
import moment from 'moment';
import BetActions from './BetActions';
import {CurrencyUtils, ObjectUtils} from '../utility';

class MarketDrawerPrivateActions {
  static updateOpenBetsLoadingStatus(loadingStatus) {
    return {
      type: ActionTypes.MARKET_DRAWER_UPDATE_OPENED_BETS_LOADING_STATUS,
      loadingStatus
    };
  }

  static addUnconfirmedBet(bet) {
    return {
      type: ActionTypes.MARKET_DRAWER_ADD_UNCONFIRMED_BET,
      bet
    };
  }

  static updateOneUnconfirmedBet(delta, currencyFormat) {
    return {
      type: ActionTypes.MARKET_DRAWER_UPDATE_ONE_UNCONFIRMED_BET,
      delta,
      currencyFormat
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
    };
  }

  static deleteManyUnconfirmedBets(listOfBetIds) {
    return {
      type: ActionTypes.MARKET_DRAWER_DELETE_MANY_UNCONFIRMED_BETS,
      listOfBetIds
    };
  }

  static deleteAllUnconfirmedBets() {
    return {
      type: ActionTypes.MARKET_DRAWER_DELETE_ALL_UNCONFIRMED_BETS
    };
  }

  static showBetSlipConfirmation() {
    return {
      type: ActionTypes.MARKET_DRAWER_SHOW_BETSLIP_CONFIRMATION
    };
  }

  static showInsufficientBalanceError() {
    return {
      type: ActionTypes.MARKET_DRAWER_SHOW_INSUFFICIENT_BALANCE_ERROR
    };
  }

  static showDisconnectedError() {
    return {
      type: ActionTypes.MARKET_DRAWER_SNOW_DISCONNECTED_ERROR
    };
  }

  static getOpenBets(openedUnmatchedBets, openedMatchedBets, bettingMarketGroupId, eventId) {
    return {
      type: ActionTypes.MARKET_DRAWER_GET_OPENED_BETS,
      openedUnmatchedBets,
      openedMatchedBets,
      bettingMarketGroupId,
      eventId
    };
  }

  static updateOneUnmatchedBet(delta, currencyFormat) {
    return {
      type: ActionTypes.MARKET_DRAWER_UPDATE_ONE_UNMATCHED_BET,
      delta,
      currencyFormat
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
    };
  }

  static showDeleteUnmatchedBetConfirmation(bet) {
    return {
      type: ActionTypes.MARKET_DRAWER_SHOW_DELETE_UNMATCHED_BET_CONFIRMATION,
      bet
    };
  }

  static deleteManyUnmatchedBets(listOfBetIds) {
    return {
      type: ActionTypes.MARKET_DRAWER_DELETE_MANY_UNMATCHED_BETS,
      listOfBetIds
    };
  }

  static showOpenBetsConfirmation() {
    return {
      type: ActionTypes.MARKET_DRAWER_SHOW_OPENED_BETS_CONFIRMATION
    };
  }

  static resetUnmatchedBets() {
    return {
      type: ActionTypes.MARKET_DRAWER_RESET_UNMATCHED_BETS
    };
  }

  static setGroupByAverageOdds(groupByAverageOdds) {
    return {
      type: ActionTypes.MARKET_DRAWER_SET_GROUP_BY_AVERAGE_ODDS,
      groupByAverageOdds
    };
  }

  static hideOverlay() {
    return {
      type: ActionTypes.MARKET_DRAWER_HIDE_OVERLAY
    };
  }
}

class MarketDrawerActions {
  static updateOpenBetsLoadingStatus(loadingStatus) {
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.updateOpenBetsLoadingStatus(loadingStatus));
    };
  }

  static createBet(bet_type, betting_market_id, odds = '') {
    return (dispatch, getState) => {
      const bettingMarket = getState().getIn([
        'bettingMarket',
        'bettingMarketsById',
        betting_market_id
      ]);
      const bettingMarketGroupId = bettingMarket && bettingMarket.get('group_id');
      const bettingMarketGroup = getState().getIn([
        'bettingMarketGroup',
        'bettingMarketGroupsById',
        bettingMarketGroupId
      ]);
      const bettingMarketDescription = bettingMarket && bettingMarket.get('description');
      const bettingMarketGroupDescription =
        bettingMarketGroup && bettingMarketGroup.get('description');
      const bet = Immutable.fromJS({
        bet_type,
        betting_market_id,
        odds,
        betting_market_description: bettingMarketDescription,
        betting_market_group_description: bettingMarketGroupDescription,
        id: parseInt(moment().format('x'), 10) // unix millisecond timestamp
      });
      dispatch(MarketDrawerPrivateActions.addUnconfirmedBet(bet));
    };
  }

  static updateUnconfirmedBet(delta, currencyFormat) {
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.updateOneUnconfirmedBet(delta, currencyFormat));
    };
  }

  static deleteUnconfirmedBet(bet) {
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.deleteOneUnconfirmedBet(bet.get('id')));
    };
  }

  static clickDeleteUnconfirmedBets(bets) {
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.showDeleteUnconfirmedBetsConfirmation(bets));
    };
  }

  static deleteUnconfirmedBets(bets) {    
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.deleteManyUnconfirmedBets(bets.map((b) => b.get('id'))));
    };
  }

  static deleteAllUnconfirmedBets() {    
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.deleteAllUnconfirmedBets());
    };
  }

  static clickPlaceBet(totalBetAmount, currencyFormat) {
    console.warn('The totalBetAmount is not the final version.');

    return (dispatch, getState) => {
      dispatch(MarketDrawerActions.updateOpenBetsLoadingStatus(LoadingStatus.LOADING));
      const isDisconnected =
        getState().getIn(['app', 'connectionStatus']) !== ConnectionStatus.CONNECTED;

      if (isDisconnected) {
        dispatch(MarketDrawerPrivateActions.showDisconnectedError());
      } else {
        const balance = getState().getIn([
          'balance',
          'availableBalancesByAssetId',
          Config.coreAsset,
          'balance'
        ]);
        const precision = getState().getIn(['asset', 'assetsById', Config.coreAsset, 'precision']);
        const normalizedBalance = balance / Math.pow(10, precision);
        const formattedBalance = parseFloat(
          CurrencyUtils.formatFieldByCurrencyAndPrecision(
            'stake',
            normalizedBalance,
            currencyFormat,
            true
          )
        );

        if (formattedBalance < totalBetAmount) {
          dispatch(MarketDrawerPrivateActions.showInsufficientBalanceError());
        } else {
          dispatch(MarketDrawerPrivateActions.showBetSlipConfirmation());
        }
      }
    };
  }

  static updateOpenBets() {
    return (dispatch, getState) => {
      const currentOpenBetsBettingMarketGroupId = getState().getIn([
        'marketDrawer',
        'bettingMarketGroupId'
      ]);

      const currentOpenBetsEventId = getState().getIn([
        'marketDrawer',
        'eventId'
      ]);

      if (currentOpenBetsBettingMarketGroupId) {
        dispatch(MarketDrawerActions.getOpenBets(currentOpenBetsBettingMarketGroupId));
      } else if (currentOpenBetsEventId) {
        dispatch(MarketDrawerActions.getOpenBetsForEvent(currentOpenBetsEventId));
      }
    };
  }

  static getOpenBetsForEvent(eventId) {
    return (dispatch, getState) => {
      const bmgs = getState().getIn(['bettingMarketGroup', 'bettingMarketGroupsById']);

      if (!bmgs || bmgs.isEmpty()) {
        return null;
      }

      let openUnmatchedBets = Immutable.List();
      let openMatchedBets = Immutable.List();
      
      // For each BMG that belongs to the event
      bmgs.forEach((bmg) => {
        if (bmg.get('event_id') === eventId) {
          // Get the associated bets and push them into their respective list. Forming a single list
          let bets = MarketDrawerActions.getOpenBetsForBMG(getState(), bmg.get('id'));
          bets.openUnmatchedBets.forEach((bet) => {
            openUnmatchedBets = openUnmatchedBets.push(bet);
          });

          bets.openMatchedBets.forEach((bet) => {
            openMatchedBets = openMatchedBets.push(bet);
          });
        }
      });
      
      // Send the list off to the private action, to be added to state. 
      // - Pass in the eventId so that Bookie knows that we're on a event page.
      // - Pass in null for the bettingMarketGroupId so that Bookie knows we're not on a BMG page.
      dispatch(
        MarketDrawerPrivateActions.getOpenBets(
          openUnmatchedBets,
          openMatchedBets,
          null, // betting Market Group Id
          eventId
        )
      );
    };
  }

  static getOpenBetsForBMG(state, bettingMarketGroupId) {
    
    const bettingMarketGroup = state.getIn([
      'bettingMarketGroup',
      'bettingMarketGroupsById',
      bettingMarketGroupId
    ]);

    if (!bettingMarketGroup || bettingMarketGroup.isEmpty()) {
      // If betting market group doesn't exist, clear open bets
      return null;
    } else {
      const unmatchedBetsById = state.getIn(['bet', 'unmatchedBetsById']);
      const matchedBetsById = state.getIn(['bet', 'matchedBetsById']);

      const bettingMarketsById = state.getIn(['bettingMarket', 'bettingMarketsById']);
      const assetsById = state.getIn(['asset', 'assetsById']);
      const bettingMarketGroupDescription =
        bettingMarketGroup && bettingMarketGroup.get('description');

      // Helper function to filter related bet
      const filterRelatedBet = (bet) => {
        // Only get bet that belongs to this betting market group
        const bettingMarket = bettingMarketsById.get(bet.get('betting_market_id'));
        return bettingMarket && bettingMarket.get('group_id') === bettingMarketGroupId;
      };

      // Helper function to format bets to market drawer bet object structure
      const formatBet = (bet) => {
        const accountId = state.getIn(['account', 'account', 'id']);
        const setting =
          state.getIn(['setting', 'settingByAccountId', accountId]) ||
          state.getIn(['setting', 'defaultSetting']);
        const bettingMarket = bettingMarketsById.get(bet.get('betting_market_id'));
        const bettingMarketDescription = bettingMarket && bettingMarket.get('description');
        const precision =
          assetsById.get(bettingMarketGroup.get('asset_id')).get('precision') || 0;
        const odds = bet.get('backer_multiplier');
        const betType = bet.get('back_or_lay');
        const currencyFormat = setting.get('currencyFormat');

        // Get the stake from the bet object
        // BACK: The stake is present in a back bet by default
        // LAY: The backer's stake needs to be calculated from the values recorded in the 
        // lay bet on the blockchain
        let stake = ObjectUtils.getStakeFromBetObject(bet) / Math.pow(10, precision);

        // This if statement sets the profit/liability according to the kind of bet it is.
        // Values are then converted to string format for consistent comparison
        // BACK: ALWAYS have a liability of 0, profit to be calculated
        // LAY: ALWAYS have a profit of 0, profit to be calculated
        let profit = 0,
          profitAsString = '0';
        let liability = 0,
          liabilityAsString = '0';

        if (betType === BetTypes.BACK) {
          // Get the raw value of the profit
          profit = bet.get('original_profit') / Math.pow(10, precision);
          profitAsString = CurrencyUtils.formatFieldByCurrencyAndPrecision(
            'profit',
            profit,
            currencyFormat
          ).toString(); // Record it as a string
        } else if (betType === BetTypes.LAY) {
          liability = bet.get('original_liability') / Math.pow(10, precision);
          liabilityAsString = CurrencyUtils.formatFieldByCurrencyAndPrecision(
            'liability',
            liability,
            currencyFormat
          ).toString();
        } else {
          console.error('Serious Error - Bet with no type has been detected');
        }

        // store odds and stake values as String for easier comparison
        const oddsAsString = CurrencyUtils.formatFieldByCurrencyAndPrecision(
          'odds',
          odds,
          currencyFormat
        ).toString();
        const stakeAsString = CurrencyUtils.formatFieldByCurrencyAndPrecision(
          'stake',
          stake,
          currencyFormat
        ).toString();

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
          profit: profitAsString,
          liability: liabilityAsString
        });

        if (bet.get('category') === BetCategories.UNMATCHED_BET) {
          // Keep all of the original values for precision and accuracy in future calculations
          formattedBet = formattedBet
            .set('original_odds', oddsAsString)
            .set('original_stake', stakeAsString)
            .set('original_profit', profitAsString)
            .set('original_liability', liabilityAsString)
            .set('updated', false);
        }

        return formattedBet;
      };

      const openUnmatchedBets = unmatchedBetsById
        .filter(filterRelatedBet)
        .map(formatBet)
        .toList();
      const openMatchedBets = matchedBetsById
        .filter(filterRelatedBet)
        .map(formatBet)
        .toList();

      return {
        openUnmatchedBets,
        openMatchedBets
      };
    }
  }

  static getOpenBets(bettingMarketGroupId) {
    return (dispatch, getState) => {
      let bets = MarketDrawerActions.getOpenBetsForBMG(getState(), bettingMarketGroupId);

      if (bets) {
        dispatch(
          MarketDrawerPrivateActions.getOpenBets(
            bets.openUnmatchedBets,
            bets.openMatchedBets,
            bettingMarketGroupId
          )
        );
      }
    };
  }

  static clearOpenBets() {
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.updateOpenBetsLoadingStatus(LoadingStatus.LOADING));
      dispatch(MarketDrawerPrivateActions.getOpenBets(Immutable.List(), Immutable.List(), null));
    };
  }

  static resetOpenBets() {
    return {
      type: ActionTypes.MARKET_DRAWER_RESET_OPEN_BETS
    };
  }

  static updateUnmatchedBet(delta, currencyFormat) {
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.updateOneUnmatchedBet(delta, currencyFormat));
    };
  }

  static deleteUnmatchedBet(bet) {
    return (dispatch) => {
      dispatch(BetActions.cancelBets(Immutable.List([bet])));
    };
  }

  static clickDeleteUnmatchedBets(bets) {
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.showDeleteUnmatchedBetsConfirmation(bets));
    };
  }

  static clickDeleteUnmatchedBet(bet) {
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.showDeleteUnmatchedBetConfirmation(bet));
    };
  }

  static deleteUnmatchedBets(bets) {
    return (dispatch) => {
      dispatch(BetActions.cancelBets(Immutable.List(bets)));
    };
  }

  static clickUpdateBet(totalBetAmount, currencyFormat, skipDustCheck) {
    console.warn('The totalBetAmount is not the final version.');

    return (dispatch, getState) => {
      const isDisconnected =
        getState().getIn(['app', 'connectionStatus']) !== ConnectionStatus.CONNECTED;

      if (isDisconnected) {
        dispatch(MarketDrawerPrivateActions.showDisconnectedError());
      } else {
        const balance = getState().getIn([
          'balance',
          'availableBalancesByAssetId',
          Config.coreAsset,
          'balance'
        ]);
        const precision = getState().getIn(['asset', 'assetsById', Config.coreAsset, 'precision']);
        const normalizedBalance = balance / Math.pow(10, precision);
        const formattedBalance = parseFloat(
          CurrencyUtils.formatFieldByCurrencyAndPrecision(
            'stake',
            normalizedBalance,
            currencyFormat,
            skipDustCheck
          )
        );
        
        if (formattedBalance < totalBetAmount) {
          dispatch(MarketDrawerPrivateActions.showInsufficientBalanceError());
        } else {
          dispatch(MarketDrawerPrivateActions.showOpenBetsConfirmation());
        }
      }
    };
  }

  static clickReset() {
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.resetUnmatchedBets());
    };
  }

  static clickAverageOdds(groupByAverageOdds) {
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.setGroupByAverageOdds(groupByAverageOdds));
    };
  }

  static hideOverlay() {
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.hideOverlay());
    };
  }
}

export default MarketDrawerActions;
