/**
 * The Market Drawer is only used when the user is viewing the BettingMarketGroup
 * (Market) page. The Market Drawer is consisted of two components: {@link Betslip}
 * and {@link OpenBets}. These two components are shown in tabs. The Betslip
 * tab is displaye by default.
 */
import React, {PureComponent} from 'react';
import {Tabs} from 'antd';
import {I18n} from 'react-redux-i18n';
import {connect} from 'react-redux';
import BetSlip from './BetSlip';
import OpenBets from './OpenBets';
import {BettingDrawerStates} from '../../../constants';
import {MarketDrawerSelector} from '../../../selectors';

const TabPane = Tabs.TabPane;
const BETSLIP = 'BETSLIP';
const OPENBETS = 'OPENBETS';
const {SUBMIT_BETS_SUCCESS} = BettingDrawerStates;

class MarketDrawer extends PureComponent {
  constructor(props) {
    super(props);
    // Show Open Bets by default
    this.state = {activeTab: OPENBETS};
    this.onTabClick = this.onTabClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // Automatically switch to Open Bets tab after a successful PlaceBet operation
    if (nextProps.overlay === SUBMIT_BETS_SUCCESS && this.props.overlay !== SUBMIT_BETS_SUCCESS) {
      if (this.state.activeTab === BETSLIP) {
        this.setState({activeTab: OPENBETS});
      }
    }

    // Automatically switch to BetSlip if the user changes anything in the BetSlip
    if (!nextProps.unconfirmedBets.equals(this.props.unconfirmedBets)) {
      if (this.state.activeTab === OPENBETS) {
        this.setState({activeTab: BETSLIP});
      }
    }
  }

  /**
   * Callback function that overrides the default behavior of the antd Tab component.
   *
   * We override the click handler so that whenever a user clicks on the tab,
   * we force the tab component to update our own internal state `activeTab` instead.
   * We are doing this because we need to forcibly switch the tab based on some
   * user actions, see #componentWillReceiveProps above for more details.
   *
   * @param {string} key - the key defined in the TabPane component. See the
   * #render function below. It indicates which tab the user has clicked on.
   */
  onTabClick(key) {
    if (this.props.canSwitchTab === true) {
      this.setState({activeTab: key});
    }
  }

  render() {
    return (
      <div id='market-drawer'>
        <Tabs activeKey={ this.state.activeTab } type='card' onTabClick={ this.onTabClick }>
          <TabPane tab={ I18n.t('market_drawer.tab1') } key={ BETSLIP }>
            <BetSlip 
              currencyFormat={ this.props.currencyFormat } 
              activeTab={ this.state.activeTab } />
          </TabPane>
          <TabPane tab={ I18n.t('market_drawer.tab2') } key={ OPENBETS }>
            <OpenBets
              currencyFormat={ this.props.currencyFormat }
              activeTab={ this.state.activeTab }
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  overlay: MarketDrawerSelector.getOverlayState(state),
  unconfirmedBets: MarketDrawerSelector.getUnconfirmedBets(state),
  canSwitchTab: MarketDrawerSelector.canAcceptBet(state)
});

export default connect(mapStateToProps)(MarketDrawer);
