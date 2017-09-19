import React, { PureComponent } from 'react';
import { EventNameUtils, DateUtils } from '../../utility';
import './Event.less';

class Event extends PureComponent {
  render() {
    const { id, onClick, data, name } = this.props;

    let date = DateUtils.getMonthAndDay(data.start_time);
    return (
      <div>
        <label className='event-date-header'>{ date }</label>        
        <div className='event-node-container' key={ id } onClick={ onClick  }>
          <div className={ `event-label-container${data.isSelected ? '-selected' : ''}` }>
            <label>{ EventNameUtils.breakAtVs(name) }</label>
            {
              data.isLiveMarket &&
              <span className='badge' />
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Event;
