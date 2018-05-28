/**
 * The MyWagerUtils contains all the functions shared within My Wager component.
 */
import React from 'react';
import { I18n } from 'react-redux-i18n';
import CurrencyUtils from './CurrencyUtils';


const renderTitle = (text, currencySymbol) => {
  return (
    <div>
      <p>{ text }</p>
      { currencySymbol }
    </div>
  )     
}

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
      title: renderTitle(I18n.t('mybets.stake'), currencySymbol),
      dataIndex: 'stake',
      key: 'stake',
      className: 'value_text_label',
    },
    {
      title: renderTitle(I18n.t('mybets.profit_liability'), currencySymbol),
      dataIndex: 'profit_liability',
      key: 'profit_liability',
      className: 'value_text_label',
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
const getMatchedBetsColumns = (currencyFormat, onEventClick) => {
  const currencySymbol = CurrencyUtils.getCurrencySymbol(currencyFormat, 'white');
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
      title: renderTitle(I18n.t('mybets.stake'), currencySymbol),
      dataIndex: 'stake',
      key: 'stake',
      className: 'value_text_label',
    },
    {
      title: renderTitle(I18n.t('mybets.profit_liability'), currencySymbol),
      dataIndex: 'profit_liability',
      key: 'profit_liability',
      className: 'value_text_label',
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
  const currencySymbol = CurrencyUtils.getCurrencySymbol(currencyFormat, 'white');

  return [
    {
      title:  I18n.t('mybets.resolved_time'),
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
      title: renderTitle(I18n.t('mybets.stake'), currencySymbol),
      dataIndex: 'stake',
      key: 'stake',
      className: 'value_text_label',
    },
    {
      title: renderTitle(I18n.t('mybets.profit_liability'), currencySymbol),
      dataIndex: 'profit_liability',
      key: 'profit_liability',
      className: 'value_text_label',
    },
    {
      title: renderTitle(I18n.t('mybets.balance'), currencySymbol),
      dataIndex: 'amount_won',
      key: 'amount_won',
      className: 'value_text_label',
    }
  ];

}

//merge data from relationalCollection to collection by foreign key relationId
//mergeColumns is key value pair in which key is new column name to be set collection
//value represent source column of relationalCollection, value of which to be copied to collection
const mergeRelationData = (collection, relationalCollection, relationId, mergeColumns) => {
  collection.forEach((d, index) => {
    //get object from relationalCollection on the basis of foreign key value from collection
    var matchObj = relationalCollection.get(d.get(relationId));
    //iterate through mergeColumns to set value from relational object to specific object in collection
    matchObj && Object.keys(mergeColumns).forEach(function(r){
      //set column value
      d = d.set(mergeColumns[r], matchObj.get(r));
    });
    //replacing updated object in collection
    collection[index] = d;
  });
  return collection;
}

const MyWagerUtils = {
  mergeRelationData,
  getUnmatchedBetsColumns,
  getMatchedBetsColumns,
  getResolvedBetsColumns
}

export default MyWagerUtils;
