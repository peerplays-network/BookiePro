import {Apis} from 'peerplaysjs-ws';
import {FetchChain} from 'peerplaysjs-lib';
import WalletApi from 'rpc_api/WalletApi';
import accountUtils from 'common/account_utils';

let wallet_api = new WalletApi();

class MarketRepository {
  static subscribeToMarket(baseId, quoteId, callback) {
    return Apis.instance().db_api().exec('subscribe_to_market', [
      callback, baseId, quoteId
    ]).catch(function (error) {
      console.error('MarketRepository: subscribeToMarket', error);
    });
  }

  static unSubscribeFromMarket(baseId, quoteId, callback) {
    return Apis.instance().db_api().exec('unsubscribe_from_market', [
      callback, baseId, quoteId
    ]).catch(function (error) {
      console.error('MarketRepository: unSubscribeFromMarket', error);
    });
  }

  static fetchOrders(baseId, quoteId) {
    return Apis.instance().db_api().exec('get_limit_orders', [
      baseId, quoteId, 100
    ]).catch((error) => {
      console.error('MarketRepository: fetchOrders', error);
    });
  }

  static createOrder(
    accountName,
    sellAmount,
    sellAsset,
    buyAmount,
    buyAsset,
    expiration,
    isFillOrKill
  ) {
    return Promise.all([
      FetchChain('getAccount', accountName)
    ]).then((result) => {
      let account = result[0];
      let tr = wallet_api.new_transaction();

      tr.add_type_operation('limit_order_create', {
        'seller': account.get('id'),
        'amount_to_sell': {
          'amount': sellAmount,
          'asset_id': sellAsset.id
        },
        expiration: expiration,
        'min_to_receive': {
          'amount': buyAmount,
          'asset_id': buyAsset.id
        },
        'fill_or_kill': isFillOrKill
      });

      return tr;
    });
  }

  static cancelOrder(accountName, orderId) {
    return Promise.all([
      FetchChain('getAccount', accountName)
    ]).then((result) => {
      let account = result[0];
      let tr = wallet_api.new_transaction();
      let fee_asset_id = accountUtils.getFinalFeeAsset(account.get('id'), 'limit_order_cancel');

      tr.add_type_operation('limit_order_cancel', {
        fee: {
          amount: 0,
          asset_id: fee_asset_id
        },
        'fee_paying_account': account.get('id'),
        'order': orderId
      });

      return tr;
    });
  }
}

export default MarketRepository;