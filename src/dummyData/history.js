import { Config, ChainTypes } from '../constants';
import _ from 'lodash';

// Assume
// 201 is operation type for make_bet (ChainTypes.operations.bet_place)
// 202 is operation type for cancel_bet (ChainTypes.operations.bet_cancel) // For display, we don't use this and use 205 BET_CANCELLED instead
// 203 is operation type for fill_bet (ChainTypes.operations.bet_matched)
// 204 is operation type for betting_market_resolved (ChainTypes.operations.betting_market_group_resolved)
// 205 is operation type for bet_cancelled (ChainTypes.operations.bet_canceled)

// TODO: add more transaction history, especially to fill my wager page, for the following 5 types of bets
// Fully unmatched bets, partially matched bets, fully matched bets, cancelled bets, and resolved bets across different markets
//
// To make fully unmatched bets:
// - add MAKE_BET operation
// - don't add any BET_MATCHED that with the same bet_id as the above MAKE_BET
// - also don't add any CANCEL_BET that with the same bet_id as the above MAKE_BET
// - also don't add any betting_market_group_id that with the same betting_market_id as the above MAKE_BET
// To make partially matched bets (= partially unmatched bets):
// - add MAKE_BET operation
// - add one or more BET_MATCHED operation with the same bet_id as the above MAKE_BET
// - however to ensure it is NOT FULLY MATCHED, this requirement should be satisfied
//      -> (sum of matched_bet_amount < original_bet_amount * (backer_multiplier - 1))
// - also don't add any CANCEL_BET that with the same bet_id as the above MAKE_BET
// - also don't add any BETTING_MARKET_RESOLVED that with the same betting_market_id as the above MAKE_BET
// To make fully matched bets:
// - add MAKE_BET operation
// - add one or more BET_MATCHED operation with the same bet_id as the above MAKE_BET
// - however to ensure it is FULLY MATCHED, this requirement should be satisfied
//      -> (sum of matched_bet_amount = original_bet_amount * (backer_multiplier - 1))
// - also don't add any CANCEL_BET that with the same bet_id as the above MAKE_BET
// - also don't add any BETTING_MARKET_RESOLVED that with the same betting_market_id as the above MAKE_BET
// To make cancelled fully unmatched bets:
// - add MAKE_BET operation
// - add BET_CANCELLED operation with stake_returned = original_bet_amount
// - don't add any BET_MATCHED that with the same bet_id as the above MAKE_BET
// - also don't add any BETTING_MARKET_RESOLVED that with the same betting_market_id as the above MAKE_BET
// To make cancelled partially unmatched bets:
// - make partially unmatched bets
// - add BET_CANCELLED operation with stake_returned = (original_bet_amount - sum of matched_bet_amount of related FILLED_BET)
// - don't add any BETTING_MARKET_RESOLVED that with the same betting_market_id as the above MAKE_BET
// To make resolved bets:
// - make partially matched bets/ fully matched bets on a particular betting market
// - add BETTING_MARKET_RESOLVED with betting_market_id equal to the above partially matched bets/ fully matched bets

// To help the developers and QA on testing (especially for checking placed bets),
// the following list lists the related dummy betting_market and betting_market_group specified in this dummy data
// - betting_market 1.105.13 (betting_market group 1.104.7 Carolina Panthers vs Denver Broncos Moneyline)
// - betting_market 1.105.5 (betting_market group 1.104.3 NY Giants vs Green Bay OverUnder 8)
// - betting_market 1.105.4 (betting_market group 1.104.2 NY Giants vs Green Bay Spread 5)
// - betting_market 1.105.3 (betting_market group 1.104.2 NY Giants vs Green Bay Spread 5)
// - betting_market 1.105.1 (betting_market group 1.104.1 NY Giants vs Green Bay Moneyline)
// - TODO: extend this list if listOfOperations is extended

const dummyAccountId = Config.dummyDataAccountId;

const oddsPrecision = Config.oddsPrecision;
const listOfOperations = [
  [
    ChainTypes.operations.bet_place,
    {
      "bet_id": "1.106.24",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.13",
      "back_or_lay": "back",
      "backer_multiplier": 2.0 * oddsPrecision,
      "amount_to_bet": {
        "amount": 5000,
        "asset_id": "1.3.0"
      }
    }
  ],
  [
    ChainTypes.operations.bet_place,
    {
      "bet_id": "1.106.23",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.13",
      "back_or_lay": "back",
      "backer_multiplier": 2.0 * oddsPrecision,
      "amount_to_bet": {
        "amount": 5000,
        "asset_id": "1.3.0"
      }
    }
  ],
  [
    ChainTypes.operations.bet_place,
    {
      "bet_id": "1.106.22",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.13",
      "back_or_lay": "lay",
      "backer_multiplier": 3.0 * oddsPrecision,
      "amount_to_bet": {
        "amount": 10000,
        "asset_id": "1.3.0"
      }
    }
  ],
  [
    ChainTypes.operations.bet_place,
    {
      "bet_id": "1.106.21",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.13",
      "back_or_lay": "back",
      "backer_multiplier": 2.0 * oddsPrecision,
      "amount_to_bet": {
        "amount": 5000,
        "asset_id": "1.3.0"
      }
    }
  ],
  [
    ChainTypes.operations.betting_market_group_resolved,
    {
      "bettor_id": dummyAccountId,
      "betting_market_group_id": "1.104.3",
      "resolutions": [
        ["1.105.5", "win"]
      ]
    }
  ],
  [
    ChainTypes.operations.betting_market_group_resolved,
    {
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.104.2",
      "resolutions": [
        ["1.105.4", "win"]
      ]
    }
  ],
  [
    ChainTypes.operations.bet_place,
    {
      "bet_id": "1.106.20",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.5",
      "back_or_lay": "lay",
      "backer_multiplier": 2.0 * oddsPrecision,
      "amount_to_bet": {
        "amount": 5000,
        "asset_id": "1.3.0"
      }
    }
  ],
  [
    ChainTypes.operations.bet_place,
    {
      "bet_id": "1.106.19",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.4",
      "back_or_lay": "back",
      "backer_multiplier": 2.0 * oddsPrecision,
      "amount_to_bet": {
        "amount": 5000,
        "asset_id": "1.3.0"
      }
    }
  ],
  [
    ChainTypes.operations.bet_matched,
    {
      "bet_id": "1.106.18",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "lay",
      "backer_multiplier": 2.0 * oddsPrecision,
      "amount_bet": {
        "amount": 2000,
        "asset_id": "1.3.0"
      },
    }
  ],
  [
    ChainTypes.operations.bet_matched,
    {
      "bet_id": "1.106.17",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "lay",
      "backer_multiplier": 2.0 * oddsPrecision,
      "amount_bet": {
        "amount": 1000,
        "asset_id": "1.3.0"
      },
    }
  ],
  [
    ChainTypes.operations.bet_matched,
    {
      "bet_id": "1.106.16",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "lay",
      "backer_multiplier": 2.0 * oddsPrecision,
      "amount_bet": {
        "amount": 35000,
        "asset_id": "1.3.0"
      },
    }
  ],
  [
    ChainTypes.operations.bet_place,
    {
      "bet_id": "1.106.18",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "lay",
      "backer_multiplier": 2.0 * oddsPrecision,
      "amount_to_bet": {
        "amount": 2000,
        "asset_id": "1.3.0"
      }
    }
  ],
  [
    ChainTypes.operations.bet_place,
    {
      "bet_id": "1.106.17",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "lay",
      "backer_multiplier": 2.0 * oddsPrecision,
      "amount_to_bet": {
        "amount": 1000,
        "asset_id": "1.3.0"
      }
    }
  ],
  [
    ChainTypes.operations.bet_place,
    {
      "bet_id": "1.106.16",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "lay",
      "backer_multiplier": 2.0 * oddsPrecision,
      "amount_to_bet": {
        "amount": 1000,
        "asset_id": "1.3.0"
      }
    }
  ],
  [
    ChainTypes.operations.bet_matched,
    {
      "bet_id": "1.106.14",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": 2.0 * oddsPrecision,
      "amount_bet": {
        "amount": 25000,
        "asset_id": "1.3.0"
      },
    }
  ],
  [
    ChainTypes.operations.bet_matched,
    {
      "bet_id": "1.106.15",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": 2.0 * oddsPrecision,
      "amount_bet": {
        "amount": 15000,
        "asset_id": "1.3.0"
      },
    }
  ],
  [
    ChainTypes.operations.bet_place,
    {
      "bet_id": "1.106.15",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": 2.0 * oddsPrecision,
      "amount_to_bet": {
        "amount": 15000,
        "asset_id": "1.3.0"
      }
    }
  ],
  [
    ChainTypes.operations.bet_place,
    {
      "bet_id": "1.106.14",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": 2.0 * oddsPrecision,
      "amount_to_bet": {
        "amount": 25000,
        "asset_id": "1.3.0"
      }
    }
  ],
  [
    ChainTypes.operations.bet_place,
    {
      "bet_id": "1.106.13",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": 1.5 * oddsPrecision,
      "amount_to_bet": {
        "amount": 35000,
        "asset_id": "1.3.0"
      }
    }
  ],
  [
    ChainTypes.operations.bet_place,
    {
      "bet_id": "1.106.12",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": 2.8 * oddsPrecision,
      "amount_to_bet": {
        "amount": 2500,
        "asset_id": "1.3.0"
      }
    }
  ],
  [
    ChainTypes.operations.bet_place,
    {
      "bet_id": "1.106.11",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": 3.5 * oddsPrecision,
      "amount_to_bet": {
        "amount": 4000,
        "asset_id": "1.3.0"
      }
    }
  ],
  [
    ChainTypes.operations.bet_place,
    {
      "bet_id": "1.106.10",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": 2.5 * oddsPrecision,
      "amount_to_bet": {
        "amount": 3000,
        "asset_id": "1.3.0"
      }
    }
  ],
  [
    ChainTypes.operations.bet_place,
    {
      "bet_id": "1.106.9",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "lay",
      "backer_multiplier": 2.25 * oddsPrecision,
      "amount_to_bet": {
        "amount": 50000,
        "asset_id": "1.3.0"
      }
    }
  ],
  [
    ChainTypes.operations.betting_market_group_resolved,
    {
      "bettor_id": dummyAccountId,
      "betting_market_group_id": "1.104.2",
      "resolutions": [
        ["1.105.3", "win"]
      ]
    }
  ],
  [
    ChainTypes.operations.bet_matched,
    {
      "bet_id": "1.106.5",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "back",
      "backer_multiplier": 1.75 * oddsPrecision,
      "amount_bet": {
        "amount": 200,
        "asset_id": "1.3.0"
      },
    }
  ],
  [
    ChainTypes.operations.bet_matched,
    {
      "bet_id": "1.106.8",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "lay",
      "backer_multiplier": 2.5 * oddsPrecision,
      "amount_bet": {
        "amount": 300,
        "asset_id": "1.3.0"
      },
    }
  ],
  [
    ChainTypes.operations.bet_matched,
    {
      "bet_id": "1.106.8",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "lay",
      "backer_multiplier": 2.5 * oddsPrecision,
      "amount_bet": {
        "amount": 300,
        "asset_id": "1.3.0"
      },
    }
  ],
  [
    ChainTypes.operations.bet_matched,
    {
      "bet_id": "1.106.5",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "back",
      "backer_multiplier": 1.75 * oddsPrecision,
      "matched_bet_amount": 200,
      "amount_bet": {
        "amount": 200,
        "asset_id": "1.3.0"
      },
    }
  ],
  [
    ChainTypes.operations.bet_matched,
    {
      "bet_id": "1.106.8",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "lay",
      "backer_multiplier": 2.5 * oddsPrecision,
      "amount_bet": {
        "amount": 300,
        "asset_id": "1.3.0"
      },
    }
  ],
  [
    ChainTypes.operations.bet_matched,
    {
      "bet_id": "1.106.8",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "lay",
      "backer_multiplier": 2.5 * oddsPrecision,
      "matched_bet_amount": 500,
      "amount_bet": {
        "amount": 500,
        "asset_id": "1.3.0"
      },
    }
  ],
  [
    ChainTypes.operations.bet_matched,
    {
      "bet_id": "1.106.5",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "back",
      "backer_multiplier": 1.75 * oddsPrecision,
      "amount_bet": {
        "amount": 1000,
        "asset_id": "1.3.0"
      },
    }
  ],
  [
    ChainTypes.operations.bet_matched,
    {
      "bet_id": "1.106.5",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "back",
      "backer_multiplier": 1.75 * oddsPrecision,
      "amount_bet": {
        "amount": 400,
        "asset_id": "1.3.0"
      },
    }
  ],
  [
    ChainTypes.operations.bet_matched,
    {
      "bet_id": "1.106.5",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "back",
      "backer_multiplier": 1.75 * oddsPrecision,
      "matched_bet_amount": 300,
      "amount_bet": {
        "amount": 300,
        "asset_id": "1.3.0"
      },
    }
  ],
  [
    ChainTypes.operations.bet_matched,
    {
      "bet_id": "1.106.5",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "back",
      "backer_multiplier": 1.75 * oddsPrecision,
      "amount_bet": {
        "amount": 200,
        "asset_id": "1.3.0"
      },
    }
  ],
  [
    ChainTypes.operations.bet_matched,
    {
      "bet_id": "1.106.5",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "back",
      "backer_multiplier": 1.75 * oddsPrecision,
      "amount_bet": {
        "amount": 1000,
        "asset_id": "1.3.0"
      },
    }
  ],
  [
    ChainTypes.operations.bet_canceled,
    {
      "bet_id": "1.106.4",
      "bettor_id": dummyAccountId,
      "stake_returned": {
        "amount":4000,
        "asset_id": "1.3.0"
      }
    }
  ],
  [
    ChainTypes.operations.bet_canceled,
    {
      "bet_id": "1.106.7",
      "bettor_id": dummyAccountId,
      "stake_returned": {
        "amount":1000,
        "asset_id": "1.3.0"
      }
    }
  ],
  [
    ChainTypes.operations.bet_place,
    {
      "bet_id": "1.106.8",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "lay",
      "backer_multiplier": 2.5 * oddsPrecision,
      "amount_to_bet": {
        "amount": 5000,
        "asset_id": "1.3.0"
      },
    }
  ],
  [
    ChainTypes.operations.bet_place,
    {
      "bet_id": "1.106.7",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "back",
      "backer_multiplier": 2.25 * oddsPrecision,
      "original_bet_amount": 1000,
      "amount_to_bet": {
        "amount": 1000,
        "asset_id": "1.3.0"
      },
    }
  ],
  [
    ChainTypes.operations.bet_place,
    {
      "bet_id": "1.106.6",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "lay",
      "backer_multiplier": 5.25 * oddsPrecision,
      "original_bet_amount": 2000,
      "amount_to_bet": {
        "amount": 2000,
        "asset_id": "1.3.0"
      },
    }
  ],
  [
    ChainTypes.operations.bet_place,
    {
      "bet_id": "1.106.5",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "back",
      "backer_multiplier": 1.75 * oddsPrecision,
      "amount_to_bet": {
        "amount": 3000,
        "asset_id": "1.3.0"
      },
    }
  ],
  [
    ChainTypes.operations.bet_place,
    {
      "bet_id": "1.106.4",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.3",
      "back_or_lay": "lay",
      "backer_multiplier": 2.60 * oddsPrecision,
      "amount_to_bet": {
        "amount": 4000,
        "asset_id": "1.3.0"
      },
    }
  ],
  [
    ChainTypes.operations.bet_matched,
    {
      "bet_id": "1.106.3",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "lay",
      "backer_multiplier": 1.5 * oddsPrecision,
      "amount_bet": {
        "amount": 300,
        "asset_id": "1.3.0"
      },
    }
  ],
  [
    ChainTypes.operations.bet_matched,
    {
      "bet_id": "1.106.3",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "lay",
      "backer_multiplier": 1.5 * oddsPrecision,
      "amount_bet": {
        "amount": 700,
        "asset_id": "1.3.0"
      },
    }
  ],
  [
    ChainTypes.operations.bet_place,
    {
      "bet_id": "1.106.3",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "lay",
      "backer_multiplier": 2.25 * oddsPrecision,
      "amount_to_bet": {
        "amount": 1000,
        "asset_id": "1.3.0"
      },
    }
  ],
  [
    ChainTypes.operations.bet_matched,
    {
      "bet_id": "1.106.2",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": 1.5 * oddsPrecision,
      "amount_bet": {
        "amount": 700,
        "asset_id": "1.3.0"
      },
    }
  ],
  [
    ChainTypes.operations.bet_matched,
    {
      "bet_id": "1.106.2",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": 1.5 * oddsPrecision,
      "amount_bet": {
        "amount": 300,
        "asset_id": "1.3.0"
      },
    }
  ],
  [
    ChainTypes.operations.bet_matched,
    {
      "bet_id": "1.106.2",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": 1.5 * oddsPrecision,
      "amount_bet": {
        "amount": 200,
        "asset_id": "1.3.0"
      },
    }
  ],
  [
    ChainTypes.operations.bet_place,
    {
      "bet_id": "1.106.2",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": 1.5 * oddsPrecision,
      "amount_to_bet": {
        "amount": 20000,
        "asset_id": "1.3.0"
      }
    }
  ],
  [
    ChainTypes.operations.bet_canceled,
    {
      "bet_id": "1.106.1",
      "bettor_id": dummyAccountId,
      "stake_returned": {
        "amount": 10000,
        "asset_id": "1.3.0"
      }
    }
  ],
  [
    ChainTypes.operations.bet_place,
    {
      "bet_id": "1.106.1",
      "bettor_id": dummyAccountId,
      "betting_market_id": "1.105.1",
      "back_or_lay": "back",
      "backer_multiplier": 1.25 * oddsPrecision,
      "amount_to_bet": {
        "amount": 10000,
        "asset_id": "1.3.0"
      },
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
      if (operation[0] === ChainTypes.operations.bet_place) {
        transaction["result"][1] = operation[1]["bet_id"]
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
