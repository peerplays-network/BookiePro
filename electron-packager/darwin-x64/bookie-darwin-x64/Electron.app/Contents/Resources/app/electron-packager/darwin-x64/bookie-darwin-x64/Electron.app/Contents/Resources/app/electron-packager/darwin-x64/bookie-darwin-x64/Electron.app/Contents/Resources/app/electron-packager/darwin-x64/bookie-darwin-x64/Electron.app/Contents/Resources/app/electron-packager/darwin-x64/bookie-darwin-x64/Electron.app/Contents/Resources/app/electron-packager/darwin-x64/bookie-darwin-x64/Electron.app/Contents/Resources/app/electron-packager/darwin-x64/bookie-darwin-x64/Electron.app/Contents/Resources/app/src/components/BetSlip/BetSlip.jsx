import React, { Component } from 'react';
import { Collapse, Icon } from 'antd';

import BetSlipTable from './BetSlipTable';

const Panel = Collapse.Panel;

class BetSlip extends Component {
  static callback(key) {
    window.console.log('callcack', key);
  }

  static deleteAllPanels(event) {
    event.preventDefault();
    // this stops the event from bubbling up to the Collapse header
    event.stopPropagation();
    window.console.log('clicked delete all panels', event);
  }

  render() {
    return (
      <Collapse className='betslip-wrapper' onChange={ BetSlip.callback }>
        <Panel
          className='betslip-panel'
          header={
            <span>
              <span>BETSLIP</span>
              <span style={ { float: 'right', marginRight: '5px' } }>
                <Icon
                  type='close-circle'
                  onClick={ BetSlip.deleteAllPanels }
                />
              </span>
            </span>
          }
          key='betslip'
        >
          <BetSlipTable />
        </Panel>
      </Collapse>
    );
  }
}

export default BetSlip;
