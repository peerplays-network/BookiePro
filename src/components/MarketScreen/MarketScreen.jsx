import React, { Component } from 'react';
import BetSlip from '../BetSlip';
import SplitPane from 'react-split-pane'
import SideBar from '../SideBar';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
var Ps = require('perfect-scrollbar');

class MarketScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
    this.updatePs = this.updatePs.bind(this);
  }

  componentDidMount() {
    Ps.initialize(this.refs.betslips);
    Ps.initialize(this.refs.sidebar);
  }

  updatePs(){
    Ps.update(this.refs.betslips);
  }



  render() {
     //setting width of sider as 200
     //primary = second , defaultSize =  400 = setting betslip width as 400
     // remove css of splitpane in MarketScreen.less to disable resizing

     //TODO Banner not yet fixed
     //TODO perfect-scrollbar make doubled height when scrollbar is needed, to be fixed

    const styleLeftPane = { background: '#1563A0' };
    const sidebarWidth = 200;
    const betslipWidth = 400;

    let transitionName = this.props.location.pathname.split("/");

    return (
      <SplitPane
          split='vertical'
          minSize={ sidebarWidth } defaultSize={ sidebarWidth }
          pane1Style={ styleLeftPane }>
            <div style={ { 'height' : '100%', 'overflow' : 'hidden' } }
              ref='sidebar'>
              { transitionName.length === 4 ?
                 <SideBar
                   completeTree={ this.props.completeTree }
                   objectId={ transitionName[3] }/>  :
                   (

                     transitionName.length === 3 ?
                        <SideBar
                          completeTree={ this.props.completeTree }
                          objectId={ transitionName[2] }/>  :
                         <SideBar
                         completeTree={ this.props.completeTree }
                         objectId={ '0' }/>

                   )
               }
            </div>
        <SplitPane
            split='vertical'
            minSize={ betslipWidth } defaultSize={ betslipWidth }
            primary='second'>
              <div >
                { this.props.children }
              </div>
              <div style={ { 'height' : '100%', 'overflow' : 'hidden', 'position' : 'relative' } }
                ref='betslips'>
                <BetSlip onClick={ () => { this.updatePs(); } } />
                <BetSlip onClick={ () => { this.updatePs(); } }/>
                <BetSlip onClick={ () => { this.updatePs(); } }/>
              </div>
        </SplitPane>

       </SplitPane>
    );
  }
}
const mapStateToProps = (state) => {
  const { sidebar } = state;
  return {
    completeTree: sidebar.complete_tree,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
  }, dispatch)
}


MarketScreen.propTypes = {
  completeTree: React.PropTypes.array.isRequired,
  tree: React.PropTypes.array,
};
export default connect(mapStateToProps, mapDispatchToProps)(MarketScreen);
