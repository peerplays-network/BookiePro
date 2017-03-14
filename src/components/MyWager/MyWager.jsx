import React, { Component } from 'react';
import { Tabs } from 'antd';
import UnmatchedBets from './UnmatchedBets';
import MatchedBets from './MatchedBets';
import ResolvedBets from './ResolvedBets';

const TabPane = Tabs.TabPane;

class MyWager extends Component {
  constructor(props) {
    super(props);
    this.onTabChange = this.onTabChange.bind(this);
  }

  onTabChange(key) {
    console.log('Go to Tab ', key);
  }

  render() {
    return (
      <div className='my-wager'>
        <div className='page-title'>
          My Wager
        </div>
        <Tabs className='content bookie-tab' defaultActiveKey='unmatchedBets' onChange={ this.onTabChange }>
          <TabPane tab='UNMATCHED BETS' key='unmatchedBets'>
            <UnmatchedBets />
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

export default MyWager;
