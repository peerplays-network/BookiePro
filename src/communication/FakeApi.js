import _ from 'lodash';
import dummyData from '../dummyData';

const {
  sports,
  eventGroups,
  competitors,
  events,
  bets,
  binnedOrderBooks,
  globalBettingStatistics,
  transactionHistory
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
          if (_.includes(arrayOfObjectIds, item.id)) {
            filteredResult.push(item);
          }
        })
        resolve(filteredResult);
      }, TIMEOUT_LENGTH);
    });
  }

  static getSports() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(_.cloneDeep(sports));
      }, TIMEOUT_LENGTH);
    });
  }

  static getEventGroups(sportId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const filteredResult = _.filter(eventGroups, (item) => {
          return item.sport_id === sportId;
        });
        resolve(filteredResult);
      }, TIMEOUT_LENGTH);
    });
  }

  static getCompetitors(sportId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const filteredResult = _.filter(competitors, (item) => {
          return item.sport_id === sportId;
        });
        resolve(filteredResult);
      }, TIMEOUT_LENGTH);
    });
  }

  static getEvents(sportId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const filteredResult = _.filter(events, (item) => {
          return item.sport_id === sportId;
        });
        resolve(filteredResult);
      }, TIMEOUT_LENGTH);
    });
  }

  static searchEvents(keyword) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const filteredResult = _.filter(events, (item) => {
          const team1Name = item.name.split(' vs ')[0];
          const team2Name = item.name.split(' vs ')[1];

          const keywordLowerCase = keyword.toLowerCase();

          const team1FirstName = team1Name.split(' ')[0].toLowerCase();
          const team2FirstName = team2Name.split(' ')[0].toLowerCase();
          return team1FirstName.startsWith(keywordLowerCase) || team2FirstName.startsWith(keywordLowerCase);

        });
        resolve(filteredResult);
      }, TIMEOUT_LENGTH);
    });
  }

  static getOngoingBets(accountId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const filteredResult = _.filter(bets, (item) => {
          return item.bettor_id === accountId;
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
          if (orderBook.betting_market_id === bettingMarketId) {
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

  static withdraw(walletAddress) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, TIMEOUT_LENGTH);
    });
  }

  static getDepositAddress(accountId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('THISISDUMMYDEPOSITADDRESSFORANYACCOUNTID');
      }, TIMEOUT_LENGTH);
    });
  }

  static getGlobalBettingStatistics() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(globalBettingStatistics);
      }, TIMEOUT_LENGTH);
    });
  }

  static getAvailableBalance(account) {
    const availableBalanceId = account && account.getIn(['balances', '1.3.0']);
    return FakeApi.getObjects([availableBalanceId]).then((objects) => {
      let availableBalance = 0;
      if (objects && objects.length > 0 ) {
        availableBalance += objects[0].balance || 0
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
          return (hist.time >= startDate && hist.time <= endDate)
        });
        resolve(_.orderBy(filteredHistory,
          function(value) {
            return (value.time+''
          )}, 'desc'
        ));
      }
      resolve(_.orderBy(transactionHistory,
        function(value) {
          return (value.time+''
        )}, 'desc'
      ));
    });
  }
}

export default FakeApi
