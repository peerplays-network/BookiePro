import {Apis} from "peerplaysjs-ws";
import WalletApi from "rpc_api/WalletApi";

class WitnessRepository {
    static fetchWitnessesAccounts(ids) {

        return Apis.instance().db_api().exec("lookup_witness_accounts", [ids.join(' '), ids.length]).then(function (accounts) {
            return accounts;
        }).catch(function (error) {
            console.log('WitnessRepository', error);
        });
    }
}

export default WitnessRepository;