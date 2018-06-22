/**
 * This selector is used to fetch bets data on the basis of activeTab and store minimal possible state in redux.
 * This data is not recomputed unless one of its arguments changes
 * This selectors are composable. They can be used as input to other selectors
 */
import React from 'react';
import { I18n } from 'react-redux-i18n';
import { createSelector } from 'reselect';
import _ from 'lodash';
import { CurrencyUtils, BettingModuleUtils, DateUtils, ObjectUtils } from '../utility';
import { TimeRangePeriodTypes, MyWagerTabTypes, LoadingStatus, BetCategories, BetTypes, Config } from '../constants';
import CommonSelector from './CommonSelector';
import MyAccountPageSelector from './MyAccountPageSelector';
import Loading from '../components/Loading'

const { getStakeFromBetObject, getProfitLiabilityFromBetObject } = ObjectUtils;
const { getBettingMarketsById } = CommonSelector

const {
  getAggregatedBettingMarketGroupsById,
  getAggregatedBettingMarketsById,
  getAggregatedEventsById,
  getSportsById,
  getAssetsById,
  getEventGroupsById,
  getCurrencyFormat
} = CommonSelector;

const getFormattedDate = DateUtils.getFormattedDate;

const getActiveTab = (state) => state.getIn(['mywager','activeTab']);


const getResolvedBetsPeriodType = (state) => state.getIn(['mywager', 'periodType']);
const getResolvedBetsCustomTimeRangeStartDate = (state) => state.getIn(['mywager', 'customTimeRangeStartDate']);
const getResolvedBetsCustomTimeRangeEndDate = (state) => state.getIn(['mywager', 'customTimeRangeEndDate']);

const startDate = createSelector(
  [
    getResolvedBetsPeriodType,
    getResolvedBetsCustomTimeRangeStartDate
  ],
   (periodType, customTimeRangeStartDate) => {
     if (periodType === TimeRangePeriodTypes.CUSTOM) {
       return customTimeRangeStartDate;
     } else {
       const timeRange = DateUtils.getTimeRangeGivenTimeRangePeriodType(periodType);
       return timeRange.startDate;
     }
   }
 )

const endDate = createSelector(
  [
    getResolvedBetsPeriodType,
    getResolvedBetsCustomTimeRangeEndDate
  ],
   (periodType, customTimeRangeEndDate) => {
     if (periodType === TimeRangePeriodTypes.CUSTOM) {
       return customTimeRangeEndDate;
     } else {
       const timeRange = DateUtils.getTimeRangeGivenTimeRangePeriodType(periodType);
       return timeRange.endDate;
     }
   }
 )

const getMatchedBetsById = (state) => state.getIn(['bet', 'matchedBetsById']);
const getUnmatchedBetsById = (state) => state.getIn(['bet', 'unmatchedBetsById']);
const getResolvedBetsById = (state) => state.getIn(['bet', 'resolvedBetsById']);

const getFilteredResolvedBetsById = createSelector(
  [
    getResolvedBetsById,
    startDate,
    endDate
  ],
  (resolvedBetsById, startDate, endDate) => {
    return resolvedBetsById.filter(bet => {
      const resolvedTime = bet.get('resolved_time');
      return resolvedTime.valueOf() <= endDate.valueOf() && resolvedTime.valueOf() >= startDate.valueOf()
    });
  }
)
/** This function extracts bet transactions on the basis of activeTab */
const getRelatedBetsCollection = createSelector(
  [
    getActiveTab,
    getMatchedBetsById,
    getUnmatchedBetsById,
    getFilteredResolvedBetsById
  ],
  (activeTab, matchedBetsById, unmatchedBetsById, filteredResolvedBetsById) => {
    switch (activeTab) {
      case MyWagerTabTypes.MATCHED_BETS:
        return matchedBetsById.toList();
      case MyWagerTabTypes.RESOLVED_BETS:
        return filteredResolvedBetsById.toList();
      default:
        return unmatchedBetsById.toList();
    }
  }
);

// memoized selector - function totaling stake and liability
// The following functionality only applies if all bets are under the same currency format
// TODO: modify the logic and the UI if we support multiple currency
const getBetTotal = createSelector(
  [getActiveTab, getRelatedBetsCollection, getCurrencyFormat, getAssetsById],
  (activeTab, bets, currencyFormat, assetsById) => {
    let total = 0;
    if (activeTab === MyWagerTabTypes.RESOLVED_BETS) {
      total = bets.reduce( (reduction, bet) => {
        return reduction + bet.get('amount_won')
      }, 0);
    } else {
      total = bets.reduce( (reduction, bet) => {
        const backOrLay = bet.get('back_or_lay');
        let amount = 0;
        if (backOrLay === BetTypes.BACK) {
          amount = getStakeFromBetObject(bet);
        } else if (backOrLay === BetTypes.LAY) {
          amount = getProfitLiabilityFromBetObject(bet);
        }
        return reduction + amount;
      }, 0);
    }

    const precision = assetsById.getIn([Config.coreAsset, 'precision']);
    const formattedTotal = CurrencyUtils.getFormattedCurrency(total/ Math.pow(10, precision), currencyFormat, BettingModuleUtils.stakePlaces);
    return formattedTotal;
  }
);

const getCancelBetsByIdsLoadingStatus = (state) => state.getIn(['bet','cancelBetsByIdsLoadingStatus']);

// Extend bet objects with necessary fields
const getExtendedBets = createSelector(
  [
    getRelatedBetsCollection,
    getAggregatedBettingMarketsById,
    getAggregatedBettingMarketGroupsById,
    getAggregatedEventsById,
    getEventGroupsById,
    getSportsById
  ],
  (bets, bettingMarketsById, bettingMarketGroupsById, eventsById, eventGroupsById, sportsById) => {
    return bets.map((bet) => {
      const bettingMarket = bettingMarketsById.get(bet.get('betting_market_id'));
      const bettingMarketDescription = (bettingMarket && bettingMarket.get('description')) || '';

      const bettingMarketGroupId = bettingMarket && bettingMarket.get('group_id');
      const bettingMarketGroup = bettingMarketGroupsById.get(bettingMarketGroupId);
      const bettingMarketGroupDescription = (bettingMarketGroup && bettingMarketGroup.get('description')) || '';

      const eventId = bettingMarketGroup && bettingMarketGroup.get('event_id');
      const event = eventsById.get(eventId);
      const eventName = (event && event.get('name')) || '';
      const eventTime = event && getFormattedDate(DateUtils.getLocalDate(event.get('start_time')));

      const eventGroupId = event && event.get('event_group_id');
      const eventGroup = eventGroupsById.get(eventGroupId);

      const sportId = eventGroup && eventGroup.get('sport_id');
      const sport = sportsById.get(sportId);
      const sportName = sport && sport.get('name');

      return bet.set('betting_market_description', bettingMarketDescription)
                .set('betting_market_group_description', bettingMarketGroupDescription)
                .set('event_name', eventName)
                .set('event_time', eventTime)
                .set('sport_name', sportName)
    })
  }
)

// Sort bet objects according to natural order
const getSortedBets = createSelector(
  [
    getActiveTab,
    getExtendedBets
  ],
  (activeTab, extendedBets) => {
    if (activeTab === MyWagerTabTypes.RESOLVED_BETS) {
      return extendedBets.sortBy(bet => bet.get('resolved_time')).reverse();
    } else {
      return extendedBets.sortBy(bet => bet.get('event_time')).reverse();
    }
  }

)

// Format the currency in a bet's field (stake, profit/ liability, and amount won)
const getBetsWithFormattedCurrency = createSelector(
  [
    getSortedBets,
    getCurrencyFormat,
    getAssetsById
  ],
  (bets, currencyFormat, assetsById) => {
    return bets.map(bet => {

      const betType = bet.get('back_or_lay')

      const precision = assetsById.getIn([bet.get('asset_id'), 'precision']) || 0;

      let formattedStake, formattedProfitLiability, formattedAmountWon

      formattedProfitLiability = CurrencyUtils.getFormattedCurrency(getProfitLiabilityFromBetObject(bet)/ Math.pow(10, precision),
                                                  currencyFormat,
                                                  BettingModuleUtils.exposurePlaces,
                                                  betType);
                                                  
      formattedStake = CurrencyUtils.getFormattedCurrency(getStakeFromBetObject(bet) / Math.pow(10, precision),
                                      currencyFormat,
                                      BettingModuleUtils.stakePlaces,
                                      betType);
      //debugger;
      // Check for zero's
      // bet = bet.set('stake', CurrencyUtils.isZero(formattedStake));
      // bet = bet.set('profit_liability', CurrencyUtils.isZero(formattedProfitLiability));
      bet = bet.set('stake', formattedStake);
      bet = bet.set('profit_liability', formattedProfitLiability);

      if (bet.get('category') === BetCategories.RESOLVED_BET) {
        formattedAmountWon = CurrencyUtils.getFormattedCurrency(
          bet.get('amount_won') / Math.pow(10, precision),
          currencyFormat,
          BettingModuleUtils.exposurePlaces,
          betType
        );
        
        //bet = bet.set('amount_won', CurrencyUtils.isZero(formattedAmountWon));
        bet = bet.set('amount_won', formattedAmountWon);        
      }
      return bet;
    })

  }
)

//memoized selector - function for formatting merged data and return same
const getBetData = createSelector(
  [
    getBetsWithFormattedCurrency,
    getCancelBetsByIdsLoadingStatus,
    getBettingMarketsById,
    getCurrencyFormat
  ],
  (
    bets,
    cancelBetsByIdsLoadingStatus,
    bettingMarkets,
    currencyFormat
  ) => {
    // const oddsFormat = MyAccountPageSelector.oddsFormatSelector(state);
          
    return bets.map((bet) => {
      //debugger;
      bet = bet.set('key', bet.get('id'));

      bet = bet.set('type', bet.get('back_or_lay').toUpperCase() + ' | ' + bet.get('betting_market_description') + ' | ' + bet.get('betting_market_group_description'))

      let profit = bet.get('profit_liability');
      let stake = bet.get('stake');
      profit = CurrencyUtils.isDust(currencyFormat, profit);
      bet = bet.set('profit_liability', profit);
      stake = CurrencyUtils.isDust(currencyFormat, stake);
      bet =  bet.set('stake', stake);

      if (bet.get('category') === BetCategories.RESOLVED_BET) {
        const resolvedTime = getFormattedDate(bet.get('resolved_time'));
        bet = bet.set('resolved_time', resolvedTime)
      } else if (bet.get('category') === BetCategories.UNMATCHED_BET) {

        let bettingMarketId = bettingMarkets.getIn([bet.get('betting_market_id')])

        if (bettingMarketId)
          bet = bet.set('group_id', bettingMarkets.getIn([bet.get('betting_market_id')]).get('group_id'))

        const linkedEventName = <a target='_self'>{ bet.get('event_name') }</a>;
        bet = bet.set('event_name', linkedEventName);
        const cancelLoadingStatus = cancelBetsByIdsLoadingStatus.get(bet.get('id')) || LoadingStatus.DEFAULT;
        const cancelButton = (cancelLoadingStatus === LoadingStatus.DEFAULT || cancelLoadingStatus === LoadingStatus.ERROR)
                            ? <a className='btn btn-cancel' target='_self'>{ I18n.t('mybets.cancel') }</a> : <Loading/>;
        bet = bet.set('cancel', cancelButton);
      } else if (bet.get('category') === BetCategories.MATCHED_BET) {
        let bettingMarketId = bettingMarkets.getIn([bet.get('betting_market_id')])

        if (bettingMarketId){
          bet = bet.set('group_id', bettingMarkets.getIn([bet.get('betting_market_id')]).get('group_id'))
        }
        const linkedEventName = <a target='_self'>{ bet.get('event_name') }</a>;
        bet = bet.set('event_name', linkedEventName);
      }
      return bet;
    });
  }
);

const getBetsLoadingStatus = (state) => state.getIn(['bet', 'initMyBetsLoadingStatus']);

const MyWagerSelector = {
  getBetsLoadingStatus,
  getCurrencyFormat,
  getBetData,
  getBetTotal
};

export default MyWagerSelector;
