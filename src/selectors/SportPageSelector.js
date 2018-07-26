import CommonSelector from './CommonSelector';
import {createSelector} from 'reselect';
import Immutable from 'immutable';
import {DateUtils} from '../utility';
import {Config} from '../constants';

const {
  getBettingMarketsById,
  getSportsById,
  getEventGroupsBySportId,
  getActiveEventsByEventGroupId,
  getSimpleBettingWidgetBinnedOrderBooksByEventId,
  getBettingMarketGroupsById
} = CommonSelector;

const getRelatedSportId = (state, ownProps) => ownProps.params.objectId;

const getSport = createSelector(
  [getSportsById, getRelatedSportId],
  (sportsById, relatedSportId) => sportsById.get(relatedSportId)
);

const getSportName = createSelector(
  [getRelatedSportId, getSportsById], 
  (sportId, sportsById) => sportsById.getIn([sportId, 'name']) || ''
);

const getSportPageLoadingStatusBySportId = state => state
  .getIn(['sportPage', 'loadingStatusBySportId']);

const getSportPageLoadingStatus = createSelector(
  [getRelatedSportId, getSportPageLoadingStatusBySportId],
  (
    relatedSportId, 
    sportPageLoadingStatusBySportId
  ) => sportPageLoadingStatusBySportId.get(relatedSportId)
);

// Sport page data is in the following format
// [
//   {
//     "name": "NFL",
//     "event_group_id": "1.101.1",
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
//         ]
//       },
//       ...
//     ],
//   },
//   ...
// ]
const getSportPageData = createSelector(
  [
    getRelatedSportId,
    getSportPageLoadingStatus,
    getEventGroupsBySportId,
    getActiveEventsByEventGroupId,
    getBettingMarketsById,
    getSimpleBettingWidgetBinnedOrderBooksByEventId,
    getBettingMarketGroupsById
  ],
  (
    relatedSportId,
    sportPageLoadingStatus,
    eventGroupsBySportId,
    activeEventsByEventGroupId,
    bettingMarketsById,
    simpleBettingWidgetBinnedOrderBooksByEventId,
    bettingMarketGroupsById
  ) => {
    // Process all sports data only if the necessary data has been finished loaded
    // NOTE if you do not want to see incremental update, re-enable this if clause
    // if (sportPageLoadingStatus !== LoadingStatus.DONE) {
    //   return Immutable.List();
    // }
    let sportPageData = Immutable.List();
    const eventGroups = eventGroupsBySportId.get(relatedSportId) || Immutable.List();
    let coreAsset = Config.coreAsset;
    eventGroups.forEach(eventGroup => {
      // Initialize event group node
      let eventGroupNode = Immutable.Map()
        .set('name', eventGroup.get('name'))
        .set('event_group_id', eventGroup.get('id'));
      // Create event nodes based on active events
      const activeEvents = activeEventsByEventGroupId.get(eventGroup.get('id')) || Immutable.List();
      const eventNodes = activeEvents
        .map(event => {
          if (event.get('status') !== null && event.get('status') !== undefined) {
            const offers =
              simpleBettingWidgetBinnedOrderBooksByEventId.get(event.get('id')) || Immutable.List();
            // Find the Betting Market Group of this event
            const bettingMarketId = offers.getIn(['0', 'betting_market_id']);
            const bettingMarketGroupId = bettingMarketsById.getIn([bettingMarketId, 'group_id']);
            const bettingMarketGroupAsset = bettingMarketGroupsById.getIn([
              bettingMarketGroupId,
              'asset_id'
            ]);
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
          } else {
            return Immutable.List();
          }
        })
        .filter(eventNode => {
          // Filter out results that do not have betting market group UIA 
          // matching the configured UIA in Config.js
          const isCoreAsset = eventNode.get('bmgAsset') === coreAsset;
          return isCoreAsset ? eventNode : null;
        });

      // Set events to the event group node
      eventGroupNode = eventGroupNode.set('events', eventNodes);
      // Set event group to the sport page data
      sportPageData = sportPageData.push(eventGroupNode);
    });

    return sportPageData;
  }
);

const SportPageSelector = {
  getSport,
  getSportPageData,
  getSportName
};

export default SportPageSelector;
