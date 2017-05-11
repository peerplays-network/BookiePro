import React from 'react';
import { Tabs } from 'antd';
import { I18n } from 'react-redux-i18n';
import BetSlip from './BetSlip';
import PlacedBets from './PlacedBets';

const TabPane = Tabs.TabPane;

const MarketDrawer = () => (
  <div id='market-drawer'>
    <Tabs defaultActiveKey='1' type='card'>
      <TabPane tab={ I18n.t('market_drawer.tab1') } key='1'>
        <BetSlip/>
      </TabPane>
      <TabPane tab={ I18n.t('market_drawer.tab2') }  key='2'>
        <PlacedBets />
      </TabPane>
    </Tabs>
  </div>
)

export default MarketDrawer;
