import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {EventPageSelector} from '../../selectors';
import {BackingWidgetContainer} from '../BettingWidgets';
import {SportBanner} from '../Banners';
import {SportsbookUtils, ObjectUtils} from '../../utility';

const MAX_EVENTS = 10;
class SportsBookSport extends PureComponent {
  render() {
    const sport = this.props.sport;
    return (
      <div className='sport-wrapper'>
        { sport && <SportBanner sport={ sport.get('sportName') || '' } /> }
        
        { 
          sport && this.props.sport.get('eventGroups').map((eg) => {

            const events = eg.get('events');

            let eventsToDisplay = [];

            events && events.slice(0, MAX_EVENTS).forEach((e) => {
              let bmgs = e.get('bettingMarketGroups');
              let bmg = bmgs.first();

              if (SportsbookUtils.isMatchodds(bmg)) {
                eventsToDisplay.push(
                  bmg
                    .set('eventName', e.get('name'))
                    .set('eventID', e.get('id'))
                    .set('eventTime', e.get('start_time'))
                    .set('eventStatus', ObjectUtils.eventStatus(e))
                );
              }
            });

            return eventsToDisplay.length > 0 && 
              (<BackingWidgetContainer
                key={ eg.get('name') }
                widgetTitle={ eg.get('name') }
                marketData={ eventsToDisplay }
              />);
          })
        }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {  
  return {
    sport: EventPageSelector.getSportData(state, ownProps.params.objectId)
  };
};

export default connect(mapStateToProps)(SportsBookSport);
