import {createSelector} from 'reselect';
import {BettingModuleUtils, CurrencyUtils} from '../utility';
import {HistoryService} from '../services';
import {Config} from '../constants';

const coreAssetPrecisionSelector = state => state
  .getIn(['asset', 'assetsById', Config.coreAsset, 'precision']);

const accountIdSelector = state => state
  .getIn(['account', 'account', 'id']);

const periodTypeSelector = state => state
  .getIn(['myAccountPage', 'periodType']);

const customTimeRangeStartDateSelector = state => state
  .getIn(['myAccountPage', 'customTimeRangeStartDate']);

const customTimeRangeEndDateSelector = state => state
  .getIn(['myAccountPage', 'customTimeRangeEndDate']);

const assetsByIdSelector = state => state.getIn(['asset', 'assetsById']);

const settingSelector = state => {
  const accountId = accountIdSelector(state);
  return (
    state.getIn(['setting', 'settingByAccountId', accountId]) ||
    state.getIn(['setting', 'defaultSetting'])
  );
};

const currencyFormatSelector = createSelector(
  [settingSelector], 
  setting => setting.get('currencyFormat')
);

const oddsFormatSelector = createSelector(
  [settingSelector], 
  setting => setting.get('oddsFormat')
);

const notificationSelector = createSelector(
  [settingSelector], setting => setting.get('notification')
);

const transactionHistorySelector = state => state
  .getIn(['myAccountPage', 'transactionHistory']);

const lastIrreversibleBlockNumSelector = state => state
  .getIn(['app', 'blockchainDynamicGlobalProperty', 'last_irreversible_block_num']);

const filteredTransactionHistorySelector = createSelector(
  [
    transactionHistorySelector,
    periodTypeSelector,
    customTimeRangeStartDateSelector,
    customTimeRangeEndDateSelector
  ],
  (
    transactionHistory, 
    periodType, 
    customTimeRangeStartDate, 
    customTimeRangeEndDate
  ) => HistoryService.filterTransactionHistoryGivenTimeRange(
    transactionHistory,
    periodType,
    customTimeRangeStartDate,
    customTimeRangeEndDate
  )
);

const availableBalanceSelector = state => {
  /*-1 will be used to check to display 'Not available' against the withdraw amount field
      when the asset Config.coreAsset is not obtained for some reason
  */
  const balance = state.getIn([
    'balance',
    'availableBalancesByAssetId',
    Config.coreAsset,
    'balance'
  ]);
  return balance || -1;
};

const formattedAvailableBalanceSelector = createSelector(
  [availableBalanceSelector, assetsByIdSelector, currencyFormatSelector],
  (availableBalance, assetsById, currencyFormat) => {
    const precision = assetsById.getIn([Config.coreAsset, 'precision']);
    return CurrencyUtils.getFormattedCurrency(
      availableBalance / Math.pow(10, precision),
      currencyFormat,
      BettingModuleUtils.exposurePlaces
    );
  }
);

const depositAddressSelector = state => state.getIn(['balance', 'depositAddress']);

const getDepositAddressLoadingStatusSelector = state => state
  .getIn(['balance', 'getDepositAddressLoadingStatus']);

const withdrawLoadingStatusSelector = state => state
  .getIn(['balance', 'withdrawLoadingStatus']);

const initRawHistoryLoadingStatusSelector = state => state
  .getIn(['rawHistory', 'initRawHistoryLoadingStatus']);

const generateTransactionHistoryExportDataLoadingStatusSelector = state => state
  .getIn(['myAccountPage', 'generateTransactionHistoryExportDataLoadingStatus']);

const transactionHistoryExportDataSelector = state => state
  .getIn(['myAccountPage', 'transactionHistoryExportData']);

const accountNameSelector = state => state.getIn(['account', 'account', 'name']);

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
  accountNameSelector
};

export default MyAccountSelector;
