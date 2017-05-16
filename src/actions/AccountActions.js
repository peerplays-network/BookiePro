import { ActionTypes } from '../constants';
import { BlockchainUtils } from '../utility';
import { WalletService, CommunicationService } from '../services';
import { TransactionBuilder } from 'graphenejs-lib';
import HistoryActions from './HistoryActions';
import Immutable from 'immutable';
import _ from 'lodash';

class AccountPrivateActions {

  static setStatisticsAction(statistics) {
    return {
      type: ActionTypes.ACCOUNT_SET_STATISTICS,
      statistics
    }
  }
}

/**
 * Public actions
 */
class AccountActions {
  static setIsLoggedInAction(isLoggedIn) {
    return {
      type: ActionTypes.ACCOUNT_SET_IS_LOGGED_IN,
      isLoggedIn
    }
  }

  static setStatistics(statistics) {
    return (dispatch, getState) => {
      // Check if this account made new transaction, if that's the case update the notification
      const currentMostRecentOp = getState().getIn(['account', 'statistics', 'most_recent_op']);
      const updatedMostRecentOp = statistics.get('most_recent_op')
      const hasMadeNewTransaction = currentMostRecentOp && (updatedMostRecentOp !== currentMostRecentOp);
      if (hasMadeNewTransaction) {
        dispatch(HistoryActions.checkForNewTransactionHistory());
      }
      // Set statistics
      dispatch(AccountPrivateActions.setStatisticsAction(statistics));
    }
  }

  static setAccountAction(account) {
    return {
      type: ActionTypes.ACCOUNT_SET_ACCOUNT,
      account
    }
  }

  static setPasswordAndKeysAction(password, keys) {
    return {
      type: ActionTypes.ACCOUNT_SET_PASSWORD_AND_KEYS,
      password,
      keys
    }
  }

  // TODO: The following this are used for testing only, remove later
  static createLimitOrder() {
    return (dispatch, getState) => {
      const sellAssetId = '1.3.0';
      const buyAssetId = '1.3.1';
      const sellAmount = 0.001;
      const buyAmount = 0.001;
      CommunicationService.callBlockchainDbApi('get_objects',[[sellAssetId, buyAssetId]]).then((result) => {
        console.log('result', result)
        const sellAsset = Immutable.fromJS(result[0]); // Core token
        const buyAsset = Immutable.fromJS(result[1]);
        const sellAssetAmount = sellAmount;
        const buyAssetAmount = buyAmount;
        const accountId = getState().getIn(['account', 'account', 'id']);
        const sellAssetSatoshiAmount = BlockchainUtils.get_satoshi_amount(sellAssetAmount, sellAsset);
        const buyAssetSatoshiAmount = BlockchainUtils.get_satoshi_amount(buyAssetAmount, buyAsset);
        const expiration = new Date();
        expiration.setYear(expiration.getFullYear() + 5);
        const isFillOrKill = false;

        // Create transaction and add operation
        const tr = new TransactionBuilder();
        const operationParams1 = {
          'seller': accountId,
          'amount_to_sell': {
            'amount': sellAssetSatoshiAmount,
            'asset_id': sellAssetId
          },
          expiration : expiration,
          'min_to_receive': {
            'amount': buyAssetSatoshiAmount,
            'asset_id': buyAssetId
          },
          'fill_or_kill': isFillOrKill
        };
        const operationParams2 = {
          'seller': accountId,
          'amount_to_sell': {
            'amount': sellAssetSatoshiAmount,
            'asset_id': sellAssetId
          },
          expiration : expiration,
          'min_to_receive': {
            'amount': buyAssetSatoshiAmount*2,
            'asset_id': buyAssetId
          },
          'fill_or_kill': isFillOrKill
        };
        const operationParams3 = {
          'seller': accountId,
          'amount_to_sell': {
            'amount': sellAssetSatoshiAmount,
            'asset_id': sellAssetId
          },
          expiration : expiration,
          'min_to_receive': {
            'amount': buyAssetSatoshiAmount*3,
            'asset_id': buyAssetId
          },
          'fill_or_kill': isFillOrKill
        };
        tr.add_type_operation('limit_order_create', operationParams1);
        tr.add_type_operation('limit_order_create', operationParams2);
        tr.add_type_operation('limit_order_create', operationParams3);
        console.log(tr)
        // Process transaction
        return WalletService.processTransaction(getState(), tr);
      }).then(() => {
        console.log('Create limit order success');
      }).catch((error) => {
        console.error('Create limit order fails', error);
      })
    }
  }


}

export default AccountActions;
