import React, { PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
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
    this.renderLive = this.renderLive.bind(this);
  }

  renderLive() {
    if (!this.props.isLiveMarket) {
      return;
    }
    
    return (
      <div className='live'>
        <span className='indicator' /> { 'LIVE' }
      </div>
    )
  }

  render() {
    const bannerSource = `url(${this.state.bannerUrl})`;
    const formattedEventTime = moment(this.props.eventTime).format('MMM D, YYYY - H:mma');

    // Regular expression to break out the team names
    const expr = /(.+)\s(@|VS|V){1}\s(.+)/gi;
    const parts = expr.exec(this.props.eventName);

    // default event name layout, overriden if we can parse out the two pieces.
    let eventName = 
      <div className='name'>
        { this.props.eventName }
      </div>;

    // The regex has matched.
    if (parts && parts.length === 4) {
      eventName = <div className='name'>
        <span className='team-one'>{parts[1]}</span>
        <span className='versus'>{parts[2]}</span>
        <span className='team-two'>{parts[3]}</span>
      </div>;
    }

    return (
      <div className='betting-market-group-banner' style={ { backgroundImage: bannerSource } }>
        <div className='event'>
          <div className='name'>{ this.props.eventName } </div>
          <div className='time'>{ I18n.t('bettingMarketGroup.match_start_on', { time: formattedEventTime }) }</div>
          { this.renderLive() }
          <div className='name'>  
            <span className={ this.props.eventStatus }>
            <span className='indicator'/>{I18n.t('complex_betting_widget.' + this.props.eventStatusClassName)}</span> 
          </div>
        </div>
      </div>
    )
  }
}


BettingMarketGroupBanner.propTypes = {
  eventTime: PropTypes.instanceOf(Date).isRequired,
  eventName: PropTypes.string.isRequired,
  eventStatus: PropTypes.any,
  eventStatusClassName: PropTypes.any,
  isLiveMarket: PropTypes.bool
}

export default BettingMarketGroupBanner;
