import React from 'react';
import { I18n } from 'react-redux-i18n';
import { createSelector } from 'reselect';
import _ from 'lodash';
import { Map } from 'immutable';
import moment from 'moment';
import { CurrencyUtils, BettingModuleUtils, DateUtils, MergeObjectUtils, ObjectUtils } from '../utility';
import { TimeRangePeriodTypes, MyWagerTabTypes } from '../constants';
import CommonSelector from './CommonSelector';
import Immutable from 'immutable';

const { mergeRelationData, mergeBettingMarketGroup } = MergeObjectUtils;
const { getStakeFromBetObject, getProfitLiabilityFromBetObject } = ObjectUtils;

const {
  getBettingMarketGroupsById,
  getBettingMarketsById,
  getEventsById,
  getSportsById,
  getAssetsById,
  getCurrencyFormat
} = CommonSelector;

const getFormattedDate = DateUtils.getFormattedDate;

const getPrecision = createSelector(
  getAssetsById,
  (assetsById) => {
    return assetsById.getIn(['1.3.0', 'precision']);
  }
)

const activeTab = (state) => state.getIn(['mywager','activeTab']);


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

const getStoreFieldName = (state) => {
  switch (activeTab(state)) {
    case MyWagerTabTypes.MATCHED_BETS:
      return 'matchedBetsById';
    case MyWagerTabTypes.RESOLVED_BETS:
      return 'resolvedBetsById';
    default:
      return 'unmatchedBetsById';
  }
}

//function to get rowdata on the basis of activeTab
const rowData = (state) => state.getIn(['bet', getStoreFieldName(state)])
  .filter(row => (activeTab(state) !== MyWagerTabTypes.UNMATCHED_BETS || !state.getIn(['bet','cancelBetsByIdsLoadingStatus']).get(row.get('id'))));

//function to get initial collection with required values from rowData
const betData = createSelector(
  [activeTab, rowData, startDate, endDate, getCurrencyFormat, getPrecision],
  (tab, bets, startDate, endDate, currencyFormat, precision)=>{
    let newData = [];
    bets.forEach((bet) => {
      if(tab !== MyWagerTabTypes.RESOLVED_BETS)
        newData.push(new Map({key: bet.get('id'),
          id: bet.get('id'),
          'betting_market_id': bet.get('betting_market_id'),
          'back_or_lay': bet.get('back_or_lay').toUpperCase(),
          'stake': CurrencyUtils.getFormattedCurrency(getStakeFromBetObject(bet)/ Math.pow(10, precision), currencyFormat, BettingModuleUtils.stakePlaces),
          'odds': bet.get('backer_multiplier'),
          'profit_liability': CurrencyUtils.getFormattedCurrency(getProfitLiabilityFromBetObject(bet)/ Math.pow(10, precision), currencyFormat, BettingModuleUtils.exposurePlaces)}));
      else if (tab === MyWagerTabTypes.RESOLVED_BETS && moment(bet.get('resolved_time')).isBetween(startDate, endDate))
        newData.push(new Map({key: bet.get('id'),
          id: bet.get('id'),
          'betting_market_id': bet.get('betting_market_id'),
          'back_or_lay': bet.get('back_or_lay').toUpperCase(),
          'stake': CurrencyUtils.getFormattedCurrency(getStakeFromBetObject(bet)/ Math.pow(10, precision), currencyFormat, BettingModuleUtils.stakePlaces),
          'odds': bet.get('backer_multiplier'),
          'resolved_time': getFormattedDate(bet.get('resolved_time')),
          'profit_liability': CurrencyUtils.getFormattedCurrency(bet.get('amount_won')/ Math.pow(10, precision), currencyFormat, BettingModuleUtils.exposurePlaces)}));
    });
    return newData;
  }
);

//memoized selector - function for merging bettingMarketData to betData and return merged data
const mergeBettingMarketData = createSelector(
  [betData, getBettingMarketsById],
  (bets, betMarket)=>{
    return mergeRelationData(bets, betMarket, 'betting_market_id',
      {betting_market_group_id: 'betting_market_group_id' , payout_condition_string: 'payout_condition_string'});
  }
);

//memoized selector - function for merging bettingMarketGroupsData to betData and return merged data
const mergeBettingMarketGroupData = createSelector(
  [mergeBettingMarketData, getBettingMarketGroupsById],
  (bets, betMarketGroup)=>{
    return mergeBettingMarketGroup(bets, betMarketGroup, 'betting_market_group_id');
  }
);

//memoized selector - function for merging events to betData and return merged data
const mergeEventsData = createSelector(
  [mergeBettingMarketGroupData, getEventsById],
  (bets, events)=>{
    return mergeRelationData(bets, events, 'event_id',
      {'name': 'event_name' , 'start_time': 'event_time', 'sport_id': 'sport_id'});
  }
);

//memoized selector - function for merging sports to betData and return merged data
const mergeSportsData = createSelector(
  [mergeEventsData, getSportsById],
  (bets, sports)=>{
    return mergeRelationData(bets, sports, 'sport_id',
      {'name': 'sport_name'});
  }
);

//formatting data after getting all reuired data merged
const formatBettingData = (data, activeTab, precision, targetCurrency, startDate, endDate) => {
  //showing past data as resolvedBets and future data as matchedBets unmatchedBets
  if(activeTab !== MyWagerTabTypes.RESOLVED_BETS)
    data = data.filter(row => (((moment(row.get('event_time')).isAfter(moment().hour(0).minute(0))))));

  //check if this can be improved
  //TODO: use .map() instead of foreach as suggested
  data.forEach((row, index) => {
    let rowObj = {
      'type' : (row.get('back_or_lay').toUpperCase() + ' | ' + row.get('payout_condition_string') + ' ' + row.get('options') + ' | ' + row.get('market_type_id')),
    };
    //randomly changed win value to negative for liability display
    //applied class based on profit or loss
    if(activeTab !== MyWagerTabTypes.RESOLVED_BETS)
      rowObj.event_time = getFormattedDate(row.get('event_time'));

    if(activeTab === MyWagerTabTypes.UNMATCHED_BETS){
      rowObj.event_name = <a target='_self'>{ row.get('event_name') }</a>;
      rowObj.cancel = (row.get('cancelled') ? '' : <a className='btn cancel-btn' target='_self'>{ I18n.t('mybets.cancel') }</a>);
    }
    data[index] = row.merge(rowObj);
  });
  return Immutable.fromJS(data);
}

//memoized selector - function for formatting merged data and return same
const getBetData = createSelector(
  [mergeSportsData, activeTab, getCurrencyFormat, getPrecision, startDate, endDate],
  (bets, activeTab, currencyFormat, precision, startDate, endDate) => {
    return formatBettingData(bets, activeTab,
    precision, currencyFormat, startDate, endDate);
  }
);

//memoized selector - function totaling stake and liability
const getBetTotal = createSelector(
  [getBetData, getCurrencyFormat, getPrecision],
  (bets, currencyFormat, precision)=>{
    let total = 0;
    bets.forEach((row, index) => {
      total += parseFloat(row.get('stake') + row.get('profit_liability'));
    });
    return CurrencyUtils.getFormattedCurrency(total, currencyFormat, precision);
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
