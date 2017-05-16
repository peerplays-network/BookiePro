import React from 'react';
import { Tabs } from 'antd';
import { I18n } from 'react-redux-i18n';
import BetSlip from './BetSlip';
import PlacedBets from './PlacedBets';

const TabPane = Tabs.TabPane;

const MarketDrawer = (props) => (
  <div id='market-drawer'>
    <Tabs defaultActiveKey='1' type='card'>
      <TabPane tab={ I18n.t('market_drawer.tab1') } key='1'>
        <BetSlip currencyFormat={ props.currencyFormat }/>
      </TabPane>
      <TabPane tab={ I18n.t('market_drawer.tab2') }  key='2'>
        <PlacedBets currencyFormat={ props.currencyFormat }/>
      </TabPane>
    </Tabs>
  </div>
)

export default MarketDrawer;
