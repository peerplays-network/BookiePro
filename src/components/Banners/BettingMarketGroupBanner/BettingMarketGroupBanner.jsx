import React from 'react';
import { I18n } from 'react-redux-i18n';
import BannerClock from '../BannerClock';
import PropTypes from 'prop-types';


const BettingMarketGroupBanner = (props) => {
  return (
    <div className='betting-market-group-banner'>
      <div className='event'>
        <div className='time'>{ I18n.t('bettingMarketGroup.match_start_on') }</div>
        <div className='name'>{ props.eventName }</div>
      </div>
      <div className='countdown'>
        <BannerClock time={ props.eventTime }/>
      </div>
    </div>
  )
};

BettingMarketGroupBanner.propTypes = {
  eventTime: PropTypes.instanceOf(Date).isRequired,
  eventName: PropTypes.string.isRequired
}

export default BettingMarketGroupBanner;
