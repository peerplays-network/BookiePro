import {Apis} from "peerplaysjs-ws";

class BalanceRepository {

    static getAccountBalances(accountId, asset_types = ['1.3.0']) {

        return Apis.instance().db_api().exec("get_account_balances", [accountId, asset_types]).then(results => results);

    }

    static getBalanceObjects(addresses) {

        return Apis.instance().db_api().exec("get_balance_objects", [addresses]);

    }
    static getVestedBalances(balance_ids) {

        return Apis.instance().db_api().exec("get_vested_balances", [balance_ids]);
    }
    static getVestingBalances(accountId) {

        return Apis.instance().db_api().exec("get_vesting_balances", [
            accountId
        ]).catch(err => {
            console.log("error:", err);
        });
    }


}

export default BalanceRepository;
