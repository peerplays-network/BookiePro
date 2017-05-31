import { createSelector } from 'reselect';

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


const getSportsById = (state) => {
  return state.getIn(['sport', 'sportsById']);
}

const getEventGroupsById = (state) => {
  return state.getIn(['eventGroup', 'eventGroupsById']);
}

const getEventsById = (state) => {
  return state.getIn(['event', 'eventsById']);
}

const getCompetitorsById = (state) => {
  return state.getIn(['competitor', 'competitorsById']);
}

const getBettingMarketGroupsById = (state) => {
  return state.getIn(['bettingMarketGroup', 'bettingMarketGroupsById']);
}

const getBettingMarketsById = (state) => {
  return state.getIn(['bettingMarket', 'bettingMarketsById']);
}

const getBinnedOrderBooksByBettingMarketId = (state) => {
  return state.getIn(['binnedOrderBook', 'binnedOrderBooksByBettingMarketId']);
}

const CommonSelector = {
  getAccountId,
  getCurrencyFormat,
  getNotificationSetting,
  getAssetsById,
  getSportsById,
  getEventGroupsById,
  getEventsById,
  getCompetitorsById,
  getBettingMarketGroupsById,
  getBettingMarketsById,
  getBinnedOrderBooksByBettingMarketId

}

export default CommonSelector;
