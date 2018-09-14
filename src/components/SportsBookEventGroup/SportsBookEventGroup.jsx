import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {EventPageSelector} from '../../selectors';
import {BackingWidgetContainer} from '../BettingWidgets';
// import {BackingWidgetContainer} from '../BettingWidgets';

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
          eventsToDisplay.push(
            bmg
              .set('eventName', e.get('name'))
              .set('eventID', e.get('id'))
              .set('eventTime', e.get('start_time'))
          );
        });
      }

      return (
        <BackingWidgetContainer
          widgetTitle={ eventGroup.get('name') }
          marketData={ eventsToDisplay }
        />
      );
    }

    return null;
  }
}

const mapStateToProps = (state, ownProps) => {  
  return {
    eventGroup: EventPageSelector.getEventGroupData(state, ownProps.params.objectId)
  };
};

export default connect(mapStateToProps)(SportsBookEventGroup);
