import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SportBanner } from '../Banners';
import { SimpleBettingWidget } from '../BettingWidgets';
import { EventGroupPageActions } from '../../actions';
import Immutable from 'immutable';

const { getData } = EventGroupPageActions;

class EventGroup extends Component {
  constructor(props) {
    super(props);
    this.props.dispatch(getData(props.params.objectId));
  }

  render() {
    const { sport, eventGroup, events, currencyFormat } = this.props;
    return (
      <div className='event-group-wrapper'>
        <SportBanner sport={ sport }/>
        <SimpleBettingWidget
          title={ eventGroup }
          events={ events }
          currencyFormat={ currencyFormat }
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const eventGroupId = window.location.href.split('/').pop();
  const eventsById = state.getIn(['event', 'eventsById']);
  const eventIds = state.getIn(['eventGroupPage', 'eventIds']);
  const binnedOrderBooksByEvent = state.getIn(['eventGroupPage', 'binnedOrderBooksByEvent']);

  // For each event, generate data entry for the Simple Betting Widget
  let myEvents = eventsById.toArray()
    .filter((event) => {
      const eventTime = event.get('start_time');
      const currentTime = new Date().getTime();
      const isEventActive = (eventTime - currentTime) > 0;
      return event.get('event_group_id') === eventGroupId && eventIds.includes(event.get('id')) && isEventActive
    }).map((event) => {
      const eventId = event.get('id');
      const offers = binnedOrderBooksByEvent.has(eventId)? binnedOrderBooksByEvent.get(eventId) : Immutable.List() ;
      return Immutable.fromJS({
        event_id: eventId,
        event_name: event.get('name'),
        time: event.get('start_time'),
        offers: offers
      })
    });
  // props attribute should all be ImmutableJS objects
  myEvents = Immutable.List(myEvents);

  return {
    sport: state.getIn(['eventGroupPage', 'sportName']),
    eventGroup: state.getIn(['eventGroupPage', 'eventGroupName']),
    events: myEvents
  };
};

export default connect(mapStateToProps)(EventGroup);
