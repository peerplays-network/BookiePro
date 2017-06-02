import React, { PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
import banner1 from '../../../assets/images/home_banner_1.png';
import banner2 from '../../../assets/images/home_banner_2.png';
import banner3 from '../../../assets/images/home_banner_3.png';
import banner4 from '../../../assets/images/home_banner_4.png';

const bannerUrls = [banner1, banner2, banner3, banner4];
const generateBannerUrl = () => {
  const indexOfBannerToBeUsed = Math.floor((Math.random() * bannerUrls.length));
  return bannerUrls[indexOfBannerToBeUsed];
}

class AllSportsBanner extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      bannerUrl: generateBannerUrl()
    }
  }

  render() {
    const bannerSource = `url(${this.state.bannerUrl})`;
    return (
      <div className='all-sports-banner' style={ { backgroundImage: bannerSource } }>
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
  }
}

export default AllSportsBanner;
