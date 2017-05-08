import React from 'react';
import { Tabs } from 'antd';
import BetSlip from './BetSlip';
import PlacedBets from './PlacedBets';

const TabPane = Tabs.TabPane;

const MarketDrawer = () => (
  <div id='market-drawer'>
    <Tabs defaultActiveKey='1' type='card'>
      <TabPane tab='BETSLIP' key='1'>
        <BetSlip/>
      </TabPane>
      <TabPane tab='PLACED BETS' key='2'>
        <PlacedBets />
      </TabPane>
    </Tabs>
  </div>
)

export default MarketDrawer;
