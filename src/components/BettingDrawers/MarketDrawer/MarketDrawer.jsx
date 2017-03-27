import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Ps from 'perfect-scrollbar';
import BetSlip from '../../BetSlip';
import { Button } from 'antd';

class MarketDrawer extends Component {
  componentDidMount() {
    Ps.initialize(ReactDOM.findDOMNode(this.refs.drawer));
  }

  componentDidUpdate() {
    Ps.update(ReactDOM.findDOMNode(this.refs.drawer));
  }

  render() {
    return (
      <div id='market-drawer' ref='drawer'>
        <div className='title'>
          <div className='label'>Market Drawer</div>
        </div>
        <div className='content'>
          <BetSlip />
          <BetSlip />
          <BetSlip />
        </div>
        <div className='footer'>
          <Button className='place-bet'>PLACE BET $0.295</Button>
        </div>
      </div>
    );
  }
}


export default MarketDrawer;
