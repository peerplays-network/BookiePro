import React from 'react';
import { I18n, Translate } from 'react-redux-i18n';
import CurrencyUtils from './CurrencyUtils';

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

//merge betting market group data to bets for display
//created seperate function otherwise column data with the same column name will be replaced in main data;
const mergeBettingMarketGroup = (data, relData, col) => {
  data.forEach((row, index) => {
    var matchObj = relData.get(row.get(col));
    if(matchObj){
      row = row.set('event_id', matchObj.get('event_id'));
      row = row.set('market_type_id', matchObj.get('market_type_id'));
      if(matchObj.get('market_type_id') === 'Moneyline'){
        row = row.set('options', '');
      }
      else if(matchObj.get('market_type_id') === 'Spread'){
        if(matchObj.get('options').get('margin') > 0)
          row = row.set('options', ('+' + matchObj.get('options').get('margin')));
        else
          row = row.set('options', matchObj.get('options').get('margin'));
      }
      else{
        row = row.set('options', matchObj.get('options').get('score'));
      }
      data[index] = row;
    }
  })
  return data;
}


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
      dataIndex: 'odds',
      key: 'odds',
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
      dataIndex: 'odds',
      key: 'odds',
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
      dataIndex: 'odds',
      key: 'odds',
    },
    {
      title: I18n.t('mybets.stake') + currencySymbol,
      dataIndex: 'stake',
      key: 'stake',
    },
    {
      title: I18n.t('mybets.profit') + currencySymbol,
      dataIndex: 'profit_liability',
      key: 'profit_liability'
    }
  ];

}

const MyWagerUtils = {
  mergeRelationData,
  mergeBettingMarketGroup,
  getUnmatchedBetsColumns,
  getMatchedBetsColumns,
  getResolvedBetsColumns
}

export default MyWagerUtils;
