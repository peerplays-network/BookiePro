import React, {PureComponent} from 'react';
import {I18n} from 'react-redux-i18n';
import PropTypes from 'prop-types';
import moment from 'moment';

import sportsBanners from '../BannerConstants';

const generateBannerUrl = (sport) => {
  // Make the passed in sport lowercase without spaces. 
  // The url name is written to conform and match these rules.
  const theSport = sport.toLowerCase().replace(/ /g, '');

  // Choose the sport that was passed into the component
  if (sportsBanners[theSport]) {
    return sportsBanners[theSport];
  } else {
    // Otherwise, use the default image
    return sportsBanners['defaultBanner'];
  }
};

class BettingMarketGroupBanner extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      bannerUrl: generateBannerUrl(props.sportName)
    };
    this.renderLive = this.renderLive.bind(this);
  }

  renderLive() {
    if (this.props.eventStatus !== 'in_progress') {
      return;
    }

    return (
      <div className='live'>
        <span className='indicator' /> {'LIVE'}
      </div>
    );
  }

  render() {
    const bannerSource = `url(${this.state.bannerUrl})`;
    const eventDate = moment(this.props.eventTime);
    let formattedEventTime = eventDate.format('MMM D, YYYY - H:mm');

    if (
      eventDate
        .calendar()
        .toLowerCase()
        .indexOf('today') !== -1
    ) {
      formattedEventTime = I18n.t('mybets.today') + ' - ' + eventDate.format('H:mm');
    }

    // Regular expression to break out the team names
    const expr = /(.+)\s(@|VS|V){1}\s(.+)/gi;
    const parts = expr.exec(this.props.eventName);

    // default event name layout, overriden if we can parse out the two pieces.
    let eventName = <div className='name'>{this.props.eventName}</div>;

    // The regex has matched.
    if (parts && parts.length === 4) {
      eventName = (
        <div className='name'>
          <span className='team-one'>{parts[1]}</span>
          <span className='versus'>{parts[2]}</span>
          <span className='team-two'>{parts[3]}</span>
        </div>
      );
    }

    return (
      <div className='betting-market-group-banner' style={ {backgroundImage: bannerSource} }>
        <div className='event'>
          <div className='name'>{eventName} </div>
          <div className='time'>
            {I18n.t('bettingMarketGroup.match_start_on', {time: formattedEventTime})}
          </div>
          {this.renderLive()}
        </div>
      </div>
    );
  }
}

BettingMarketGroupBanner.propTypes = {
  eventTime: PropTypes.instanceOf(Date).isRequired,
  eventName: PropTypes.string.isRequired,
  eventStatus: PropTypes.any.isRequired,
  eventStatusClassName: PropTypes.any,
  isLiveMarket: PropTypes.bool
};

export default BettingMarketGroupBanner;
