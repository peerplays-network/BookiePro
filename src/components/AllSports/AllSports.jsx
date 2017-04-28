import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AllSportsBanner } from '../Banners';
import { SimpleBettingWidget } from '../BettingWidgets';
import { AllSportsActions } from '../../actions';
import Immutable from 'immutable';

const { getData } = AllSportsActions;

class AllSports extends Component {
  constructor(props) {
    super(props);
    this.props.dispatch(getData());
  }

  render() {
    const { sports, currencyFormat } = this.props;
    return (
      <div id='all-sports-wrapper'>
        <AllSportsBanner />
        {
          // convert the list of keys into vanilla JS array so that I can grab the index
          sports.keySeq().toArray().map((sportId, idx) => {
            const sport = sports.get(sportId);
            return (
              <SimpleBettingWidget
                key={ idx }                   // required by React to have unique key
                title={ sport.get('name') }
                events={ sport.get('events') }
                currencyFormat={ currencyFormat }
              />
            )
          })
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const sportsById = state.getIn(['sport', 'sportsById']);
  const eventsById = state.getIn(['event', 'eventsById']);
  const binnedOrderBooksByEvent = state.getIn(['allSports', 'binnedOrderBooksByEvent']);

  // Construct the page content
  let page = Immutable.Map();

  // Create a map using sport id as keys
  sportsById.forEach((sport) => {
    const sportId = sport.get('id');
    page = page.set(sportId, Immutable.Map());
    page = page.setIn([sportId, 'name'], sport.get('name'));
    page = page.setIn([sportId, 'events'], Immutable.List());
  });

  // For each event, generate data entry for the Simple Betting Widget
  eventsById.forEach((event) => {
    const eventSportId = event.get('sport_id');
    if (page.has(eventSportId)) {
      const eventId = event.get('id');
      const offers = binnedOrderBooksByEvent.has(eventId)? binnedOrderBooksByEvent.get(eventId) : Immutable.List() ;
      let eventList = page.getIn([eventSportId, 'events']);
      eventList = eventList.push(Immutable.fromJS({
        event_id: event.get('id'),
        event_name: event.get('name'),
        time: event.get('start_time'),
        offers: offers
      }));
      page = page.setIn([eventSportId, 'events'], eventList);
    }
  });

  return {
    sports: page
  }
}

export default connect(mapStateToProps)(AllSports);
