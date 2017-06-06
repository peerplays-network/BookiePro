import { ActionTypes, LoadingStatus, TimeRangePeriodTypes } from '../constants';
import { CurrencyUtils, DateUtils, BettingModuleUtils, MergeObjectUtils, ObjectUtils, MyWagerUtils } from '../utility';
import moment from 'moment';
import Immutable from 'immutable';
const { mergeRelationData, mergeBettingMarketGroup } = MergeObjectUtils;
const { getResolvedBetsColumns } = MyWagerUtils;
const { getStakeFromBetObject } = ObjectUtils;

const getFormattedDate = DateUtils.getFormattedDate;
class MywagerPrivateActions {
  static setGenerateResolvedBetsExportDataLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.MY_WAGER_SET_GENERATE_RESOLVED_BETS_EXPORT_DATA_LOADING_STATUS,
      loadingStatus
    }
  }

  static setResolvedBetsExportDataAction(resolvedBetsExportData) {
    return {
      type: ActionTypes.MY_WAGER_SET_RESOLVED_BETS_EXPORT_DATA,
      resolvedBetsExportData
    }
  }

  static setGenerateResolvedBetsExportDataErrorAction(error) {
    return {
      type: ActionTypes.MY_WAGER_SET_RESOLVED_BETS_EXPORT_DATA_ERROR,
      error
    }
  }
}

class MywagerActions {
  static setMywagerActiveTab(activeTab) {
    return {
      type: ActionTypes.MY_WAGER_SET_ACTIVE_TAB,
      activeTab
    }
  }

  /**
   * Set time range for resolved bets
   */
  static setResolvedBetsTimeRangeAction(periodType, customTimeRangeStartDate, customTimeRangeEndDate) {
    return {
      type: ActionTypes.MY_WAGER_SET_RESOLVED_BETS_TIME_RANGE,
      periodType,
      customTimeRangeStartDate,
      customTimeRangeEndDate
    }
  }

  static resetTimeRange() {
    return {
      type: ActionTypes.MY_WAGER_RESET_TIME_RANGE
    }
  }

  static resetResolvedBetsExportDataAction() {
    return {
      type: ActionTypes.MY_WAGER_RESET_RESOLVED_BETS_EXPORT_DATA,
    }
  }

  static generateResolvedBetsExportData() {
    return (dispatch, getState) => {
      const accountId = getState().getIn(['account', 'account', 'id']);
      if (accountId) {

        // Set loading status
        dispatch(MywagerPrivateActions.setGenerateResolvedBetsExportDataLoadingStatusAction(LoadingStatus.LOADING));
        let startDate, endDate;
        const periodType = getState().getIn(['mywager', 'periodType']);
        const customTimeRangeStartDate = getState().getIn(['mywager', 'customTimeRangeStartDate']);
        const customTimeRangeEndDate = getState().getIn(['mywager', 'customTimeRangeEndDate']);
        if (periodType === TimeRangePeriodTypes.CUSTOM) {
          startDate = customTimeRangeStartDate;
          endDate = customTimeRangeEndDate;
        } else {
          const timeRange = DateUtils.getTimeRangeGivenTimeRangePeriodType(periodType);
          startDate = timeRange.startDate;
          endDate = timeRange.endDate
        }

        const setting = getState().getIn(['setting', 'settingByAccountId', accountId]) || getState().getIn(['setting', 'defaultSetting']);
        const currencyFormat = setting.getIn(['currencyFormat']);
        const assetsById = getState().getIn(['asset', 'assetsById']);
        const bettingMarketsById = getState().getIn(['bettingMarket', 'bettingMarketsById']);

        let exportData = [];

        let filteredResolvedBets = getState().getIn(['bet', 'resolvedBetsById'])
          .filter(bet => (moment(bet.get('resolved_time')).isBetween(startDate, endDate)));

        filteredResolvedBets.forEach(bet => {
          const bettingMarket = bettingMarketsById.get(bet.get('betting_market_id'));
          const precision = assetsById.getIn([bettingMarket.get('bet_asset_type'), 'precision']) || 0;
          let rowObj = {
            key: bet.get('id'),
            id: bet.get('id'),
            'betting_market_id': bet.get('betting_market_id'),
            'back_or_lay': bet.get('back_or_lay'),
            // TODO: use betcategories instead of MyWagerTabTypes to avoid confusion
            'stake': CurrencyUtils.getFormattedCurrency(getStakeFromBetObject(bet)/ Math.pow(10, precision), currencyFormat, BettingModuleUtils.stakePlaces),
            'odds': bet.get('backer_multiplier'),
            'profit_liability': CurrencyUtils.getFormattedCurrency(bet.get('amount_won')/ Math.pow(10, precision), currencyFormat, BettingModuleUtils.exposurePlaces),
            'resolved_time': getFormattedDate(bet.get('resolved_time'))
          }
          exportData.push(Immutable.Map(rowObj));
        });

        //merging betting market data for display and betting_market_group_id for reference
        exportData = mergeRelationData(exportData, getState().getIn(['bettingMarket','bettingMarketsById']), 'betting_market_id',
          {betting_market_group_id: 'betting_market_group_id' , payout_condition_string: 'payout_condition_string'});

        //merging betting market group data for display and eventid for reference
        exportData = mergeBettingMarketGroup(exportData,
          getState().getIn(['bettingMarketGroup','bettingMarketGroupsById']), 'betting_market_group_id');

        //merging evemt data for display and sport id for reference
        exportData = mergeRelationData(exportData, getState().getIn(['event','eventsById']), 'event_id',
          {'name': 'event_name' , 'sport_id': 'sport_id'});

        //merging sport data for display
        exportData = mergeRelationData(exportData, getState().getIn(['sport','sportsById']), 'sport_id',
          {'name': 'sport_name'});

        //Generated Resolved bets export object array using foreach to display properties in particular order in excel.
        //TODO: Need to check if this can be improved
        /*NOTE: Things to be taken care of for Resolved bet export data are listed below:-
          1. Object property name change as per column configuration
          2. Sequence of properties in Object as per column configuration
          3. Removing unwanted columns from export data
        */
        const columns = getResolvedBetsColumns(currencyFormat);
        exportData.forEach((row, index) => {
          row = row.merge({
            'type' : (row.get('back_or_lay') + ' | ' + row.get('payout_condition_string') + ' ' + row.get('options') + ' | ' + row.get('market_type_id')),
          });
          let formattedRow = {};
          for (var i = 0; i < columns.length; i++) {
            formattedRow[columns[i].title] = row.get(columns[i].key);
          }
          exportData[index] = formattedRow;
        });

        // Add to redux store
        dispatch(MywagerPrivateActions.setResolvedBetsExportDataAction(exportData));
        // Set loading status
        dispatch(MywagerPrivateActions.setGenerateResolvedBetsExportDataLoadingStatusAction(LoadingStatus.DONE));
      }
    }
  }

}

export default MywagerActions;
