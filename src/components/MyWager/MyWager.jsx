import React, { PureComponent } from 'react';
import { Tabs, Breadcrumb } from 'antd';
import UnmatchedBets from './UnmatchedBets';
import MatchedBets from './MatchedBets';
import ResolvedBets from './ResolvedBets';
import { BetActions } from '../../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getFormattedDate } from '../../utility/DateUtils';
import { mergeRelationData} from '../../utility/MergeObjectUtils';
import _ from 'lodash';
import { List, Map } from 'immutable';
import { LoadingStatus } from '../../constants';
import { I18n } from 'react-redux-i18n';

const TabPane = Tabs.TabPane;
var tabKey = 'unmatchedBets';

class PrivateFunctions{
  //merge betting market group data to bets for display
  //created seperate function otherwise column data with the same column name will be replaced in main data;
  static mergeBettingMarketGroup(data, relData, col){
    data.forEach((d, index) => {
    	var matchObj = relData.get(d.get(col));
      if(matchObj){
        d = d.set('event_id', matchObj.get('event_id'));
        d = d.set('market_type_id', matchObj.get('market_type_id'));
        if(matchObj.get('market_type_id') === 'Moneyline'){
          d = d.set('options', '');
        }
        else if(matchObj.get('market_type_id') === 'Spread'){
          if(matchObj.get('options').get('margin') > 0)
            d = d.set('options', ('+' + matchObj.get('options').get('margin')));
          else
            d = d.set('options', matchObj.get('options').get('margin'));
        }
        else{
      	  d = d.set('options', matchObj.get('options').get('score'));
        }
        data[index] = d;
      }
    })
    return data;
  }

  //formatting data after getting all reuired data merged
  static formatBettingData(data){
    data.forEach((d, index) => {
      let rowObj = {
        'type' : (d.get('back_or_lay') + ' | ' + d.get('payout_condition_string') + ' ' + d.get('options') + ' | ' + d.get('market_type_id')),
        'odds' : (d.get('amount_to_win') / d.get('amount_to_bet')).toFixed(2),
        'amount_to_bet' : (d.get('amount_to_bet') / 100000 ),
        'amount_to_win' : (d.get('amount_to_win') / 100000 ),
        'event_time': getFormattedDate(d.get('event_time'))
      };
      if(tabKey === 'unmatchedBets')
        rowObj.cancel = (d.get('cancelled') ? '' : <a className='btn cancel-btn' href=''>{ I18n.t('mybets.cancel') }</a>);
      data[index] = d.merge(Map(rowObj));
    });
    return data;
  }
}

class MyWager extends PureComponent {
  constructor(props) {
    super(props);
    this.onTabChange = this.onTabChange.bind(this);
  }

  onTabChange(key) {
    if(key === 'resolvedBets'){
      console.log('Go to Tab ', key);
    }
    else{
      //get matched and unmatched bets
      this.props.getOngoingBets();
      tabKey = key;
    }
  }

  componentDidMount()
  {
    //get data for default active tab unmatched Bets
    this.props.getOngoingBets();
  }

  render() {
    return (
      <div className='my-wager'>
        <Breadcrumb className='bookie-breadcrumb'>
          <Breadcrumb.Item><a href='/'>  { I18n.t('mybets.home') } </a></Breadcrumb.Item>
          <Breadcrumb.Item> { I18n.t('mybets.mywager') } </Breadcrumb.Item>
        </Breadcrumb>

        <Tabs className='content bookie-tab' defaultActiveKey='unmatchedBets' onChange={ this.onTabChange }>
          <TabPane tab={ I18n.t('mybets.unmatched_bets') } key='unmatchedBets'>
            <UnmatchedBets columns={ this.props.unmatchedBetsColumns } unmatchedBets={ this.props.unmatchedBetsData }
              unmatchedBetsLoadingStatus={ this.props.unmatchedBetsLoadingStatus }
              currencyFormat={ this.props.unmatchedBetsCurrencyFormat } betsTotal={ this.props.unmatchedBetsTotal }/>
          </TabPane>
          <TabPane tab={ I18n.t('mybets.matched_bets') } key='matchedBets'>
            <MatchedBets columns={ this.props.matchedBetsColumns } matchedBets={ this.props.matchedBetsData }
              matchedBetsLoadingStatus={ this.props.matchedBetsLoadingStatus }
              currencyFormat={ this.props.matchedBetsCurrencyFormat } betsTotal={ this.props.matchedBetsTotal }/>
          </TabPane>
          <TabPane tab={ I18n.t('mybets.resolved_bets') } key='resolvedBets'>
            <ResolvedBets />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

const mapStateToProps = (state) => {

  if(tabKey === 'unmatchedBets' || tabKey === 'matchedBets'){
    const columns = [
      {
        title: I18n.t('mybets.event_time'),
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
        title: I18n.t('mybets.stake') + '(' + (state.getIn(['setting','currencyFormat']) === 'BTC' ? 'Ƀ' : 'm') + ')',
        dataIndex: 'amount_to_bet',
        key: 'amount_to_bet',
      },
      {
        title: I18n.t('mybets.profit') + ' / ' + I18n.t('mybets.liability') + '(' + (state.getIn(['setting','currencyFormat']) === 'BTC' ? 'Ƀ' : 'm') + ')',
        dataIndex: 'amount_to_win',
        key: 'amount_to_win',
      }
    ];

    if(tabKey === 'unmatchedBets'){
      columns.push(
        {
          title: '',
          dataIndex: 'cancel',
          key: 'cancel',
        }
      );
    }

    let mergeData = [];
    let total = 0;
    if(state.getIn(['bet','getOngoingBetsLoadingStatus']) === LoadingStatus.DONE){
      state.getIn(['bet',(tabKey === 'matchedBets' ? 'matchedBets' : 'unmatchedBets')]).forEach(row =>
      {
        let rowObj = {
          key: row.get('id'),
          id: row.get('id'),
          'betting_market_id': row.get('betting_market_id'),
          'back_or_lay': row.get('back_or_lay')
        }
        //used same name amount_to_bet and amount_to_win for matchedBets and unmatchedBets to shorten code
        if(tabKey === 'unmatchedBets'){
          rowObj.cancelled = row.get('cancelled');
          rowObj.amount_to_bet = row.get('remaining_amount_to_bet');
          rowObj.amount_to_win = row.get('remaining_amount_to_win');
        }
        else {
          rowObj.amount_to_bet = row.get('amount_to_bet');
          rowObj.amount_to_win = row.get('amount_to_win');
        }
        mergeData.push(Map(rowObj));
      });

      //merging betting market data for display and betting_market_group_id for reference
      mergeData = mergeRelationData(mergeData, state.getIn(['bettingMarket','bettingMarketsById']), 'betting_market_id',
        {betting_market_group_id: 'betting_market_group_id' , payout_condition_string: 'payout_condition_string'});

      //merging betting market group data for display and eventid for reference
      mergeData = PrivateFunctions.mergeBettingMarketGroup(mergeData, state.getIn(['bettingMarketGroup','bettingMarketGroupsById']),
        'betting_market_group_id');

      //merging evemt data for display and sport id for reference
      mergeData = mergeRelationData(mergeData, state.getIn(['event','eventsById']), 'event_id',
      {'name': 'event_name' , 'start_time': 'event_time', 'sport_id': 'sport_id'});

      //merging sport data for display
      mergeData = mergeRelationData(mergeData, state.getIn(['sport','sportsById']), 'sport_id',
      {'name': 'sport_name'});

      //formating data for display
      mergeData = PrivateFunctions.formatBettingData(mergeData);
      mergeData = List(mergeData);

      //totalling the Bets stake and profit/liability
      mergeData.forEach((d, index) => {
        total += parseFloat(d.get('amount_to_bet') + d.get('amount_to_win'));
      });

      //TODO: verify if we will use 5 or 6 digits after decimal
      total = total.toFixed(5);
    }

    if(tabKey === 'unmatchedBets'){
      return {
        unmatchedBetsColumns: columns,
        unmatchedBetsData: mergeData,
        unmatchedBetsLoadingStatus: state.getIn(['bet','getOngoingBetsLoadingStatus']),
        unmatchedBetsCurrencyFormat: state.getIn(['setting','currencyFormat']),
        unmatchedBetsTotal: total
      }
    }
    else{
      return {
        matchedBetsColumns: columns,
        matchedBetsData: mergeData,
        matchedBetsLoadingStatus: state.getIn(['bet','getOngoingBetsLoadingStatus']),
        matchedBetsCurrencyFormat: state.getIn(['setting','currencyFormat']),
        matchedBetsTotal: total
      }
    }
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    getOngoingBets: BetActions.getOngoingBets
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MyWager);
