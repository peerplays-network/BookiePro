import { createSelector } from 'reselect';
import Immutable from 'immutable';
import CommonSelector from './CommonSelector';
import { CurrencyUtils } from '../utility';

const {
  getBettingMarketGroupsById,
  getEventsById,
  getBettingMarketsById,
  getAssetsById,
  getRulesById,
  getBinnedOrderBooksByBettingMarketId,
  getCurrencyFormat
} = CommonSelector;

const getBettingMarketGroupId = (state, props) => {
  return props.params.objectId;
}

const getLoadingStatusByBettingMarketGroupId = (state) => {
  return state.getIn(['bettingMarketGroupPage', 'loadingStatusByBettingMarketGroupId']);
}

const getLoadingStatus = createSelector(
  [
    getBettingMarketGroupId,
    getLoadingStatusByBettingMarketGroupId
  ],
  (bettingMarketGroupId, loadingStatusByBettingMarketGroupId) => {
    return loadingStatusByBettingMarketGroupId.get(bettingMarketGroupId);
  }
)

const getBettingMarketGroup = createSelector(
  [
    getBettingMarketGroupId,
    getBettingMarketGroupsById
  ],
  (bettingMarketGroupId, bettingMarketGroupsById) => {
    return bettingMarketGroupsById.get(bettingMarketGroupId);
  }
)

const getEvent = createSelector(
  [
    getBettingMarketGroup,
    getEventsById
  ],
  (bettingMarketGroup, eventsById) => {
    const event = bettingMarketGroup && eventsById.get(bettingMarketGroup.get('event_id'));
    return event;
  }
);

const getEventName = createSelector(
  getEvent,
  (event) => {
    const eventName = (event && event.get('name')) || '';
    return eventName;
  }
)

const getEventTime = createSelector(
  getEvent,
  (event) => {
    const eventTime = (event && event.get('start_time') && new Date(event.get('start_time'))) || new Date();
    return eventTime;
  }
)

const getIsLiveMarket = createSelector(
  getEvent,
  (event) => {
    return event && event.get('isLiveMarket');
  }
)


const getBettingMarkets = createSelector(
  [
    getBettingMarketGroupId,
    getBettingMarketsById
  ],
  (bettingMarketGroupId, bettingMarketsById) => {
    let bettingMarkets = Immutable.List();
    bettingMarketsById.forEach((bettingMarket) => {
      if (bettingMarket.get('group_id') === bettingMarketGroupId ) {
        bettingMarkets = bettingMarkets.push(bettingMarket);
      }
    });
    return bettingMarkets;
  }
)

const getTotalMatchedBetsByMarketGroupId = (state) => {
  return state.getIn(['liquidity', 'totalMatchedBetsByBettingMarketGroupId']);
}


const getTotalMatchedBetsAmount = createSelector(
  [
    getBettingMarketGroupId,
    getAssetsById,
    getTotalMatchedBetsByMarketGroupId,
    getCurrencyFormat
  ],
  (bettingMarketGroupId, assetsById, totalMatchedBetsByMarketGroupId, currencyFormat) => {
    const totalMatchedBetsAssetId = totalMatchedBetsByMarketGroupId.getIn([bettingMarketGroupId, 'asset_id']);
    const totalMatchedBetsAsset = assetsById.get(totalMatchedBetsAssetId)
    const totalMatchedBetsAssetPrecision = totalMatchedBetsAsset ? totalMatchedBetsAsset.get('precision') : 0;
    const totalMatchedBetsAmount = CurrencyUtils.formatByCurrencyAndPrecisionWithSymbol(
      totalMatchedBetsByMarketGroupId.getIn([bettingMarketGroupId, 'amount']) / Math.pow(10, totalMatchedBetsAssetPrecision),
      currencyFormat,
      totalMatchedBetsAssetPrecision,
      true );
    return totalMatchedBetsAmount;
  }
)

const getUnconfirmedBets = (state) => {
  return state.getIn(['marketDrawer', 'unconfirmedBets']);
}

const getWidgetTitle = createSelector([
  getBettingMarketGroup
], (bettingMarketGroup) => {
  return (bettingMarketGroup && bettingMarketGroup.get('description')) || '';
})

const getMarketData = createSelector(
  [
    getBettingMarkets,
    getBinnedOrderBooksByBettingMarketId,
    getBettingMarketGroup,
  ],
  (bettingMarkets, binnedOrderBooksByBettingMarketId, bettingMarketGroup) => {
    let marketData = Immutable.List();
    bettingMarkets.forEach((bettingMarket, i) => {
      const binnedOrderBook = binnedOrderBooksByBettingMarketId.get(bettingMarket.get('id'));
      let data = Immutable.Map().set('displayName', bettingMarket.get('description'))
        .set('name', bettingMarket.get('description'))
        .set('displayedName',  bettingMarket.get('description'));

      const aggregated_lay_bets = (binnedOrderBook && binnedOrderBook.get('aggregated_lay_bets')) || Immutable.List();
      const aggregated_back_bets = (binnedOrderBook && binnedOrderBook.get('aggregated_back_bets')) || Immutable.List();
      let offer = Immutable.Map({
        backIndex: 0,
        layIndex: 0,
        bettingMarketId: bettingMarket.get('id'),
        backOrigin: aggregated_lay_bets.sort((a, b) => b.get('odds') - a.get('odds')),  //display in descending order, ensure best odd is in the first index
        layOrigin: aggregated_back_bets.sort((a, b) => a.get('odds') - b.get('odds')),  //display in ascending order, ensure best odd is in the first index
        bettingMarketGroup: bettingMarketGroup,
      })
      data = data.set('offer', offer);
      marketData = marketData.push(data);
    });
    return marketData;
  }
)

const getRules = createSelector(
  [getRulesById, getBettingMarketGroup],
  (rulesById, bettingMarketGroup) => {
    const ruleId = bettingMarketGroup && bettingMarketGroup.get('rules_id');
    return rulesById.get(ruleId);
  }
)

const BettingMarketGroupPageSelector = {
  getBettingMarketGroup,
  getBettingMarkets,
  getMarketData,
  getEventName,
  getEventTime,
  getIsLiveMarket,
  getTotalMatchedBetsAmount,
  getUnconfirmedBets,
  getLoadingStatus,
  getWidgetTitle,
  getRules
}

export default BettingMarketGroupPageSelector;
