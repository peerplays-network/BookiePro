import React, { PureComponent } from 'react';

import sportsBanners from '../BannerConstants';

import PropTypes from 'prop-types';

const generateBannerUrl = (sport) => {
  // Make the passed in sport lowercase without spaces. The url name is written to conform and match these rules. 
  const theSport = sport.toLowerCase().replace(/ /g,'');

  // Choose the sport that was passed into the component
  if (sportsBanners[theSport]) {
    return sportsBanners[theSport];
  } else {
    // Otherwise, use the default image
    return sportsBanners['defaultBanner'];
  }
}

class SportsBanner extends PureComponent {
  constructor(props) {
    super(props);
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
