import React from 'react';
import './Event.less';

const Event = React.createClass({
  render() {
    return (
      <div className='event-node-container'
        key={ this.props.id }
        onClick={ this.props.onClick  } >
        { this.props.data.isSelected ?
          <div className='event-label-container-selected'>
            <label> { this.props.name } </label>
          </div>
          :
          <div className='event-label-container'>
            <label> { this.props.name } </label>
          </div>
         }
      </div>
    );
  }
});

export default Event;
