import {Apis} from "peerplaysjs-ws";
import WalletApi from "rpc_api/WalletApi";

class ObjectRepository {
    static fetchObjectsByIds(ids = []) {

        return Apis.instance().db_api().exec("get_objects", [ids]).then(function (optional_objects) {
            return optional_objects;
        }).catch(function (error) {
            console.log('ObjectRepository', error);
        });
    }
}


export default ObjectRepository;