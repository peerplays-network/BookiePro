import React, { Component } from 'react';
import { BettingMarketGroupBanner } from '../Banners';
import SimpleBettingWidget from '../SimpleBettingWidget';

class BettingMarketGroup extends Component {
  render() {
    return (
      <div className='betting-market-group-wrapper'>
        <BettingMarketGroupBanner />
        <SimpleBettingWidget
          title='Betting Market Title'
          events={ [] }
        />
      </div>
    )
  }
}

export default BettingMarketGroup;
