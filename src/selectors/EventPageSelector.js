import {createSelector} from 'reselect';
import CommonSelector from './CommonSelector';
import Immutable from 'immutable';
import {SportsbookUtils} from '../utility';
import {Config} from '../constants';

const {
  getBettingMarketsById,
  getBinnedOrderBooksByBettingMarketId,
  getActiveEventsBySportId,
  getSportsById,
  getSportById,
  getEventGroupsBySportId,
  getEventGroupById,
  getEventsByEventGroupId
} = CommonSelector;

const getEvent = (state, id) => state.getIn(['event', 'eventsById', id]);

const getEventIdByFromBMGId = (state, id) => {
  const bmgs = state.getIn(['bettingMarketGroup', 'bettingMarketGroupsById']);
  let foundEventID = -1;
  
  if (bmgs) {
    bmgs.valueSeq().forEach((bettingMarket) => {
      if (bettingMarket.get('id') === id) {
        foundEventID = bettingMarket.get('event_id');
      }
    });
  }

  return foundEventID;
};

const getBettingMarketGroupsByEventId = (state, ownProps) => {
  const bmgs = state.getIn(['bettingMarketGroup', 'bettingMarketGroupsById']);
  const eventId = ownProps.eventId;

  let bettingMarketGroups = Immutable.List();
  bmgs.valueSeq().forEach((bettingMarketGroup) => {
    if (bettingMarketGroup.get('event_id') === eventId) {
      bettingMarketGroups = bettingMarketGroups.push(bettingMarketGroup);
    }
  });
  return bettingMarketGroups;
};

const getAllBettingMarketGroupsByEventId = (state) => {
  const bmgs = state.getIn(['bettingMarketGroup', 'bettingMarketGroupsById']);
  let events = [];
  bmgs.valueSeq().forEach((bmg) => {
    let eventID = bmg.get('event_id');

    if (!events[eventID]) {
      events[eventID] = Immutable.List();
    }

    events[eventID] = events[eventID].push(bmg);
  });
  return events;
};

const getFirstBettingMarketGroupByEventId = createSelector(
  [getBettingMarketGroupsByEventId],
  (bettingMarketGroups) => {
    if (bettingMarketGroups.first()) {
      return SportsbookUtils.prioritySort(bettingMarketGroups).first();
    }
  }
);

const getBettingMarketsByBMGID = createSelector([getBettingMarketsById], (bettingMarkets) => {
  let bettingMarketsByGroupID = {};

  bettingMarkets.forEach((bettingMarket) => {
    const groupID = bettingMarket.get('group_id');

    if (!bettingMarketsByGroupID[groupID]) {
      bettingMarketsByGroupID[groupID] = [];
    }

    bettingMarketsByGroupID[groupID].push(bettingMarket);
  });
  return bettingMarketsByGroupID;
});

const getMarketData = createSelector(
  [getBettingMarketGroupsByEventId, getBettingMarketsByBMGID, getBinnedOrderBooksByBettingMarketId],
  (
    bettingMarketGroups,
    // bettingMarkets is a dictionary
    //    - Where the keys are BMG ID's
    //    - Where the values are arrays that contain all of the BM's that pertain to the BMG
    bettingMarkets,
    binnedOrderBooksByBettingMarketId
  ) => {
    // Iterate through the values of the bettingMarkets dictionary
    Object.values(bettingMarkets).forEach((bm) => {
      // There are one or more bm in a single betting market group, this loop matches them
      //  with the order book that pertains to the BM.
      for (let i = 0; i < bm.length; i++) {
        bm[i] = bm[i].set('orderBook', binnedOrderBooksByBettingMarketId.get(bm[i].get('id')));

        // We only care about the lay bets (the bets that will display as open back bets)
        let aggregated_lay_bets = bm[i].getIn(['orderBook', 'aggregated_lay_bets']);

        if (aggregated_lay_bets) {
          aggregated_lay_bets = aggregated_lay_bets.map((aggregated_lay_bet) => {
            const odds = aggregated_lay_bet.get('backer_multiplier') / Config.oddsPrecision;
            return aggregated_lay_bet.set('odds', odds);
          });
          bm[i] = bm[i].set(
            'backOrigin',
            aggregated_lay_bets.sort((a, b) => a.get('odds') - b.get('odds'))
          );
        }
      }
    });

    // Iterate through the list of betting market groups and...
    bettingMarketGroups.forEach((bmg, index) => {
      // Pick the betting markets out of the dictionary that pertain to the given BMG
      bettingMarketGroups = bettingMarketGroups.set(
        index,
        bmg.set('bettingMarkets', bettingMarkets[bmg.get('id')])
      );
    });

    // Group all of the over under BMGs as if they belonged to the same BMG.
    bettingMarketGroups = SportsbookUtils.groupOverUnders(bettingMarketGroups);

    // Sort the betting market groups so that they are in priority order. Then center
    //  the draw bm in BMG's where there is a draw option
    bettingMarketGroups = SportsbookUtils.sortAndCenter(bettingMarketGroups);

    return bettingMarketGroups;
  }
);

const getBettingMarketsWithOrderBook = createSelector(
  [getBettingMarketsById, getBinnedOrderBooksByBettingMarketId],
  (bettingMarkets, binnedOrderBooksByBettingMarketId) => {
    // Iterate through the values of the bettingMarkets dictionary
    bettingMarkets = bettingMarkets.map((bm) => {
      // There are one or more bm in a single betting market group, this loop matches them
      //  with the order book that pertains to the BM.

      bm = bm.set('orderBook', binnedOrderBooksByBettingMarketId.get(bm.get('id')));

      // We only care about the lay bets (the bets that will display as open back bets)
      let aggregated_lay_bets = bm.getIn(['orderBook', 'aggregated_lay_bets']);

      if (aggregated_lay_bets) {
        aggregated_lay_bets = aggregated_lay_bets.map((aggregated_lay_bet) => {
          const odds = aggregated_lay_bet.get('backer_multiplier') / Config.oddsPrecision;
          return aggregated_lay_bet.set('odds', odds);
        });
        bm = bm.set(
          'backOrigin',
          aggregated_lay_bets.sort((a, b) => a.get('odds') - b.get('odds'))
        );
      }

      return bm;
    });

    let orderBooksByBMGID = [];

    bettingMarkets.forEach((bm) => {
      let bmgID = bm.get('group_id');

      if (!orderBooksByBMGID[bmgID]) {
        orderBooksByBMGID[bmgID] = [];
      }

      orderBooksByBMGID[bmgID].push(bm);
    });

    return orderBooksByBMGID;
  }
);

const getAllSportsData = createSelector(
  [
    getSportsById,
    getActiveEventsBySportId,
    getAllBettingMarketGroupsByEventId,
    getBettingMarketsWithOrderBook
  ],
  (sportsById, activeEventsBySportId, bmgsByEventID, bettingMarketsWithOrderBook) => {
    let allSportsData = Immutable.List();

    // Iterate through each sport to build each sport node
    sportsById.forEach((sport) => {
      // A sport node consists of a name and a sport ID
      let sportNode = Immutable.Map()
        .set('name', sport.get('name'))
        .set('sport_id', sport.get('id'));

      // Get the events that pertain to the current sport
      const activeEvents = activeEventsBySportId.get(sport.get('id'));

      // Iterate through each event and parse the relevant data
      let eventNodes =
        activeEvents &&
        activeEvents.map((e) => {
          let bmgs = bmgsByEventID[e.get('id')];

          if(bmgs) {
            bmgs = bmgs.filter((bmg) => {
              let description = bmg.get('description').toUpperCase();
              let passesFilters = false;
              
              if ((description === 'MONEYLINE' ||
                description === 'MATCH ODDS') && description !== 'FRIENDLY INTERNATIONAL') {
                passesFilters = true;
              }

              return passesFilters;
            }).map((bmg) => {
              let bmgID = bmg.get('id');
              return bmg.set('bettingMarkets', bettingMarketsWithOrderBook[bmgID]);
            });

            bmgs = SportsbookUtils.sortAndCenter(bmgs);

            // Put the list of BMGs into their respective events
            e = e.set('bettingMarketGroups', bmgs);

            return e;
          } else {
            return null;
          }
        });

      if (eventNodes) {
        eventNodes = eventNodes.filter((e) => e);
        eventNodes = SportsbookUtils.sortEventsByDate(eventNodes);
      }

      // Set events to the sport
      sportNode = sportNode.set('events', eventNodes);
      // Set sport to the all sports data
      allSportsData = allSportsData.push(sportNode);
    });
    return allSportsData;
  }
);

const getSportData = createSelector(
  [
    getSportById,
    getEventGroupsBySportId,
    getEventsByEventGroupId,
    getAllBettingMarketGroupsByEventId,
    getBettingMarketsWithOrderBook
  ],
  (sport, eventGroups, events, bmgsByEventID, bettingMarketsWithOrderBook) => {
    if (!eventGroups || !events || !sport) {
      return;
    }

    let sportData = Immutable.Map();

    sportData = sportData
      .set('eventGroups', eventGroups.get(sport.get('id')))
      .set('sportId', sport.get('id'))
      .set('sportName', sport.get('name'));

    eventGroups = sportData.get('eventGroups').map((eg) => {
      let eventList = events.get(eg.get('id'));

      if (eventList) {
        eventList = eventList.map((e) => {
          let bmgs = bmgsByEventID[e.get('id')];

          if (bmgs) {
            bmgs = bmgs.map((bmg) => {
              let bmgID = bmg.get('id');
              return bmg.set('bettingMarkets', bettingMarketsWithOrderBook[bmgID]);
            });

            bmgs = SportsbookUtils.sortAndCenter(bmgs);
          }
          
          // Put the list of BMGs into their respective events
          return e.set('bettingMarketGroups', bmgs);
        });

        eventList = eventList.filter((e) => e);

        eventList = SportsbookUtils.sortEventsByDate(eventList);

        if (eventList) {
          return eg.set('events', eventList.filter((e) => e));
        } else {
          return Immutable.List();
        }
      } else {
        return Immutable.List();
      }
    });

    eventGroups = eventGroups.filter((eg) => eg);

    sportData = sportData.set('eventGroups', eventGroups);

    return sportData;
  }
);

const getEventGroupData = createSelector(
  [
    getEventGroupById,
    getEventsByEventGroupId,
    getAllBettingMarketGroupsByEventId,
    getBettingMarketsWithOrderBook
  ],
  (eventGroup, events, bmgsByEventID, bettingMarketsWithOrderBook) => {
    if (!eventGroup || !events || !bmgsByEventID || !bettingMarketsWithOrderBook) {
      return;
    }

    let eventGroupData = Immutable.Map();

    eventGroupData = eventGroupData
      .set('name', eventGroup.get('name'))
      .set('id', eventGroup.get('id'));

    let eventList = events.get(eventGroup.get('id'));

    eventList = eventList.map((e) => {
      let bmgs = bmgsByEventID[e.get('id')];

      if(bmgs) {
        bmgs = bmgs.map((bmg) => {
          let bmgID = bmg.get('id');
          return bmg.set('bettingMarkets', bettingMarketsWithOrderBook[bmgID]);
        });

        bmgs = SportsbookUtils.sortAndCenter(bmgs);
      }
      
      // Put the list of BMGs into their respective events
      return e.set('bettingMarketGroups', bmgs);
    });

    eventList = eventList.filter((e) => e);

    eventList = SportsbookUtils.sortEventsByDate(eventList);

    eventGroupData = eventGroupData.set('events', eventList);

    return eventGroupData;
  }
);

const EventPageSelector = {
  getEvent,
  getMarketData,
  getBettingMarketGroupsByEventId,
  getEventIdByFromBMGId,
  getFirstBettingMarketGroupByEventId,
  getAllSportsData,
  getSportData,
  getEventGroupData
};

export default EventPageSelector;
