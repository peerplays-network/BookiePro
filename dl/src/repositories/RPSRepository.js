import {Apis} from "peerplaysjs-ws";
import WalletApi from "rpc_api/WalletApi";
import {GameMoves} from "peerplaysjs-lib";
import AccountRepository from "./AccountRepository";

let wallet_api = new WalletApi();

class RPSRepository {

    static commitMove(gameId, asset_id, playerAccountId, commit, privateKey) {

        let operationJSON = {
            "fee": {
                amount: 0,
                asset_id: asset_id
            },
            "game_id": gameId,
            "player_account_id": playerAccountId,
            "move": [0, commit],
            "extensions": null
        };

        let tr = wallet_api.new_transaction();

        tr.add_type_operation("game_move", operationJSON);

        return AccountRepository.process_transaction(tr, privateKey);

    }

    static broadcastRevealMove(gameId, asset_id, playerAccountId, revealMove, privateKey) {

        let operationJSON = {
            "fee": {
                amount: 0,
                asset_id: asset_id
            },
            "game_id": gameId,
            "player_account_id": playerAccountId,
            "move": [1, revealMove],
            "extensions": null
        };


        let tr = wallet_api.new_transaction();

        tr.add_type_operation("game_move", operationJSON);

        return AccountRepository.process_transaction(tr, privateKey);

    }

}

export default RPSRepository;