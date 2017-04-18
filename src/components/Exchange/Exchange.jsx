import React, { Component } from 'react';
import ReactDOM from "react-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import SplitPane from 'react-split-pane';
import SideBar from '../SideBar';
import { QuickBetDrawer, MarketDrawer } from '../BettingDrawers';
import { NavigateActions } from '../../actions';
import Immutable from 'immutable';
import UnplacedBetModal from '../Modal/UnplacedBetModal';

import Ps from 'perfect-scrollbar';

class Exchange extends Component {

  constructor(props) {
    super(props);
    this.state = {
      //////// dummy buttons for routing hooking BEGINS //////////
      hasUnplacedBet: false,
      //////// dummy buttons for routing hooking ENDS //////////

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

  //////// dummy buttons for routing hooking BEGINS //////////
  updateUnplacedBetStatus(value){
    this.setState({
      hasUnplacedBet: value,
    })
  }
  //////// dummy buttons for routing hooking ENDS //////////

  setModalVisible(modalVisible) {
    this.setState({
      unplacedBetModalVisible: modalVisible
    });
  }

  handleLeave(){
    this.setModalVisible(false)
    this.setState({
      hasUnplacedBet: false,
      confirmToLeave: true
    });
  }

  routerWillLeave(nextLocation){

    this.setState({
      nextLocation: nextLocation
    })

    if (!this.state.confirmToLeave && this.state.hasUnplacedBet){
      this.setModalVisible(true);
      return false;
    } else {
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
    //NOTE////// updateUnplacedBetStatus is used for dummy buttons //////////
    let selectBettingDrawer = (pathTokens) => {
      if (pathTokens.length < 3 || pathTokens[2].toLowerCase() !== 'bettingmarketgroup') {
        return ( <QuickBetDrawer updateUnplacedBetStatus={ this.updateUnplacedBetStatus.bind(this) } bettingStatus={ this.state.hasUnplacedBet } /> );
      }

      return ( <MarketDrawer updateUnplacedBetStatus={ this.updateUnplacedBetStatus.bind(this) } bettingStatus={ this.state.hasUnplacedBet } /> );
    }

    return (
    <div>
      <SplitPane
          style={ splitPaneStyle }
          split='vertical'
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
                minSize={ betslipWidth } defaultSize={ betslipWidth }
                primary='second'>
                  <div style={ { 'height' : '100%', 'position' : 'relative' } }
                    ref='main'>
                    { this.props.children }
                  </div>
                  { selectBettingDrawer(transitionName) }
            </SplitPane>
       </SplitPane>
       { unplacedBetModal }
     </div>
    );
  }
}

const mapStateToProps = (state) => {
  const sidebar = state.get('sidebar');
  return {
    completeTree: sidebar.get('complete_tree'),
  };
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
  }, dispatch);
}

Exchange.propTypes = {
  completeTree: React.PropTypes.instanceOf(Immutable.List),
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Exchange));
