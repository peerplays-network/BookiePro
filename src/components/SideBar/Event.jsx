import React, { Component } from 'react';
import { EventNameUtils } from '../../utility';
import './Event.less';

class Event extends Component {
  render() {
    const { id, onClick, data, name } = this.props;
    return (
      <div className='event-node-container' key={ id } onClick={ onClick  }>
        <div className={ `event-label-container${data.isSelected ? '-selected' : ''}` }>
          <label>{ EventNameUtils.breakAtVs(name) }</label>
        </div>
      </div>
    );
  }
}

export default Event;
