import { ActionTypes, LoadingStatus } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  getDepositAddressLoadingStatus: LoadingStatus.DEFAULT,
  depositAddress: null,
  getDepositAddressError: null,
  withdrawLoadingStatus: LoadingStatus.DEFAULT,
  withdrawError: null,
  topMenuWithdrawLoadingStatus: LoadingStatus.DEFAULT,
  topMenuWithdrawError: null,
  availableBalancesByAssetId: {},
  balanceErrors: null,
  balanceLoadingStatus: LoadingStatus.DEFAULT
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.BALANCE_SET_GET_DEPOSIT_ADDRESS_LOADING_STATUS: {
      return state.merge({
        getDepositAddressLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.BALANCE_SET_WITHDRAW_LOADING_STATUS: {
      return state.merge({
        withdrawLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.BALANCE_SET_WITHDRAW_ERROR: {
      return state.merge({
        withdrawError: action.error,
        withdrawLoadingStatus: LoadingStatus.ERROR
      });
    }
    case ActionTypes.BALANCE_SET_TOPMENU_WITHDRAW_LOADING_STATUS: {
      return state.merge({
        topMenuWithdrawLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.BALANCE_SET_TOPMENU_WITHDRAW_ERROR: {
      return state.merge({
        topMenuWithdrawError: action.error,
        topMenuWithdrawLoadingStatus: LoadingStatus.ERROR
      });
    }
    case ActionTypes.BALANCE_SET_DEPOSIT_ADDRESS: {
      return state.merge({
        depositAddress: action.depositAddress
      });
    }
    case ActionTypes.BALANCE_SET_GET_DEPOSIT_ADDRESS_ERROR: {
      return state.merge({
        getDepositAddressError: action.error,
        getDepositAddressLoadingStatus: LoadingStatus.ERROR
      });
    }
    case ActionTypes.BALANCE_ADD_OR_UPDATE_AVAILABLE_BALANCES: {
      let nextState = state;
      action.availableBalances.forEach((balance) => {
        const assetId = balance.get('asset_type');
        nextState = nextState.setIn(['availableBalancesByAssetId', assetId], balance);
      })
      return nextState;
    }
    case ActionTypes.BALANCE_REMOVE_AVAILABLE_BALANCES_BY_IDS: {
      return state.updateIn(['availableBalancesByAssetId'], availableBalancesByAssetId => {
        return availableBalancesByAssetId.filterNot( balance => action.balanceIds.includes(balance.get('id')));
      });
    }
    case ActionTypes.AUTH_LOGOUT: {
      return initialState;
    }
    default:
      return state;
  }
}
