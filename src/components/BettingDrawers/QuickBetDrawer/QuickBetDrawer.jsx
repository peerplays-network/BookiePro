import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Ps from 'perfect-scrollbar';
import EditableBetTable from '../EditableBetTable';
import { Button } from 'antd';

class QuickBetDrawer extends Component {
  componentDidMount() {
    Ps.initialize(ReactDOM.findDOMNode(this.refs.drawer));
  }

  componentDidUpdate() {
    Ps.update(ReactDOM.findDOMNode(this.refs.drawer));
  }

  render() {
    return (
      <div id='quick-bet-drawer' ref='drawer'>
        <div className='title'>
          <div className='label'>BETSLIP</div>
        </div>
        <div className='content'>
          <EditableBetTable />
          <EditableBetTable />
          <EditableBetTable />
        </div>
        <div className='footer'>
          <Button className='place-bet'>PLACE BET $0.295</Button>
        </div>
      </div>
    );
  }
}


export default QuickBetDrawer;
