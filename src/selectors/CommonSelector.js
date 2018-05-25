/**
 * In simply, Reselect is useful preventing unnecessary rerenders and recalculations, through memorization.
 * For reference, http://blog.rangle.io/react-and-redux-performance-with-reselect/
 * and https://docs.mobify.com/progressive-web/0.15.0/guides/reselect/
 */
import { createSelector } from 'reselect';
import { ObjectUtils } from '../utility';
import { Config } from '../constants';
import Immutable from 'immutable';

const getAccountId = (state) => {
  return state.getIn(['account', 'account', 'id'])
}

const getSettingByAccountId = (state) => {
  return state.getIn(['setting', 'settingByAccountId']);
}

const getDefaultSetting = (state) => {
  return state.getIn(['setting', 'defaultSetting']);
}

const getSetting = createSelector(
  [
    getAccountId,
    getSettingByAccountId,
    getDefaultSetting
  ],
  (accountId, settingByAccountId, defaultSetting) => {
    return settingByAccountId.get(accountId) || defaultSetting;
  }
)

const getCurrencyFormat = createSelector(
  getSetting,
  (setting) => {
    return setting.get('currencyFormat');
  }
)
const getNotificationSetting = createSelector(
  getSetting,
  (setting) => {
    return setting.get('notification');
  }
)

const getAssetsById = (state) => {
  return state.getIn(['asset', 'assetsById']);
}

const getRulesById = (state) => {
  return state.getIn(['rule', 'rulesById']);
}

const getSportsById = (state) => {
  return state.getIn(['sport', 'sportsById']);
}

const getEventGroupsById = (state) => {
  return state.getIn(['eventGroup', 'eventGroupsById']);
}

const getEventGroupsBySportId = createSelector(
  getEventGroupsById,
  (eventGroupsById) => {
    return eventGroupsById.toList().groupBy(eventGroup => eventGroup.get('sport_id'));
  }
)

const getEventsById = (state) => {
  return state.getIn(['event', 'eventsById']);
}

const getPersistedEventsById = (state) => {
  return state.getIn(['event', 'persistedEventsById']);
}

const getAggregatedEventsById = createSelector([
  getEventsById,
  getPersistedEventsById
], (eventsById, persistedEventsById) => {
  return eventsById.concat(persistedEventsById);
});

const getEventStatusById = createSelector(
  [
    getEventsById
  ],
  (eventsById) => {
    const eventStatus = (event) => (ObjectUtils.eventStatus(event));
    return eventsById.filter(eventStatus);
  }
)

const getActiveEventsById = createSelector(
  [
    getEventsById
  ],
  (eventsById) => {
    const isActiveEvent = (event) => (ObjectUtils.isActiveEvent(event));
    return eventsById.filter(isActiveEvent);
  }
);

const getActiveEventsBySportId = createSelector(
  [
    getActiveEventsById,
    getEventGroupsById
  ],
  (activeEventsById, eventGroupsById) => {
    return activeEventsById.toList().groupBy(event => {
      const eventGroup = eventGroupsById.get(event.get('event_group_id'));
      return eventGroup && eventGroup.get('sport_id')
    });
  }
)

const getEventsByEventGroupId = createSelector(
  getEventsById,
  (eventsById) => {
    return eventsById.toList().groupBy(event => event.get('event_group_id'));
  }
)

const getActiveEventsByEventGroupId = createSelector(
  getActiveEventsById,
  (activeEventsById) => {
    return activeEventsById.toList().groupBy(event => event.get('event_group_id'));
  }
)

const getBettingMarketGroupsById = (state) => {
  return state.getIn(['bettingMarketGroup', 'bettingMarketGroupsById']);
}

const getPersistedBettingMarketGroupsById = (state) => {
  return state.getIn(['bettingMarketGroup', 'persistedBettingMarketGroupsById']);
}

const getAggregatedBettingMarketGroupsById = createSelector([
  getBettingMarketGroupsById,
  getPersistedBettingMarketGroupsById
], (bettingMarketGroupsById, persistedBettingMarketGroupsById) => {
  return bettingMarketGroupsById.concat(persistedBettingMarketGroupsById);
});

const getBettingMarketsById = (state) => {
  return state.getIn(['bettingMarket', 'bettingMarketsById']);
}

const getPersistedBettingMarketsById = (state) => {
  return state.getIn(['bettingMarket', 'persistedBettingMarketsById']);
}

const getAggregatedBettingMarketsById = createSelector([
  getBettingMarketsById,
  getPersistedBettingMarketsById
], (bettingMarketsById, persistedBettingMarketsById) => {
  return bettingMarketsById.concat(persistedBettingMarketsById);
});

const getBinnedOrderBooksByBettingMarketId = (state) => {
  return state.getIn(['binnedOrderBook', 'binnedOrderBooksByBettingMarketId']);
}

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
    getAssetsById
  ],
  (binnedOrderBooksByBettingMarketId, bettingMarketsById, bettingMarketGroupsById, eventsById, assetsById) => {
    let simpleBettingWidgetBinnedOrderBooksByEventId = Immutable.Map();
    binnedOrderBooksByBettingMarketId.forEach((binnedOrderBook, bettingMarketId) => {
      const bettingMarket = bettingMarketsById.get(bettingMarketId);
      const bettingMarketGroupId = bettingMarket && bettingMarket.get('group_id');
      const bettingMarketGroup = bettingMarketGroupsById.get(bettingMarketGroupId);
      const eventId = bettingMarketGroup && bettingMarketGroup.get('event_id');
      if(bettingMarketGroup !== undefined){
        // NOTE: Assume description can be used as comparison
        let moneylineFilterEnabled = Config.features.moneylineFilter;          
        var isMoneyline = !!bettingMarketGroup && (bettingMarketGroup.get('description').toUpperCase() === 'MONEYLINE');
        // If the moneyline filter is disabled, flip the isMoneyline bool so that bets can still be viewed and placed.
        if (!moneylineFilterEnabled){
          isMoneyline = true;
        }
        if (eventId && isMoneyline) {
          // Implicit Rule: the first betting market is for the home team
          let simpleBettingWidgetBinnedOrderBook = Immutable.Map().set('betting_market_id', bettingMarketId)
            .set('back', Immutable.List())
            .set('lay', Immutable.List());

          // Normalize aggregated_lay_bets and aggregated_back_bets
          const assetPrecision = assetsById.getIn([bettingMarketGroup.get('asset_id'), 'precision']);
          let aggregated_lay_bets = (binnedOrderBook && binnedOrderBook.get('aggregated_lay_bets')) || Immutable.List();
          aggregated_lay_bets = aggregated_lay_bets.map(aggregated_lay_bet => {
            const odds = aggregated_lay_bet.get('backer_multiplier') / Config.oddsPrecision;
            const price = aggregated_lay_bet.get('amount_to_bet') / Math.pow(10, assetPrecision);
            return aggregated_lay_bet.set('odds', odds)
              .set('price', price);
          });
          let aggregated_back_bets = (binnedOrderBook && binnedOrderBook.get('aggregated_back_bets')) || Immutable.List();
          aggregated_back_bets = aggregated_back_bets.map(aggregated_back_bet => {
            const odds = aggregated_back_bet.get('backer_multiplier') / Config.oddsPrecision;
            const price = aggregated_back_bet.get('amount_to_bet') / Math.pow(10, assetPrecision);
            return aggregated_back_bet.set('odds', odds)
              .set('price', price);
          });
          simpleBettingWidgetBinnedOrderBook = simpleBettingWidgetBinnedOrderBook.set('back', aggregated_back_bets)
            .set('lay', aggregated_lay_bets);
          simpleBettingWidgetBinnedOrderBooksByEventId = simpleBettingWidgetBinnedOrderBooksByEventId.update(eventId, (simpleBettingWidgetBinnedOrderBooks) => {
            if (!simpleBettingWidgetBinnedOrderBooks) simpleBettingWidgetBinnedOrderBooks = Immutable.List();
            return simpleBettingWidgetBinnedOrderBooks.push(simpleBettingWidgetBinnedOrderBook);
          })
        }
      }
    })
    return simpleBettingWidgetBinnedOrderBooksByEventId;
  }
)


const CommonSelector = {
  getAccountId,
  getCurrencyFormat,
  getNotificationSetting,
  getAssetsById,
  getSportsById,
  getEventGroupsById,
  getEventGroupsBySportId,
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

}

export default CommonSelector;
