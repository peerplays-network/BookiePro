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

//function to get rowdata on the basis of activeTab
const rowData = (state) => state.getIn(['bet', activeTab(state) + 'ById'])
  .filter(row => (activeTab(state) !== 'unmatchedBets' || !state.getIn(['bet','cancelBetsByIdsLoadingStatus']).get(row.get('id'))));

//function to get initial collection with required values from rowData
const betData = createSelector(
  [activeTab, rowData],
  (tab, bets)=>{
    let newData = [];
    bets.forEach((bet) => {
      if(tab === 'unmatchedBets'){
        newData.push(new Map({key: bet.get('id'),
          id: bet.get('id'),
          'betting_market_id': bet.get('betting_market_id'),
          'back_or_lay': bet.get('back_or_lay'),
          'amount_to_bet': bet.get('remaining_amount_to_bet'),
          'amount_to_win': bet.get('remaining_amount_to_win'),
          'cancelled': bet.get('cancelled')}));
      }
      else
        newData.push(new Map({key: bet.get('id'),
          id: bet.get('id'),
          'betting_market_id': bet.get('betting_market_id'),
          'back_or_lay': bet.get('back_or_lay'),
          'amount_to_bet': bet.get('amount_to_bet'),
          'amount_to_win': bet.get('amount_to_win')}));
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
  if(activeTab === 'resolvedBets')
    data = data.filter(row => (moment(row.get('event_time')).isBetween(startDate, endDate)));
  else
    data = data.filter(row => (((moment(row.get('event_time')).isAfter(moment().hour(0).minute(0))))));

  //check if this can be improved
  //TODO: use .map() instead of foreach as suggested
  data.forEach((row, index) => {
    let rowObj = {
      'type' : (row.get('back_or_lay') + ' | ' + row.get('payout_condition_string') + ' ' + row.get('options') + ' | ' + row.get('market_type_id')),
      'odds' : (row.get('amount_to_win') / row.get('amount_to_bet')).toFixed(BettingModuleUtils.oddsPlaces),
      'amount_to_bet' : CurrencyUtils.getFormattedCurrency(row.get('amount_to_bet')/ Math.pow(10, precision), targetCurrency, BettingModuleUtils.stakePlaces),
      'amount_to_win' : CurrencyUtils.getFormattedCurrency(row.get('amount_to_win')/ Math.pow(10, precision), targetCurrency, BettingModuleUtils.exposurePlaces),
      'event_time': getFormattedDate(row.get('event_time'))
    };
    //randomly changed win value to negative for liability display
    //applied class based on profit or loss
    if(activeTab === 'resolvedBets'){
      rowObj.amount_to_win *= Math.floor(Math.random()*2) === 1 ? 1 : -1;
      rowObj.amount_to_win = <span className={ rowObj.amount_to_win > 0 ? 'profit' : 'loss' }>
        {(rowObj.amount_to_win > 0 ? '+' : '')}{ rowObj.amount_to_win }</span>;
    }
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
  [getBetData],
  (bets)=>{
    let total = 0;
    bets.forEach((row, index) => {
      total += parseFloat(row.get('amount_to_bet') + row.get('amount_to_win'));
    });
    return total;
  }
);

const MyWagerSelector = {
  getCurrencyFormat,
  getBetData,
  getBetTotal
};

export default MyWagerSelector;
