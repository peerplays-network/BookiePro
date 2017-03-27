import React, { Component } from 'react';
import { Icon } from 'antd';

import BetSlipTable from './BetSlipTable';

class BetSlip extends Component {
  static deleteAllPanels(event) {
    event.preventDefault();
    // this stops the event from bubbling up to the Collapse header
    event.stopPropagation();
    window.console.log('clicked delete all panels', event);
  }

  // TODO: The DeleteAll button should be moved to the drawer header later
  render() {
    return (
      <div className='betslip-wrapper'>
        <div className='header'>
          <span className='title'>CLEMON VS ALABAMA</span>
          <span className='icon'>
            <Icon
              type='close-circle'
              onClick={ BetSlip.deleteAllPanels }
            />
          </span>
        </div>
        <BetSlipTable />
      </div>
    );
  }
}

export default BetSlip;
