import market_utils from "common/market_utils";
let {operations} = require("peerplaysjs-lib").ChainTypes;
let ops = Object.keys(operations);

class ExplorerBlockChainService {

    /**
     * Format the received data on transactions
     * @param newOperation
     * @param operation
     * @param fetchedObjects
     * @returns {*}
     */
    static setOperationField(newOperation, operation, fetchedObjects = {}) {

        if (fetchedObjects[newOperation['fee_asset_id']]) {
            newOperation['fee_asset'] = fetchedObjects[newOperation['fee_asset_id']];
        }

        switch (ops[newOperation.type]) {

            case "game_move":

                newOperation.operation = {
                    from: fetchedObjects[operation[1].player_account_id]['name'],
                    to: '—',
                    game_id: operation[1]['game_id'],
                    gesture: (operation[1] && operation[1]['move'] && operation[1]['move'][1]['gesture']) ? operation[1]['move'][1]['gesture'] : null
                };

                return newOperation;

                break;

            case "tournament_create":

                newOperation.operation = {
                    from: fetchedObjects[operation[1].creator]['name'],
                    to: '—',
                    asset: fetchedObjects[operation[1].options.buy_in.asset_id],
                    amount: operation[1].options.buy_in.amount
                };

                return newOperation;

                break;
            case "tournament_join":

                newOperation.operation = {
                    from: fetchedObjects[operation[1].player_account_id]['name'],
                    to: '—',
                    tournament_id: operation[1].tournament_id
                };

                return newOperation;
                break;

            case "transfer"://0

                newOperation.operation = {
                    from: fetchedObjects[operation[1].from]['name'],
                    to: fetchedObjects[operation[1].to]['name'],
                    asset: fetchedObjects[operation[1].amount.asset_id],
                    amount: operation[1].amount.amount
                };

                return newOperation;


                break;
            case "limit_order_create"://1

                let isAsk = market_utils.isAskOp(operation[1]);

                let base_asset;
                let base_amount;
                let quote_asset;
                let quote_amount;


                if (isAsk) {
                    base_asset = fetchedObjects[operation[1]['min_to_receive']['asset_id']];
                    base_amount = operation[1]['min_to_receive']['amount'];
                    quote_asset = fetchedObjects[operation[1]['amount_to_sell']['asset_id']];
                    quote_amount = operation[1]['amount_to_sell']['amount'];
                } else {
                    base_asset = fetchedObjects[operation[1]['amount_to_sell']['asset_id']];
                    base_amount = operation[1]['amount_to_sell']['amount'];
                    quote_asset = fetchedObjects[operation[1]['min_to_receive']['asset_id']];
                    quote_amount = operation[1]['min_to_receive']['amount'];
                }

                newOperation.operation = {
                    account: fetchedObjects[operation[1].seller]['name'],
                    base_asset: base_asset,
                    base_amount: base_amount,
                    quote_asset: quote_asset,
                    quote_amount: quote_amount,

                    isAsk: isAsk
                };
                return newOperation;

                break;

            case "limit_order_cancel"://2

                newOperation.operation = {
                    account: fetchedObjects[operation[1].fee_paying_account]['name'],
                    order: operation[1]['order']
                };

                return newOperation;

                break;


            case "call_order_update"://3

                newOperation.operation = {
                    account_name: fetchedObjects[operation[1].funding_account]['name'],
                    asset_debt: fetchedObjects[operation[1].delta_debt.asset_id],
                    asset_debt_amount: operation[1].delta_debt.amount,
                    asset_collateral: fetchedObjects[operation[1].delta_collateral.asset_id],
                    asset_collateral_amount: operation[1].delta_collateral.amount
                };

                return newOperation;

                break;
            case "account_create"://5

                newOperation.operation = {
                    registrar: fetchedObjects[operation[1].registrar]['name'],
                    new_account: operation[1].name
                };

                return newOperation;

                break;
            case "account_update"://6

                newOperation.operation = {
                    account_name: fetchedObjects[operation[1].account]['name']
                };

                return newOperation;

                break;
            case "account_whitelist"://7

                newOperation.operation = {
                    authorizing_account_name: fetchedObjects[operation[1].authorizing_account]['name'],
                    account_to_list_name: fetchedObjects[operation[1].account_to_list]['name'],
                    new_listing: operation[1].new_listing
                };

                return newOperation;

                break;
            case "asset_create"://10


                newOperation.operation = {
                    account_name: fetchedObjects[operation[1].issuer]['name'],
                    symbol: operation[1].symbol
                };

                return newOperation;

                break;
            case "asset_update"://11
            case "asset_update_bitasset"://12

                newOperation.operation = {
                    account_name: fetchedObjects[operation[1].issuer]['name'],
                    asset: fetchedObjects[operation[1].asset_to_update]
                };

                return newOperation;

                break;
            case "asset_issue"://14

                newOperation.operation = {
                    account_name: fetchedObjects[operation[1].issuer]['name'],
                    account_to: fetchedObjects[operation[1].issue_to_account]['name'],
                    asset: fetchedObjects[operation[1].asset_to_issue.asset_id],
                    asset_amount: operation[1].asset_to_issue.amount
                };

                return newOperation;

                break;
            case "asset_reserve"://15

                newOperation.operation = {
                    account_name: fetchedObjects[operation[1].payer]['name'],
                    asset: fetchedObjects[operation[1].amount_to_reserve.asset_id],
                    asset_amount: operation[1].amount_to_reserve.amount
                };

                return newOperation;

                break;
            case "asset_fund_fee_pool"://16

                newOperation.operation = {
                    account_name: fetchedObjects[operation[1].from_account]['name'],
                    asset: fetchedObjects['1.3.0'],
                    asset_amount: operation[1].amount,
                    asset_n: fetchedObjects[operation[1].asset_id]
                };

                return newOperation;

                break;
            case "asset_publish_feed"://19

                newOperation.operation = {
                    account: fetchedObjects[operation[1].publisher]['name'],
                    base_asset: fetchedObjects[operation[1]['feed']['settlement_price']['base']['asset_id']],
                    base_amount: operation[1]['feed']['settlement_price']['base']['amount'],
                    quote_asset: fetchedObjects[operation[1]['feed']['settlement_price']['quote']['asset_id']],
                    quote_amount: operation[1]['feed']['settlement_price']['quote']['amount']
                };

                return newOperation;

                break;
            case "proposal_create"://22

                newOperation.operation = {
                    account_name: fetchedObjects[operation[1].fee_paying_account]['name']
                };

                return newOperation;

                break;
            case "witness_update"://21

                newOperation.operation = {
                    from: fetchedObjects[operation[1].witness_account]['name'],
                    to: '—',
                    account_name: fetchedObjects[operation[1].witness_account]['name']
                };

                return newOperation;

                break;
            case "vesting_balance_withdraw"://33

                newOperation.operation = {
                    account_name: fetchedObjects[operation[1].owner]['name'],
                    asset: fetchedObjects[operation[1].amount.asset_id],
                    asset_amount: operation[1].amount.amount
                };

                return newOperation;

                break;

            case "balance_claim"://37

                newOperation.operation = {
                    account_name: fetchedObjects[operation[1].deposit_to_account]['name'],
                    asset: fetchedObjects[operation[1].total_claimed.asset_id],
                    asset_amount: operation[1].total_claimed.amount
                };

                return newOperation;

                break;

            case "transfer_to_blind"://39

                newOperation.operation = {
                    account_name: fetchedObjects[operation[1].from]['name'],
                    asset: fetchedObjects[operation[1].amount.asset_id],
                    asset_amount: operation[1].amount.amount
                };

                return newOperation;

                break;
            case "transfer_from_blind"://41

                newOperation.operation = {
                    account_name: fetchedObjects[operation[1].to]['name'],
                    asset: fetchedObjects[operation[1].amount.asset_id],
                    asset_amount: operation[1].amount.amount
                };

                return newOperation;

                break;
            case "asset_claim_fees"://43

                newOperation.operation = {
                    account_name: fetchedObjects[operation[1].issuer]['name'],
                    asset: fetchedObjects[operation[1].amount_to_claim.asset_id],
                    asset_amount: operation[1].amount_to_claim.amount
                };

                return newOperation;
                break;
            default:
                console.warn('OPTYPE', ops[newOperation.type], newOperation.type, operation);

        }
    }

    /**
     * Set the necessary objects for obtaining
     * @param operation
     * @param neededObjects
     * @returns {{}}
     */
    static setNeededObjects(operation, neededObjects = {}) {

        if (operation[1].fee && operation[1].fee.asset_id) {
            neededObjects[operation[1].fee.asset_id] = operation[1].fee.asset_id;
        }

        switch (ops[operation[0]]) {

            case "game_move":
                neededObjects[operation[1].player_account_id] = operation[1].player_account_id;
                break;
            case "tournament_create":
                neededObjects[operation[1].creator] = operation[1].creator;
                neededObjects[operation[1].options.buy_in.asset_id] = operation[1].options.buy_in.asset_id;
                break;

            case "tournament_join":
                neededObjects[operation[1].player_account_id] = operation[1].player_account_id;
                break;

            case "transfer"://0

                neededObjects[operation[1].from] = operation[1].from;
                neededObjects[operation[1].to] = operation[1].to;
                neededObjects[operation[1].amount.asset_id] = operation[1].amount.asset_id;

                break;

            case "limit_order_create"://1

                let isAsk = market_utils.isAskOp(operation[1]);

                neededObjects[operation[1].seller] = operation[1].seller;

                if (isAsk) {
                    neededObjects[operation[1]['min_to_receive']['asset_id']] = operation[1]['min_to_receive']['asset_id'];
                    neededObjects[operation[1]['amount_to_sell']['asset_id']] = operation[1]['amount_to_sell']['asset_id'];
                } else {
                    neededObjects[operation[1]['amount_to_sell']['asset_id']] = operation[1]['amount_to_sell']['asset_id'];
                    neededObjects[operation[1]['min_to_receive']['asset_id']] = operation[1]['min_to_receive']['asset_id'];
                }

                break;

            case "limit_order_cancel"://2

                neededObjects[operation[1].fee_paying_account] = operation[1].fee_paying_account;

                break;


            case "call_order_update"://3

                neededObjects[operation[1].funding_account] = operation[1].funding_account;
                neededObjects[operation[1].delta_debt.asset_id] = operation[1].delta_debt.asset_id;
                neededObjects[operation[1].delta_collateral.asset_id] = operation[1].delta_collateral.asset_id;


                break;
            case "account_create"://5

                neededObjects[operation[1].registrar] = operation[1].registrar;

                break;
            case "account_update"://6

                neededObjects[operation[1].account] = operation[1].account;

                break;
            case "account_whitelist"://7

                neededObjects[operation[1].account_to_list] = operation[1].account_to_list;
                neededObjects[operation[1].authorizing_account] = operation[1].authorizing_account;

                break;
            case "asset_create"://10

                neededObjects[operation[1].issuer] = operation[1].issuer;

                break;
            case "asset_update"://11
            case "asset_update_bitasset"://12

                neededObjects[operation[1].issuer] = operation[1].issuer;
                neededObjects[operation[1].asset_to_update] = operation[1].asset_to_update;

                break;
            case "asset_issue":

                neededObjects[operation[1].issuer] = operation[1].issuer;
                neededObjects[operation[1].issue_to_account] = operation[1].issue_to_account;
                neededObjects[operation[1].asset_to_issue.asset_id] = operation[1].asset_to_issue.asset_id;

                break;
            case "asset_reserve"://15

                neededObjects[operation[1].payer] = operation[1].payer;
                neededObjects[operation[1].amount_to_reserve.asset_id] = operation[1].amount_to_reserve.asset_id;

                break;
            case "asset_fund_fee_pool"://16

                neededObjects[operation[1].from_account] = operation[1].from_account;
                neededObjects[operation[1].asset_id] = operation[1].asset_id;
                neededObjects['1.3.0'] = '1.3.0';

                break;
            case "asset_publish_feed"://19

                neededObjects[operation[1].publisher] = operation[1].publisher;
                neededObjects[operation[1]['feed']['settlement_price']['base']['asset_id']] = operation[1]['feed']['settlement_price']['base']['asset_id'];
                neededObjects[operation[1]['feed']['settlement_price']['quote']['asset_id']] = operation[1]['feed']['settlement_price']['quote']['asset_id'];


                break;
            case "witness_update"://21
                neededObjects[operation[1].witness_account] = operation[1].witness_account;
                break;
            case "proposal_create"://22

                neededObjects[operation[1].fee_paying_account] = operation[1].fee_paying_account;

                break;
            case "vesting_balance_withdraw"://33

                neededObjects[operation[1].owner] = operation[1].owner;
                neededObjects[operation[1].amount.asset_id] = operation[1].amount.asset_id;

                break;
            case "balance_claim"://37
                neededObjects[operation[1].deposit_to_account] = operation[1].deposit_to_account;
                neededObjects[operation[1].total_claimed.asset_id] = operation[1].total_claimed.asset_id;
                break;
            case "transfer_to_blind"://39

                neededObjects[operation[1].from] = operation[1].from;
                neededObjects[operation[1].amount.asset_id] = operation[1].amount.asset_id;

                break;

            case "transfer_from_blind"://41

                neededObjects[operation[1].to] = operation[1].to;
                neededObjects[operation[1].amount.asset_id] = operation[1].amount.asset_id;

                break;
            case "asset_claim_fees"://43

                neededObjects[operation[1].issuer] = operation[1].issuer;
                neededObjects[operation[1].amount_to_claim.asset_id] = operation[1].amount_to_claim.asset_id;

                break;

            default:
                console.warn('OPTYPE', ops[operation[0]]);

        }

        return neededObjects;
    }


}


export default ExplorerBlockChainService;