import React, { Component } from 'react';
import { BettingMarketGroupBanner } from '../Banners';
import SimpleBettingWidget from '../SimpleBettingWidget';
import { MarketDrawerContainer } from '../BettingDrawers';

class BettingMarketGroup extends Component {
  render() {
    return (
      <MarketDrawerContainer>
        <div className='betting-market-group-wrapper'>
          <BettingMarketGroupBanner />
          <SimpleBettingWidget
            title='Betting Market Title'
            events={ [] }
          />
        </div>
      </MarketDrawerContainer>
    )
  }
}

export default BettingMarketGroup;
