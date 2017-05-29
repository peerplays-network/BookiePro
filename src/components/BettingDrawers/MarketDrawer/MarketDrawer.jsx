import React, { Component } from 'react';
import { Tabs } from 'antd';
import { I18n } from 'react-redux-i18n';
import BetSlip from './BetSlip';
import PlacedBets from './PlacedBets';

const TabPane = Tabs.TabPane;

class MarketDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = { activeTab: '1' };
    this.onTabClick = this.onTabClick.bind(this);
  }

  onTabClick(key) {
    this.setState({ activeTab: key });
  }

  render() {
    return (
      <div id='market-drawer'>
        <Tabs activeKey={ this.state.activeTab } type='card' onTabClick={ this.onTabClick }>
          <TabPane tab={ I18n.t('market_drawer.tab1') } key='1'>
            <BetSlip currencyFormat={ this.props.currencyFormat }/>
          </TabPane>
          <TabPane tab={ I18n.t('market_drawer.tab2') }  key='2'>
            <PlacedBets currencyFormat={ this.props.currencyFormat }/>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}


export default MarketDrawer;
