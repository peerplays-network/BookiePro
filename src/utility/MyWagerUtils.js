/**
 * The MyWagerUtils contains all the functions shared within My Wager component.
 */
import React from 'react';
import { I18n, Translate } from 'react-redux-i18n';
import CurrencyUtils from './CurrencyUtils';


/**
 *  get list of unmatched bets to be served as data in unmatched bets columns
 *
 * @param {string} currency - display currency, 'BTC' or 'mBTC'
 * @param {callback} onCancelBetClick - callback funciton upon clicking on cancel bet button
 * @param {callback} onEventClick - callback funciton upon clicking on event cell
 * @returns {list} - list of objects with 'title', 'dataIndex', 'key' and 'onCellClick'(optional)
 */
const getUnmatchedBetsColumns = (currencyFormat, onCancelBetClick, onEventClick) => {
  const currencySymbol = '(' + CurrencyUtils.getCurruencySymbol(currencyFormat) + ')';
  const profitLiabilityTitle  = <Translate value='mybets.profit_liability' currency={ currencySymbol } dangerousHTML/> ;
  return [
    {
      title: I18n.t('mybets.event_time') ,
      dataIndex: 'event_time',
      key: 'event_time',
    },
    {
      title: I18n.t('mybets.event'),
      dataIndex: 'event_name',
      key: 'event_name',
      onCellClick: (record, event) => { onEventClick(record, event); }
    },
    {
      title: I18n.t('mybets.type'),
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: I18n.t('mybets.sport'),
      dataIndex: 'sport_name',
      key: 'sport_name',
    },
    {
      title: I18n.t('mybets.odds'),
      dataIndex: 'backer_multiplier',
      key: 'backer_multiplier',
    },
    {
      title: I18n.t('mybets.stake') + currencySymbol,
      dataIndex: 'stake',
      key: 'stake',
    },
    {
      title: profitLiabilityTitle,
      dataIndex: 'profit_liability',
      key: 'profit_liability'
    },
    {
      title: '',
      dataIndex: 'cancel',
      key: 'cancel',
      onCellClick: (record, event) => { onCancelBetClick(record, event); }
    }
  ];
}

/**
 *  get list of matched bets to be served as data in matched bets columns
 *
 * @param {string} currency - display currency, 'BTC' or 'mBTC'
 * @returns {list} - list of objects with 'title', 'dataIndex', 'key' and 'onCellClick'(optional)
 */
const getMatchedBetsColumns = (currencyFormat) => {
  const currencySymbol = '(' + CurrencyUtils.getCurruencySymbol(currencyFormat) + ')';
  const profitLiabilityTitle  = <Translate value='mybets.profit_liability' currency={ currencySymbol } dangerousHTML/> ;
  return [
    {
      title: I18n.t('mybets.event_time') ,
      dataIndex: 'event_time',
      key: 'event_time',
    },
    {
      title: I18n.t('mybets.event'),
      dataIndex: 'event_name',
      key: 'event_name',
    },
    {
      title: I18n.t('mybets.type'),
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: I18n.t('mybets.sport'),
      dataIndex: 'sport_name',
      key: 'sport_name',
    },
    {
      title: I18n.t('mybets.odds'),
      dataIndex: 'backer_multiplier',
      key: 'backer_multiplier',
    },
    {
      title: I18n.t('mybets.stake') + currencySymbol,
      dataIndex: 'stake',
      key: 'stake',
    },
    {
      title: profitLiabilityTitle,
      dataIndex: 'profit_liability',
      key: 'profit_liability'
    },
  ];
}

/**
 *  get list of resolved bets to be served as data in resolved bets columns
 *
 * @param {string} currency - display currency, 'BTC' or 'mBTC'
 * @returns {list} - list of objects with 'title', 'dataIndex', 'key' and 'onCellClick'(optional)
 */
const getResolvedBetsColumns = (currencyFormat) => {
  const currencySymbol = '(' + CurrencyUtils.getCurruencySymbol(currencyFormat) + ')';
  return [
    {
      title:  I18n.t('resolved_time'),
      dataIndex: 'resolved_time' ,
      key: 'resolved_time',
    },
    {
      title: I18n.t('mybets.event'),
      dataIndex: 'event_name',
      key: 'event_name',
    },
    {
      title: I18n.t('mybets.type'),
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: I18n.t('mybets.sport'),
      dataIndex: 'sport_name',
      key: 'sport_name',
    },
    {
      title: I18n.t('mybets.odds'),
      dataIndex: 'backer_multiplier',
      key: 'backer_multiplier',
    },
    {
      title: I18n.t('mybets.stake') + currencySymbol,
      dataIndex: 'stake',
      key: 'stake',
    },
    {
      title: I18n.t('mybets.profit') + currencySymbol,
      dataIndex: 'amount_won',
      key: 'amount_won'
    }
  ];

}

const MyWagerUtils = {
  getUnmatchedBetsColumns,
  getMatchedBetsColumns,
  getResolvedBetsColumns
}

export default MyWagerUtils;
