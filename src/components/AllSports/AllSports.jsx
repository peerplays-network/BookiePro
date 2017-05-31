import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AllSportsBanner } from '../Banners';
import { SimpleBettingWidget } from '../BettingWidgets';
import { AllSportsActions } from '../../actions';
import Immutable from 'immutable';

const MAX_EVENTS_PER_WIDGET = 3;
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
            const events = sport.get('events');
            return (
              <SimpleBettingWidget
                key={ idx }                   // required by React to have unique key
                title={ sport.get('name') }
                events={ events }  // No pagination, only show top records
                currencyFormat={ currencyFormat }
                showFooter={ sport.get('showFooter') }
                footerLink={ `/exchange/sport/${sportId}` }
                pagination={ false }
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
  const bettingMarketGroupsById = state.getIn(['bettingMarketGroup', 'bettingMarketGroupsById']);
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
    const eventTime = event.get('start_time');
    const currentTime = new Date().getTime();
    const isEventActive = (eventTime - currentTime) > 0;
    if (page.has(eventSportId) && isEventActive) {
      const eventId = event.get('id');
      const offers = binnedOrderBooksByEvent.has(eventId)? binnedOrderBooksByEvent.get(eventId) : Immutable.List() ;
      let eventList = page.getIn([eventSportId, 'events']);
      // Find the MoneyLine Betting Market Group of this event
      const moneyline = event.get('betting_market_group_ids').find((id) => {
        const bettingMarketGroup = bettingMarketGroupsById.get(id);
        if (bettingMarketGroup) {
          return bettingMarketGroup.get('market_type_id') === 'Moneyline';
        }
        return false;
      });
      eventList = eventList.push(Immutable.fromJS({
        event_id: event.get('id'),
        event_name: event.get('name'),
        time: event.get('start_time'),
        offers,
        moneyline,
      }));
      page = page.setIn([eventSportId, 'events'], eventList.slice(0, MAX_EVENTS_PER_WIDGET))
                 .setIn([eventSportId, 'showFooter'], eventList.size > MAX_EVENTS_PER_WIDGET);
      console.log(page.getIn([eventSportId, 'events']).toJS());
    }
  });


  return {
    sports: page
  }
}

export default connect(mapStateToProps)(AllSports);
