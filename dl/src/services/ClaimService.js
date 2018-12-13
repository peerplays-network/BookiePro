import AccountRepository from "../repositories/AccountRepository";
import BalanceRepository from '../repositories/BalanceRepository';
import Immutable from "immutable";
import {PrivateKey, ChainTypes, key} from "peerplaysjs-lib";
import WalletApi from "rpc_api/WalletApi";

class ClaimService {

    /**
     * Claim balances
     *
     * @param {String} accountId
     * @param {String} privateKeyWif
     * @param {PrivateKey} accountPrivateKey
     */
    static claimByBalanceIds(accountId, privateKeyWif, accountPrivateKey) {

        let privateKey = PrivateKey.fromWif(privateKeyWif),
            publicKey = privateKey.toPublicKey().toPublicKeyString(),
            addresses = key.addresses( publicKey );

        return BalanceRepository.getBalanceObjects(addresses).then( results => {

            if (!results.length) {
                return Promise.resolve();
            }

            let balance_ids = [];

            for(let balance of results) {
                balance_ids.push(balance.id);
            }

            return BalanceRepository.getVestedBalances(balance_ids).then( vested_balances => {

                let balances = Immutable.List().withMutations( balance_list => {
                    for(let i = 0; i < results.length; i++) {

                        let balance = results[i];

                        if(balance.vesting_policy) {
                            balance.vested_balance = vested_balances[i];
                        }

                        balance.public_key_string = publicKey;

                        balance_list.push(Immutable.fromJS(balance));

                    }

                });

                let balance_claims = [];

                for(let balance of balances) {

                    balance = balance.toJS();

                    let {vested_balance, public_key_string} = balance;


                    let total_claimed;
                    if( vested_balance ) {
                        if(vested_balance.amount == 0)
                        // recently claimed
                            continue;

                        total_claimed = vested_balance.amount;
                    } else
                        total_claimed = balance.balance.amount;

                    //assert
                    if(vested_balance && vested_balance.asset_id != balance.balance.asset_id) {
                        throw new Error("Vested balance record and balance record asset_id missmatch",
                            vested_balance.asset_id,
                            balance.balance.asset_id
                        )
                    }

                    balance_claims.push({
                        fee: { amount: "0", asset_id: "1.3.0"},
                        deposit_to_account: accountId,
                        balance_to_claim: balance.id,
                        balance_owner_key: public_key_string,
                        total_claimed: {
                            amount: total_claimed,
                            asset_id: balance.balance.asset_id
                        }
                    });

                }

                if (balance_claims.length) {
                    let wallet_api = new WalletApi(),
                        tr = wallet_api.new_transaction();

                    tr.add_signer(privateKey, publicKey);

                    for(let balance_claim of balance_claims) {
                        tr.add_type_operation("balance_claim", balance_claim);
                    }

                    return AccountRepository.process_transaction(tr, accountPrivateKey).then(() => {

                    }).catch(err => {
                        console.log('ERR', err);
                    });

                }

            });
        });

    }

}

export default ClaimService;