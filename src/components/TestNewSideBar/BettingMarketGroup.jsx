import React from 'react';
import './BettingMarketGroup.less';

//BettingMarket Object (1.E.x)
//A betting market is a market where bettors can bet on a single specific outcome for an event
const BettingMarketGroup = React.createClass({
  render() {
    return (
      <div className='betting-market-node-container'
        key={ this.props.id }
        onClick={ this.props.onClick  } >
        { this.props.data.isSelected ?
          <div className='betting-market-label-container-selected'>
            <label> { this.props.name } </label>
          </div>
          :
          <div className='betting-market-label-container'>
            <label> { this.props.name } </label>
          </div>
         }
      </div>
    );
  }
});

export default BettingMarketGroup;
