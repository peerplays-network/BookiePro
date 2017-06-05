import { Config, DummyOperationTypes } from '../constants';
import _ from 'lodash';

// Assume
// 201 is operation type for make_bet (DummyOperationTypes.MAKE_BET)
// 202 is operation type for cancel_bet (DummyOperationTypes.CANCEL_BET)
// 203 is operation type for fill_bet (DummyOperationTypes.FILL_BET)
// 204 is operation type for betting_market_resolved (DummyOperationTypes.BETTING_MARKET_RESOLVED)

// TODO: add more transaction history, especially to fill my wager page, for the following 5 types of bets
// Fully unmatched bets, partially matched bets, fully matched bets, cancelled bets, and resolved bets across different markets
//
// To make fully unmatched bets:
// - add MAKE_BET operation
// - don't add any FILL_BET that with the same bet_id as the above MAKE_BET
// - also don't add any CANCEL_BET that with the same bet_id as the above MAKE_BET
// - also don't add any betting_market_group_id that with the same betting_market_id as the above MAKE_BET
// To make partially matched bets (= partially unmatched bets):
// - add MAKE_BET operation
// - add one or more FILL_BET operation with the same bet_id as the above MAKE_BET
// - however to ensure it is NOT FULLY MATCHED, this requirement should be satisfied
//      -> (sum of matched_bet_amount < original_bet_amount * (backer_multiplier - 1))
// - also don't add any CANCEL_BET that with the same bet_id as the above MAKE_BET
// - also don't add any BETTING_MARKET_RESOLVED that with the same betting_market_id as the above MAKE_BET
// To make fully matched bets:
// - add MAKE_BET operation
// - add one or more FILL_BET operation with the same bet_id as the above MAKE_BET
// - however to ensure it is FULLY MATCHED, this requirement should be satisfied
//      -> (sum of matched_bet_amount = original_bet_amount * (backer_multiplier - 1))
// - also don't add any CANCEL_BET that with the same bet_id as the above MAKE_BET
// - also don't add any BETTING_MARKET_RESOLVED that with the same betting_market_id as the above MAKE_BET
// To make cancelled fully unmatched bets:
// - add MAKE_BET operation
// - add CANCEL_BET operation with amount_refunded = original_bet_amount
// - don't add any FILL_BET that with the same bet_id as the above MAKE_BET
// - also don't add any BETTING_MARKET_RESOLVED that with the same betting_market_id as the above MAKE_BET
// To make cancelled partially unmatched bets:
// - make partially unmatched bets
// - add CANCEL_BET operation with amount_refunded = (original_bet_amount - sum of matched_bet_amount of related FILLED_BET)
// - don't add any BETTING_MARKET_RESOLVED that with the same betting_market_id as the above MAKE_BET
// To make resolved bets:
// - make partially matched bets/ fully matched bets on a particular betting market
// - add BETTING_MARKET_RESOLVED with betting_market_id equal to the above partially matched bets/ fully matched bets
// - since amount_paid of BETTING_MARKET_RESOLVED is used as it is (we don't need to do calculation on it), we can just put arbitary number here to make our life easier
const dummyAccountId = Config.dummyDataAccountId;

const listOfOperations = [
  [
    DummyOperationTypes.MAKE_BET,
    {
      "bet_id": "1.106.24",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.13",
      "back_or_lay": "back",
      "backer_multiplier": 2.0,
      "original_bet_amount": 5000,
    }
  ],
  [
    DummyOperationTypes.MAKE_BET,
    {
      "bet_id": "1.106.23",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.13",
      "back_or_lay": "back",
      "backer_multiplier": 2.0,
      "original_bet_amount": 5000,
    }
  ],
  [
    DummyOperationTypes.MAKE_BET,
    {
      "bet_id": "1.106.22",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.13",
      "back_or_lay": "lay",
      "backer_multiplier": 3.0,
      "original_bet_amount": 10000,
    }
  ],
  [
    DummyOperationTypes.MAKE_BET,
    {
      "bet_id": "1.106.21",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.13",
      "back_or_lay": "back",
      "backer_multiplier": 2.0,
      "original_bet_amount": 5000,
    }
  ],
  [
    DummyOperationTypes.BETTING_MARKET_RESOLVED,
    {
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.5",
      "amount_paid": 10000,
    }
  ],
  [
    DummyOperationTypes.BETTING_MARKET_RESOLVED,
    {
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.4",
      "amount_paid": 10000,
    }
  ],
  [
    DummyOperationTypes.MAKE_BET,
    {
      "bet_id": "1.106.20",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.5",
      "back_or_lay": "lay",
      "backer_multiplier": 2.0,
      "original_bet_amount": 5000,
    }
  ],
  [
    DummyOperationTypes.MAKE_BET,
    {
      "bet_id": "1.106.19",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.4",
      "back_or_lay": "back",
      "backer_multiplier": 2.0,
      "original_bet_amount": 5000,
    }
  ],
  [
    DummyOperationTypes.BET_MATCHED,
    {
      "bet_id": "1.106.18",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "lay",
      "backer_multiplier": 2.0,
      "matched_bet_amount": 2000,
    }
  ],
  [
    DummyOperationTypes.BET_MATCHED,
    {
      "bet_id": "1.106.17",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "lay",
      "backer_multiplier": 2.0,
      "matched_bet_amount": 1000,
    }
  ],
  [
    DummyOperationTypes.BET_MATCHED,
    {
      "bet_id": "1.106.16",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "lay",
      "backer_multiplier": 2.0,
      "matched_bet_amount": 35000,
    }
  ],
  [
    DummyOperationTypes.MAKE_BET,
    {
      "bet_id": "1.106.18",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "lay",
      "backer_multiplier": 2.0,
      "original_bet_amount": 2000,
    }
  ],
  [
    DummyOperationTypes.MAKE_BET,
    {
      "bet_id": "1.106.17",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "lay",
      "backer_multiplier": 2.0,
      "original_bet_amount": 1000,
    }
  ],
  [
    DummyOperationTypes.MAKE_BET,
    {
      "bet_id": "1.106.16",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "lay",
      "backer_multiplier": 2.0,
      "original_bet_amount": 35000,
    }
  ],
  [
    DummyOperationTypes.BET_MATCHED,
    {
      "bet_id": "1.106.14",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": 2.0,
      "matched_bet_amount": 25000,
    }
  ],
  [
    DummyOperationTypes.BET_MATCHED,
    {
      "bet_id": "1.106.15",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": 2.0,
      "matched_bet_amount": 15000,
    }
  ],
  [
    DummyOperationTypes.MAKE_BET,
    {
      "bet_id": "1.106.15",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": 2.0,
      "original_bet_amount": 15000,
    }
  ],
  [
    DummyOperationTypes.MAKE_BET,
    {
      "bet_id": "1.106.14",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": 2.0,
      "original_bet_amount": 25000,
    }
  ],
  [
    DummyOperationTypes.MAKE_BET,
    {
      "bet_id": "1.106.13",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": 1.5,
      "original_bet_amount": 35000,
    }
  ],
  [
    DummyOperationTypes.MAKE_BET,
    {
      "bet_id": "1.106.12",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": 2.8,
      "original_bet_amount": 2500,
    }
  ],
  [
    DummyOperationTypes.MAKE_BET,
    {
      "bet_id": "1.106.11",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": 3.5,
      "original_bet_amount": 4000,
    }
  ],
  [
    DummyOperationTypes.MAKE_BET,
    {
      "bet_id": "1.106.10",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": 2.5,
      "original_bet_amount": 3000,
    }
  ],
  [
    DummyOperationTypes.MAKE_BET,
    {
      "bet_id": "1.106.9",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "lay",
      "backer_multiplier": 2.25,
      "original_bet_amount": 50000,
    }
  ],
  [
    DummyOperationTypes.BETTING_MARKET_RESOLVED,
    {
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "amount_paid": 100000,
    }
  ],
  [
    DummyOperationTypes.BET_MATCHED,
    {
      "bet_id": "1.106.5",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "back",
      "backer_multiplier": 1.75,
      "matched_bet_amount": 200,
    }
  ],
  [
    DummyOperationTypes.BET_MATCHED,
    {
      "bet_id": "1.106.8",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "lay",
      "backer_multiplier": 2.5,
      "matched_bet_amount": 300,
    }
  ],
  [
    DummyOperationTypes.BET_MATCHED,
    {
      "bet_id": "1.106.8",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "lay",
      "backer_multiplier": 2.5,
      "matched_bet_amount": 300,
    }
  ],
  [
    DummyOperationTypes.BET_MATCHED,
    {
      "bet_id": "1.106.5",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "back",
      "backer_multiplier": 1.75,
      "matched_bet_amount": 200,
    }
  ],
  [
    DummyOperationTypes.BET_MATCHED,
    {
      "bet_id": "1.106.8",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "lay",
      "backer_multiplier": 2.5,
      "matched_bet_amount": 300,
    }
  ],
  [
    DummyOperationTypes.BET_MATCHED,
    {
      "bet_id": "1.106.8",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "lay",
      "backer_multiplier": 2.5,
      "matched_bet_amount": 500,
    }
  ],
  [
    DummyOperationTypes.BET_MATCHED,
    {
      "bet_id": "1.106.5",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "back",
      "backer_multiplier": 1.75,
      "matched_bet_amount": 1000,
    }
  ],
  [
    DummyOperationTypes.BET_MATCHED,
    {
      "bet_id": "1.106.5",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "back",
      "backer_multiplier": 1.75,
      "matched_bet_amount": 400,
    }
  ],
  [
    DummyOperationTypes.BET_MATCHED,
    {
      "bet_id": "1.106.5",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "back",
      "backer_multiplier": 1.75,
      "matched_bet_amount": 300,
    }
  ],
  [
    DummyOperationTypes.BET_MATCHED,
    {
      "bet_id": "1.106.5",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "back",
      "backer_multiplier": 1.75,
      "matched_bet_amount": 200,
    }
  ],
  [
    DummyOperationTypes.BET_MATCHED,
    {
      "bet_id": "1.106.5",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "back",
      "backer_multiplier": 1.75,
      "matched_bet_amount": 1000,
    }
  ],
  [
    DummyOperationTypes.CANCEL_BET,
    {
      "bet_id": "1.106.4",
      "amount_refunded": 4000,
      "asset_type": "1.3.0",
    }
  ],
  [
    DummyOperationTypes.CANCEL_BET,
    {
      "bet_id": "1.106.7",
      "amount_refunded": 1000,
      "asset_type": "1.3.0",
    }
  ],
  [
    DummyOperationTypes.MAKE_BET,
    {
      "bet_id": "1.106.8",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "lay",
      "backer_multiplier": 2.5,
      "original_bet_amount": 5000,
    }
  ],
  [
    DummyOperationTypes.MAKE_BET,
    {
      "bet_id": "1.106.7",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "back",
      "backer_multiplier": 2.25,
      "original_bet_amount": 1000,
    }
  ],
  [
    DummyOperationTypes.MAKE_BET,
    {
      "bet_id": "1.106.6",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "lay",
      "backer_multiplier": 5.25,
      "original_bet_amount": 2000,
    }
  ],
  [
    DummyOperationTypes.MAKE_BET,
    {
      "bet_id": "1.106.5",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "back",
      "backer_multiplier": 1.75,
      "original_bet_amount": 3000,
    }
  ],
  [
    DummyOperationTypes.MAKE_BET,
    {
      "bet_id": "1.106.4",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "lay",
      "backer_multiplier": 2.60,
      "original_bet_amount": 4000,
    }
  ],
  [
    DummyOperationTypes.BET_MATCHED,
    {
      "bet_id": "1.106.3",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "lay",
      "backer_multiplier": 1.5,
      "matched_bet_amount": 300,
    }
  ],
  [
    DummyOperationTypes.BET_MATCHED,
    {
      "bet_id": "1.106.3",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "lay",
      "backer_multiplier": 1.5,
      "matched_bet_amount": 700,
    }
  ],
  [
    DummyOperationTypes.MAKE_BET,
    {
      "bet_id": "1.106.3",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "lay",
      "backer_multiplier": 2.25,
      "original_bet_amount": 1000,
    }
  ],
  [
    DummyOperationTypes.BET_MATCHED,
    {
      "bet_id": "1.106.2",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": 1.5,
      "matched_bet_amount": 700,
    }
  ],
  [
    DummyOperationTypes.BET_MATCHED,
    {
      "bet_id": "1.106.2",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": 1.5,
      "matched_bet_amount": 300,
    }
  ],
  [
    DummyOperationTypes.BET_MATCHED,
    {
      "bet_id": "1.106.2",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": 1.5,
      "matched_bet_amount": 200,
    }
  ],
  [
    DummyOperationTypes.MAKE_BET,
    {
      "bet_id": "1.106.2",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": 1.5,
      "original_bet_amount": 20000,
    }
  ],
  [
    DummyOperationTypes.CANCEL_BET,
    {
      "bet_id": "1.106.1",
      "amount_refunded": 10000,
      "asset_type": "1.3.0",
    }
  ],
  [
    DummyOperationTypes.MAKE_BET,
    {
      "bet_id": "1.106.1",
      "account_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": 1.25,
      "original_bet_amount": 10000,
    }
  ]
];


const dummyTransactionHistoryMaxIdInstanceNumber = listOfOperations.length + 100000;
const dummyMaxBlockNum = listOfOperations.length * 3;
const dummyMaxVirtualOpId = listOfOperations.length + 100000;

/**
* Function to generate history given the list of operations
* This reduces the number of redundant and tedious job of creating dummy data (i.e. setting id, block_num, virtual_op for each transaction)
*/
const generateHistory = () => {
  const result = [];

  // 1 transaction every 3 seconds;
  // Note, if you want to modify this, make sure to modify the dummyMaxBlockNum accordingly, so it couldn't reach below zero
  const transactionInterval =  3;

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
