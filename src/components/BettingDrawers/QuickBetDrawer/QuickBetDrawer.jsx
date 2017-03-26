import React from 'react';
import BetSlip from '../../BetSlip';

const QuickBetDrawer = () => (
  <div id='quick-bet-drawer'>
    <div className='title'>Quick Bet Drawer</div>
    <div className='content'>
      <BetSlip />
      <BetSlip />
      <BetSlip />
    </div>
  </div>
);

export default QuickBetDrawer;
