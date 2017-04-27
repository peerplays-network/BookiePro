import React, { Component } from 'react';
import ReactDOM from "react-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import SplitPane from 'react-split-pane';
import SideBar from '../SideBar';
import { QuickBetDrawer, MarketDrawer } from '../BettingDrawers';
import { QuickBetDrawerActions, MarketDrawerActions, NavigateActions } from '../../actions';
import Immutable from 'immutable';
import UnplacedBetModal from '../Modal/UnplacedBetModal';
import PropTypes from 'prop-types';

import Ps from 'perfect-scrollbar';

class Exchange extends Component {

  constructor(props) {
    super(props);
    this.state = {
      confirmToLeave: false,
      unplacedBetModalVisible: false,
    }
  }

  componentDidMount() {
    Ps.initialize(ReactDOM.findDOMNode(this.refs.sidebar));
    Ps.initialize(ReactDOM.findDOMNode(this.refs.main));
  }

  componentDidUpdate(prevProps, prevState){
    Ps.update(ReactDOM.findDOMNode(this.refs.sidebar));
    Ps.update(ReactDOM.findDOMNode(this.refs.main));

    //confirming to ignore unplaced bet
    if (prevState.confirmToLeave === false && this.state.confirmToLeave === true){
      this.props.navigateTo(this.state.nextLocation);
      this.setState({
        confirmToLeave: false
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    const { router, routes } = nextProps;
    //route change from /exchange/xxxxx to /exchange/yyyyy wont trigger unmount in Exchange.jsx,
    //so setRouteLeaveHook is placed in componentWillReceiveProps instead of componentDidMount

    // hook CURRENT route leave. current route is retrieved from nextProps
    const currentRoute = routes[nextProps.routes.length - 1];
    router.setRouteLeaveHook(currentRoute, this.routerWillLeave.bind(this));
  }

  setModalVisible(modalVisible) {
    this.setState({
      unplacedBetModalVisible: modalVisible
    });
  }

  handleLeave(){
    const transitionName = this.props.location.pathname.split("/");
    if (transitionName.length < 3 || transitionName[2].toLowerCase() !== 'bettingmarketgroup') {
      // This will remove all bet slips
      this.props.clearQuickBetDrawer();
      // This has the same effect of clicking any cancel button
      // in order to hide any overlay on the betting drawer
      this.props.cancelQuickBets();
    } else {
      this.props.clearMarketDrawerBetslips();
    }
    this.setModalVisible(false);
    this.setState({
      confirmToLeave: true
    });
  }

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
      return true;
    }

  }
  //end of route hooking

  render() {
     //setting width of sider as 220
     //primary = second , defaultSize =  400 = setting betslip width as 400
     // remove css of splitpane in Exchange.less to disable resizing

    //pane width and style is required here
    //because it goes into splitpane component
    const styleLeftPane = { background: '#002440' };
    const sidebarWidth = 220;
    const betslipWidth = 400;

    let transitionName = this.props.location.pathname.split("/");
    const splitPaneStyle = {
      'top':'0px',
      'paddingTop':'64px', //due to top bar
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
        return ( <QuickBetDrawer /> );
      }

      return ( <MarketDrawer /> );
    }

    return (
    <div>
      <SplitPane
          style={ splitPaneStyle }
          split='vertical'
          allowResize={ false }
          minSize={ sidebarWidth } defaultSize={ sidebarWidth }
          pane1Style={ styleLeftPane }>
            <div style={ { 'height' : '100%', 'position' : 'relative' } }
              ref='sidebar'>
              <SideBar
                 completeTree={ this.props.completeTree }
                 level={ transitionName.length }
                 objectId={ transitionName[transitionName.length -1] }/>
            </div>
            <SplitPane
                split='vertical'
                allowResize={ false }
                minSize={ betslipWidth } defaultSize={ betslipWidth }
                primary='second'>
                  <div style={ { 'height' : '100%', 'position' : 'relative' } }
                    ref='main'>
                     {React.cloneElement(this.props.children, {
                       currencyFormat: 'mBTC'//this.props.currencyFormat
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

  const sidebar = state.get('sidebar');
  return {
    completeTree: sidebar.get('complete_tree'),
    hasUnplacedBets: !state.getIn(path).isEmpty(),
    currencyFormat
  };
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
    clearQuickBetDrawer: QuickBetDrawerActions.deleteAllBets,
    cancelQuickBets: QuickBetDrawerActions.cancelPlaceBet,
    clearMarketDrawerBetslips: MarketDrawerActions.deleteAllUnconfirmedBets,
  }, dispatch);
}

Exchange.propTypes = {
  completeTree: PropTypes.instanceOf(Immutable.List),
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Exchange));
