import React from 'react';

const renderClockColumn = (number, label) => {
  let digits = (number > 9 ? number.toString() : '0' + number.toString());
  return (
    <div className='column'>
      <div className='digits'>
        <span className='digit'>{ digits[0] }</span>
        <span className='digit'>{ digits[1] }</span>
      </div>
      <div className='label'>{ label }</div>
    </div>
  );
}

const BettingMarketGroupBanner = () => (
  <div className='betting-market-group-banner'>
    <div className='event'>
      <div className='time'>Pre-Live! Starts on 10/01/2017 13:00</div>
      <div className='name'>NY GIANTS VS GREEN DAY</div>
    </div>
    <div className='countdown'>
      <div className='time-remaining'>Time Remaining</div>
      <div className='clock'>
        { renderClockColumn(1, 'DAYS') }
        { renderClockColumn(12, 'HOURS') }
        { renderClockColumn(0, 'MINS') }
        { renderClockColumn(0, 'SECS') }
      </div>
    </div>
  </div>
)

export default BettingMarketGroupBanner;
