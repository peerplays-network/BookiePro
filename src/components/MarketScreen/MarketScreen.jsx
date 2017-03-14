import React, { Component } from 'react';
import BetSlip from '../BetSlip';
import Banner from './Banner';
import MarketTable from '../MarketTable';
import SplitPane from 'react-split-pane'
import TestNewSideBar from '../TestNewSideBar';

// import ps from "perfect-scrollbar";
// import "perfect-scrollbar";
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

    return (
      <SplitPane
          split='vertical'
          minSize={ 200 } defaultSize={ 200 }
          pane1Style={ styleLeftPane }>
            <div style={ { 'height' : '100%', 'overflow' : 'hidden' } }
              ref='sidebar'>
              <TestNewSideBar/>

            </div>
        <SplitPane
            split='vertical'
            minSize={ 400 } defaultSize={ 400 }
            primary='second'>
              <div >
                { this.props.children }
               {/* <Banner />
               <MarketTable /> */}
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
// const MarketScreen = () => (
//   <div id='home-wrapper'>
//     <div className='left-content'>
//       <Banner />
//       <MarketTable />
//     </div>
//     <div className='right-content'>
//       <BetSlip />
//       <BetSlip />
//       <BetSlip />
//     </div>
//   </div>
// );

export default MarketScreen;
