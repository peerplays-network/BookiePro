import { createSelector } from 'reselect';
import { I18n } from 'react-redux-i18n';
import Immutable from 'immutable';
import CommonSelector from './CommonSelector';
import { CurrencyUtils, StringUtils } from '../utility';

const {
  getBettingMarketGroupsById,
  getEventsById,
  getCompetitorsById,
  getSportsById,
  getBettingMarketsById,
  getAssetsById,
  getBinnedOrderBooksByBettingMarketId,
  getCurrencyFormat
} = CommonSelector;

const homeId = 0;
const awayId = 1;

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

const getBettingMarketGroupName = createSelector([
  getBettingMarketGroup
], (bettingMarketGroup) => {
  let bettingMarketGroupName = (bettingMarketGroup && bettingMarketGroup.get('market_type_id'));
  if ( bettingMarketGroupName === 'Spread'){
    bettingMarketGroupName = I18n.t('bettingMarketGroup.spread');
  } else if ( bettingMarketGroupName === 'OverUnder'){
    bettingMarketGroupName = I18n.t('bettingMarketGroup.overunder');
  } else if ( bettingMarketGroupName === 'Moneyline'){
    bettingMarketGroupName = I18n.t('bettingMarketGroup.moneyline');
  }
  return bettingMarketGroupName;
})

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



const getHomeName = createSelector(
  [
    getEvent,
    getCompetitorsById
  ],
  (event, competitorsById) => {
    let homeName = '';
    if (event){
      const homeCompetitorId = event.getIn(['scores', homeId, 'competitor_id']);
      homeName = competitorsById.getIn([homeCompetitorId, 'name']) || '';
    }
    return homeName;
  }
)

const getAwayName = createSelector(
  [
    getEvent,
    getCompetitorsById
  ],
  (event, competitorsById) => {
    let awayName = '';
    if (event){
      const awayCompetitorId = event.getIn(['scores', awayId, 'competitor_id']);
      awayName = competitorsById.getIn([awayCompetitorId, 'name']) || '';
    }
    return awayName;
  }
)

const getSportName = createSelector(
  [
    getEvent,
    getCompetitorsById,
    getSportsById
  ],
  (event, competitorsById, sportsById) => {
    let sportName = '';
    if (event){
      const homeCompetitorId = event.getIn(['scores', homeId, 'competitor_id']);
      const sportId = competitorsById.getIn([homeCompetitorId, 'sport_id']);
      sportName = sportsById.getIn([sportId, 'name']) || '';
    }
    return sportName;
  }
)

const getBettingMarketIds = createSelector(
  getBettingMarketGroup,
  (bettingMarketGroup) => {
    const bettingMarketIds = (bettingMarketGroup && bettingMarketGroup.get('betting_market_ids')) || Immutable.List();
    return bettingMarketIds;
  }
)

const getBettingMarkets = createSelector(
  [
    getBettingMarketIds,
    getBettingMarketsById
  ],
  (bettingMarketIds, bettingMarketsById) => {
    let bettingMarkets = Immutable.List();
    bettingMarketIds.forEach((bettingMarketId) => {
      const bettingMarket = bettingMarketsById.get(bettingMarketId);
      if (bettingMarket) bettingMarkets = bettingMarkets.push(bettingMarket);
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
    const totalMatchedBetsAmount = CurrencyUtils.getFormattedCurrency(
      totalMatchedBetsAsset ?
        totalMatchedBetsByMarketGroupId.getIn([bettingMarketGroupId, 'amount']) / Math.pow(10, totalMatchedBetsAsset.get('precision')) : 0,
      currencyFormat,
      totalMatchedBetsAsset ? totalMatchedBetsAsset.get('precision') : 0,
      true );
    return totalMatchedBetsAmount;
  }
)

const getUnconfirmedBets = (state) => {
  return state.getIn(['marketDrawer', 'unconfirmedBets']);
}

const getWidgetTitle = (state) => {
  return state.getIn(['bettingMarketGroupPage', 'widgetTitle']);
}

const getMarketData = createSelector(
  [
    getBettingMarkets,
    getBinnedOrderBooksByBettingMarketId,
    getBettingMarketGroup,
    getHomeName,
    getAwayName
  ],
  (bettingMarkets, binnedOrderBooksByBettingMarketId, bettingMarketGroup, homeName, awayName) => {
    let marketData = Immutable.List();
    bettingMarkets.forEach((bettingMarket, i) => {
      const binnedOrderBook = binnedOrderBooksByBettingMarketId.get(bettingMarket.get('id'));

      const marketTypeId = bettingMarketGroup.get('market_type_id');

      // TODO: REMOVE this once we have the real Blockchain
      // Using payout_condition_string as PLACEHOLDER in case of (dummy) data integrity issue
      let data = Immutable.Map().set('displayName', bettingMarket.get('payout_condition_string'))
        .set('name', bettingMarket.get('payout_condition_string'))
        .set('marketTypeId', marketTypeId)

      const homeSelection = homeName ? homeName : data.get('displayName')
      const awaySelection = awayName ? awayName : data.get('displayName')

      //parse market type id to get team name ( for first column in complex betting widget)
      if ( marketTypeId === 'Spread'){

        const margin = bettingMarketGroup.getIn(['options', 'margin']);
        if ( i === homeId ){
          const signedMargin = StringUtils.formatSignedNumber(margin);
          data = data.set('displayedName', homeSelection + signedMargin )
            .set('name', homeSelection)
            .set('marketTypeValue', signedMargin);
        } else if ( i === awayId ){
          const signedMargin = StringUtils.formatSignedNumber(margin*-1);
          data = data.set('displayedName', awaySelection + signedMargin)
            .set('name', awaySelection)
            .set('marketTypeValue', signedMargin);
        }

      } else if ( marketTypeId === 'OverUnder'){

        const score = bettingMarketGroup.getIn(['options', 'score']);
        if ( i === 0 ){
          data = data.set('displayedName', I18n.t('bettingMarketGroup.over') + score )
            .set('name', homeSelection)
            .set('marketTypeValue', I18n.t('bettingMarketGroup.over') + score);
        } else if ( i === 1 ){
          data = data.set('displayedName', I18n.t('bettingMarketGroup.under') + score )
            .set('name', awaySelection)
            .set('marketTypeValue', I18n.t('bettingMarketGroup.under') + score );
        }

      } else if ( marketTypeId === 'Moneyline'){
        data = data.set('marketTypeValue', marketTypeId); // Moneyline has no extra option
        if ( i === homeId && homeName ){
          data = data.set('displayedName', homeSelection )
            .set('name', homeSelection);
        } else if ( i === awayId && awayName ){
          data = data.set('displayedName', awaySelection )
            .set('name', awaySelection);
        }

      }

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

const BettingMarketGroupPageSelector = {
  getSportName,
  getBettingMarketGroup,
  getBettingMarkets,
  getMarketData,
  getEventName,
  getEventTime,
  getBettingMarketGroupName,
  getTotalMatchedBetsAmount,
  getUnconfirmedBets,
  getLoadingStatus,
  getWidgetTitle,
}

export default BettingMarketGroupPageSelector;
