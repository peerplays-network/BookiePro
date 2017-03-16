import { ActionTypes } from '../constants';
import { LoadingStatus } from '../constants';
import _ from 'lodash';

let initialState = {
  getDepositAddressLoadingStatus: LoadingStatus.DEFAULT,
  getTransactionHistoriesLoadingStatus: LoadingStatus.DEFAULT,
  withdrawLoadingStatus: LoadingStatus.DEFAULT,
  transactionHistories: [],
  depositAddress: null
};

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.ACCOUNT_SET_GET_DEPOSIT_ADDRESS_LOADING_STATUS: {
      return Object.assign({}, state, {
        getDepositAddressLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.ACCOUNT_SET_GET_TRANSACTION_HISTORIES_LOADING_STATUS: {
      return Object.assign({}, state, {
        getTransactionHistoriesLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.ACCOUNT_SET_WITHDRAW_LOADING_STATUS: {
      return Object.assign({}, state, {
        withdrawLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.ACCOUNT_SET_DEPOSIT_ADDRESS: {
      return Object.assign({}, state, {
        depositAddress: action.depositAddress
      });
    }
    case ActionTypes.ACCOUNT_SET_TRANSACTION_HISTORIES: {
      return Object.assign({}, state, {
        transactionHistories: action.transactionHistories
      });
    }
    default:
      return state;
  }
}
