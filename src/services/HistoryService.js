import { DummyOperationTypes } from '../constants';
import { BlockchainUtils } from '../utility';
import { ChainTypes } from 'graphenejs-lib';
import Immutable from 'immutable';
import moment from 'moment';

class HistoryService {
  /**
  * Convert blockchain raw history to the app transaction history
  * Transaction history object is as the following
  * transaction = {
  *  id,
  *  time,
  *  desc,
  *  blockNum,
  *  amount
  * };
  */
  static convertRawHistoryToTransactionHistory(state, rawHistory) {
    const dynGlobalObject = state.getIn(['app', 'blockchainDynamicGlobalProperty']);
    const globalObject = state.getIn(['app', 'blockchainGlobalProperty']);
    const gatewayAccountId = state.getIn(['app', 'gatewayAccount', 'id']);
    const assetsById = state.getIn(['asset', 'assetsById']);

    let transactionHistory = Immutable.List();
    rawHistory.forEach((rawTransaction) => {
      // Check the operation type to ensure it is relevant
      let isRelevant = false;
      const operationType = rawTransaction.getIn(['op', 0]);
      if (operationType === ChainTypes.operations.transfer) {
        // The transaction is relevant only if the transfer operation is done by the gateway
        const from = rawTransaction.getIn(['op', 1, 'from']);
        const to = rawTransaction.getIn(['op', 1, 'to']);
        isRelevant = isRelevant || from === gatewayAccountId || to === gatewayAccountId;
      }
      isRelevant = isRelevant || (operationType === DummyOperationTypes.MAKE_BET);
      isRelevant = isRelevant || (operationType === DummyOperationTypes.CANCEL_BET);
      isRelevant = isRelevant || (operationType === DummyOperationTypes.BET_MATCHED);
      isRelevant = isRelevant || (operationType === DummyOperationTypes.BETTING_MARKET_RESOLVED);

      // Only process the transaction, if it is relevant
      if (isRelevant) {
        let amount, description, precision;
        switch (operationType) {
          case ChainTypes.operations.transfer: {
            const from = rawTransaction.getIn(['op', 1, 'from']);
            const to = rawTransaction.getIn(['op', 1, 'to']);
            if (from === gatewayAccountId) {
              description = 'Deposit';
            } else if (to === gatewayAccountId) {
              description = 'Withdraw';
            } else {
              description = 'Transfer';
            }
            amount = rawTransaction.getIn(['op', 1, 'amount', 'amount']);
            const assetId = rawTransaction.getIn(['op', 1, 'amount', 'asset_id']);
            precision = assetsById.getIn([assetId, 'precision']);
            break;
          }
          case DummyOperationTypes.MAKE_BET: {
            description = 'Make bet';
            amount = rawTransaction.getIn(['op', 1, 'original_bet_amount']);
            precision = assetsById.getIn(['1.3.0', 'precision']);
            break;
          }
          case DummyOperationTypes.CANCEL_BET: {
            description = 'Cancel bet';
            amount = rawTransaction.getIn(['op', 1, 'amount_refunded']);
            precision = assetsById.getIn(['1.3.0', 'precision']);
            break;
          }
          case DummyOperationTypes.BET_MATCHED: {
            description = 'Bet matched';
            amount = rawTransaction.getIn(['op', 1, 'matched_bet_amount']);
            precision = assetsById.getIn(['1.3.0', 'precision']);
            break;
          }
          case DummyOperationTypes.BETTING_MARKET_RESOLVED: {
            description = 'Betting market resolved';
            amount = rawTransaction.getIn(['op', 1, 'amount_paid']);
            precision = assetsById.getIn(['1.3.0', 'precision']);
            break;
          }
          default: break;
        }

        // Calculate block time
        const blockNum  = rawTransaction.get('block_num');
        const blockTime = BlockchainUtils.calcBlockTime(blockNum, globalObject, dynGlobalObject);

        const transaction = Immutable.fromJS({
          key: rawTransaction.get('id'),
          id: rawTransaction.get('id'),
          time: moment(blockTime),
          desc:  description,
          blockNum,
          amount: amount/ Math.pow(10, precision)
        });
        // Add to the list
        transactionHistory = transactionHistory.push(transaction);
      }
    });
    return transactionHistory;
  }
}

export default HistoryService;
