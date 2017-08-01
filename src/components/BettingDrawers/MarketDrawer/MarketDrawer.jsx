import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import BetSlip from './BetSlip';
import PlacedBets from './PlacedBets';
import { BettingDrawerStates } from '../../../constants';
import { MarketDrawerSelector } from '../../../selectors';

const TabPane = Tabs.TabPane;
const BETSLIP = '1';
const PLACEDBETS = '2';
const { SUBMIT_BETS_SUCCESS } = BettingDrawerStates;

class MarketDrawer extends PureComponent {
  constructor(props) {
    super(props);
    // Show BetSlip by default
    this.state = { activeTab: BETSLIP };
    this.onTabClick = this.onTabClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // Automatically switch to Placed Bets tab after a successful PlaceBet operation
    if (nextProps.overlay === SUBMIT_BETS_SUCCESS &&
        this.props.overlay !== SUBMIT_BETS_SUCCESS) {
      if (this.state.activeTab === BETSLIP) {
        this.setState({ activeTab: PLACEDBETS });
      }
    }

    // Automatically switch to BetSlip if the user changes anything in the BetSlip
    if (!nextProps.unconfirmedBets.equals(this.props.unconfirmedBets)) {
      if (this.state.activeTab === PLACEDBETS) {
        this.setState({ activeTab: BETSLIP });
      }
    }
  }

  // We forced the Tabs component to use the internal activeTab state as the activeKey.
  // We do this so that we can have direct control of the tabs, i.e. we can now
  // programmatically switch tab based on props
  onTabClick(key) {
    if (this.props.canSwitchTab === true) {
      this.setState({ activeTab: key });
    }
  }

  render() {
    return (
      <div id='market-drawer'>
        <Tabs activeKey={ this.state.activeTab } type='card' onTabClick={ this.onTabClick }>
          <TabPane tab={ I18n.t('market_drawer.tab1') } key={ BETSLIP }>
            <BetSlip currencyFormat={ this.props.currencyFormat }/>
          </TabPane>
          <TabPane tab={ I18n.t('market_drawer.tab2') } key={ PLACEDBETS }>
            <PlacedBets currencyFormat={ this.props.currencyFormat }/>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    overlay: MarketDrawerSelector.getOverlayState(state),
    unconfirmedBets: MarketDrawerSelector.getUnconfirmedBets(state),
    canSwitchTab: MarketDrawerSelector.canAcceptBet(state),
  }
}

export default connect(mapStateToProps)(MarketDrawer);
