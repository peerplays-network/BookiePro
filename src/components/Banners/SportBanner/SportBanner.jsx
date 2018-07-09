import React, { PureComponent } from 'react';
import banner1 from '../../../assets/images/sports_banner_1.png';
import banner2 from '../../../assets/images/sports_banner_2.png';
import banner3 from '../../../assets/images/sports_banner_3.png';

import baseball from '../../../assets/images/sports_banner_baseball.png';
import basketball from '../../../assets/images/sports_banner_basketball.png';
import defaultBanner from '../../../assets/images/sports_banner_default.png';
import football from '../../../assets/images/sports_banner_football.png';
import icehockey from '../../../assets/images/sports_banner_hockey.png';
import soccer from '../../../assets/images/sports_banner_soccer.png';

import PropTypes from 'prop-types';

const bannerUrls = [banner1, banner2, banner3];
const sportBannerUrls = {
  baseball, basketball, defaultBanner, football, soccer, icehockey
};

const generateBannerUrl = (sport) => {

  // Make the passed in sport lowercase without spaces. The url name is written to conform and match these rules. 
  const theSport = sport.toLowerCase().replace(/ /g,'');

  // Choose the sport that was passed into the component
  if (sportBannerUrls[theSport]) {
    return sportBannerUrls[theSport];
  } else {
    // Otherwise, use the default image
    return defaultBanner;
  }
  
}

class SportsBanner extends PureComponent {
  constructor(props) {
    super(props);
    console.log('Sports Banner')
    console.log(props)
    this.state = {
      bannerUrl: generateBannerUrl(props.sport)
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
