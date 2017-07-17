import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import BannerClockDigit from './BannerClockDigit';
import _ from 'lodash';

class BannerClockDigits extends PureComponent {
  render() {
    const { value, footerText } = this.props;
    const numberOfDigit = value !== 0 ? (Math.floor(Math.log10(value)) + 1) : 1;
    const bannerClockDigitsContent = [];

    if (numberOfDigit < 2) {
      for (let i = numberOfDigit; i < 2; i++) {
        const digit = <BannerClockDigit key={ 'padding' + i } value={ 0 } />
        bannerClockDigitsContent.push(digit);
      }
    }
    for (let i = numberOfDigit; i > 0; i--) {
      const digit = <BannerClockDigit key={ i } value={ Math.floor(value / Math.pow(10, i-1)) % 10 }/>
      bannerClockDigitsContent.push(digit);
    }

    return (
      <div className='banner-clock-digits'>
        <div className='banner-clock-digits-content'>
          { bannerClockDigitsContent }
        </div>
        <div className='banner-clock-digits-footer'>
          { footerText }
        </div>
      </div>
    )
  }
}

BannerClockDigits.propTypes = {
  value: PropTypes.number,
  footerText: PropTypes.string
}

BannerClockDigits.defaultProps = {
  value: 0
}

export default BannerClockDigits;
