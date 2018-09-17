import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {BackingWidgetContainer} from '../BettingWidgets';
import {EventPageSelector} from '../../selectors';

const MAX_EVENTS = 3;

class SportsBook extends PureComponent {
  render() {

    return (
      <div className='all-sports-wrapper'>
        <div className='banner-ad-header' />
        {
          this.props.allSports.map((sport) => {
            const events = sport.get('events');

            let eventsToDisplay = [];

            events && events.slice(0, MAX_EVENTS).forEach((e) => {
              let bmgs = e.get('bettingMarketGroups');
              let bmg = bmgs.first();

              eventsToDisplay.push(
                bmg
                  .set('eventName', e.get('name'))
                  .set('eventID', e.get('id'))
                  .set('eventTime', e.get('start_time'))
              );
            });

            if (eventsToDisplay.length > 0) {
              return (<BackingWidgetContainer
                key={ sport.get('name') }
                widgetTitle={ sport.get('name') }
                marketData={ eventsToDisplay }
              />);
            }
          })
        }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const allSports = EventPageSelector.getAllSportsData(state, ownProps);

  return {
    allSports
  };
};

export default connect(mapStateToProps)(SportsBook);
