/**
 * In simply, Reselect is useful preventing unnecessary rerenders and recalculations, 
 * through memorization.
 * For reference, http://blog.rangle.io/react-and-redux-performance-with-reselect/
 * and https://docs.mobify.com/progressive-web/0.15.0/guides/reselect/
 */
import {createSelector} from 'reselect';
import {ObjectUtils} from '../utility';
import {Config} from '../constants';
import Immutable from 'immutable';

const getAccountId = (state) => state.getIn(['account', 'account', 'id']);

const getSettingByAccountId = (state) => state.getIn(['setting', 'settingByAccountId']);

const getDefaultSetting = (state) => state.getIn(['setting', 'defaultSetting']);

const getSetting = createSelector(
  [getAccountId, getSettingByAccountId, getDefaultSetting],
  (
    accountId, 
    settingByAccountId, 
    defaultSetting
  ) => settingByAccountId.get(accountId) || defaultSetting
);

const getCurrencyFormat = createSelector(getSetting, (setting) => setting.get('currencyFormat'));
const getNotificationSetting = createSelector(getSetting, (setting) => setting.get('notification'));

const getAssetsById = (state) => state.getIn(['asset', 'assetsById']);

const getRulesById = (state) => state.getIn(['rule', 'rulesById']);

const getSportsById = (state) => state.getIn(['sport', 'sportsById']);

const getSportById = (state, sportId) => state.getIn(['sport', 'sportsById', sportId]);

const getEventGroupsById = (state) => state.getIn(['eventGroup', 'eventGroupsById']);

const getEventGroupById = (state, eventGroupId) => state.getIn(['eventGroup', 'eventGroupsById', eventGroupId]); // eslint-disable-line

const getEventGroupsBySportId = createSelector(
  getEventGroupsById, 
  (eventGroupsById) => eventGroupsById.toList().groupBy((eventGroup) => eventGroup.get('sport_id'))
);

const getEventsById = (state) => state.getIn(['event', 'eventsById']);

const getPersistedEventsById = (state) => state.getIn(['event', 'persistedEventsById']);

const getAggregatedEventsById = createSelector(
  [getEventsById, getPersistedEventsById],
  (eventsById, persistedEventsById) => eventsById.concat(persistedEventsById)
);

const getEventStatusById = createSelector([getEventsById], (eventsById) => {
  const eventStatus = (event) => ObjectUtils.eventStatus(event);
  return eventsById.filter(eventStatus);
});

const getActiveEventsById = createSelector([getEventsById], (eventsById) => {
  const isActiveEvent = (event) => ObjectUtils.isActiveEvent(event);
  return eventsById.filter(isActiveEvent);
});

const getActiveEventsBySportId = createSelector(
  [getActiveEventsById, getEventGroupsById],
  (activeEventsById, eventGroupsById) => activeEventsById.toList().groupBy((event) => {
    const eventGroup = eventGroupsById.get(event.get('event_group_id'));
    return eventGroup && eventGroup.get('sport_id');
  })
);

const getEventsByEventGroupId = createSelector(
  getEventsById, 
  (eventsById) => eventsById.toList().groupBy((event) => event.get('event_group_id'))
);

const getActiveEventsByEventGroupId = createSelector(
  getActiveEventsById, 
  (activeEventsById) => activeEventsById.toList().groupBy((event) => event.get('event_group_id'))
);

const getBettingMarketGroupsById = (state) => state
  .getIn(['bettingMarketGroup', 'bettingMarketGroupsById']);

const getPersistedBettingMarketGroupsById = (state) => state
  .getIn(['bettingMarketGroup', 'persistedBettingMarketGroupsById']);

const getAggregatedBettingMarketGroupsById = createSelector(
  [
    getBettingMarketGroupsById, 
    getPersistedBettingMarketGroupsById
  ],
  (
    bettingMarketGroupsById, 
    persistedBettingMarketGroupsById
  ) => bettingMarketGroupsById.concat(persistedBettingMarketGroupsById)
);

const getBettingMarketsById = (state) => state.getIn(['bettingMarket', 'bettingMarketsById']);

const getPersistedBettingMarketsById = (state) => state
  .getIn(['bettingMarket', 'persistedBettingMarketsById']);

const getAggregatedBettingMarketsById = createSelector(
  [getBettingMarketsById, getPersistedBettingMarketsById],
  (
    bettingMarketsById, 
    persistedBettingMarketsById
  ) => bettingMarketsById.concat(persistedBettingMarketsById)
);

const getBinnedOrderBooksByBettingMarketId = (state) => state
  .getIn(['binnedOrderBook', 'binnedOrderBooksByBettingMarketId']);

// The structure of the binned order book used for simple betting widget is as the following
// {
//    "betting_market_id": "1.105.37",
//      "back": [
//       {
//         "odds": 4.9,
//         "price": 0.63
//       },
//       {
//         "odds": 3.9,
//         "price": 0.46
//       }
//     ],
//     "lay": [
//       {
//         "odds": 4.13,
//         "price": 0.8
//       },
//       {
//         "odds": 3.6,
//         "price": 0.72
//       }
//     ]
//   },
const getSimpleBettingWidgetBinnedOrderBooksByEventId = createSelector(
  [
    getBinnedOrderBooksByBettingMarketId,
    getBettingMarketsById,
    getBettingMarketGroupsById,
    getEventsById,
    getAssetsById,
    getEventGroupsById
  ],
  // TO DO: FIX ME. .map with .filter
  (
    binnedOrderBooksByBettingMarketId,
    bettingMarketsById,
    bettingMarketGroupsById,
    eventsById,
    assetsById,
    eventGroupsById
  ) => {
    let simpleBettingWidgetBinnedOrderBooksByEventId = Immutable.Map();
    binnedOrderBooksByBettingMarketId.forEach((binnedOrderBook, bettingMarketId) => {
      const bettingMarket = bettingMarketsById.get(bettingMarketId);
      const bettingMarketGroupId = bettingMarket && bettingMarket.get('group_id');
      const bettingMarketGroup = bettingMarketGroupsById.get(bettingMarketGroupId);
      const eventId = bettingMarketGroup && bettingMarketGroup.get('event_id');

      if (eventsById.get(eventId) !== undefined) {
        const eventGroupId = eventsById.get(eventId).get('event_group_id');
        const eventGroupName = eventGroupsById.get(eventGroupId).get('name');

        // Ensure bettingMarketGroup exists.
        // Remove instances of friendly international event group(s) from the bookie pro fun beta.
        if (
          bettingMarketGroup !== undefined &&
          eventGroupName.toUpperCase() !== 'FRIENDLY INTERNATIONAL'
        ) {
          // NOTE: Assume description can be used as comparison
          var passesFilters =
            !!bettingMarketGroup &&
            (bettingMarketGroup.get('description').toUpperCase() === 'MONEYLINE' ||
              bettingMarketGroup.get('description').toUpperCase() === 'MATCH ODDS');

          if (eventId && passesFilters) {
            // Implicit Rule: the first betting market is for the home team
            let simpleBettingWidgetBinnedOrderBook = Immutable.Map()
              .set('betting_market_id', bettingMarketId)
              .set('back', Immutable.List())
              .set('lay', Immutable.List());

            // Normalize aggregated_lay_bets and aggregated_back_bets
            const assetPrecision = assetsById.getIn([
              bettingMarketGroup.get('asset_id'),
              'precision'
            ]);
            let aggregated_lay_bets =
              (binnedOrderBook && binnedOrderBook.get('aggregated_lay_bets')) || Immutable.List();
            aggregated_lay_bets = aggregated_lay_bets.map((aggregated_lay_bet) => {
              const odds = aggregated_lay_bet.get('backer_multiplier') / Config.oddsPrecision;
              const price = aggregated_lay_bet.get('amount_to_bet') / Math.pow(10, assetPrecision);
              return aggregated_lay_bet.set('odds', odds).set('price', price);
            });
            let aggregated_back_bets =
              (binnedOrderBook && binnedOrderBook.get('aggregated_back_bets')) || Immutable.List();
            aggregated_back_bets = aggregated_back_bets.map((aggregated_back_bet) => {
              const odds = aggregated_back_bet.get('backer_multiplier') / Config.oddsPrecision;
              const price = aggregated_back_bet.get('amount_to_bet') / Math.pow(10, assetPrecision);
              return aggregated_back_bet.set('odds', odds).set('price', price);
            });
            simpleBettingWidgetBinnedOrderBook = simpleBettingWidgetBinnedOrderBook
              .set('back', aggregated_back_bets)
              .set('lay', aggregated_lay_bets);

            simpleBettingWidgetBinnedOrderBooksByEventId = simpleBettingWidgetBinnedOrderBooksByEventId.update( // eslint-disable-line
              eventId,
              (simpleBettingWidgetBinnedOrderBooks) => {
                if (!simpleBettingWidgetBinnedOrderBooks) {
                  simpleBettingWidgetBinnedOrderBooks = Immutable.List();
                }

                return simpleBettingWidgetBinnedOrderBooks.push(simpleBettingWidgetBinnedOrderBook);
              }
            );
          }
        }
      }
    });
    return simpleBettingWidgetBinnedOrderBooksByEventId;
  }
);

const CommonSelector = {
  getAccountId,
  getCurrencyFormat,
  getNotificationSetting,
  getAssetsById,
  getSportsById,
  getSportById,
  getEventGroupsById,
  getEventGroupsBySportId,
  getEventGroupById,
  getEventsById,
  getPersistedEventsById,
  getAggregatedEventsById,
  getEventStatusById,
  getActiveEventsById,
  getActiveEventsBySportId,
  getEventsByEventGroupId,
  getActiveEventsByEventGroupId,
  getPersistedBettingMarketGroupsById,
  getAggregatedBettingMarketGroupsById,
  getBettingMarketGroupsById,
  getPersistedBettingMarketsById,
  getAggregatedBettingMarketsById,
  getBettingMarketsById,
  getRulesById,
  getBinnedOrderBooksByBettingMarketId,
  getSimpleBettingWidgetBinnedOrderBooksByEventId
};

export default CommonSelector;
