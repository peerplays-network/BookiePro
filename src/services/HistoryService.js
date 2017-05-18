import { DummyOperationTypes, TimeRangePeriodTypes } from '../constants';
import { BlockchainUtils, DateUtils, CurrencyUtils, BettingModuleUtils } from '../utility';
import { ChainTypes } from 'graphenejs-lib';
import { I18n } from 'react-redux-i18n';
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
    const accountId = state.getIn(['account', 'account', 'id']);

    let transactionHistory = Immutable.List();
    rawHistory.forEach((rawTransaction) => {
      // Check the operation type to ensure it is relevant
      let isRelevant = false;
      const operationType = rawTransaction.getIn(['op', 0]);
      isRelevant = isRelevant || ChainTypes.operations.transfer;
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
            if (from === gatewayAccountId && to === accountId) {
              description = I18n.t('transaction.deposit');
            } else if (to === gatewayAccountId && from === accountId) {
              description = I18n.t('transaction.withdraw');
            } else {
              description = I18n.t('transaction.transfer');
            }
            amount = rawTransaction.getIn(['op', 1, 'amount', 'amount']);
            const assetId = rawTransaction.getIn(['op', 1, 'amount', 'asset_id']);
            precision = assetsById.getIn([assetId, 'precision']);
            break;
          }
          case DummyOperationTypes.MAKE_BET: {
            description = I18n.t('transaction.makeBet');
            amount = rawTransaction.getIn(['op', 1, 'original_bet_amount']);
            precision = assetsById.getIn(['1.3.0', 'precision']);
            break;
          }
          case DummyOperationTypes.CANCEL_BET: {
            description = I18n.t('transaction.cancelBet');
            amount = rawTransaction.getIn(['op', 1, 'amount_refunded']);
            precision = assetsById.getIn(['1.3.0', 'precision']);
            break;
          }
          case DummyOperationTypes.BET_MATCHED: {
            description = I18n.t('transaction.betMatched');
            amount = rawTransaction.getIn(['op', 1, 'matched_bet_amount']);
            precision = assetsById.getIn(['1.3.0', 'precision']);
            break;
          }
          case DummyOperationTypes.BETTING_MARKET_RESOLVED: {
            description = I18n.t('transaction.bettingMarketResolved');
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

  static filterTransactionHistoryGivenTimeRange(transactionHistory, periodType, customTimeRangeStartDate, customTimeRangeEndDate) {
    const filteredTransactionHistory = transactionHistory.filter((transaction) => {
      let startDate, endDate;
      if (periodType === TimeRangePeriodTypes.CUSTOM) {
        startDate = customTimeRangeStartDate;
        endDate = customTimeRangeEndDate;
      } else {
        const timeRange = DateUtils.getTimeRangeGivenTimeRangePeriodType(periodType);
        startDate = timeRange.startDate;
        endDate = timeRange.endDate
      }
      const time = transaction.get('time');

      return time.valueOf() <= endDate.valueOf() && time.valueOf() >= startDate.valueOf()
    });

    return filteredTransactionHistory;
  }

  static convertTransactionHistoryToTransactionHistoryExportData(state, transactionHistory) {
    const accountId = state.getIn(['account', 'account', 'id']);
    const setting = state.getIn(['setting', 'settingByAccountId', accountId]) || state.getIn(['setting', 'defaultSetting']);
    const currencyFormat = setting.get('currencyFormat');
    const lastIrreversibleBlockNum = state.getIn(['app', 'blockchainDynamicGlobalProperty', 'last_irreversible_block_num']);

    return transactionHistory.map((transaction) => {
      const blockNum = transaction.get('blockNum');
      let status;
      if (lastIrreversibleBlockNum >= blockNum) {
        status = I18n.t('myAccount.transaction_status_complete');
      } else {
        status = I18n.t('myAccount.transaction_status_processing');
      }

      return {
        Id: transaction.get('id'),
        Time: moment(transaction.get('time')).format('DD/MM/YYYY HH:mm:ss'),
        Description: transaction.get('desc'),
        Status: status,
        Amount: CurrencyUtils.getFormattedCurrency(transaction.get('amount'), currencyFormat, BettingModuleUtils.stakePlaces)
      };
    });
  }
}

export default HistoryService;
