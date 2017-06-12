/*
 *  Copyright (c) 2015 Cryptonomex, Inc., and contributors.
 *
 *  The MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

import {Apis} from "peerplaysjs-ws";
import {FetchChain} from "peerplaysjs-lib";
import WalletApi from "rpc_api/WalletApi";
import accountUtils from "common/account_utils";


let wallet_api = new WalletApi();

class MarketRepository {

    static subscribeToMarket(baseId, quoteId, callback) {
        return Apis.instance().db_api().exec("subscribe_to_market", [
            callback, baseId, quoteId
        ]).catch(function (error) {
            console.error('MarketRepository: subscribeToMarket', error);
        });
    }

    static unSubscribeFromMarket(baseId, quoteId, callback) {

        return Apis.instance().db_api().exec("unsubscribe_from_market", [
            callback, baseId, quoteId
        ]).catch(function (error) {
            console.error('MarketRepository: unSubscribeFromMarket', error);
        });

    }

    static fetchOrders(baseId, quoteId){
        return Apis.instance().db_api().exec("get_limit_orders", [
            baseId, quoteId, 100
        ]).catch((error)=>{
            console.error('MarketRepository: fetchOrders', error);
        });
    }

    static createOrder(accountName, sellAmount, sellAsset, buyAmount, buyAsset, expiration, isFillOrKill) {
        return Promise.all([
            FetchChain("getAccount", accountName)
        ]).then((result) => {
            let account = result[0];

            let tr = wallet_api.new_transaction();

            tr.add_type_operation("limit_order_create", {
                "seller": account.get('id'),
                "amount_to_sell": {
                    "amount": sellAmount,
                    "asset_id": sellAsset.id
                },
                expiration : expiration,
                "min_to_receive": {
                    "amount": buyAmount,
                    "asset_id": buyAsset.id
                },
                "fill_or_kill": isFillOrKill
            });

            return tr;
        });
    }

    static cancelOrder(accountName, orderId){
        return Promise.all([
            FetchChain("getAccount", accountName)
        ]).then((result)=>{
            let account = result[0];

            let tr = wallet_api.new_transaction();

            let fee_asset_id = accountUtils.getFinalFeeAsset(account.get('id'), "limit_order_cancel");

            tr.add_type_operation("limit_order_cancel", {
                fee: {
                    amount: 0,
                    asset_id: fee_asset_id
                },
                "fee_paying_account": account.get('id'),
                "order": orderId
            });

            return tr;
        });
    }

}

export default MarketRepository;
