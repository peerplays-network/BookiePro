import React, { Component } from 'react';
import { Translate } from 'react-redux-i18n';
import { Tabs } from 'antd';
import BetSlip from './BetSlip';

const TabPane = Tabs.TabPane;

const renderPlacedBets = (props) => (
  <div className='content' ref='placedBets'>
    <div className='empty'>
      <div className='instructions'>
        <Translate value='market_drawer.unmatched_bets.empty.instructions' dangerousHTML/>
      </div>
    </div>
  </div>
);

class MarketDrawer extends Component {
  render() {
    return (
      <div id='market-drawer'>
        <Tabs defaultActiveKey='1' type='card'>
          <TabPane tab='BETSLIP' key='1'>
            <BetSlip/>
          </TabPane>
          <TabPane tab='PLACED BETS' key='2'>
            { renderPlacedBets(this.props) }
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default MarketDrawer;
