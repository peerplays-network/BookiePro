import {ActionTypes, LoadingStatus} from '../constants';
import {CurrencyUtils, DateUtils, BettingModuleUtils, ObjectUtils, MyWagerUtils} from '../utility';
import Immutable from 'immutable';
import {MyWagerSelector} from '../selectors';
const {getResolvedBetsColumns} = MyWagerUtils;
const {getStakeFromBetObject} = ObjectUtils;
class MywagerPrivateActions {
  static setGenerateResolvedBetsExportDataLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.MY_WAGER_SET_GENERATE_RESOLVED_BETS_EXPORT_DATA_LOADING_STATUS,
      loadingStatus
    };
  }

  static setResolvedBetsExportDataAction(resolvedBetsExportData) {
    return {
      type: ActionTypes.MY_WAGER_SET_RESOLVED_BETS_EXPORT_DATA,
      resolvedBetsExportData
    };
  }

  static setGenerateResolvedBetsExportDataErrorAction(error) {
    return {
      type: ActionTypes.MY_WAGER_SET_RESOLVED_BETS_EXPORT_DATA_ERROR,
      error
    };
  }
}

class MywagerActions {
  static setMywagerActiveTab(activeTab) {
    return {
      type: ActionTypes.MY_WAGER_SET_ACTIVE_TAB,
      activeTab
    };
  }

  /**
   * Set time range for resolved bets
   */
  static setResolvedBetsTimeRangeAction(
    periodType,
    customTimeRangeStartDate,
    customTimeRangeEndDate
  ) {
    return {
      type: ActionTypes.MY_WAGER_SET_RESOLVED_BETS_TIME_RANGE,
      periodType,
      customTimeRangeStartDate,
      customTimeRangeEndDate
    };
  }

  static resetTimeRange() {
    return {
      type: ActionTypes.MY_WAGER_RESET_TIME_RANGE
    };
  }

  static resetResolvedBetsExportDataAction() {
    return {
      type: ActionTypes.MY_WAGER_RESET_RESOLVED_BETS_EXPORT_DATA
    };
  }

  static generateResolvedBetsExportData() {
    return (dispatch, getState) => {
      const accountId = getState().getIn(['account', 'account', 'id']);

      if (accountId) {
        const betData = MyWagerSelector.getBetData(getState());
        // Set loading status
        dispatch(
          MywagerPrivateActions.setGenerateResolvedBetsExportDataLoadingStatusAction(
            LoadingStatus.LOADING
          )
        );

        const setting =
          getState().getIn(['setting', 'settingByAccountId', accountId]) ||
          getState().getIn(['setting', 'defaultSetting']);
        const currencyFormat = setting.getIn(['currencyFormat']);
        const assetsById = getState().getIn(['asset', 'assetsById']);
        const bettingMarketsById = getState().getIn([
          'bettingMarket',
          'persistedBettingMarketsById'
        ]);

        let exportData = [];

        betData.forEach((bet) => {
          const bettingMarket = bettingMarketsById.get(bet.get('betting_market_id'));
          const bettingMarketGroupId = bettingMarket.get('group_id');
          const bettingMarketGroup =
            getState().getIn([
              'bettingMarketGroup',
              'persistedBettingMarketGroupsById',
              bettingMarketGroupId
            ]) || Immutable.Map();
          const precision =
            assetsById.getIn([bettingMarketGroup.get('asset_id'), 'precision']) || 0;
          let rowObj = {
            key: bet.get('id'),
            id: bet.get('id'),
            betting_market_id: bet.get('betting_market_id'),
            back_or_lay: bet.get('back_or_lay'),
            // TODO: use betcategories instead of MyWagerTabTypes to avoid confusion
            stake: CurrencyUtils.getFormattedCurrency(
              getStakeFromBetObject(bet) / Math.pow(10, precision),
              currencyFormat,
              BettingModuleUtils.stakePlaces
            ),
            backer_multiplier: bet.get('backer_multiplier'),
            profit_liability: CurrencyUtils.getFormattedCurrency(
              parseFloat(bet.get('amount_won')),
              currencyFormat,
              BettingModuleUtils.exposurePlaces,
              true,
              false,
              true
            ),
            amount_won: CurrencyUtils.getFormattedCurrency(
              parseFloat(bet.get('amount_won')),
              currencyFormat,
              BettingModuleUtils.exposurePlaces,
              true,
              false,
              true
            ),
            resolved_time: DateUtils.getFormattedDate(bet.get('resolved_time'), true),
            event_name: bet.get('event_name'),
            sport_name: bet.get('sport_name'),
            betting_market_description: bet.get('betting_market_description'),
            betting_market_group_description: bet.get('betting_market_group_description')
          };

          exportData.push(Immutable.Map(rowObj));
        });

        //Generated Resolved bets export object array using foreach to display 
        // properties in particular order in excel.
        //TODO: Need to check if this can be improved
        /*NOTE: Things to be taken care of for Resolved bet export data are listed below:-
          1. Object property name change as per column configuration
          2. Sequence of properties in Object as per column configuration
          3. Removing unwanted columns from export data
        */
        const columns = getResolvedBetsColumns(currencyFormat, true);
        exportData.forEach((row, index) => {
          row = row.merge({
            type:
              row.get('back_or_lay') +
              ' | ' +
              row.get('betting_market_description') +
              ' | ' +
              row.get('betting_market_group_description')
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
        dispatch(
          MywagerPrivateActions.setGenerateResolvedBetsExportDataLoadingStatusAction(
            LoadingStatus.DONE
          )
        );
      }
    };
  }
}

export default MywagerActions;
