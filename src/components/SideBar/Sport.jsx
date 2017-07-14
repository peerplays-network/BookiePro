import React, { PureComponent } from 'react';
import './Sport.less';

class Sport extends PureComponent {
  render() {
    const { id, onClick, data, name } = this.props;
    return (
      <div className='sport-node-container' key={ id } onClick={ onClick  }>
        <div className={ `sport-label-container${data.isSelected ? '-selected' : ''}` }>
          <label>{ name }</label>
        </div>
      </div>
    );
  }
}

export default Sport;
