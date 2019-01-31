import {Apis} from 'peerplaysjs-ws';

class HistoryRepository {
  static fetchMarketHistory(coreId, quoteId, tm, startDateShort, endDateShort) {
    return Apis.instance().history_api().exec('get_market_history', [
      coreId, quoteId, tm, startDateShort, endDateShort
    ]).catch(function (error) {
      console.log('HistoryRepository: fetchMarketHistory', error);
    });
  }

  static fetchFillOrderHistory(coreId, quoteId, param) {
    return Apis.instance().history_api().exec('get_fill_order_history', [
      coreId, quoteId, param
    ]).catch(function (error) {
      console.log('HistoryRepository: fetchFillOrderHistory', error);
    });
  }

  static fetchBuckets() {
    return Apis.instance().history_api().exec('get_market_history_buckets', []);
  }

  static fetchAccountHistory(accountId, mostRecent = '1.11.0', limit = 100) {
    return Apis.instance().history_api()
      .exec('get_account_history',[ accountId, mostRecent, limit, '1.11.0']).catch((error) => {
        console.log('HistoryRepository: fetchRecentHistory', error);
      });
  }
}

export default HistoryRepository;
