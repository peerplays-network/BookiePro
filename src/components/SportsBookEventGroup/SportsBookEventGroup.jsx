import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {EventPageSelector, EventGroupPageSelector} from '../../selectors';
import {BackingWidgetContainer} from '../BettingWidgets';
import {SportBanner} from '../Banners';
import {SportsbookUtils, ObjectUtils} from '../../utility';

const MAX_EVENTS = 25;
class SportsBookEventGroup extends PureComponent {
  render() {
    const eventGroup = this.props.eventGroup;

    if (eventGroup) {
      const events = eventGroup.get('events');
      let eventsToDisplay = [];

      if (events) {
        events.slice(0, MAX_EVENTS).forEach((e) => {
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
      }

      return (
        <div className='event-group-wrapper'>
          <SportBanner sport={ this.props.sportName } />
          <BackingWidgetContainer
            widgetTitle={ eventGroup.get('name') }
            marketData={ eventsToDisplay }
          />
        </div>
      );
    }

    return null;
  }
}

const mapStateToProps = (state, ownProps) => {  
  return {
    eventGroup: EventPageSelector.getEventGroupData(state, ownProps.params.objectId),
    sportName: EventGroupPageSelector.getSportName(state, ownProps)
  };
};

export default connect(mapStateToProps)(SportsBookEventGroup);
