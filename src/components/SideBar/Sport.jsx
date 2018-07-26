import React, {PureComponent} from 'react';
import './Sport.less';

class Sport extends PureComponent {
  render() {
    const {id, onClick, data, name} = this.props;

    let appliedStateClass = '';

    // Set classes to be able to properly style the different states.
    if (data.isSelected) {
      appliedStateClass = '-selected';
    } else if (data.isOpen) {
      appliedStateClass = '-open';
    }

    return (
      <div className='sport-node-container' key={ id } onClick={ onClick }>
        <div className={ `sport-label-container${appliedStateClass}` }>
          <label>{name}</label>
        </div>
      </div>
    );
  }
}

export default Sport;
