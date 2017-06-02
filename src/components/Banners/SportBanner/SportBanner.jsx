import React, { PureComponent } from 'react';
import banner1 from '../../../assets/images/sports_banner_1.png';
import banner2 from '../../../assets/images/sports_banner_2.png';
import banner3 from '../../../assets/images/sports_banner_3.png';
import PropTypes from 'prop-types';

const bannerUrls = [banner1, banner2, banner3];
const generateBannerUrl = () => {
  const indexOfBannerToBeUsed = Math.floor((Math.random() * bannerUrls.length));
  return bannerUrls[indexOfBannerToBeUsed];
}

class SportsBanner extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      bannerUrl: generateBannerUrl()
    }
  }

  render() {
    const bannerSource = `url(${this.state.bannerUrl})`;
    return (
      <div className='sport-banner'  style={ { backgroundImage: bannerSource } }>
          <div className='sport-name'>
            { this.props.sport }
          </div>
      </div>
    )
  }
}

SportsBanner.propTypes = {
  sport: PropTypes.string
}

export default SportsBanner;
