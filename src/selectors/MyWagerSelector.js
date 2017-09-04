import React from 'react';
import { I18n } from 'react-redux-i18n';
import { createSelector } from 'reselect';
import _ from 'lodash';
import moment from 'moment';
import { CurrencyUtils, BettingModuleUtils, DateUtils, MyWagerUtils, ObjectUtils } from '../utility';
import { TimeRangePeriodTypes, MyWagerTabTypes, LoadingStatus } from '../constants';
import CommonSelector from './CommonSelector';
import Immutable from 'immutable';

const { mergeRelationData } = MyWagerUtils;
const { getStakeFromBetObject, getProfitLiabilityFromBetObject } = ObjectUtils;

const {
  getBettingMarketGroupsById,
  getBettingMarketsById,
  getEventsById,
  getSportsById,
  getAssetsById,
  getEventGroupsById,
  getCurrencyFormat
} = CommonSelector;

const getFormattedDate = DateUtils.getFormattedDate;

const getPrecision = createSelector(
  getAssetsById,
  (assetsById) => {
    return assetsById.getIn(['1.3.0', 'precision']);
  }
)

const getActiveTab = (state) => state.getIn(['mywager','activeTab']);


const getResolvedBetsPeriodType = (state) => state.getIn(['mywager', 'periodType']);
const getResolvedBetsCustomTimeRangeStartDate = (state) => state.getIn(['mywager', 'customTimeRangeStartDate']);
const getResolvedBetsCustomTimeRangeEndDate = (state) => state.getIn(['mywager', 'customTimeRangeEndDate']);

const startDate = createSelector(
  [
    getResolvedBetsPeriodType,
    getResolvedBetsCustomTimeRangeStartDate
  ],
   (periodType, customTimeRangeStartDate) => {
     if (periodType === TimeRangePeriodTypes.CUSTOM) {
       return customTimeRangeStartDate;
     } else {
       const timeRange = DateUtils.getTimeRangeGivenTimeRangePeriodType(periodType);
       return timeRange.startDate;
     }
   }
 )

const endDate = createSelector(
  [
    getResolvedBetsPeriodType,
    getResolvedBetsCustomTimeRangeEndDate
  ],
   (periodType, customTimeRangeEndDate) => {
     if (periodType === TimeRangePeriodTypes.CUSTOM) {
       return customTimeRangeEndDate;
     } else {
       const timeRange = DateUtils.getTimeRangeGivenTimeRangePeriodType(periodType);
       return timeRange.endDate;
     }
   }
 )

const getMatchedBetsById = (state) => state.getIn(['bet', 'matchedBetsById']);
const getUnmatchedBetsById = (state) => state.getIn(['bet', 'unmatchedBetsById']);
const getResolvedBetsById = (state) => state.getIn(['bet', 'resolvedBetsById']);

const getRelatedBetsCollection = createSelector(
  [
    getActiveTab,
    getMatchedBetsById,
    getUnmatchedBetsById,
    getResolvedBetsById
  ],
  (activeTab, matchedBetsById, unmatchedBetsById, resolvedBetsById) => {
    switch (activeTab) {
      case MyWagerTabTypes.MATCHED_BETS:
        return matchedBetsById;
      case MyWagerTabTypes.RESOLVED_BETS:
        return resolvedBetsById;
      default:
        return unmatchedBetsById;
    }
  }
);

const getSportNameByBettingMarketId = createSelector(
  [
    getBettingMarketsById,
    getBettingMarketGroupsById,
    getEventsById,
    getEventGroupsById,
    getSportsById,
  ],
  (bettingMarketsById, bettingMarketGroupsById, eventsById, eventGroupsById, sportsById) => {
    let sportNameByBettingMarketId = Immutable.Map();
    bettingMarketsById.forEach( bettingMarket => {
      const bettingMarketId = bettingMarket.get('id');
      const bettingMarketGroup = bettingMarketGroupsById.get(bettingMarket.get('group_id'));
      const event = bettingMarketGroup && eventsById.get(bettingMarketGroup.get('event_id'));
      const eventGroup = event && eventGroupsById.get(event.get('event_group_id'));
      const sport = eventGroup && sportsById.get(eventGroup.get('sport_id'));
      const sportName = (sport && sport.get('name')) || '';
      sportNameByBettingMarketId = sportNameByBettingMarketId.set(bettingMarketId, sportName);
    });
    return sportNameByBettingMarketId;
  }
);

const getCancelBetsByIdsLoadingStatus = (state) => state.getIn(['bet','cancelBetsByIdsLoadingStatus']);

//function to get initial collection with required values from rowData
const betData = createSelector(
  [
    getActiveTab,
    getRelatedBetsCollection,
    startDate,
    endDate,
    getCurrencyFormat,
    getPrecision,
    getAssetsById,
    getSportNameByBettingMarketId,
    getCancelBetsByIdsLoadingStatus
  ],
  (tab, bets, startDate, endDate, currencyFormat, precision, assetsById, sportNameByBettingMarketId, cancelBetsByIdsLoadingStatus)=>{
    let betData = [];
    bets.forEach((bet) => {
      let betObject = Immutable.fromJS({
        key: bet.get('id'),
        id: bet.get('id'),
        betting_market_id: bet.get('betting_market_id'),
        back_or_lay: bet.get('back_or_lay'),
        stake: CurrencyUtils.getFormattedCurrency(getStakeFromBetObject(bet)/ Math.pow(10, precision), currencyFormat, BettingModuleUtils.stakePlaces),
        odds: bet.get('backer_multiplier'),
        sport_name: sportNameByBettingMarketId.get(bet.get('betting_market_id')),
      });
      if (tab === MyWagerTabTypes.RESOLVED_BETS)  {
        const profit_liability = CurrencyUtils.getFormattedCurrency(bet.get('amount_won')/ Math.pow(10, precision), currencyFormat, BettingModuleUtils.exposurePlaces);
        const resolved_time = getFormattedDate(bet.get('resolved_time'));
        betObject = betObject.set('profit_liability', profit_liability);
        betObject = betObject.set('resolved_time', resolved_time);
      } else {
        const profit_liability = CurrencyUtils.getFormattedCurrency(getProfitLiabilityFromBetObject(bet)/ Math.pow(10, precision), currencyFormat, BettingModuleUtils.exposurePlaces);
        betObject = betObject.set('profit_liability', profit_liability);
        // Set cancel bet loading status
        if (tab === MyWagerTabTypes.UNMATCHED_BETS || tab === MyWagerTabTypes.MATCHED_BETS) {
          const cancelLoadingStatus = cancelBetsByIdsLoadingStatus.get(bet.get('id')) || LoadingStatus.DEFAULT;
          betObject = betObject.set('cancel_loading_status', cancelLoadingStatus);
        }
      }
      betData.push(betObject);
    });
    return betData;
  }
);

//memoized selector - function for merging bettingMarketData to betData and return merged data
const mergeBettingMarketData = createSelector(
  [betData, getBettingMarketsById],
  (bets, betMarket)=>{
    return mergeRelationData(bets, betMarket, 'betting_market_id',
      {group_id: 'group_id', description: 'betting_market_description'});
  }
);

//memoized selector - function for merging bettingMarketGroupsData to betData and return merged data
const mergeBettingMarketGroupData = createSelector(
  [mergeBettingMarketData, getBettingMarketGroupsById],
  (bets, betMarketGroup)=>{
    return mergeRelationData(bets, betMarketGroup, 'group_id',
      { event_id: 'event_id', description: 'betting_market_group_description' });
  }
);

//memoized selector - function for merging events to betData and return merged data
const mergeEventsData = createSelector(
  [mergeBettingMarketGroupData, getEventsById],
  (bets, events)=>{
    return mergeRelationData(bets, events, 'event_id',
      {'name': 'event_name' , 'start_time': 'event_time', 'sport_id': 'sport_id'});
  }
);

//memoized selector - function for merging sports to betData and return merged data
const mergeSportsData = createSelector(
  [mergeEventsData, getSportsById],
  (bets, sports)=>{
    return mergeRelationData(bets, sports, 'sport_id',
      {'name': 'sport_name'});
  }
);

// TODO: revisit this later and simplify the logic
//formatting data after getting all reuired data merged
// Bet data currently looks like this
/**
back_or_lay:"LAY"
group_id:"1.104.1"
betting_market_id:"1.105.1"
cancel:Object
event_id:"1.103.1"
event_name:Object
event_time:"Tomorrow, 14:54"
id:"1.106.9"
key:"1.106.9"
betting_market_description: "NY Giants",
betting_market_group_description: "Moneyline",
odds:2.25
profit_liability:"0.50000"
sport_id:"1.100.1"
sport_name:"American Football"
stake:"0.625"
type:"LAY | NY Giants  | Moneyline"
 */
const formatBettingData = (data, activeTab, precision, targetCurrency, startDate, endDate) => {
  //showing past data as resolvedBets and future data as matchedBets unmatchedBets
  if(activeTab !== MyWagerTabTypes.RESOLVED_BETS)
    data = data.filter(row => (((moment(row.get('event_time')).isAfter(moment().hour(0).minute(0))))));

  //check if this can be improved
  //TODO: use .map() instead of foreach as suggested
  data.forEach((row, index) => {
    let rowObj = {
      'type' : (row.get('back_or_lay').toUpperCase() + ' | ' + row.get('betting_market_description') + ' | ' + row.get('betting_market_group_description')),
    };
    //randomly changed win value to negative for liability display
    //applied class based on profit or loss
    if(activeTab !== MyWagerTabTypes.RESOLVED_BETS)
      rowObj.event_time = getFormattedDate(row.get('event_time'));

    if(activeTab === MyWagerTabTypes.UNMATCHED_BETS){
      rowObj.event_name = <a target='_self'>{ row.get('event_name') }</a>;
      rowObj.cancel = (row.get('cancel_loading_status') === LoadingStatus.DEFAULT || row.get('cancel_loading_status') === LoadingStatus.ERROR)
                        &&  (<a className='btn cancel-btn' target='_self'>{ I18n.t('mybets.cancel') }</a>);
    }
    data[index] = row.merge(rowObj);
  });

  return Immutable.fromJS(data);
}

//memoized selector - function for formatting merged data and return same
const getBetData = createSelector(
  [mergeSportsData, getActiveTab, getCurrencyFormat, getPrecision, startDate, endDate],
  (bets, activeTab, currencyFormat, precision, startDate, endDate) => {
    return formatBettingData(bets, activeTab,
    precision, currencyFormat, startDate, endDate);
  }
);

//memoized selector - function totaling stake and liability
const getBetTotal = createSelector(
  [getBetData, getCurrencyFormat, getPrecision],
  (bets, currencyFormat, precision)=>{
    let total = 0;
    bets.forEach((row, index) => {
      //parsed stake and profit_liability otherwise it considers string and concatenate the values
      total += parseFloat(row.get('stake')) + parseFloat(row.get('profit_liability'));
    });
    return total.toFixed(currencyFormat === 'mBTC' ? precision - 3 : precision);
  }
);

const getBetsLoadingStatus = (state) => state.getIn(['bet', 'initMyBetsLoadingStatus']);

const MyWagerSelector = {
  getBetsLoadingStatus,
  getCurrencyFormat,
  getBetData,
  getBetTotal
};

export default MyWagerSelector;
