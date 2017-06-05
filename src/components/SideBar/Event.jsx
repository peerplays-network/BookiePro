import React, { Component } from 'react';
import './Event.less';

const formatName = (name) => {
  let formatted = (<span>{ name }</span>);
  // REVIEW Ensure this is the actual agreed format
  if (name.includes('vs')) {
    const index = name.indexOf('vs');
    formatted = (<span>{ name.substring(0, index+3) }<br/>{ name.substring(index+3) }</span>);
  }
  return formatted;
}

class Event extends Component {
  render() {
    const { id, onClick, data, name } = this.props;
    return (
      <div className='event-node-container' key={ id } onClick={ onClick  }>
        <div className={ `event-label-container${data.isSelected ? '-selected' : ''}` }>
          <label>{ formatName(name) }</label>
        </div>
      </div>
    );
  }
}

export default Event;
