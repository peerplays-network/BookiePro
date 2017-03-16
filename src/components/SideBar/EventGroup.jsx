import React from 'react';
import './EventGroup.less';

const EventGroup = React.createClass({
  render() {
    return (
      <div className='eventgroup-node-container'
        key={ this.props.id }
        onClick={ this.props.onClick  } >
        { this.props.data.isSelected ?
          <div className='eventgroup-label-container-selected'>
            <label> { this.props.name } </label>
          </div>
          :
          <div className='eventgroup-label-container'>
            <label> { this.props.name } </label>
          </div>
         }
      </div>
    );
  }
});

export default EventGroup;
