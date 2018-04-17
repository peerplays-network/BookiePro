import { createSelector } from 'reselect';
import Immutable from 'immutable';
import CommonSelector from './CommonSelector';
import { CurrencyUtils, ObjectUtils } from '../utility';
import { Config } from '../constants';

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

// Main selector forBettingMarketGroup.jsx
const getBettingMarketGroup = createSelector(
  [
    getBettingMarketGroupId,
    getBettingMarketGroupsById // List of betting market groups
  ],
  (bettingMarketGroupId, bettingMarketGroupsById) => {
    return bettingMarketGroupsById.get(bettingMarketGroupId);
  }
)
const getBettingMarketGroupStatus = createSelector(
  getBettingMarketGroup, // Id of current betting market group
  (bettingMarketGroup) => {
    return ObjectUtils.bettingMarketGroupStatus(bettingMarketGroup);
  }
)

const getBettingMarkets = createSelector(
  [
    getBettingMarketGroupId, 
    getBettingMarketsById // list of betting markets
  ],
  (bettingMarketGroupId, bettingMarketsById) => {
    // Filter all the betting markets by those that have the same BMG Id as the current BMG.
    let bettingMarkets = Immutable.List();
    bettingMarketsById.forEach((bettingMarket) => {
      if (bettingMarket.get('group_id') === bettingMarketGroupId ) {
        bettingMarkets = bettingMarkets.push(bettingMarket);
      }
    });
    return bettingMarkets;
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
)
const getEventStatus = createSelector(
  getEvent,
  (event) => {
    return ObjectUtils.eventStatus(event);
  }
)

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
    const eventTime = (event && event.get('start_time')) || new Date();
    return eventTime;
  }
)

const getIsLiveMarket = createSelector(
  getEvent,
  (event) => {
    return event && event.get('is_live_market');
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

const disabledStatus = (bmgStatus, bmStatus, eStatus) => {
  var results = [
    false,
    eStatus,
    bmgStatus,
    bmStatus,
    -1
  ]
  if(eStatus === 'frozen' || eStatus === 'finished' || eStatus === 'settled'){
    results = [
      true,
      eStatus,
      bmgStatus,
      bmStatus,
      1 // used to identify which status enumerator passed the conditional
    ]
  }
  if(bmgStatus === 'frozen' || bmgStatus === 'graded' || bmgStatus === 're_grading' || bmgStatus === 'settled'){
    results = [
      true,
      eStatus,
      bmgStatus,
      bmStatus,
      2 // used to identify which status enumerator passed the conditional
    ]
  }
  if(bmStatus[1] === 'win' || bmStatus[1] === 'not_win' || bmStatus[1] === 'frozen'){
    results = [
      true,
      eStatus,
      bmgStatus,
      bmStatus,
      3 // used to identify which status enumerator passed the conditional
    ]
  }
  return results;
}


const getMarketData = createSelector(
  [
    getBettingMarkets,
    getBinnedOrderBooksByBettingMarketId,
    getBettingMarketGroup,
    getAssetsById,
    getEventStatus
  ],
  (bettingMarkets, binnedOrderBooksByBettingMarketId, bettingMarketGroup, assetsById, eventStatus) => {
    let marketData = Immutable.List();
    bettingMarkets.forEach((bettingMarket, i) => {
      const binnedOrderBook = binnedOrderBooksByBettingMarketId.get(bettingMarket.get('id'));

      const bmgStatus = bettingMarketGroup.get('status');
      let data = Immutable.Map().set('displayName', bettingMarket.get('description'))
        .set('name', bettingMarket.get('description'))
        .set('displayedName',  bettingMarket.get('description'))
        .set('bettingMarket_status', ObjectUtils.bettingMarketStatus(bettingMarket.get('status')))
        .set('bmStatus', disabledStatus(bmgStatus, ObjectUtils.bettingMarketStatus(bettingMarket.get('status')), eventStatus[1].toLowerCase()));        

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

      let offer = Immutable.Map({
        backIndex: 0,
        layIndex: 0,
        bettingMarketId: bettingMarket.get('id'),
        bettingMarketStatus: bettingMarket.get('status'),
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
  getEventStatus,
  getBettingMarketGroupStatus,
  getIsLiveMarket,
  getTotalMatchedBetsAmount,
  getUnconfirmedBets,
  getLoadingStatus,
  getWidgetTitle,
  getRules
}

export default BettingMarketGroupPageSelector;
