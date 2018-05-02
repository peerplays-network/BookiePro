import React, { PureComponent } from 'react';
import './EventGroup.less';

class EventGroup extends PureComponent {
  render() {
    const { id, onClick, data, name } = this.props;
    
    let appliedStateClass = '';

    // Set classes to be able to properly style the different states.
    if (data.isSelected) {
      appliedStateClass = '-selected';
    } else if (data.isOpen) {
      appliedStateClass = '-open';
    }

    return (
      <div className='eventgroup-node-container' key={ id } onClick={ onClick  }>
        <div className={ `eventgroup-label-container${appliedStateClass}` }>
          <label>{ name }</label>
        </div>
      </div>
    );
  }
}

export default EventGroup;
