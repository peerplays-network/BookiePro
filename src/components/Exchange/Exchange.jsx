import React, { Component } from 'react';
import ReactDOM from "react-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import SplitPane from 'react-split-pane';
import SideBar from '../SideBar';
import { QuickBetDrawer, MarketDrawer } from '../BettingDrawers';
import { QuickBetDrawerActions, MarketDrawerActions, NavigateActions } from '../../actions';
import UnplacedBetModal from '../Modal/UnplacedBetModal';
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
      // Notify Search Menu(i.e. react-select) to remove focus
      this.props.onRouteChange();

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
          minSize={ sidebarWidth } defaultSize={ sidebarWidth }
          pane1Style={ styleLeftPane }>
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
    cancelQuickBets: QuickBetDrawerActions.cancelPlaceBet,
    clearMarketDrawerBetslips: MarketDrawerActions.deleteAllUnconfirmedBets,
  }, dispatch);
}


export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Exchange));
