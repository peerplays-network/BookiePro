import React from 'react';
import BetSlip from '../../BetSlip';

const MarketDrawer = () => (
  <div id='market-drawer'>
    <div className='title'>Market Drawer</div>
    <div className='content'>
      <BetSlip />
      <BetSlip />
      <BetSlip />
    </div>
  </div>
);

export default MarketDrawer;
