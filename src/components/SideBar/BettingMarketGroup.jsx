import React, { PureComponent } from 'react';
import './BettingMarketGroup.less';

class BettingMarketGroup extends PureComponent {
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
      <div className='betting-market-node-container' key={ id } onClick={ onClick }>
        <div className={ `betting-market-label-container${appliedStateClass}` }>
          <label>{ name }</label>
        </div>
      </div>
    );
  }
}

export default BettingMarketGroup;
