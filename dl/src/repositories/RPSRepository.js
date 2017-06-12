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