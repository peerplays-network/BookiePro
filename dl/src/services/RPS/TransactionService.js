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

import {GameMoves} from "peerplaysjs-lib";
import RPSRepository from "repositories/RPSRepository"
import Repository from "repositories/chain/repository"
import iDB from "idb-instance";

class TransactionService {

    /**
     * Create commit operation
     * @param move
     * @returns {*}
     */
    static createCommitAndRevealMoveOperations(move) {

        let gameMoves = new GameMoves();

        return gameMoves.createCommitAndRevealMoveOperations(move);

    }

    /**
     * Commit RPS Move
     * @param tournamentId
     * @param gameId
     * @param playerAccountId
     * @param commit
     * @param privateKey
     */
    static commitMove(tournamentId, gameId, playerAccountId, commit, privateKey) {
        return Repository.getObject(tournamentId).then((tournament) => {
            return tournament;
        }).then((tournament) => {
            return RPSRepository.commitMove(gameId, tournament.getIn(['options', 'buy_in', 'asset_id']), playerAccountId, commit, privateKey)
        });
    }

    /**
     * Broadcast Reveal move
     * @param tournamentId
     * @param gameId
     * @param playerAccountId
     * @param commitMove
     * @param privateKey
     */
    static broadcastRevealMove(tournamentId, gameId, playerAccountId, commitMove, privateKey) {
        return Repository.getObject(tournamentId).then((tournament) => {
            return tournament;
        }).then((tournament) => {
            return iDB.load_data('wallet').then(([wallet]) => {
                if (wallet) {
                    let reveal_moves = wallet.reveal_moves;
                    let revealMove;

                    if (reveal_moves &&
                        reveal_moves[gameId] &&
                        reveal_moves[gameId][playerAccountId] &&
                        reveal_moves[gameId][playerAccountId][commitMove.get('nonce1')]
                    ) {
                        revealMove = reveal_moves[gameId][playerAccountId][commitMove.get('nonce1')];
                    }

                    if (revealMove) {
                        return RPSRepository.broadcastRevealMove(gameId, tournament.getIn(['options', 'buy_in', 'asset_id']), playerAccountId, revealMove, privateKey);
                    } else {
                        console.log("Error no stored reveal move for commit move, game: %o, player: %o, commitMove: %O", gameId, playerAccountId, commitMove);

                        return Promise.reject();
                    }

                }
            });
        })


    }

}

export default TransactionService;
