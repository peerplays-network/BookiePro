/**
 * The Exchange component is available in all the Sport, EventGroup, Event and BettingMarketGroup Pages.
 * It contains Sidebar, Betting Widgets and Betting Drawers
 *
 * If there exists unplaced bets in betting drawer when leaving current route,
 * a confirmation modal {@link UnplacedBetModal} which ask for user confirmation of leaving the route without saving any unplaced bets
 * will be shown.
 *
 */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import SplitPane from 'react-split-pane';
import SideBar from '../SideBar';
import { QuickBetDrawer, MarketDrawer } from '../BettingDrawers';
import { QuickBetDrawerActions, MarketDrawerActions, NavigateActions } from '../../actions';
import UnplacedBetModal from '../Modal/UnplacedBetModal';
import Ps from 'perfect-scrollbar';

class Exchange extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      // whether user has clicked 'confirm' button in the UnplacedBetModal.
      confirmToLeave: false,
      // whether the UnplacedBetModal is shown
      unplacedBetModalVisible: false,
    }
  }

  componentDidMount() {
    Ps.initialize(this.refs.sidebar);
    Ps.initialize(this.refs.main);
  }

  componentDidUpdate(prevProps, prevState){
    //reset scroll area in sidebar and betting widget upon route change when they are being reused.
    this.refs.sidebar.scrollTop = 0;
    Ps.update(this.refs.sidebar);
    this.refs.main.scrollTop = 0;
    Ps.update(this.refs.main);

    /*
     * navigate to new route after clicking confirm button in confirmation modal.
     */
    if (prevState.confirmToLeave === false && this.state.confirmToLeave === true){
      this.props.navigateTo(this.state.nextLocation);
      this.setState({
        confirmToLeave: false
      })
    }
  }

  /**
   * The #componentWillReceiveProps function is overriden here in order to update the routeLeaveHook upon route change.
   *
   * Normally setRouteLeaveHook is placed in componentDidMount yet Exchange component is being reused when new route is triggered by sidebar.
   * So we need to call setRouteLeaveHook for every change in routes and router props.
   */
  componentWillReceiveProps(nextProps) {
    const { router, routes } = nextProps;

    // second last item in routes in nextProps  is equivalant to last item in routes in currentProps
    const currentRoute = routes[nextProps.routes.length - 1];
    router.setRouteLeaveHook(currentRoute, this.routerWillLeave.bind(this));
  }

  setModalVisible(modalVisible) {
    this.setState({
      unplacedBetModalVisible: modalVisible
    });
  }

  /**
   * function being called just before leaving current page.
   * Situations could be
   *   - leaving without unconfirmed bets.
   *   - leaving after clicking confirm button in modal when there is unconfirmed bets.
   *
   * It attempts to reset the state as well as UI the current screen.
   * I.e. clear all the unconfirmed bets stored in state and resetting modal visibliity / overlay effect.
   */
  handleLeave(){
    const transitionName = this.props.location.pathname.split("/");
    if (transitionName.length < 3 || transitionName[2].toLowerCase() !== 'bettingmarketgroup') {
      this.props.clearQuickBetDrawer();
      this.props.clearQuickBetsOverlay();
    } else {
      this.props.clearMarketDrawerBetslips();
      this.props.clearMarketBetsOverlay();
    }
    this.setModalVisible(false);
    this.setState({
      confirmToLeave: true
    });
  }

  /**
   * function being called when user 'attempt' to navigate to new page
   * return true to follow the new route
   * return false to block the new route
   *
   * When there exists unplaced bets, confrimation modal will be shown and new route will be temporiaily blocked.
   * New route will be stored in state, so router can follow the new route after user confirm to leave current route with unplaced bets.
   *
   * @param {string} nextLocation - the route location user attempt to navigate to
   */
  routerWillLeave(nextLocation){

    this.setState({
      nextLocation: nextLocation
    })

    if (!this.state.confirmToLeave && this.props.hasUnplacedBets){
      this.setModalVisible(true);
      return false;
    } else {
      // DO NOT remove
      // We still need to gracefully "leave" the page and reset the drawer
      this.handleLeave();
      // Notify Search Menu(i.e. react-select) to remove focus
      this.props.onRouteChange();

      return true;
    }

  }

  render() {

    const sidebarWidth = 220;
    const betslipWidth = 360;

    let transitionName = this.props.location.pathname.split("/");
    const splitPaneStyle = {
      'top':'0px',
      'position': 'fixed'
    };

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
        return ( <QuickBetDrawer currencyFormat={ this.props.currencyFormat }/> );
      }

      return ( <MarketDrawer currencyFormat={ this.props.currencyFormat }/> );
    }

    return (
    <div>
      <SplitPane
          style={ splitPaneStyle }
          split='vertical'
          allowResize={ false }
          minSize={ sidebarWidth } defaultSize={ sidebarWidth }>
            <div className='sidebar-main' ref='sidebar'>
              <SideBar
                 level={ transitionName.length }
                 objectId={ transitionName[transitionName.length -1] }/>
            </div>
            <SplitPane
                split='vertical'
                allowResize={ false }
                minSize={ betslipWidth } defaultSize={ betslipWidth }
                primary='second'>
                  <div className='scrollbar-style-main'
                    ref='main'>
                     {React.cloneElement(this.props.children, {
                       currencyFormat: this.props.currencyFormat
                     })}
                  </div>
                  { selectBettingDrawer(transitionName) }
            </SplitPane>
       </SplitPane>
       { unplacedBetModal }
     </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {

  const account = state.get('account');
  const accountId = account.getIn(['account','id']);
  const setting = state.getIn(['setting', 'settingByAccountId', accountId]) || state.getIn(['setting', 'defaultSetting'])

  const currencyFormat = setting.get('currencyFormat');
  // Determine which betting drawer we should check
  let path = ['marketDrawer', 'unconfirmedBets'];
  const transitionName = ownProps.location.pathname.split("/");
  if (transitionName.length < 3 || transitionName[2].toLowerCase() !== 'bettingmarketgroup') {
    path = ['quickBetDrawer', 'bets'];
  }

  return {
    hasUnplacedBets: !state.getIn(path).isEmpty(),
    currencyFormat
  };
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
    clearQuickBetDrawer: QuickBetDrawerActions.deleteAllBets,
    clearQuickBetsOverlay: QuickBetDrawerActions.hideOverlay,
    clearMarketDrawerBetslips: MarketDrawerActions.deleteAllUnconfirmedBets,
    clearMarketBetsOverlay: MarketDrawerActions.hideOverlay,
  }, dispatch);
}


export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Exchange));
