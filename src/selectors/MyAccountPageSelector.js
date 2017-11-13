import { createSelector } from 'reselect';
import { BettingModuleUtils, CurrencyUtils } from '../utility';
import { HistoryService } from '../services';
import { Config } from '../constants'

const coreAssetPrecisionSelector = (state) => {
  return state.getIn(['asset', 'assetsById', Config.coreAsset, 'precision']);
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

const oddsFormatSelector = createSelector(
  [settingSelector],
  (setting) => {
    return setting.get('oddsFormat')
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
      return HistoryService.filterTransactionHistoryGivenTimeRange(transactionHistory, periodType, customTimeRangeStartDate, customTimeRangeEndDate);
    }
);

const availableBalanceSelector = (state) => {
  /*-1 will be used to check to display 'Not available' against the withdraw amount field
      when the asset Config.coreAsset is not obtained for some reason
  */
  const balance = state.getIn(['balance', 'availableBalancesByAssetId',Config.coreAsset,'balance']);
  return balance || -1;
}

const formattedAvailableBalanceSelector = createSelector(
  [availableBalanceSelector, assetsByIdSelector, currencyFormatSelector],
  (availableBalance, assetsById, currencyFormat) => {
    const precision = assetsById.getIn([Config.coreAsset, 'precision']);
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

const initRawHistoryLoadingStatusSelector = (state) => {
  return state.getIn(['rawHistory', 'initRawHistoryLoadingStatus']);
}

const generateTransactionHistoryExportDataLoadingStatusSelector = (state) => {
  return state.getIn(['myAccountPage', 'generateTransactionHistoryExportDataLoadingStatus']);
}

const transactionHistoryExportDataSelector = (state) => {
  return state.getIn(['myAccountPage', 'transactionHistoryExportData']);
}

const accountNameSelector = (state) => {
  return state.getIn(['account', 'account', 'name']);
}


const MyAccountSelector = {
  lastIrreversibleBlockNumSelector,
  depositAddressSelector,
  getDepositAddressLoadingStatusSelector,
  withdrawLoadingStatusSelector,
  initRawHistoryLoadingStatusSelector,
  coreAssetPrecisionSelector,
  notificationSelector,
  currencyFormatSelector,
  oddsFormatSelector,
  filteredTransactionHistorySelector,
  availableBalanceSelector,
  generateTransactionHistoryExportDataLoadingStatusSelector,
  transactionHistoryExportDataSelector,
  formattedAvailableBalanceSelector,
  accountNameSelector,
}

export default MyAccountSelector;
