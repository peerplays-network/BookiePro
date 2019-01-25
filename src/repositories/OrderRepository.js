import {Apis} from 'peerplaysjs-ws';

class OrderRepository {
  static fetchLimitOrders(baseAssetId, quoteAssetId, limit = 100) {
    return Apis.instance().db_api().exec('get_limit_orders', [
      baseAssetId, quoteAssetId, limit
    ]).catch(function (error) {
      console.log('OrderRepository', error);
    });
  }

  static fetchCallOrders(marketAssetId, limit = 100) {
    return Apis.instance().db_api().exec('get_call_orders', [
      marketAssetId, limit
    ]).catch(function (error) {
      console.log('OrderRepository', error);
    });
  }
}

export default OrderRepository;