import { createSelector } from 'reselect';
import { TimeRangePeriodTypes} from '../constants';
import { BettingModuleUtils, CurrencyUtils, DateUtils } from '../utility';

const coreAssetPrecisionSelector = (state) => {
  return state.getIn(['asset', 'assetsById', '1.3.0']).get('precision');
}

const accountIdSelector = (state) => {
  return state.getIn(['account', 'account','id'])
}

const periodTypeSelector = (state) => {
  return state.getIn(['myAccountPage', 'periodType']);
}
const customTimeRangeStartDateSelector = (state) => {
  return state.getIn(['myAccountPage', 'customTimeRangeStartDate']);
}

const customTimeRangeEndDateSelector = (state) => {
  return state.getIn(['myAccountPage', 'customTimeRangeEndDate']);
}

const assetsByIdSelector = (state) => {
  return state.getIn(['asset', 'assetsById']);
}

const settingSelector = (state) => {
  const accountId = accountIdSelector(state);
  return state.getIn(['setting', 'settingByAccountId', accountId]) || state.getIn(['setting', 'defaultSetting']);
}

const currencyFormatSelector = createSelector(
  [settingSelector],
  (setting) => {
    return setting.get('currencyFormat')
  }
)

const notificationSelector = createSelector(
  [settingSelector],
  (setting) => {
    return setting.get('notification')
  }
)

const transactionHistorySelector = (state) => {
  return state.getIn(['myAccountPage', 'transactionHistory']);
}

const lastIrreversibleBlockNumSelector = (state) => {
  return state.getIn(['app', 'blockchainDynamicGlobalProperty', 'last_irreversible_block_num']);
}


const filteredTransactionHistorySelector = createSelector(
    [transactionHistorySelector, periodTypeSelector, customTimeRangeStartDateSelector, customTimeRangeEndDateSelector],
    (transactionHistory, periodType, customTimeRangeStartDate, customTimeRangeEndDate) => {
      const filteredTransactionHistory = transactionHistory.filter((transaction) => {
        let startDate, endDate;
        if (periodType === TimeRangePeriodTypes.CUSTOM) {
          startDate = customTimeRangeStartDate;
          endDate = customTimeRangeEndDate;
        } else {
          const timeRange = DateUtils.getTimeRangeGivenTimeRangePeriodType(periodType);
          startDate = timeRange.startDate;
          endDate = timeRange.endDate
        }
        const time = transaction.get('time');

        return time.valueOf() <= endDate.valueOf() && time.valueOf() >= startDate.valueOf()
      });

      return filteredTransactionHistory;
    }
);

const availableBalanceSelector = (state) => {
  /*-1 will be used to check to display 'Not available' against the withdraw amount field
      when the asset '1.3.0' is not obtained for some reason
  */
  const balance = state.getIn(['balance', 'availableBalancesByAssetId','1.3.0','balance']);
  return balance || -1;
}

const formattedAvailableBalanceSelector = createSelector(
  [availableBalanceSelector, assetsByIdSelector, currencyFormatSelector],
  (availableBalance, assetsById, currencyFormat) => {
    const precision = assetsById.getIn(['1.3.0', 'precision']);
    return CurrencyUtils.getFormattedCurrency(availableBalance/ Math.pow(10, precision),
     currencyFormat, BettingModuleUtils.exposurePlaces);
  }
)

const depositAddressSelector = (state) => {
  return state.getIn(['balance', 'depositAddress']);
}

const getDepositAddressLoadingStatusSelector = (state) => {
  return state.getIn(['balance', 'getDepositAddressLoadingStatus']);
}

const withdrawLoadingStatusSelector = (state) => {
  return state.getIn(['balance', 'withdrawLoadingStatus']);
}

const initTransactionHistoryLoadingStatusSelector = (state) => {
  return state.getIn(['history', 'initTransactionHistoryLoadingStatus']);
}


const MyAccountSelector = {
  lastIrreversibleBlockNumSelector,
  depositAddressSelector,
  getDepositAddressLoadingStatusSelector,
  withdrawLoadingStatusSelector,
  initTransactionHistoryLoadingStatusSelector,
  coreAssetPrecisionSelector,
  notificationSelector,
  currencyFormatSelector,
  filteredTransactionHistorySelector,
  availableBalanceSelector,
  formattedAvailableBalanceSelector
}

export default MyAccountSelector;
