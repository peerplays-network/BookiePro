import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SportBanner } from '../Banners';
import { SimpleBettingWidget } from '../BettingWidgets';
import { SportPageActions } from '../../actions';
import Immutable from 'immutable';
const { getData } = SportPageActions;

class Sport extends Component {
  constructor(props) {
    super(props);
    this.props.dispatch(getData(props.params.objectId));
  }

  render() {
    const { sport, eventGroups, currencyFormat } = this.props;
    return (
      <div className='sport-wrapper'>
        <SportBanner sport={ sport }/>
        {
          // convert the list of keys into vanilla JS array so that I can grab the index
          eventGroups.keySeq().toArray().map((eventGroupId, idx) => {
            const eventGroup = eventGroups.get(eventGroupId);
            return (
              <SimpleBettingWidget
                key={ idx }                    // required by React to have unique key
                title={ eventGroup.get('name') }
                events={ eventGroup.get('events') }
                currencyFormat={ currencyFormat }
              />
            );
          })
        }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const sportsById = state.getIn(['sport', 'sportsById']);
  const eventsById = state.getIn(['event', 'eventsById']);
  const sportPage = state.get('sportPage');
  const eventGroupsById = state.getIn(['eventGroup', 'eventGroupsById']);
  const binnedOrderBooksByEvent = state.getIn(['sportPage', 'binnedOrderBooksByEvent']);

  // Determine the banner title
  const sportObject = sportsById.get(ownProps.params.objectId);
  let sportName = '';
  if (sportObject !== undefined) {
    sportName = sportObject.get('name');
  }

  // Construct the page content
  let page = Immutable.Map();

  // First, found all relevant event objects based on the component's state
  const myEvents = eventsById.filter((event) => sportPage.get('eventIds').includes(event.get('id')));

  // Create a map using event group id as keys
  eventGroupsById.forEach((eventGroup) => {
    const eventGroupId = eventGroup.get('id');
    if (sportPage.get('eventGroupIds').includes(eventGroupId)) {
      page = page.set(eventGroupId, Immutable.Map());
      page = page.setIn([eventGroupId, 'name'], eventGroup.get('name'));
      page = page.setIn([eventGroupId, 'events'], Immutable.List());
    }
  });

  // For each event, generate data entry for the Simple Betting Widget
  myEvents.forEach((event) => {
    const eventGroupId = event.get('event_group_id');
    if (page.has(eventGroupId)) {
      const eventId = event.get('id');
      const offers = binnedOrderBooksByEvent.has(eventId)? binnedOrderBooksByEvent.get(eventId) : Immutable.List() ;
      let eventList = page.getIn([eventGroupId, 'events']);
      eventList = eventList.push(Immutable.fromJS({
        event_id: event.get('id'),
        event_name: event.get('name'),
        time: event.get('start_time'),
        offers: offers
      }))
      page = page.setIn([eventGroupId, 'events'], eventList);
    }
  });

  return {
    sport: sportName,
    eventGroups: page
  };
}

export default connect(mapStateToProps)(Sport);
