import {ActionTypes, TimeRangePeriodTypes, MyWagerTabTypes, LoadingStatus} from '../constants';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  activeTab: MyWagerTabTypes.UNMATCHED_BETS,
  periodType: TimeRangePeriodTypes.LAST_7_DAYS,
  customTimeRangeStartDate: null,
  customTimeRangeEndDate: null,
  resolvedBetsExportData: Immutable.List(),
  generateResolvedBetsExportDataLoadingStatus: LoadingStatus.DEFAULT,
  generateResolvedBetsExportDataError: null
});

export default function(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.MY_WAGER_SET_ACTIVE_TAB: {
      return state.merge({
        activeTab: action.activeTab
      });
    }

    case ActionTypes.MY_WAGER_SET_RESOLVED_BETS_TIME_RANGE: {
      return state.merge({
        periodType: action.periodType,
        customTimeRangeStartDate: action.customTimeRangeStartDate,
        customTimeRangeEndDate: action.customTimeRangeEndDate
      });
    }

    case ActionTypes.MY_WAGER_RESET_TIME_RANGE: {
      return state.merge({
        periodType: initialState.get('periodType'),
        customTimeRangeStartDate: initialState.get('customTimeRangeStartDate'),
        customTimeRangeEndDate: initialState.get('customTimeRangeEndDate')
      });
    }

    case ActionTypes.MY_WAGER_RESET_RESOLVED_BETS_EXPORT_DATA: {
      return state.merge({
        resolvedBetsExportData: initialState.get('resolvedBetsExportData'),
        generateTransactionHistoryExportDataError: initialState.get(
          'generateTransactionHistoryExportDataLoadingStatus'
        ),
        generateResolvedBetsExportDataLoadingStatus: initialState.get(
          'generateResolvedBetsExportDataLoadingStatus'
        )
      });
    }

    case ActionTypes.MY_WAGER_SET_RESOLVED_BETS_EXPORT_DATA: {
      return state.merge({
        resolvedBetsExportData: action.resolvedBetsExportData
      });
    }

    case ActionTypes.MY_WAGER_SET_GENERATE_RESOLVED_BETS_EXPORT_DATA_LOADING_STATUS: {
      return state.merge({
        generateResolvedBetsExportDataLoadingStatus: action.loadingStatus
      });
    }

    case ActionTypes.MY_WAGER_SET_RESOLVED_BETS_EXPORT_DATA_ERROR: {
      return state.merge({
        generateResolvedBetsExportDataLoadingStatus: LoadingStatus.ERROR,
        generateResolvedBetsExportDataError: action.error
      });
    }

    case ActionTypes.AUTH_LOGOUT: {
      return initialState;
    }

    default:
      return state;
  }
}
