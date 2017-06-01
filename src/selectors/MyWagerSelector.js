import React from 'react';
import { I18n } from 'react-redux-i18n';
import { createSelector } from 'reselect';
import _ from 'lodash';
import { Map } from 'immutable';
import { mergeRelationData, mergeBettingMarketGroup } from '../utility/MergeObjectUtils';
import moment from 'moment';
import { CurrencyUtils, BettingModuleUtils } from '../utility';
import DateUtils from '../utility/DateUtils';

const getFormattedDate = DateUtils.getFormattedDate;

const account = (state) => state.get('account');

const accountId = (state) => account(state).getIn(['account','id']);

const setting = (state) => state.getIn(['setting', 'settingByAccountId', accountId(state)])
  || state.getIn(['setting', 'defaultSetting']);

const getCurrencyFormat = (state) => setting(state).get('currencyFormat');

const precision = (state) => state.getIn(['asset', 'assetsById', '1.3.0']).get('precision');

const activeTab = (state) => state.getIn(['mywager','activeTab']);

const bettingMarketData = (state) => state.getIn(['bettingMarket','bettingMarketsById']);

const bettingMarketGroupsData = (state) => state.getIn(['bettingMarketGroup','bettingMarketGroupsById']);

const eventsData = (state) => state.getIn(['event','eventsById']);

const sportsData = (state) => state.getIn(['sport','sportsById']);

const startDate = (state) => state.getIn(['mywager','startDate']);

const endDate = (state) => state.getIn(['mywager','endDate']);

const getStoreFieldName = (state) => {
  switch (activeTab(state)) {
    case 'matchedBets':
      return 'newMatchedBetsById';
    case 'resolvedBets':
      return 'newResolvedBetsById';
    default:
      return 'newUnmatchedBetsById';
  }
}

export const getStake = function(activeTab, bet){
  let betAmount = (activeTab === 'unmatchedBets' ? bet.get('unmatched_bet_amount') : bet.get('matched_bet_amount'));
  switch (bet.get('back_or_lay').toUpperCase()) {
    case 'BACK':
      return betAmount;
    default:
      return betAmount * (bet.get('backer_multiplier') - 1);
  }
};

const getProfitLiability = function(activeTab, bet){
  let betAmount = (activeTab === 'unmatchedBets' ? bet.get('unmatched_bet_amount') : bet.get('matched_bet_amount'));
  switch (bet.get('back_or_lay').toUpperCase()) {
    case 'BACK':
      return betAmount / (bet.get('backer_multiplier') - 1);
    default:
      return betAmount;
  }
};

//function to get rowdata on the basis of activeTab
const rowData = (state) => state.getIn(['bet', getStoreFieldName(state)])
  .filter(row => (activeTab(state) !== 'unmatchedBets' || !state.getIn(['bet','cancelBetsByIdsLoadingStatus']).get(row.get('id'))));

//function to get initial collection with required values from rowData
const betData = createSelector(
  [activeTab, rowData, startDate, endDate, getCurrencyFormat, precision],
  (tab, bets, startDate, endDate, currencyFormat, precision)=>{
    let newData = [];
    bets.forEach((bet) => {
      if(tab !== 'resolvedBets')
        newData.push(new Map({key: bet.get('id'),
          id: bet.get('id'),
          'betting_market_id': bet.get('betting_market_id'),
          'back_or_lay': bet.get('back_or_lay').toUpperCase(),
          'stake': CurrencyUtils.getFormattedCurrency(getStake(tab, bet)/ Math.pow(10, precision), currencyFormat, BettingModuleUtils.stakePlaces),
          'odds': bet.get('backer_multiplier'),
          'profit_liability': CurrencyUtils.getFormattedCurrency(getProfitLiability(tab, bet)/ Math.pow(10, precision), currencyFormat, BettingModuleUtils.exposurePlaces)}));
      else if (tab === 'resolvedBets' && moment(bet.get('resolved_time')).isBetween(startDate, endDate))
        newData.push(new Map({key: bet.get('id'),
          id: bet.get('id'),
          'betting_market_id': bet.get('betting_market_id'),
          'back_or_lay': bet.get('back_or_lay').toUpperCase(),
          'stake': CurrencyUtils.getFormattedCurrency(getStake(tab, bet)/ Math.pow(10, precision), currencyFormat, BettingModuleUtils.stakePlaces),
          'odds': bet.get('backer_multiplier'),
          'resolved_time': getFormattedDate(bet.get('resolved_time')),
          'profit_liability': CurrencyUtils.getFormattedCurrency(bet.get('amount_won')/ Math.pow(10, precision), currencyFormat, BettingModuleUtils.exposurePlaces)}));
    });
    return newData;
  }
);

//memoized selector - function for merging bettingMarketData to betData and return merged data
const mergeBettingMarketData = createSelector(
  [betData, bettingMarketData],
  (bets, betMarket)=>{
    return mergeRelationData(bets, betMarket, 'betting_market_id',
      {betting_market_group_id: 'betting_market_group_id' , payout_condition_string: 'payout_condition_string'});
  }
);

//memoized selector - function for merging bettingMarketGroupsData to betData and return merged data
const mergeBettingMarketGroupData = createSelector(
  [mergeBettingMarketData, bettingMarketGroupsData],
  (bets, betMarketGroup)=>{
    return mergeBettingMarketGroup(bets, betMarketGroup, 'betting_market_group_id');
  }
);

//memoized selector - function for merging events to betData and return merged data
const mergeEventsData = createSelector(
  [mergeBettingMarketGroupData, eventsData],
  (bets, events)=>{
    return mergeRelationData(bets, events, 'event_id',
      {'name': 'event_name' , 'start_time': 'event_time', 'sport_id': 'sport_id'});
  }
);

//memoized selector - function for merging sports to betData and return merged data
const mergeSportsData = createSelector(
  [mergeEventsData, sportsData],
  (bets, sports)=>{
    return mergeRelationData(bets, sports, 'sport_id',
      {'name': 'sport_name'});
  }
);

//formatting data after getting all reuired data merged
const formatBettingData = (data, activeTab, precision, targetCurrency, startDate, endDate) => {
  //showing past data as resolvedBets and future data as matchedBets unmatchedBets
  if(activeTab !== 'resolvedBets')
    data = data.filter(row => (((moment(row.get('event_time')).isAfter(moment().hour(0).minute(0))))));

  //check if this can be improved
  //TODO: use .map() instead of foreach as suggested
  data.forEach((row, index) => {
    let rowObj = {
      'type' : (row.get('back_or_lay').toUpperCase() + ' | ' + row.get('payout_condition_string') + ' ' + row.get('options') + ' | ' + row.get('market_type_id')),
    };
    //randomly changed win value to negative for liability display
    //applied class based on profit or loss
    if(activeTab !== 'resolvedBets')
      rowObj.event_time = getFormattedDate(row.get('event_time'));

    if(activeTab === 'unmatchedBets')
      rowObj.cancel = (row.get('cancelled') ? '' : <a className='btn cancel-btn' target='_self'>{ I18n.t('mybets.cancel') }</a>);
    data[index] = row.merge(rowObj);
  });
  return data;
}

//memoized selector - function for formatting merged data and return same
const getBetData = createSelector(
  [mergeSportsData, activeTab, getCurrencyFormat, precision, startDate, endDate],
  (bets, activeTab, currencyFormat, precision, startDate, endDate) => {
    return formatBettingData(bets, activeTab,
    precision, currencyFormat, startDate, endDate);
  }
);

//memoized selector - function totaling stake and liability
const getBetTotal = createSelector(
  [getBetData, getCurrencyFormat, precision],
  (bets, currencyFormat, precision)=>{
    let total = 0;
    bets.forEach((row, index) => {
      total += parseFloat(row.get('stake') + row.get('profit_liability'));
    });
    return CurrencyUtils.getFormattedCurrency(total, currencyFormat, precision);
  }
);

const MyWagerSelector = {
  getCurrencyFormat,
  getBetData,
  getBetTotal
};

export default MyWagerSelector;
