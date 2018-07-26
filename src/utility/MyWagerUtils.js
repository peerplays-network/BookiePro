/**
 * The MyWagerUtils contains all the functions shared within My Wager component.
 */
import React from 'react';
import {I18n} from 'react-redux-i18n';
import CurrencyUtils from './CurrencyUtils';

const renderTitle = (text, currencySymbol) => (
  <div>
    <p>
      {text} ({currencySymbol})
    </p>
  </div>
);

/**
 *  get list of unmatched bets to be served as data in unmatched bets columns
 *
 * @param {string} currency - display currency, 'BTC' or 'mBTC'
 * @param {callback} onCancelBetClick - callback funciton upon clicking on cancel bet button
 * @param {callback} onEventClick - callback funciton upon clicking on event cell
 * @returns {list} - list of objects with 'title', 'dataIndex', 'key' and 'onCellClick'(optional)
 */
const getUnmatchedBetsColumns = (currencyFormat, onCancelBetClick, onEventClick) => {
  const currencySymbol = CurrencyUtils.getCurrencySymbol(currencyFormat, 'white');
  return [
    {
      title: I18n.t('mybets.event_time'),
      dataIndex: 'event_time',
      key: 'event_time'
    },
    {
      title: I18n.t('mybets.event'),
      dataIndex: 'event_name',
      key: 'event_name',
      onCellClick: (record, event) => {
        onEventClick(record, event);
      }
    },
    {
      title: I18n.t('mybets.type'),
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: I18n.t('mybets.sport'),
      dataIndex: 'sport_name',
      key: 'sport_name'
    },
    {
      title: I18n.t('mybets.odds'),
      dataIndex: 'backer_multiplier',
      key: 'backer_multiplier'
    },
    {
      title: renderTitle(I18n.t('mybets.stake'), currencySymbol),
      dataIndex: 'stake',
      key: 'stake',
      className: 'value_text_label'
    },
    {
      title: renderTitle(I18n.t('mybets.profit_liability'), currencySymbol),
      dataIndex: 'profit_liability',
      key: 'profit_liability',
      className: 'value_text_label'
    },
    {
      title: '',
      dataIndex: 'cancel',
      key: 'cancel',
      onCellClick: (record, event) => {
        onCancelBetClick(record, event);
      }
    }
  ];
};

/**
 *  get list of matched bets to be served as data in matched bets columns
 *
 * @param {string} currency - display currency, 'BTC' or 'mBTC'
 * @returns {list} - list of objects with 'title', 'dataIndex', 'key' and 'onCellClick'(optional)
 */
const getMatchedBetsColumns = (currencyFormat, onEventClick) => {
  const currencySymbol = CurrencyUtils.getCurrencySymbol(currencyFormat, 'white');
  return [
    {
      title: I18n.t('mybets.event_time'),
      dataIndex: 'event_time',
      key: 'event_time'
    },
    {
      title: I18n.t('mybets.event'),
      dataIndex: 'event_name',
      key: 'event_name',
      onCellClick: (record, event) => {
        onEventClick(record, event);
      }
    },
    {
      title: I18n.t('mybets.type'),
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: I18n.t('mybets.sport'),
      dataIndex: 'sport_name',
      key: 'sport_name'
    },
    {
      title: I18n.t('mybets.odds'),
      dataIndex: 'backer_multiplier',
      key: 'backer_multiplier'
    },
    {
      title: renderTitle(I18n.t('mybets.stake'), currencySymbol),
      dataIndex: 'stake',
      key: 'stake',
      className: 'value_text_label'
    },
    {
      title: renderTitle(I18n.t('mybets.profit_liability'), currencySymbol),
      dataIndex: 'profit_liability',
      key: 'profit_liability',
      className: 'value_text_label'
    }
  ];
};

/**
 *  get list of resolved bets to be served as data in resolved bets columns
 *
 * @param {string} currency - display currency, 'BTC' or 'mBTC'
 * @returns {list} - list of objects with 'title', 'dataIndex', 'key' and 'onCellClick'(optional)
 */
const getResolvedBetsColumns = (currencyFormat, forExport = false) => {
  var currencySymbol = CurrencyUtils.getCurrencySymbol(currencyFormat, 'white');

  if (forExport) {
    currencySymbol = currencyFormat;
  }

  return [
    {
      title: I18n.t('mybets.resolved_time'),
      dataIndex: 'resolved_time',
      key: 'resolved_time'
    },
    {
      title: I18n.t('mybets.event'),
      dataIndex: 'event_name',
      key: 'event_name'
    },
    {
      title: I18n.t('mybets.type'),
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: I18n.t('mybets.sport'),
      dataIndex: 'sport_name',
      key: 'sport_name'
    },
    {
      title: I18n.t('mybets.odds'),
      dataIndex: 'backer_multiplier',
      key: 'backer_multiplier'
    },
    {
      title: forExport
        ? I18n.t('mybets.bet_amount') + ' (' + currencySymbol + ')'
        : renderTitle(I18n.t('mybets.bet_amount'), currencySymbol),
      dataIndex: 'stake',
      key: 'stake',
      className: 'value_text_label'
    },
    {
      title: forExport
        ? I18n.t('mybets.winnings') + ' (' + currencySymbol + ')'
        : renderTitle(I18n.t('mybets.winnings'), currencySymbol),
      dataIndex: 'profit_liability',
      key: 'profit_liability',
      className: 'value_text_label'
    }
    // {
    //   title: renderTitle(I18n.t('mybets.balance'), currencySymbol),
    //   dataIndex: 'amount_won',
    //   key: 'amount_won',
    //   className: 'value_text_label',
    // }
  ];
};

const MyWagerUtils = {
  getUnmatchedBetsColumns,
  getMatchedBetsColumns,
  getResolvedBetsColumns
};

export default MyWagerUtils;
