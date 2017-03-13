import React, { Component } from 'react';
import BetSlip from '../BetSlip';
import Banner from './Banner';
import MarketTable from '../MarketTable';
import SplitPane from 'react-split-pane'
import TestNewSideBar from '../TestNewSideBar';


class MarketScreen extends Component {


  render() {
     //setting width of sider as 200
     //primary second + 200 = setting betslip width as 400 

    return (
      <SplitPane split='vertical' minSize={ 200 } defaultSize={ 200 }>
        <TestNewSideBar/>
          <SplitPane split='vertical' defaultSize={ 400 } primary='second'>
                  <div >
                   <Banner />
                   <MarketTable />
                  </div>
                  <div>
                    <BetSlip />
                    <BetSlip />
                    <BetSlip />
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
