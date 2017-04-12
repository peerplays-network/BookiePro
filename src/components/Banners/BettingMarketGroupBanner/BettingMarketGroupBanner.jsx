import React from 'react';
import { I18n } from 'react-redux-i18n';

const renderClockColumn = (number, label) => {
  let digits = (number > 9 ? number.toString() : '0' + number.toString());
  return (
    <div className='column'>
      <div className='digit'>
        <span className='top-half'>{ digits[0] }</span>
        <span className='bottom-half'>{ digits[0] }</span>
      </div>
      <div className='digit'>
        <span className='top-half'>{ digits[1] }</span>
        <span className='bottom-half'>{ digits[1] }</span>
      </div>
      <div className='label'>{ label }</div>
    </div>
  );
}

const BettingMarketGroupBanner = (props) => (
  <div className='betting-market-group-banner'>
    <div className='event'>
      <div className='time'>{ I18n.t('bettingMarketGroup.match_start_on') }</div>
      <div className='name'>{ props.eventName }</div>
    </div>
    <div className='countdown'>
      <div className='time-remaining'>{ I18n.t('bettingMarketGroup.time_remaining') }</div>
      <div className='clock'>
        { renderClockColumn(1, I18n.t('bettingMarketGroup.days')) }
        { renderClockColumn(12, I18n.t('bettingMarketGroup.hours')) }
        { renderClockColumn(0, I18n.t('bettingMarketGroup.mins')) }
        { renderClockColumn(0, I18n.t('bettingMarketGroup.secs')) }
      </div>
    </div>
  </div>
)

export default BettingMarketGroupBanner;
