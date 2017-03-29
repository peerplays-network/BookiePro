import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AllSportsBanner } from '../Banners';
import SimpleBettingWidget from '../SimpleBettingWidget';
import { AllSportsActions } from '../../actions';
import Immutable from 'immutable';

const { getData } = AllSportsActions;

class AllSports extends Component {
  constructor(props) {
    super(props);
    this.props.dispatch(getData());
  }

  render() {
    return (
      <div id='all-sports-wrapper'>
        <AllSportsBanner />
        {
          Object.keys(this.props.sports).map((sportId, idx) => {
            const sport = this.props.sports[sportId];
            return (
              <SimpleBettingWidget
                key={ idx }
                title={ sport.name }
                events={ sport.events }
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
  let page = {};

  // Create a map using sport id as keys
  sportsById.forEach((sport) => {
    const sportId = sport.get('id');
    page[sportId] = { name: sport.get('name') };
    page[sportId]['events'] = [];
  });

  // For each event, generate data entry for the Simple Betting Widget
  eventsById.forEach((event) => {
    const eventSportId = event.get('sport_id');
    if (page.hasOwnProperty(eventSportId)) {
      const eventId = event.get('id');
      const offers = binnedOrderBooksByEvent.has(eventId)? binnedOrderBooksByEvent.get(eventId) : Immutable.List() ;
      page[eventSportId]['events'].push({
        id: event.get('id'),
        name: event.get('name'),
        time: event.get('start_time'),
        offers: offers
      });
    }
  });

  return {
    sports: page
  }
}

export default connect(mapStateToProps)(AllSports);
