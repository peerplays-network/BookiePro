import React from 'react';

const Banner = () => (
  <div className='betting-market-banner'>
    <div className='event'>
      <div className='time'>Pre-Live! Starts on 10/01/2017 13:00</div>
      <div className='name'>NY GIANTS VS GREEN DAY</div>
    </div>
    <div className='countdown'>
      <div className='time-remaining'>Time Remaining</div>
      <div className='clock'>
        <div className='column'>
          <div className='digits'>
            <span className='digit'>0</span>
            <span className='digit'>1</span>
          </div>
          <div className='label'>DAYS</div>
        </div>
        <div className='column'>
          <div className='digits'>
            <span className='digit'>1</span>
            <span className='digit'>2</span>
          </div>
          <div className='label'>HOURS</div>
        </div>
        <div className='column'>
          <div className='digits'>
            <span className='digit'>0</span>
            <span className='digit'>0</span>
          </div>
          <div className='label'>MINS</div>
        </div>
        <div className='column'>
          <div className='digits'>
            <span className='digit'>0</span>
            <span className='digit'>0</span>
          </div>
          <div className='label'>SECS</div>
        </div>
      </div>
    </div>
  </div>
)

export default Banner;
