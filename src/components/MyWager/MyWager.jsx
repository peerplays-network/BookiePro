import React, { Component } from 'react';
import { Tabs, Breadcrumb } from 'antd';
import UnmatchedBets from './UnmatchedBets';
import MatchedBets from './MatchedBets';
import ResolvedBets from './ResolvedBets';
import { BetActions } from '../../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const TabPane = Tabs.TabPane;

class MyWager extends Component {
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
          <Breadcrumb.Item><a
            href='/'>  Home </a></Breadcrumb.Item>
          <Breadcrumb.Item> My Wager </Breadcrumb.Item>
        </Breadcrumb>

        <Tabs className='content bookie-tab' defaultActiveKey='unmatchedBets' onChange={ this.onTabChange }>
          <TabPane tab='UNMATCHED BETS' key='unmatchedBets'>
            <UnmatchedBets unmatchedBets={ this.props.unmatchedBets } bettingMarketsById={ this.props.bettingMarketsById }
              bettingMarketGroupsById={ this.props.bettingMarketGroupsById } eventsById={ this.props.eventsById } sportsById={ this.props.sportsById }
              unmatchedBetsLoadingStatus={ this.props.ongoingBetsLoadingStatus } currencyFormat={ this.props.currencyFormat } />
          </TabPane>
          <TabPane tab='MATCHED BETS' key='matchedBets'>
            <MatchedBets />
          </TabPane>
          <TabPane tab='RESOLVED BETS' key='resolvedBets'>
            <ResolvedBets />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ongoingBetsLoadingStatus: state.getIn(['bet','getOngoingBetsLoadingStatus']),
    unmatchedBets: state.getIn(['bet','unmatchedBets']),
    matchedBets: state.getIn(['bet','matchedBets']),
    resolvedBets: state.getIn(['bet','resolvedBets']),
    bettingMarketsById: state.getIn(['bettingMarket','bettingMarketsById']),
    bettingMarketGroupsById: state.getIn(['bettingMarketGroup','bettingMarketGroupsById']),
    eventsById: state.getIn(['event','eventsById']),
    sportsById: state.getIn(['sport','sportsById']),
    currencyFormat: state.getIn(['setting','currencyFormat'])
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    getOngoingBets: BetActions.getOngoingBets
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MyWager);
