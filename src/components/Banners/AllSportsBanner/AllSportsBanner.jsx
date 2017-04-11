import React from 'react';
var I18n = require('react-redux-i18n').I18n;

const Banner = () => (
  <div className='all-sports-banner'>
    <div className='statistics'>
      <div className='flip-amount'>
        <div className='digit'>
          <span className='front'>1</span>
          <span className='back'>1</span>
        </div>
        <div className='digit'>
          <span className='front'>1</span>
          <span className='back'>1</span>
        </div>
        <div className='digit-delimiter'>.</div>
        <div className='digit'>
          <span className='front'>0</span>
          <span className='back'>0</span>
        </div>
        <div className='digit'>
          <span className='front'>0</span>
          <span className='back'>0</span>
        </div>
      </div>
      <div className='text'>
        <span className='text'>
          { I18n.t('homepage.bannerText') }
        </span>
      </div>
    </div>
  </div>
)

export default Banner;
