import React, { PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
import BannerClock from '../BannerClock';
import PropTypes from 'prop-types';
import banner1 from '../../../assets/images/market_banner_1.png';
import banner2 from '../../../assets/images/market_banner_2.png';
import banner3 from '../../../assets/images/market_banner_3.png';
import moment from 'moment';

const bannerUrls = [banner1, banner2, banner3];
const generateBannerUrl = () => {
  const indexOfBannerToBeUsed = Math.floor((Math.random() * bannerUrls.length));
  return bannerUrls[indexOfBannerToBeUsed];
}

class BettingMarketGroupBanner extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      bannerUrl: generateBannerUrl()
    }
  }
  render() {
    const bannerSource = `url(${this.state.bannerUrl})`;
    const formattedEventTime = moment(this.props.eventTime).format('DD/MM/YYYY');
    return (
      <div className='betting-market-group-banner' style={ { backgroundImage: bannerSource } }>
        <div className='event'>
          <div className='time'>{ I18n.t('bettingMarketGroup.match_start_on', { time: formattedEventTime }) }</div>
          <div className='name'>{ this.props.eventName }</div>
        </div>
        <div className='countdown'>
          <BannerClock time={ this.props.eventTime }/>
        </div>
      </div>
    )
  }
}


BettingMarketGroupBanner.propTypes = {
  eventTime: PropTypes.instanceOf(Date).isRequired,
  eventName: PropTypes.string.isRequired
}

export default BettingMarketGroupBanner;
