import React, { PureComponent } from 'react';
import { EventNameUtils } from '../../utility';
import './Event.less';

class Event extends PureComponent {
  render() {
    const { id, onClick, data, name } = this.props;
    return (

      data.isLiveMarket ?
        <div className='event-node-container-live' key={ id } onClick={ onClick  }>
          <i className='live-icon'></i>
          <div className={ `event-label-container${data.isSelected ? '-selected' : ''}` }>
            <label>{ EventNameUtils.breakAtVs(name) }</label>
          </div>
        </div>
        :
        <div className='event-node-container' key={ id } onClick={ onClick  }>
          <div className={ `event-label-container${data.isSelected ? '-selected' : ''}` }>
            <label>{ EventNameUtils.breakAtVs(name) }</label>
          </div>
        </div>

    );
  }
}

export default Event;
