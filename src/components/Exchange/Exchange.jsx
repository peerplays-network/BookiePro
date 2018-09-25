/**
 * The Exchange component is available in all the Sport, EventGroup, Event and 
 * BettingMarketGroup Pages.
 * It contains Sidebar, Betting Widgets and Betting Drawers, separated by 
 * {@link https://github.com/tomkp/react-split-pane} react-split-pane.
 */
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router';
import SplitPane from 'react-split-pane';
import SideBar from '../SideBar';
import {QuickBetDrawer, MarketDrawer} from '../BettingDrawers';
import {QuickBetDrawerActions, MarketDrawerActions, NavigateActions} from '../../actions';
import UnplacedBetModal from '../Modal/UnplacedBetModal';
import Ps from 'perfect-scrollbar';
import CommonMessage from '../CommonMessage/CommonMessage';
import CommonMessageActions from '../../actions/CommonMessageActions';
import MessageType from '../../constants/MessageTypes';

class Exchange extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // whether user has clicked 'confirm' button in the UnplacedBetModal.
      confirmToLeave: false,
      // whether the UnplacedBetModal is shown
      unplacedBetModalVisible: false
    };
  }

  componentDidMount() {
    Ps.initialize(this.refs.sidebar);
    Ps.initialize(this.refs.main);
  }

  componentDidUpdate(prevProps, prevState) {
    //reset scroll area in sidebar and betting widget upon route change.
    Ps.update(this.refs.sidebar);
    Ps.update(this.refs.main);

    // navigate to new route after clicking confirm button in confirmation modal.
    if (prevState.confirmToLeave === false && this.state.confirmToLeave === true) {
      this.props.navigateTo(this.state.nextLocation);
      this.setState({
        confirmToLeave: false
      });
    }
  }

  /**
   * The #componentWillReceiveProps function is overriden here in order to update the 
   * routeLeaveHook upon route change.
   *
   * Normally setRouteLeaveHook is placed in componentDidMount yet Exchange component is being 
   * reused when new route is triggered by sidebar.
   * So we need to call setRouteLeaveHook for every change in routes and router props.
   */
  componentWillReceiveProps(nextProps) {
    const {router, routes} = nextProps;

    // second last item in routes in nextProps  is equivalant to last item in routes in currentProps
    // which means route in current page before leaving
    const currentRoute = routes[nextProps.routes.length - 1];
    router.setRouteLeaveHook(currentRoute, this.routerWillLeave.bind(this));
  }

  setModalVisible(modalVisible) {
    this.setState({
      unplacedBetModalVisible: modalVisible
    });
  }

  /**
   * called just before leaving current page.
   *
   * Situations could be
   *   - leaving without unconfirmed bets.
   *   - leaving after clicking confirm button in modal when there is unconfirmed bets.
   *
   * Attempts to reset the store about unconfirmed bets as well as state of UI like modal 
   * visibliity and overlay.
   */
  handleLeave() {
    this.props.clearQuickBetDrawer();
    this.props.clearQuickBetsOverlay();
    this.props.clearMarketDrawerBetslips();
    this.props.clearMarketBetsOverlay();

    this.setModalVisible(false);
    this.setState({
      confirmToLeave: true
    });
  }

  gracefulLeave() {
    // We still need to gracefully "leave" the page and reset the drawer
    this.handleLeave();
    // Notify Search Menu(i.e. react-select) to remove focus
    this.props.onRouteChange();
    return true;
  }
  /**
   * Callback function when user 'attempt' to navigate to new page
   *
   * When there exists unplaced bets in betting drawer store, confrimation modal will be shown 
   * and new route will be temporiaily blocked.
   * New route will be stored in state, being navigated to after clicking confirm button in 
   * confirmation modal.
   *
   * @param {string} nextLocation - the route location user attempt to navigate to
   * @returns {boolean} whether to follow the new route
   */
  routerWillLeave(nextLocation) {
    this.setState({
      nextLocation
    });

    // TESTING PURPOSES
    let index = Math.floor(Math.random() * 5) + 1;

    switch (index) {
      case 1:
        this.props.addCommonMessage(
          Math.random(Math.random() * 99).toString(), MessageType.SUCCESS, 'exchange');
        this.props.addCommonMessage(
          Math.random(Math.random() * 99).toString(), MessageType.INFO, 'betslip');
        break;
      case 2:
        this.props.addCommonMessage(
          Math.random(Math.random() * 99).toString(), MessageType.INFO, 'betslip');
        break;
      case 3:
        this.props.addCommonMessage(
          Math.random(Math.random() * 99).toString(), MessageType.ERROR, 'exchange');
        this.props.addCommonMessage(
          Math.random(Math.random() * 99).toString(), MessageType.INFO, 'betslip');
        break;
      case 4:
        this.props.addCommonMessage(
          Math.random(Math.random() * 99).toString(), MessageType.WARNING, 'exchange');
        this.props.addCommonMessage(
          Math.random(Math.random() * 99).toString(), MessageType.INFO, 'betslip');
        break;
    }

    if (
      !this.props.isShowLogoutPopup &&
      !this.state.confirmToLeave &&
      this.props.hasUnplacedBets &&
      this.props.connectionStatus.toLowerCase() === 'connected'
    ) {
      this.setModalVisible(true);
      return false;
    }

    return this.gracefulLeave(); // will return true
  }

  render() {
    const sidebarWidth = 220;
    const betslipWidth = 360;

    let transitionName = this.props.location.pathname.split('/');
    const splitPaneStyle = {
      top: '0px',
      position: 'fixed'
    };

    //confirmation modal about leaving current route.
    let unplacedBetModal = (
      <UnplacedBetModal
        visible={ this.state.unplacedBetModalVisible }
        onLeave={ () => this.handleLeave() }
        onStay={ () => this.setModalVisible(false) }
      />
    );

    // Pick one of the 2 betting drawers based on the path
    let selectBettingDrawer = (pathTokens) => {
      if (pathTokens.length < 3 || pathTokens[2].toLowerCase() !== 'bettingmarketgroup') {
        return <QuickBetDrawer currencyFormat={ this.props.currencyFormat } />;
      }

      return <MarketDrawer currencyFormat={ this.props.currencyFormat } />;
    };

    return (
      <div>
        <SplitPane
          style={ splitPaneStyle }
          split='vertical'
          allowResize={ false }
          minSize={ sidebarWidth }
          defaultSize={ sidebarWidth }
        >
          <div className='sidebar-main' ref='sidebar'>
            <SideBar
              level={ transitionName.length }
              objectId={ transitionName[transitionName.length - 1] }
            />
          </div>
          <div className='messaging'>
            <CommonMessage
              location='exchange'
            />
            <SplitPane
              split='vertical'
              allowResize={ false }
              minSize={ betslipWidth }
              defaultSize={ betslipWidth }
              primary='second'
            >
              <div className='scrollbar-style-main' ref='main'>
                {React.cloneElement(this.props.children, {
                  currencyFormat: this.props.currencyFormat
                })}
              </div>
              {selectBettingDrawer(transitionName)}
            </SplitPane>
          </div>
        </SplitPane>
        {unplacedBetModal}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const app = state.get('app');
  const isShowLogoutPopup = app.get('isShowLogoutPopup');
  const connectionStatus = app.get('connectionStatus');
  const account = state.get('account');
  const accountId = account.getIn(['account', 'id']);
  const setting =
    state.getIn(['setting', 'settingByAccountId', accountId]) ||
    state.getIn(['setting', 'defaultSetting']);
  const currencyFormat = setting.get('currencyFormat');
  // Determine which betting drawer we should check
  let path = ['marketDrawer', 'unconfirmedBets'];
  const transitionName = ownProps.location.pathname.split('/');

  if (transitionName.length < 3 || transitionName[2].toLowerCase() !== 'bettingmarketgroup') {
    path = ['quickBetDrawer', 'bets'];
  }

  return {
    hasUnplacedBets: !state.getIn(path).isEmpty(),
    currencyFormat,
    isShowLogoutPopup,
    connectionStatus
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    navigateTo: NavigateActions.navigateTo,
    clearQuickBetDrawer: QuickBetDrawerActions.deleteAllBets,
    clearQuickBetsOverlay: QuickBetDrawerActions.hideOverlay,
    clearMarketDrawerBetslips: MarketDrawerActions.deleteAllUnconfirmedBets,
    clearMarketBetsOverlay: MarketDrawerActions.hideOverlay,
    addCommonMessage: CommonMessageActions.newMessage
  },
  dispatch
);

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Exchange)
);
