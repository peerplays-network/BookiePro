import React from 'react';
var I18n = require('react-redux-i18n').I18n;

const Banner = () => (
  <div className='all-sports-banner'>
    <div className='statistics'>
      <div className='float-right'>
        <div className='bitcoin-icon-main'>
          <i className='icon-bitcoin-white'></i>
        </div>
        <div className='flip-amount'>
          <div className='digit'>
            <span className='top-half'>1</span>
            <span className='bottom-half'>1</span>
          </div>
          <div className='digit'>
            <span className='top-half'>1</span>
            <span className='bottom-half'>1</span>
          </div>
          <div className='digit-delimiter'>.</div>
          <div className='digit'>
            <span className='top-half'>0</span>
            <span className='bottom-half'>0</span>
          </div>
          <div className='digit'>
            <span className='top-half'>0</span>
            <span className='bottom-half'>0</span>
          </div>
        </div>
      </div>
      <div className='text'>
        <span className='text'>
          { I18n.t('AllSports.bannerText') }
        </span>
      </div>
    </div>
  </div>
)

export default Banner;
