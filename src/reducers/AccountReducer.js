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
  getTransactionHistoriesLoadingStatus: LoadingStatus.DEFAULT,
  transactionHistories: [],
  getTransactionHistoriesError: null,
  withdrawLoadingStatus: LoadingStatus.DEFAULT,
  withdrawError: null,
  changePasswordLoadingStatus: LoadingStatus.DEFAULT,
  changePasswordErrors: [],
  inGameBalancesByAssetId: {},
  availableBalancesByAssetId: {},
  statistics: {},
  availableBalance: 0
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
        getTransactionHistoriesLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.ACCOUNT_SET_TRANSACTION_HISTORIES: {
      return state.merge({
        transactionHistories: action.transactionHistories
      });
    }
    case ActionTypes.ACCOUNT_SET_GET_TRANSACTION_HISTORIES_ERROR: {
      return state.merge({
        getTransactionHistoriesError: action.error,
        getTransactionHistoriesLoadingStatus: LoadingStatus.ERROR
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
    case ActionTypes.ACCOUNT_SET_AVAILABLE_BALANCES: {
      let availableBalancesByAssetId = Immutable.Map();
      action.availableBalances.forEach((balance) => {
        const assetId = balance.get('asset_type');
        availableBalancesByAssetId = availableBalancesByAssetId.set(assetId, balance);
      })
      return state.merge({
        availableBalancesByAssetId
      })
    }
    case ActionTypes.ACCOUNT_UPDATE_AVAILABLE_BALANCE: {
      const assetId = action.availableBalance.get('asset_type');
      return state.setIn(['availableBalancesByAssetId', assetId], action.availableBalance);
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
