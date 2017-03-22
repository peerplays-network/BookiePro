import React, { Component } from 'react';
import { Table } from 'antd';
import { LoadingStatus } from '../../constants';
import './MyWager.less';
import _ from 'lodash';

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
    dataIndex: 'payout_condition_string',
    key: 'payout_condition_string',
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
    title: 'Stake()',
    dataIndex: 'remaining_amount_to_bet',
    key: 'remaining_amount_to_bet',
  },
  {
    title: 'Profit / Liability()',
    dataIndex: 'remaining_amount_to_win',
    key: 'remaining_amount_to_win',
  },
  {
    title: '',
    dataIndex: 'cancel',
    key: 'cancel',
  }
];

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
    const { unmatchedBets, bettingMarkets, bettingMarketGroups, events, sports, unmatchedBetsLoadingStatus } = this.props;
    //merging betting market group id for reference
    var unmatchedData = [];

    if(unmatchedBetsLoadingStatus === LoadingStatus.DONE){
      unmatchedData = privateFunctions.mergeRelationData(unmatchedBets, bettingMarkets, 'betting_market_id', 'id',
        ['betting_market_group_id', 'payout_condition_string']);
      //merging betting market group data for display and eventid for reference
      unmatchedData = privateFunctions.mergeRelationData(unmatchedData, bettingMarketGroups, 'betting_market_group_id', 'id',
        ['event_id']);
      //merging evemt data for display and sport id for reference
      unmatchedData = privateFunctions.mergeEventData(unmatchedData, events, 'event_id', 'id');
      //merging sport data for display
      unmatchedData = privateFunctions.mergeSport(unmatchedData, sports, 'sport_id', 'id', 'sport_name');

      //formating data for display
      unmatchedData = _.forEach(unmatchedData, function(d){
        _.merge(d, {'cancel' : (d['cancelled'] ? '' : <a className='btn cancel-btn' href=''>cancel</a>) });
        _.merge(d, {'odds' : (d['remaining_amount_to_win'] / d['remaining_amount_to_bet']).toFixed(2)  });
        _.merge(d, {'event_time' : new Date(d['event_time']).toISOString().substring(0, 16).replace('T',' ')});
        total += parseFloat(d['remaining_amount_to_bet']);
      });
    }

    return (
      <div>
        <div className='top-data clearfix'>
          <div className='float-left'>
            <p className='font18 padding-tb-5'>TOTAL: Ƀ{ total }</p>
          </div>
          <div className='float-right'>
            <div className='float-right'>
              { /* cancel all To be done */ }
              <a className='btn cancel-btn' href='' disabled={ unmatchedData.length === 0 }>Cancel All</a>
            </div>
          </div>
          <div className='right-left'></div>
        </div>
        <Table className='bookie-table' pagination={ { pageSize: 10 } } locale={ {emptyText: 'No Data'} } dataSource={ unmatchedData } columns={ columns } />
      </div>
    )
  }
}

export default UnmatchedBets;
