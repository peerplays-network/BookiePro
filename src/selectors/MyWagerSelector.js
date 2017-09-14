import React from 'react';
import { I18n } from 'react-redux-i18n';
import { createSelector } from 'reselect';
import _ from 'lodash';
import { CurrencyUtils, BettingModuleUtils, DateUtils, ObjectUtils } from '../utility';
import { TimeRangePeriodTypes, MyWagerTabTypes, LoadingStatus, BetCategories, BetTypes } from '../constants';
import CommonSelector from './CommonSelector';

const { getStakeFromBetObject, getProfitLiabilityFromBetObject } = ObjectUtils;

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

    const precision = assetsById.getIn(['1.3.0', 'precision']);
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
      const eventTime = event && getFormattedDate(event.get('start_time'));

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
      const precision = assetsById.getIn([bet.get('asset_id'), 'precision']) || 0;
      const formattedStake =  CurrencyUtils.getFormattedCurrency(getStakeFromBetObject(bet)/ Math.pow(10, precision), currencyFormat, BettingModuleUtils.stakePlaces);
      const formattedProfitLiability = CurrencyUtils.getFormattedCurrency(getProfitLiabilityFromBetObject(bet)/ Math.pow(10, precision), currencyFormat, BettingModuleUtils.exposurePlaces);
      bet = bet.set('stake', formattedStake);
      bet = bet.set('profit_liability', formattedProfitLiability);
      if (bet.get('category') === BetCategories.RESOLVED_BET) {
        const formattedAmountWon = CurrencyUtils.getFormattedCurrency(bet.get('amount_won')/ Math.pow(10, precision), currencyFormat, BettingModuleUtils.exposurePlaces);
        bet = bet.set('amount_won', formattedAmountWon);
      }
      return bet;
    })

  }
)

// Bet data currently looks like this
// back_or_lay:"back"
// betting_market_id:"1.105.1"
// cancel:Object
// event_id:"1.103.1"
// event_name:Object
// event_time:"Tomorrow, 14:54"
// id:"1.106.9"
// key:"1.106.9"
// betting_market_description: "NY Giants",
// betting_market_group_description: "Moneyline",
// backer_multiplier:2.25
// profit_liability:"0.50000"
// sport_name:"American Football"
// stake:"0.625"
// type:"LAY | NY Giants  | Moneyline"

// Format bet objects to be shown on table
const getBetData = createSelector(
  [
    getBetsWithFormattedCurrency,
    getCancelBetsByIdsLoadingStatus
  ],
  (
    bets,
    cancelBetsByIdsLoadingStatus
  ) => {
    return bets.map((bet) => {
      bet = bet.set('key', bet.get('id'));
      bet = bet.set('type', bet.get('back_or_lay').toUpperCase() + ' | ' + bet.get('betting_market_description') + ' | ' + bet.get('betting_market_group_description'))

      if (bet.get('category') === BetCategories.RESOLVED_BET) {
        const resolvedTime = getFormattedDate(bet.get('resolved_time'));
        bet = bet.set('resolved_time', resolvedTime)
      } else if (bet.get('category') === BetCategories.UNMATCHED_BET) {
        const linkedEventName = <a target='_self'>{ bet.get('event_name') }</a>;
        bet = bet.set('event_name', linkedEventName);
        const cancelLoadingStatus = cancelBetsByIdsLoadingStatus.get(bet.get('id')) || LoadingStatus.DEFAULT;
        const cancelButton = (cancelLoadingStatus === LoadingStatus.DEFAULT || cancelLoadingStatus === LoadingStatus.ERROR)
                            && (<a className='btn cancel-btn' target='_self'>{ I18n.t('mybets.cancel') }</a>);
        bet = bet.set('cancel', cancelButton);
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
