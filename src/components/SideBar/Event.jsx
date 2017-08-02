import React, { PureComponent } from 'react';
import { EventNameUtils } from '../../utility';
import './Event.less';

class Event extends PureComponent {
  render() {
    const { id, onClick, data, name } = this.props;
    return (
      <div className='event-node-container' key={ id } onClick={ onClick  }>
        <div className={ `event-label-container${data.isSelected ? '-selected' : ''}` }>
          <label>{ EventNameUtils.breakAtVs(name) }</label>
          {
            data.isLiveMarket &&
            <span className='badge' />
          }
        </div>
      </div>
    );
  }
}

export default Event;
