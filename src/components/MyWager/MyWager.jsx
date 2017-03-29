import React, { PureComponent } from 'react';
import { Tabs, Breadcrumb } from 'antd';
import UnmatchedBets from './UnmatchedBets';
import MatchedBets from './MatchedBets';
import ResolvedBets from './ResolvedBets';
import { BetActions } from '../../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getFormattedDate } from '../../utility/DateUtils';
import { mergeRelationData, mergeBettingMarketGroup, mergeEventData, mergeSport} from '../../utility/MergeObjectUtils';
import _ from 'lodash';

import { LoadingStatus } from '../../constants';
import { I18n } from 'react-redux-i18n';

const TabPane = Tabs.TabPane;
var tabKey = 'unmatchedBets';

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
            <MatchedBets />
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
    const unmatchedColumns = [
      {
        key: 'id',
      },
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
        dataIndex: 'remaining_amount_to_bet',
        key: 'remaining_amount_to_bet',
      },
      {
        title: I18n.t('mybets.profit') + ' / ' + I18n.t('mybets.liability') + '(' + (state.getIn(['setting','currencyFormat']) === 'BTC' ? 'Ƀ' : 'm') + ')',
        dataIndex: 'remaining_amount_to_win',
        key: 'remaining_amount_to_win',
      },
      {
        title: '',
        dataIndex: 'cancel',
        key: 'cancel',
      }
    ];

    let mergeData = [];
    let total = 0;
    if(state.getIn(['bet','getOngoingBetsLoadingStatus']) === LoadingStatus.DONE){

      state.getIn(['bet','unmatchedBets']).forEach(row =>
      {
        let rowObj = {
          key: row.get('id'),
          id: row.get('id'),
          'betting_market_id': row.get('betting_market_id'),
          'back_or_lay': row.get('back_or_lay'),
          'remaining_amount_to_bet': row.get('remaining_amount_to_bet'),
          'remaining_amount_to_win': row.get('remaining_amount_to_win'),
          'cancelled': row.get('cancelled')
        }
        mergeData.push(rowObj);
      });


      //merging betting market data for display and betting_market_group_id for reference
      mergeData = mergeRelationData(mergeData, state.getIn(['bettingMarket','bettingMarketsById']),
        'betting_market_id', 'id', ['betting_market_group_id', 'payout_condition_string']);
      //merging betting market group data for display and eventid for reference
      mergeData = mergeBettingMarketGroup(mergeData, state.getIn(['bettingMarketGroup','bettingMarketGroupsById']),
        'betting_market_group_id', 'id');
      //merging evemt data for display and sport id for reference
      mergeData = mergeEventData(mergeData, state.getIn(['event','eventsById']), 'event_id', 'id');
      //merging sport data for display
      mergeData = mergeSport(mergeData, state.getIn(['sport','sportsById']), 'sport_id', 'id', 'sport_name');

      //formating data for display
      mergeData = _.forEach(mergeData, function(d){
        _.merge(d, {'cancel' : (d['cancelled'] ? '' : <a className='btn cancel-btn' href=''>{ I18n.t('mybets.cancel') }</a>) });
        //TODO: need to clarify on team and market options
        _.merge(d, {'type' : (d['back_or_lay'] + ' | ' + d['payout_condition_string'] + ' ' + d['options'] + ' | ' + d['market_type_id']) });
        //TODO: verify Odd calculation formula = amount to win / amount to bet
        _.merge(d, {'odds' : (d['remaining_amount_to_win'] / d['remaining_amount_to_bet']).toFixed(2)  });
        _.merge(d, {'remaining_amount_to_bet' : (d['remaining_amount_to_bet'] / 100000 )});
        _.merge(d, {'remaining_amount_to_win' : (d['remaining_amount_to_win'] / 100000 )});
        _.merge(d, {'event_time': getFormattedDate(d['event_time'])});
        total += parseFloat(d['remaining_amount_to_bet']);
      });
      //TODO: verify if we will use 5 or 6 digits after decimal
      total = total.toFixed(5);
    }

    if(tabKey === 'unmatchedBets'){
      return {
        unmatchedBetsColumns: unmatchedColumns,
        unmatchedBetsData: mergeData,
        unmatchedBetsLoadingStatus: state.getIn(['bet','getOngoingBetsLoadingStatus']),
        unmatchedBetsCurrencyFormat: state.getIn(['setting','currencyFormat']),
        unmatchedBetsTotal: total
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
