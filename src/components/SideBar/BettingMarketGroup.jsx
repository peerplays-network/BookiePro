import React, { PureComponent } from 'react';
import './BettingMarketGroup.less';

class BettingMarketGroup extends PureComponent {
  render() {
    const { id, onClick, data, name } = this.props;
    return (
      <div className='betting-market-node-container' key={ id } onClick={ onClick }>
        <div className={ `betting-market-label-container${data.isSelected ? '-selected' : ''}` }>
          <label>{ name }</label>
        </div>
      </div>
    );
  }
}

export default BettingMarketGroup;
