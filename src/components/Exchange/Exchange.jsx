import React, { Component } from 'react';
import ReactDOM from "react-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import SplitPane from 'react-split-pane';
import BetSlip from '../BetSlip';
import SideBar from '../SideBar';
import { SidebarActions } from '../../actions';

import Ps from 'perfect-scrollbar';

class Exchange extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
    this.updatePs = this.updatePs.bind(this);
  }

  componentDidMount() {
    Ps.initialize(ReactDOM.findDOMNode(this.refs.betslips));
    Ps.initialize(ReactDOM.findDOMNode(this.refs.sidebar));
    Ps.initialize(ReactDOM.findDOMNode(this.refs.middlepanel));

    //NOTE to be fine tune later for not to call api everytime,
    // we could fine tune when we could SUBSCRIBE change in
    // sport / eventgp / event / betting mkg gp
    const { getDataForSidebar } = this.props
    getDataForSidebar();
  }

  componentDidUpdate() {
    Ps.update(ReactDOM.findDOMNode(this.refs.betslips));
    Ps.update(ReactDOM.findDOMNode(this.refs.sidebar));
    Ps.update(ReactDOM.findDOMNode(this.refs.middlepanel));
  }


  updatePs(){
    Ps.update(this.refs.betslips);
  }



  render() {
     //setting width of sider as 200
     //primary = second , defaultSize =  400 = setting betslip width as 400
     // remove css of splitpane in Exchange.less to disable resizing

    const styleLeftPane = { background: '#1563A0' };
    const sidebarWidth = 200;
    const betslipWidth = 400;
    const splitPaneStyle = {
      'top':'0px',
      'paddingTop':'64px', //due to top bar
      'position': 'fixed'
    };

    let transitionName = this.props.location.pathname.split("/");

    return (
      <SplitPane
          style={ splitPaneStyle }
          split='vertical'
          minSize={ sidebarWidth } defaultSize={ sidebarWidth }
          pane1Style={ styleLeftPane }>
            <div style={ { 'height' : '100%', 'position' : 'relative' } }
              ref='sidebar'>
              { transitionName.length === 4 ?
                 <SideBar
                   completeTree={ this.props.completeTree }
                   level={ transitionName.length }
                   objectId={ transitionName[3] }/>  :
                   (

                     transitionName.length === 3 ?
                        <SideBar
                          completeTree={ this.props.completeTree }
                          level={ transitionName.length }
                          objectId={ transitionName[2] }/>  :
                         <SideBar
                         completeTree={ this.props.completeTree }
                         level={ transitionName.length }
                         objectId={ '' }/>

                   )
               }
            </div>
        <SplitPane
            split='vertical'
            minSize={ betslipWidth } defaultSize={ betslipWidth }
            primary='second'>
              <div style={ { 'height' : '100%', 'position' : 'relative' } }
                ref='middlepanel'>
                { this.props.children }
              </div>
              <div style={ { 'height' : '100%', 'position' : 'relative' } }
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
    getDataForSidebar : SidebarActions.getData,

  }, dispatch)
}


Exchange.propTypes = {
  completeTree: React.PropTypes.array.isRequired,
};
export default connect(mapStateToProps, mapDispatchToProps)(Exchange);