import { Config } from '../constants';
import _ from 'lodash';

// Assume
// 201 is operation type for make_bet
// 202 is operation type for cancel_bet
// 203 is operation type for fill_bet
// 204 is operation type for betting_market_resolved

// Modify this one depending on the account that you use to test
const dummyAccountId = Config.dummyDataAccountId;
// IMPORTANT, this instance number should be smaller than the instance number of earliest REAL transaction history of the account id
// Otherwise, the real transactions are not going to be prepended on top of the dummy data
// ALSO, list of operations should be smaller than this number
const dummyTransactionHistoryMaxIdInstanceNumber = 420;
const dummyMaxBlockNum = 67000;
const dummyMaxVirtualOpId = 1000;

const listOfOperations = [
  [
    204,
    {
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.5",
      "amount_paid": 10000,
    }
  ],
  [
    204,
    {
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.4",
      "amount_paid": 10000,
    }
  ],
  [
    201,
    {
      "bet_id": "1.106.20",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.5",
      "back_or_lay": "lay",
      "backer_multiplier": "2.0",
      "original_bet_amount": 5000,
    }
  ],
  [
    201,
    {
      "bet_id": "1.106.19",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.4",
      "back_or_lay": "back",
      "backer_multiplier": "2.0",
      "original_bet_amount": 5000,
    }
  ],
  [
    203,
    {
      "bet_id": "1.106.18",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "lay",
      "backer_multiplier": "2.0",
      "original_bet_amount": 2000,
    }
  ],
  [
    203,
    {
      "bet_id": "1.106.17",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "lay",
      "backer_multiplier": "2.0",
      "original_bet_amount": 1000,
    }
  ],
  [
    203,
    {
      "bet_id": "1.106.16",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "lay",
      "backer_multiplier": "2.0",
      "original_bet_amount": 35000,
    }
  ],
  [
    201,
    {
      "bet_id": "1.106.18",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "lay",
      "backer_multiplier": "2.0",
      "original_bet_amount": 2000,
    }
  ],
  [
    201,
    {
      "bet_id": "1.106.17",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "lay",
      "backer_multiplier": "2.0",
      "original_bet_amount": 1000,
    }
  ],
  [
    201,
    {
      "bet_id": "1.106.16",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "lay",
      "backer_multiplier": "2.0",
      "original_bet_amount": 35000,
    }
  ],
  [
    203,
    {
      "bet_id": "1.106.14",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": "2.0",
      "matched_bet_amount": 25000,
    }
  ],
  [
    203,
    {
      "bet_id": "1.106.15",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": "2.0",
      "matched_bet_amount": 15000,
    }
  ],
  [
    201,
    {
      "bet_id": "1.106.15",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": "2.0",
      "original_bet_amount": 15000,
    }
  ],
  [
    201,
    {
      "bet_id": "1.106.14",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": "2.0",
      "original_bet_amount": 25000,
    }
  ],
  [
    201,
    {
      "bet_id": "1.106.13",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": "1.5",
      "original_bet_amount": 35000,
    }
  ],
  [
    201,
    {
      "bet_id": "1.106.12",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": "2.8",
      "original_bet_amount": 2500,
    }
  ],
  [
    201,
    {
      "bet_id": "1.106.11",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": "3.5",
      "original_bet_amount": 4000,
    }
  ],
  [
    201,
    {
      "bet_id": "1.106.10",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": "2.5",
      "original_bet_amount": 3000,
    }
  ],
  [
    201,
    {
      "bet_id": "1.106.9",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "lay",
      "backer_multiplier": "2.25",
      "original_bet_amount": 50000,
    }
  ],
  [
    203,
    {
      "bet_id": "1.106.5",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "back",
      "backer_multiplier": "1.75",
      "matched_bet_amount": 200,
    }
  ],
  [
    203,
    {
      "bet_id": "1.106.8",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "lay",
      "backer_multiplier": "2.5",
      "matched_bet_amount": 300,
    }
  ],
  [
    203,
    {
      "bet_id": "1.106.8",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "lay",
      "backer_multiplier": "2.5",
      "matched_bet_amount": 300,
    }
  ],
  [
    203,
    {
      "bet_id": "1.106.5",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "back",
      "backer_multiplier": "1.75",
      "matched_bet_amount": 200,
    }
  ],
  [
    203,
    {
      "bet_id": "1.106.8",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "lay",
      "backer_multiplier": "2.5",
      "matched_bet_amount": 300,
    }
  ],
  [
    203,
    {
      "bet_id": "1.106.8",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "lay",
      "backer_multiplier": "2.5",
      "matched_bet_amount": 500,
    }
  ],
  [
    203,
    {
      "bet_id": "1.106.5",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "back",
      "backer_multiplier": "1.75",
      "matched_bet_amount": 1000,
    }
  ],
  [
    203,
    {
      "bet_id": "1.106.5",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "back",
      "backer_multiplier": "1.75",
      "matched_bet_amount": 400,
    }
  ],
  [
    203,
    {
      "bet_id": "1.106.5",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "back",
      "backer_multiplier": "1.75",
      "matched_bet_amount": 300,
    }
  ],
  [
    203,
    {
      "bet_id": "1.106.5",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "back",
      "backer_multiplier": "1.75",
      "matched_bet_amount": 200,
    }
  ],
  [
    203,
    {
      "bet_id": "1.106.5",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "back",
      "backer_multiplier": "1.75",
      "matched_bet_amount": 1000,
    }
  ],
  [
    202,
    {
      "bet_id": "1.106.4",
      "amount_refunded": 4000,
      "asset_type": "1.3.0",
    }
  ],
  [
    202,
    {
      "bet_id": "1.106.7",
      "amount_refunded": 1000,
      "asset_type": "1.3.0",
    }
  ],
  [
    201,
    {
      "bet_id": "1.106.8",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "lay",
      "backer_multiplier": "2.5",
      "original_bet_amount": 5000,
    }
  ],
  [
    201,
    {
      "bet_id": "1.106.7",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "back",
      "backer_multiplier": "2.25",
      "original_bet_amount": 1000,
    }
  ],
  [
    201,
    {
      "bet_id": "1.106.6",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "lay",
      "backer_multiplier": "5.25",
      "original_bet_amount": 2000,
    }
  ],
  [
    201,
    {
      "bet_id": "1.106.5",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "back",
      "backer_multiplier": "1.75",
      "original_bet_amount": 3000,
    }
  ],
  [
    201,
    {
      "bet_id": "1.106.4",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "lay",
      "backer_multiplier": "2.60",
      "original_bet_amount": 4000,
    }
  ],
  [
    203,
    {
      "bet_id": "1.106.3",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "lay",
      "backer_multiplier": "1.5",
      "matched_bet_amount": 300,
    }
  ],
  [
    203,
    {
      "bet_id": "1.106.3",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "lay",
      "backer_multiplier": "1.5",
      "matched_bet_amount": 700,
    }
  ],
  [
    201,
    {
      "bet_id": "1.106.3",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "lay",
      "backer_multiplier": "2.25",
      "original_bet_amount": 1000,
    }
  ],
  [
    203,
    {
      "bet_id": "1.106.2",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": "1.5",
      "matched_bet_amount": 700,
    }
  ],
  [
    203,
    {
      "bet_id": "1.106.2",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": "1.5",
      "matched_bet_amount": 300,
    }
  ],
  [
    203,
    {
      "bet_id": "1.106.2",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": "1.5",
      "matched_bet_amount": 200,
    }
  ],
  [
    201,
    {
      "bet_id": "1.106.2",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": "1.5",
      "original_bet_amount": 20000,
    }
  ],
  [
    202,
    {
      "bet_id": "1.106.1",
      "amount_refunded": 10000,
      "asset_type": "1.3.0",
    }
  ],
  [
    201,
    {
      "bet_id": "1.106.1",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": "1.25",
      "original_bet_amount": 10000,
    }
  ]
];

/**
* Function to generate history given the list of operations
* This reduces the number of redundant and tedious job of creating dummy data (i.e. setting id, block_num, virtual_op for each transaction)
*/
const generateHistory = () => {
  const result = [];

  // 1 transaction every 5 mins;
  // Note, if you want to modify this, make sure to modify the dummyMaxBlockNum accordingly
  const transactionInterval =  5 * 60 / 3;

  let nextTransactionHistoryMaxIdInstanceNumber = dummyTransactionHistoryMaxIdInstanceNumber;
  let nextBlockNum = dummyMaxBlockNum;
  let nextVirtualOpId = dummyMaxVirtualOpId;

  _.forEach(listOfOperations, (operation) => {
    if (nextTransactionHistoryMaxIdInstanceNumber > 0) {
      // Append fee and extension field to the operation
      let modifiedOperation = operation;
      modifiedOperation[1]["fee"] =  {
        "amount": 200,
        "asset_id": "1.3.0"
      };
      modifiedOperation[1]["extensions"] = [];

      // Create transaction given the operation
      const transaction = {
        "id": "1.11." + nextTransactionHistoryMaxIdInstanceNumber,
        "op": modifiedOperation,
        "result": [
          0,
          {}
        ],
        "block_num": nextBlockNum,
        "trx_in_block": 1,
        "op_in_trx": 0,
        "virtual_op": nextVirtualOpId,
      }
      // Append it to the result
      result.push(transaction);
      // Update next number
      nextTransactionHistoryMaxIdInstanceNumber -= 1;
      nextBlockNum -= transactionInterval; // 1 transaction every 3 hour
      nextVirtualOpId -= 1;
    }
  })
  return result;
}

const history = generateHistory();

export default history;
