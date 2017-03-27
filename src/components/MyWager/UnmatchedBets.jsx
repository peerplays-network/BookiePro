import React, { Component } from 'react';
import { Table } from 'antd';
import { LoadingStatus } from '../../constants';
import './MyWager.less';
import _ from 'lodash';

class privateFunctions{
  //merge column value based on relation
  //relnames should be distinct otherwise it will replace value of main data
  static mergeRelationData(data, relData, col, relCol, relNames){
    _.forEach(data, function(d){
      var matchObj = _.find(relData, {[relCol]: d[col]})
      _.forEach(relNames, function(r){
        _.merge(d, {[r] : matchObj[r]})
      });
    })
    return data;
  }

  //merge betting market group data to bets for display
  //created seperate function otherwise column data with the same column name will be replaced in main data
  static mergeBettingMarketGroup(data, relData, col, relCol){
    _.forEach(data, function(d){
    	var matchObj = _.find(relData, {[relCol]: d[col]});
      _.merge(d, {'event_id' : matchObj['event_id']})
      _.merge(d, {'market_type_id' : matchObj['market_type_id']})
      if(matchObj['market_type_id'] === 'Moneyline'){
        _.merge(d, {'options' : ''});
      }
      else if(matchObj['market_type_id'] === 'Spread'){
        if(matchObj['options']['margin'] > 0)
          _.merge(d, {'options' : ('+' + matchObj['options']['margin'])});
        else
          _.merge(d, {'options' : matchObj['options']['margin']});
      }
      else{
    	  _.merge(d, {'options' : matchObj['options']['score']});
      }
    })
  	return data;
  }

  //merge event data to bets for display
  //created seperate function otherwise column data with the same column name will be replaced in main data
  static mergeEventData(data, relData, col, relCol){
    	_.forEach(data, function(d){
    		var matchObj = _.find(relData, {[relCol]: d[col]});
      _.merge(d, {'event_name' : matchObj['name']})
      _.merge(d, {'event_time' : matchObj['start_time']})
      _.merge(d, {'sport_id' : matchObj['sport_id']})
    })
  	return data;
  }

  //merge sport data to bets for display
  //created seperate function otherwise column data with the same column name will be replaced in main data
  static mergeSport(data, relData, col, relCol, relName){
    // TODO: temporary solution is converting immutable object using toJS(), but should be avoided in the final version
  	_.forEach(data, function(d){
  		var matchObj = _.find(relData, {[relCol]: d[col]})
  		_.merge(d, {[relName] : matchObj['name']})
  	})
  	return data;
  }
}

class UnmatchedBets extends Component {
  render() {
    let total = 0;
    let { unmatchedBets, bettingMarketsById, bettingMarketGroupsById, eventsById, sportsById, unmatchedBetsLoadingStatus,
      currencyFormat } = this.props;
    // TODO: temporary solution is converting immutable object using toJS() and toArray(), but should be avoided in the final version
    // TODO: this temporary solution is used to make minimal change to the current code after changing the whole redux tree into immutable tree
    unmatchedBets = unmatchedBets.toJS();
    const bettingMarkets = _.map(bettingMarketsById.toJS());
    const bettingMarketGroups = _.map(bettingMarketGroupsById.toJS());
    const events = _.map(eventsById.toJS());
    const sports = _.map(sportsById.toJS());

    //merging betting market group id for reference
    var unmatchedData = [];

    if(unmatchedBetsLoadingStatus === LoadingStatus.DONE){
      unmatchedData = privateFunctions.mergeRelationData(unmatchedBets, bettingMarkets, 'betting_market_id', 'id',
        ['betting_market_group_id', 'payout_condition_string']);
      //merging betting market group data for display and eventid for reference
      unmatchedData = privateFunctions.mergeBettingMarketGroup(unmatchedData, bettingMarketGroups, 'betting_market_group_id', 'id');
      //merging evemt data for display and sport id for reference
      unmatchedData = privateFunctions.mergeEventData(unmatchedData, events, 'event_id', 'id');
      //merging sport data for display
      unmatchedData = privateFunctions.mergeSport(unmatchedData, sports, 'sport_id', 'id', 'sport_name');
      //formating data for display
      unmatchedData = _.forEach(unmatchedData, function(d){
        _.merge(d, {'cancel' : (d['cancelled'] ? '' : <a className='btn cancel-btn' href=''>cancel</a>) });
        //TODO: need to clarify on team and market options
        _.merge(d, {'type' : (d['back_or_lay'] + ' | ' + d['payout_condition_string'] + ' ' + d['options'] + ' | ' + d['market_type_id']) });
        //TODO: verify Odd calculation formula = amount to win / amount to bet
        _.merge(d, {'odds' : (d['remaining_amount_to_win'] / d['remaining_amount_to_bet']).toFixed(2)  });
        _.merge(d, {'event_time' : new Date(d['event_time']).toLocaleString().split(':', 2).join(':').replace(',','')});
        total += parseFloat(d['remaining_amount_to_bet']);
      });
      //TODO: verify if we will use 5 or 6 digits after decimal
      total = total.toFixed(6);
    }

    const columns = [
      {
        title: 'Event Time',
        dataIndex: 'event_time',
        key: 'event_time',
      },
      {
        title: 'Event',
        dataIndex: 'event_name',
        key: 'event_name',
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: 'Sport',
        dataIndex: 'sport_name',
        key: 'sport_name',
      },
      {
        title: 'Odds',
        dataIndex: 'odds',
        key: 'odds',
      },
      {
        title: 'Stake(' + (currencyFormat === 'BTC' ? 'Ƀ' : 'm') + ')',
        dataIndex: 'remaining_amount_to_bet',
        key: 'remaining_amount_to_bet',
      },
      {
        title: 'Profit / Liability(' + (currencyFormat === 'BTC' ? 'Ƀ' : 'm') + ')',
        dataIndex: 'remaining_amount_to_win',
        key: 'remaining_amount_to_win',
      },
      {
        title: '',
        dataIndex: 'cancel',
        key: 'cancel',
      }
    ];

    return (
      <div>
        <div className='top-data clearfix'>
          <div className='float-left'>
            <p className='font18 padding-tb-5'>TOTAL: { (currencyFormat === 'BTC' ? 'Ƀ ' : 'm ') + total }</p>
          </div>
          <div className='float-right'>
            <div className='float-right'>
              { /* cancel all To be done */ }
              <a className='btn cancel-btn' href='' disabled={ unmatchedData.length === 0 }>Cancel All</a>
            </div>
          </div>
          <div className='right-left'></div>
        </div>
        <Table className='bookie-table' pagination={ { pageSize: 10 } }
          locale={ {emptyText: ( unmatchedData.length === 0 && unmatchedBetsLoadingStatus === LoadingStatus.DONE ? 'No Data' : unmatchedBetsLoadingStatus )} }
          dataSource={ unmatchedData } columns={ columns } />
      </div>
    )
  }
}

export default UnmatchedBets;
