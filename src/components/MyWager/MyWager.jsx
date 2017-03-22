import React, { Component } from 'react';
import { Tabs } from 'antd';
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
        <div className='page-title'>
          My Wager
        </div>
        <Tabs className='content bookie-tab' defaultActiveKey='unmatchedBets' onChange={ this.onTabChange }>
          <TabPane tab='UNMATCHED BETS' key='unmatchedBets'>
            <UnmatchedBets unmatchedBets={ this.props.unmatchedBets } bettingMarkets={ this.props.bettingMarkets }
              bettingMarketGroups={ this.props.bettingMarketGroups } events={ this.props.events } sports={ this.props.sports }
              unmatchedBetsLoadingStatus={ this.props.ongoingBetsLoadingStatus } />
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
    ongoingBetsLoadingStatus: state.bet.getOngoingBetsLoadingStatus,
    unmatchedBets: state.bet.unmatchedBets,
    matchedBets: state.bet.matchedBets,
    resolvedBets: state.bet.resolvedBets,
    bettingMarkets: state.bettingMarket.bettingMarkets,
    bettingMarketGroups: state.bettingMarketGroup.bettingMarketGroups,
    events: state.event.events,
    sports: state.sport.sports
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    getOngoingBets: BetActions.getOngoingBets
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MyWager);
