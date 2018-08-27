import React, {PureComponent} from 'react';
import {I18n} from 'react-redux-i18n';
import banner1 from '../../../assets/images/home_banner_1.png';
import banner2 from '../../../assets/images/home_banner_2.png';
import banner3 from '../../../assets/images/home_banner_3.png';
import banner4 from '../../../assets/images/home_banner_4.png';
import PropTypes from 'prop-types';
import Immutable from 'immutable';

const bannerUrls = [banner1, banner2, banner3, banner4];

const generateBannerUrl = () => {
  const indexOfBannerToBeUsed = Math.floor(Math.random() * bannerUrls.length);
  return bannerUrls[indexOfBannerToBeUsed];
};

class AllSportsBanner extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      bannerUrl: generateBannerUrl()
    };
  }

  renderTotalAmountStakedIntegerPart(totalAmountStaked) {
    let digits = [];
    const numberOfDigit =
      totalAmountStaked !== 0 ? Math.floor(Math.log10(totalAmountStaked)) + 1 : 1;

    // Add 0 padding if it is less than 2 digits
    if (numberOfDigit < 2) {
      for (let i = numberOfDigit; i < 2; i++) {
        const digit = (
          <div className='digit' key='padding'>
            <span className='top-half'>0</span>
            <span className='bottom-half'>0</span>
          </div>
        );
        digits.push(digit);
      }
    }

    for (let i = numberOfDigit; i > 0; i--) {
      const value = Math.floor(totalAmountStaked / Math.pow(10, i - 1)) % 10;
      const digit = (
        <div className='digit' key={ 'integer-' + i }>
          <span className='top-half'>{value}</span>
          <span className='bottom-half'>{value}</span>
        </div>
      );
      digits.push(digit);
    }

    return digits;
  }

  renderTotalAmountStakedFractionalPart(totalAmountStaked) {
    let digits = [];
    const fractionalPartInHundred = (totalAmountStaked - Math.floor(totalAmountStaked)) * 100;
    const firstFraction = (
      <div className='digit' key='first-fraction'>
        <span className='top-half'>{Math.floor(fractionalPartInHundred / 10)}</span>
        <span className='bottom-half'>{Math.floor(fractionalPartInHundred / 10)}</span>
      </div>
    );
    digits.push(firstFraction);

    const secondFraction = (
      <div className='digit' key='second-fraction'>
        <span className='top-half'>{Math.floor(fractionalPartInHundred % 10)}</span>
        <span className='bottom-half'>{Math.floor(fractionalPartInHundred % 10)}</span>
      </div>
    );
    digits.push(secondFraction);
    return digits;
  }
  render() {
    const bannerSource = `url(${this.state.bannerUrl})`;
    const numberOfActiveEvents =
      this.props.globalBettingStatistics.get('number_of_active_events') || 0;
    const totalAmountStaked = 0;

    return (
      <div className='all-sports-banner' style={ {backgroundImage: bannerSource} }>
        <div className='statistics'>
          <div className='float-right'>
            <div className='bitcoin-icon-main'>
              <i className='icon-bitcoin-white' />
            </div>
            <div className='flip-amount'>
              {this.renderTotalAmountStakedIntegerPart(totalAmountStaked)}
              <div className='digit-delimiter'>.</div>
              {this.renderTotalAmountStakedFractionalPart(totalAmountStaked)}
            </div>
          </div>
          <div className='text'>
            <span className='text'>{I18n.t('AllSports.bannerText', {numberOfActiveEvents})}</span>
          </div>
        </div>
      </div>
    );
  }
}

AllSportsBanner.propTypes = {
  globalBettingStatistics: PropTypes.instanceOf(Immutable.Map)
};

AllSportsBanner.defaultProps = {
  globalBettingStatistics: Immutable.Map()
};

export default AllSportsBanner;
