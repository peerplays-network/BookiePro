import React, { Component } from 'react';
import { BettingMarketBanner } from '../Banners';
import SimpleBettingWidget from '../SimpleBettingWidget';

class BettingMarket extends Component {
  render() {
    return (
      <div className='betting-market-wrapper'>
        <BettingMarketBanner />
        <SimpleBettingWidget
          title='Betting Market Title'
          events={ [] }
        />
      </div>
    )
  }
}

export default BettingMarket;
