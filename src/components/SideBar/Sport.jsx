import React, { Component } from 'react';
import './Sport.less';

class Sport extends Component {
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
