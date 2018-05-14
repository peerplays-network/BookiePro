import React, { PureComponent } from 'react';
import { EventNameUtils, DateUtils } from '../../utility';
import './Event.less';

class Event extends PureComponent {
  render() {
    const { id, onClick, data, name } = this.props;

    let date = DateUtils.getMonthAndDay(data.start_time);

        
    let appliedStateClass = '';

    // Set classes to be able to properly style the different states.
    if (data.isSelected) {
      appliedStateClass = '-selected';
    } else if (data.isOpen) {
      appliedStateClass = '-open';
    }

    return (
      <div>
        { data.start_time && <label className='event-date-header'>{ date }</label> }
        { data.isLiveMarket ?
        <div className='event-node-container-live' key={ id } onClick={ onClick  }>
          <i className='live-icon'></i>
          <div className={ `event-label-container${appliedStateClass}` }>
            <label>{ EventNameUtils.breakAtVs(name) }</label>
          </div>
          </div>
        :
        <div className='event-node-container' key={ id } onClick={ onClick  }>
          <div className={ `event-label-container${appliedStateClass}` }>
            <label>{ EventNameUtils.breakAtVs(name) }</label>
          </div>
        </div> }
      </div>

    );
  }
}

export default Event;
