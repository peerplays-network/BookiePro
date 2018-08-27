import React, {PureComponent} from 'react';
import BannerClockDigits from './BannerClockDigits';
import PropTypes from 'prop-types';
import {I18n} from 'react-redux-i18n';

class BannerClock extends PureComponent {
  constructor(props) {
    super(props);
    const currentTime = new Date();
    this.state = {
      remainingTime: Math.max(0, props.time - currentTime)
    };
  }

  componentDidMount() {
    this.timer = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  tick() {
    const currentTime = new Date();
    this.setState({
      remainingTime: Math.max(0, this.props.time - currentTime)
    });
  }

  render() {
    return (
      <div className='banner-clock'>
        <div className='banner-clock-header'>{I18n.t('bannerClock.header')}</div>
        <div className='banner-clock-content'>
          <BannerClockDigits
            value={ Math.floor(this.state.remainingTime / (24 * 60 * 60 * 1000)) }
            footerText={ I18n.t('bannerClock.days') }
          />
          <div className='colon'>{':'}</div>
          <BannerClockDigits
            value={ Math.floor(this.state.remainingTime / (60 * 60 * 1000)) % 24 }
            footerText={ I18n.t('bannerClock.hours') }
          />
          <div className='colon'>{':'}</div>
          <BannerClockDigits
            value={ Math.floor(this.state.remainingTime / (60 * 1000)) % 60 }
            footerText={ I18n.t('bannerClock.minutes') }
          />
        </div>
      </div>
    );
  }
}

BannerClock.propTypes = {
  time: PropTypes.instanceOf(Date)
};

BannerClock.defaultProps = {
  time: new Date()
};
export default BannerClock;
