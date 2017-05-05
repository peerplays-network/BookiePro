import { ActionTypes, LoadingStatus } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  isLoggedIn: false,
  account: {},
  password: null,
  privateKeyWifsByRole: {},
  publicKeyStringsByRole: {},
  getDepositAddressLoadingStatus: LoadingStatus.DEFAULT,
  depositAddress: null,
  getDepositAddressError: null,
  withdrawLoadingStatus: LoadingStatus.DEFAULT,
  withdrawError: null,
  inGameBalancesByAssetId: {},
  availableBalancesByAssetId: {},
  statistics: {},
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.ACCOUNT_SET_IS_LOGGED_IN: {
      return state.merge({
        isLoggedIn: action.isLoggedIn
      });
    }
    case ActionTypes.ACCOUNT_SET_GET_DEPOSIT_ADDRESS_LOADING_STATUS: {
      return state.merge({
        getDepositAddressLoadingStatus: action.loadingStatus
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
    case ActionTypes.ACCOUNT_SET_PASSWORD_AND_KEYS: {
      let privateKeyWifsByRole = Immutable.Map();
      let publicKeyStringsByRole = Immutable.Map();
      _.forEach(action.keys, (privateKey, role) => {
        privateKeyWifsByRole = privateKeyWifsByRole.set(role, privateKey.toWif());
        publicKeyStringsByRole = publicKeyStringsByRole.set(role, privateKey.toPublicKey().toPublicKeyString());
      });

      return state.merge({
        password: action.password,
        privateKeyWifsByRole,
        publicKeyStringsByRole
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
