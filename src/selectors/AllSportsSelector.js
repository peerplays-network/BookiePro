import CommonSelector from './CommonSelector';
import { createSelector } from 'reselect';
import Immutable from 'immutable';
import { DateUtils } from '../utility';
import { Config } from '../constants';

const {
  getBettingMarketsById,
  getSportsById,
  getActiveEventsBySportId,
  getSimpleBettingWidgetBinnedOrderBooksByEventId,
  getBettingMarketGroupsById
} = CommonSelector;

const getAllSportsLoadingStatus = (state) => state.getIn(['allSports', 'loadingStatus']);

// All Sports Data is in the following format
// [
//   {
//     "name": "American Football",
//     "sport_id": "1.100.1",
//     "events": [
//       {
//         "event_id": "1.103.7",
//         "event_name": "Cincinnati Bengals vs New York Jets",
//         "time": 1497428288000,
//         "isLiveMarket": true,
//         "offers": [
//           {
//             "betting_market_id": "1.105.37",
//             "back": [
//               {
//                 "odds": 4.9,
//                 "price": 0.63
//               },
//               {
//                 "odds": 3.9,
//                 "price": 0.46
//               }
//             ],
//             "lay": [
//               {
//                 "odds": 4.13,
//                 "price": 0.8
//               },
//               {
//                 "odds": 3.6,
//                 "price": 0.72
//               }
//             ]
//           },
//           ...
//         ],
//         "moneyline": "1.104.19"
//       },
//       ...
//     ],
//   },
//   ...
// ]

// This functions extract the various part of all sport details.
// Including events, betting markets, binned order books, sports
const getAllSportsData = createSelector(
  [
    getAllSportsLoadingStatus,
    getSportsById,
    getActiveEventsBySportId,
    getBettingMarketsById,
    getSimpleBettingWidgetBinnedOrderBooksByEventId,
    getBettingMarketGroupsById
  ],
  (allSportsLoadingStatus, sportsById, activeEventsBySportId, bettingMarketsById, simpleBettingWidgetBinnedOrderBooksByEventId, bettingMarketGroupsById) => {
    // Process all sports data only if the necessary data has been finished loaded
    // NOTE if you do not want to see incremental update, re-enable this if clause
    // if (allSportsLoadingStatus !== LoadingStatus.DONE) {
    //   return Immutable.List();
    // }
    let coreAsset = Config.coreAsset;

    let allSportsData = Immutable.List();
    // Iterate over all sports to create sport node
    sportsById.forEach((sport) => {
      // Initialize sport node
      let sportNode = Immutable.Map().set('name', sport.get('name'))
                                      .set('sport_id', sport.get('id'));
      // Create event nodes based on active events
      const activeEvents = activeEventsBySportId.get(sport.get('id')) || Immutable.List();
      const eventNodes = activeEvents.map((event) => {
        if (event.get('status') !== null){
          const offers = simpleBettingWidgetBinnedOrderBooksByEventId.get(event.get('id')) || Immutable.List();
          // Find the Betting Market Group of this event
          const bettingMarketId = offers.getIn(['0', 'betting_market_id']);
          const bettingMarketGroupId = bettingMarketsById.getIn([bettingMarketId, 'group_id']);
          const bettingMarketGroupAsset = bettingMarketGroupsById.getIn([bettingMarketGroupId, 'asset_id']);
          // Create event node
          return Immutable.fromJS({
            event_id: event.get('id'),
            event_name: event.get('name'),
            time: DateUtils.getLocalDate(event.get('start_time')),
            isLiveMarket: event.get('is_live_market'),
            eventStatus: event.get('status').toLowerCase(),
            offers,
            bettingMarketGroupId: bettingMarketGroupId,
            bmgAsset: bettingMarketGroupAsset
          });
        }
      }).filter( eventNode => {
        // Feature check       
        const isCoreAsset = eventNode.get('bmgAsset') === coreAsset;
        return isCoreAsset ? eventNode : null;
      });
      // Set events to the sport
      sportNode = sportNode.set('events', eventNodes);
      // Set sport to the all sports data
      allSportsData = allSportsData.push(sportNode);
    });

    return allSportsData;
  }
)

const getGlobalBettingStatistics = (state) => {
  return state.getIn(['app', 'globalBettingStatistics']);
}

const AllSportsSelector = {
  getAllSportsData,
  getGlobalBettingStatistics
}

export default AllSportsSelector;
