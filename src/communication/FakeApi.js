import _ from 'lodash';
import dummyData from '../dummyData';
import Immutable from 'immutable';
const {
  sports,
  eventGroups,
  competitors,
  events,
  bets,
  binnedOrderBooks,
  globalBettingStatistics,
  transactionHistory,
  bettingMarketGroups,
  bettingMarkets
} = dummyData;

const TIMEOUT_LENGTH = 500;

class FakeApi {
  static getObjects(arrayOfObjectIds = []) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const filteredResult = [];
        // Iterate every object in dummy data to find the matching object
        let allObjects = [];
        _.forEach(dummyData, (item) => {
          allObjects = _.concat(allObjects, item);
        })
        _.forEach(allObjects, (item) => {
          if (_.includes(arrayOfObjectIds, item.get('id'))) {
            filteredResult.push(item);
          }
        })
        resolve(filteredResult);
      }, TIMEOUT_LENGTH);
    });
  }

  static getOngoingBets(accountId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const filteredResult = _.filter(bets, (item) => {
          return item.get('bettor_id') === accountId;
        });
        resolve(filteredResult);
      }, TIMEOUT_LENGTH);
    });
  }

  static getResolvedBets(accountId, startTime, stopTime) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // TODO: do it later, pending for confirmation from Dan
        resolve([]);
      }, TIMEOUT_LENGTH);
    });
  }

  static getBinnedOrderBook(bettingMarketId, binning_precision) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let mappedResult = [];
        binnedOrderBooks.forEach((orderBook) => {
          if (orderBook.get('betting_market_id') === bettingMarketId) {
            mappedResult.push(orderBook);
          }
        });
        resolve(mappedResult);
      }, TIMEOUT_LENGTH);
    })
  }

  static getTransactionHistories(accountId, startTime, stopTime) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // TODO: do it later, pending for confirmation from Dan
        resolve([]);
      }, TIMEOUT_LENGTH);
    });
  }


  static getAvailableBalance(account) {
    const availableBalanceId = account && account.getIn(['balances', '1.3.0']);
    return FakeApi.getObjects([availableBalanceId]).then((objects) => {
      let availableBalance = 0;
      if (objects && objects.length > 0 ) {
        availableBalance += objects[0].get('balance') || 0
      }
      return availableBalance
    });
  }

  static getInGameBalance(account) {
    const accountId = account && account.get('id');
    return FakeApi.getOngoingBets(accountId).then((ongoingBets) => {
      let inGameBalance = 0;
      // Calculate in game balance by summing matched bets
      _.forEach(ongoingBets, (bet) => {
        if (!(bet.amount_to_bet === bet.remaining_amount_to_bet
          && bet.amount_to_win === bet.remaining_amount_to_win)) {
          inGameBalance += bet.amount_to_bet;
        }
      })
      return inGameBalance;
    });
  }

  static processTransaction(transactionObject) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, TIMEOUT_LENGTH);
    })
  }

  static getTransactionHistory(accountid,startDate,endDate) {
    return new Promise((resolve, reject) => {
      if(startDate !== undefined && endDate !== undefined){
        var filteredHistory =  _.filter(transactionHistory, (hist) => {
          return (hist.get('time') >= startDate && hist.get('time') <= endDate)
        });
        resolve(_.orderBy(filteredHistory,
          function(value) {
            return (value.get('time')+''
          )}, 'desc'
        ));
      }
      resolve(_.orderBy(transactionHistory,
        function(value) {
          return (value.get('time')+''
        )}, 'desc'
      ));
    });
  }
}

export default FakeApi
