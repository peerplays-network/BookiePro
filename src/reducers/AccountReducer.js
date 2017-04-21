import { ActionTypes } from '../constants';
import { LoadingStatus } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  account: {},
  privateKeyWifsByRole: {},
  publicKeyStringsByRole: {},
  getDepositAddressLoadingStatus: LoadingStatus.DEFAULT,
  depositAddress: null,
  getDepositAddressError: null,
  getTransactionHistoryLoadingStatus: LoadingStatus.DEFAULT,
  transactionHistories: [],
  getTransactionHistoryError: null,
  getTransactionHistoriesExportLoadingStatus: LoadingStatus.DEFAULT,
  transactionHistoriesExport: [],
  getTransactionHistoriesExportError: null,
  withdrawLoadingStatus: LoadingStatus.DEFAULT,
  withdrawError: null,
  changePasswordLoadingStatus: LoadingStatus.DEFAULT,
  changePasswordErrors: [],
  inGameBalancesByAssetId: {},
  availableBalancesByAssetId: {},
  statistics: {},
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.ACCOUNT_SET_GET_DEPOSIT_ADDRESS_LOADING_STATUS: {
      return state.merge({
        getDepositAddressLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.ACCOUNT_SET_GET_TRANSACTION_HISTORIES_LOADING_STATUS: {
      return state.merge({
        getTransactionHistoryLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.ACCOUNT_SET_TRANSACTION_HISTORIES: {
      return state.merge({
        transactionHistories: action.transactionHistories
      });
    }
    case ActionTypes.ACCOUNT_SET_GET_TRANSACTION_HISTORIES_ERROR: {
      return state.merge({
        getTransactionHistoryError: action.error,
        getTransactionHistoryLoadingStatus: LoadingStatus.ERROR
      });
    }


    case ActionTypes.ACCOUNT_SET_GET_TRANSACTION_HISTORIES_LOADING_STATUS_EXPORT: {
      return state.merge({
        getTransactionHistoriesExportLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.ACCOUNT_SET_TRANSACTION_HISTORIES_EXPORT: {
      return state.merge({
        transactionHistoriesExport: action.transactionHistoriesExport
      });
    }
    case ActionTypes.ACCOUNT_SET_GET_TRANSACTION_HISTORIES_ERROR_EXPORT: {
      return state.merge({
        getTransactionHistoriesExportError: action.error,
        getTransactionHistoriesExportLoadingStatus: LoadingStatus.ERROR
      });
    }



    case ActionTypes.ACCOUNT_SET_WITHDRAW_LOADING_STATUS: {
      return state.merge({
        withdrawLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.ACCOUNT_SET_WITHDRAW_ERROR: {
      return state.merge({
        withdrawError: action.error,
        withdrawLoadingStatus: LoadingStatus.ERROR
      });
    }
    case ActionTypes.ACCOUNT_SET_CHANGE_PASSWORD_LOADING_STATUS: {
      return state.merge({
        changePasswordLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.ACCOUNT_SET_CHANGE_PASSWORD_ERRORS: {
      return state.merge({
        changePasswordErrors: action.errors,
        changePasswordLoadingStatus: LoadingStatus.ERROR
      });
    }
    case ActionTypes.ACCOUNT_SET_DEPOSIT_ADDRESS: {
      return state.merge({
        depositAddress: action.depositAddress
      });
    }
    case ActionTypes.ACCOUNT_SET_GET_DEPOSIT_ADDRESS_ERROR: {
      return state.merge({
        getDepositAddressError: action.error,
        getDepositAddressLoadingStatus: LoadingStatus.ERROR
      });
    }
    case ActionTypes.ACCOUNT_SET_ACCOUNT: {
      return state.merge({
        account: action.account
      });
    }
    case ActionTypes.ACCOUNT_ADD_OR_UPDATE_AVAILABLE_BALANCES: {
      let nextState = state;
      action.availableBalances.forEach((balance) => {
        const assetId = balance.get('asset_type');
        nextState = nextState.setIn(['availableBalancesByAssetId', assetId], balance);
      })
      return nextState;
    }
    case ActionTypes.ACCOUNT_REMOVE_AVAILABLE_BALANCE_BY_ID: {
      return state.updateIn(['availableBalancesByAssetId'], availableBalancesByAssetId => {
        return availableBalancesByAssetId.filterNot( balance => balance.get('id') === action.balanceId);
      });
    }
    case ActionTypes.ACCOUNT_SET_IN_GAME_BALANCES: {
      let inGameBalancesByAssetId = Immutable.Map();
      action.inGameBalances.forEach((balance) => {
        const assetId = balance.get('asset_type');
        inGameBalancesByAssetId = inGameBalancesByAssetId.set(assetId, balance);
      })
      return state.merge({
        inGameBalancesByAssetId
      })
    }
    case ActionTypes.ACCOUNT_SET_KEYS: {
      return state.merge({
        privateKeyWifsByRole: action.privateKeyWifsByRole,
        publicKeyStringsByRole: action.publicKeyStringsByRole
      });
    }
    case ActionTypes.ACCOUNT_SET_STATISTICS: {
      return state.merge({
        statistics: action.statistics
      });
    }
    case ActionTypes.ACCOUNT_LOGOUT: {
      return initialState;
    }
    default:
      return state;
  }
}
