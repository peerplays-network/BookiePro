import { ActionTypes } from '../constants';
import { LoadingStatus } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  account: null,
  keys: null,
  getDepositAddressLoadingStatus: LoadingStatus.DEFAULT,
  getTransactionHistoriesLoadingStatus: LoadingStatus.DEFAULT,
  withdrawLoadingStatus: LoadingStatus.DEFAULT,
  changePasswordLoadingStatus: LoadingStatus.DEFAULT,
  changePasswordError: null,
  transactionHistories: [],
  depositAddress: null
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
    case ActionTypes.ACCOUNT_SET_WITHDRAW_LOADING_STATUS: {
      return state.merge({
        withdrawLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.ACCOUNT_SET_CHANGE_PASSWORD_LOADING_STATUS: {
      return state.merge({
        changePasswordLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.ACCOUNT_SET_CHANGE_PASSWORD_ERROR: {
      return state.merge({
        changePasswordError: action.error
      });
    }
    case ActionTypes.ACCOUNT_SET_DEPOSIT_ADDRESS: {
      return state.merge({
        depositAddress: action.depositAddress
      });
    }
    case ActionTypes.ACCOUNT_SET_TRANSACTION_HISTORIES: {
      return state.merge({
        transactionHistories: action.transactionHistories
      });
    }
    case ActionTypes.ACCOUNT_SET_ACCOUNT: {
      return state.merge({
        account: action.account
      });
    }
    case ActionTypes.ACCOUNT_SET_KEYS: {
      return state.merge({
        keys: action.keys
      });
    }
    case ActionTypes.ACCOUNT_LOGOUT: {
      return initialState;
    }
    default:
      return state;
  }
}
