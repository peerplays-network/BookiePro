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
