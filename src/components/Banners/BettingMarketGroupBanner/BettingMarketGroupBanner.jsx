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
    this.renderCountdown = this.renderCountdown.bind(this);
    this.renderLive = this.renderLive.bind(this);
    this.renderLiveMarker = this.renderLiveMarker.bind(this);
  }

  renderCountdown() {
    const isCountdownEnd = !moment(this.props.eventTime).isAfter();
    if (isCountdownEnd && this.props.isLiveMarket) {
      return this.renderLive();
    } else {
      return (
        <div className='countdown'>
          <BannerClock time={ new Date(this.props.eventTime) }/>
        </div>
      )
    }
  }
  renderLiveMarker() {
    // Event status enumerators. 
    // there will be more types, depending on the change in blockchain objects future. See lib/peerplaysjs-lib/lib/serializer/src/operations.js
    switch (this.props.eventStatus){
      case "upcoming":
        return (
          <span className='going-live'><span className='indicator'/>{ I18n.t('complex_betting_widget.upcoming') }</span>        
        )
        break;
      case "in_progress":
        return (
          <span className='live'><span className='indicator'/>{ I18n.t('complex_betting_widget.in_progress') }</span>
        )
        break;
      case "frozen":
        return (
          <span className='going-live'><span className='indicator'/>{ I18n.t('complex_betting_widget.frozen') }</span>        
        )
        break;
      case "finished":
        return (
          <span className='going-live'><span className='indicator'/>{ I18n.t('complex_betting_widget.finished') }</span>        
        )
        break;
      case "settled":
        return (
          <span className='going-live'><span className='indicator'/>{ I18n.t('complex_betting_widget.settled') }</span>        
        )
        break;
      case "canceled":
        return (
          <span className='going-live'><span className='indicator'/>{ I18n.t('complex_betting_widget.canceled') }</span>        
        )
        break;
      default:
        console.log(this.props.eventStatus);
        return (
          <span className='live'><span className='indicator'/>{ I18n.t('complex_betting_widget.error') }</span>
        )
    }
  } 
  
  renderLive() {
    // TODO: waiting for the style
    return (
      <div className='live'>
        { 'LIVE' }
      </div>
    )
  }

  render() {
    const bannerSource = `url(${this.state.bannerUrl})`;
    const formattedEventTime = moment(this.props.eventTime).format('LLL');
    return (
      <div className='betting-market-group-banner' style={ { backgroundImage: bannerSource } }>
        <div className='event'>
          <div className='name'>{ this.props.eventName } { this.renderLiveMarker() } </div>
          <div className='time'>{ I18n.t('bettingMarketGroup.match_start_on', { time: formattedEventTime }) }</div>

        </div>
        {
          this.renderCountdown()
        }
      </div>
    )
  }
}


BettingMarketGroupBanner.propTypes = {
  eventTime: PropTypes.string.isRequired,  
  eventName: PropTypes.string.isRequired,
  isLiveMarket: PropTypes.bool
}

export default BettingMarketGroupBanner;
