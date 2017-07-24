import { createSelector } from 'reselect';
import Immutable from 'immutable';

const getAccountId = (state) => {
  return state.getIn(['account', 'account','id'])
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

const getActiveEventsBySportId = createSelector(
  [
    getEventsById,
    getEventGroupsById
  ],
  (eventsById, eventGroupsById) => {
    // Active event is event whose start time is
    const isActiveEvent = (event) => (event.get('start_time') -  new Date()) > 0;
    return eventsById.filter(isActiveEvent).toList().groupBy(event => {
      const eventGroup = eventGroupsById.get(event.get('event_group_id'));
      return eventGroup && eventGroup.get('sport_id')
    });
  }
)

const getActiveEventsByEventGroupId = createSelector(
  getEventsById,
  (eventsById) => {
    // Active event is event whose start time is
    const isActiveEvent = (event) => (event.get('start_time') -  new Date()) > 0;
    return eventsById.filter(isActiveEvent).toList().groupBy(event => event.get('event_group_id'));
  }
)


const getBettingMarketGroupsById = (state) => {
  return state.getIn(['bettingMarketGroup', 'bettingMarketGroupsById']);
}

const getBettingMarketsById = (state) => {
  return state.getIn(['bettingMarket', 'bettingMarketsById']);
}

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
  ],
  (binnedOrderBooksByBettingMarketId, bettingMarketsById, bettingMarketGroupsById, eventsById) => {
    let simpleBettingWidgetBinnedOrderBooksByEventId = Immutable.Map();
    binnedOrderBooksByBettingMarketId.forEach((binnedOrderBook, bettingMarketId) => {
      const bettingMarket = bettingMarketsById.get(bettingMarketId);
      const bettingMarketGroupId = bettingMarket && bettingMarket.get('group_id');
      const bettingMarketGroup = bettingMarketGroupsById.get(bettingMarketGroupId);
      const eventId = bettingMarketGroup && bettingMarketGroup.get('event_id');
      // NOTE: Assume description can be used as comparison
      const isMoneyline = !!bettingMarketGroup && (bettingMarketGroup.get('description').toUpperCase() === 'MONEYLINE');
      if (eventId && isMoneyline) {
        // Implicit Rule: the first betting market is for the home team
        let simpleBettingWidgetBinnedOrderBook = Immutable.Map().set('betting_market_id', bettingMarketId)
                                                                .set('back', Immutable.List())
                                                                .set('lay', Immutable.List());
        simpleBettingWidgetBinnedOrderBook = simpleBettingWidgetBinnedOrderBook.set('back', binnedOrderBook.get('aggregated_back_bets'))
                                                                               .set('lay', binnedOrderBook.get('aggregated_lay_bets'));
        simpleBettingWidgetBinnedOrderBooksByEventId = simpleBettingWidgetBinnedOrderBooksByEventId.update(eventId, (simpleBettingWidgetBinnedOrderBooks) => {
          if (!simpleBettingWidgetBinnedOrderBooks) simpleBettingWidgetBinnedOrderBooks = Immutable.List();
          return simpleBettingWidgetBinnedOrderBooks.push(simpleBettingWidgetBinnedOrderBook);
        })
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
  getActiveEventsBySportId,
  getActiveEventsByEventGroupId,
  getBettingMarketGroupsById,
  getBettingMarketsById,
  getRulesById,
  getBinnedOrderBooksByBettingMarketId,
  getSimpleBettingWidgetBinnedOrderBooksByEventId

}

export default CommonSelector;
