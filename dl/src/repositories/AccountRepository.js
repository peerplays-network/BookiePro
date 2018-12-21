import {
  Aes,
  TransactionHelper,
  FetchChain
} from 'peerplaysjs-lib';
import {
  Apis
} from 'peerplaysjs-ws';
import WalletApi from 'rpc_api/WalletApi';

class AccountRepository {
  static fetchFullAccount(accountIdOrName) {
    return Apis.instance().db_api().exec('get_full_accounts', [
      [accountIdOrName], true
    ]).then((results) => {
      if (results.length === 0 && !results[0]) {
        return null;
      }

      return results[0];
    });
  }

  static getAccountRefsOfKey(key) {
    return Apis.instance().db_api().exec('get_key_references', [[key]]).then((vec_account_id) => {
      if (vec_account_id[0] && vec_account_id[0].length) {
        return vec_account_id[0];
      }

      return null;
    });
  }

  static lookupAccounts(startChar, limit) {
    return Apis.instance().db_api().exec('lookup_accounts', [
      startChar, limit
    ]);
  }

  static updateActiveKey(accountId, ownerPrivateKey, activePublicKey, options) {
    if (!accountId || !ownerPrivateKey || !activePublicKey) {
      throw new Error('Missing argument');
    }

    return new Promise(function (resolve, reject) {
      options.memo_key = activePublicKey;
      let wallet_api = new WalletApi(),
        tr = wallet_api.new_transaction(),
        ownerPublicKey = ownerPrivateKey.toPublicKey().toPublicKeyString(),
        updateObject = {
          account: accountId,
          owner: {
            weight_threshold: 1,
            account_auths: [],
            address_auths: [],
            key_auths: [
              [
                ownerPublicKey,
                1
              ]
            ]
          },
          active: {
            weight_threshold: 1,
            account_auths: [],
            address_auths: [],
            key_auths: [
              [
                activePublicKey,
                1
              ]
            ]
          },
          new_options: options
        };

      tr.add_type_operation('account_update', updateObject);
      tr.set_required_fees().then(() => {
        return tr.get_potential_signatures().then(({pubkeys}) => {
          let myPubKeys = [ownerPublicKey];

          if (pubkeys.indexOf(ownerPublicKey) === -1) {
            reject();
          }

          return tr.get_required_signatures(myPubKeys).then((requiredPubKeys) => {
            if (requiredPubKeys.length > 0) {
              tr.add_signer(ownerPrivateKey, ownerPublicKey);
              tr.broadcast((data) => {
                resolve(data);
              }).catch((error) => {
                reject(error);
              });
            }
          });
        });
      });
    });
  }

  static updateVoting(tr, ownerPrivateKey, activePrivateKey) {
    let activePublicKey = activePrivateKey.toPublicKey().toPublicKeyString();
    let ownerPublicKey = ownerPrivateKey.toPublicKey().toPublicKeyString();

    return new Promise(function (resolve, reject) {
      tr.set_required_fees().then(() => {

        return tr.get_potential_signatures().then(({pubkeys}) => {
          let myPubKeys = [activePublicKey, ownerPublicKey];

          if (pubkeys.indexOf(activePublicKey) === -1) {
            reject();
          }

          return tr.get_required_signatures(myPubKeys).then((requiredPubKeys) => {
            if (requiredPubKeys.length > 0) {
              tr.add_signer(ownerPrivateKey, ownerPublicKey);
              tr.broadcast((data) => {
                resolve(data);
              }).catch((error) => {
                reject(error);
              });
            }
          });
        });
      });
    });
  }

  static updateMemo(account, activePublicKey) {
    return Promise.all([
      FetchChain('getAccount', account.id),
      FetchChain('getAsset', '1.3.0'), //asset
      FetchChain('getAsset', '1.3.0') //fee
    ]).then((res) => {
      let [chain_account, chain_asset, chain_fee_asset] = res; // eslint-disable-line
      let fee_asset = chain_fee_asset.toJS();

      if (fee_asset.options.core_exchange_rate.base.asset_id === '1.3.0' &&
        fee_asset.options.core_exchange_rate.quote.asset_id === '1.3.0') {
        let fee_asset_id = '1.3.0'; // eslint-disable-line
      }

      let wallet_api = new WalletApi();
      let tr = wallet_api.new_transaction();
      let update_op = tr.get_type_operation('account_update', {
        account: account.id,
        fee: {
          amount: 0,
          asset_id: '1.3.0'
        },
        owner: account.owner,
        active: Object.assign({}, account.active, {
          key_auths: [
            [activePublicKey, 1]
          ]
        }),
        new_options: Object.assign({}, account.options, {
          memo_key: activePublicKey
        })
      });

      tr.add_operation(update_op);

      return tr;
    });
  }

  static updateKeys(account, ownerKeyPublic, activeKeyPublic, memoKeyPublic) {
    return Promise.all([
      FetchChain('getAccount', account.id),
      FetchChain('getAsset', '1.3.0'), //asset
      FetchChain('getAsset', '1.3.0') //fee
    ]).then((res) => { //eslint-disable-line
      let wallet_api = new WalletApi();
      let tr = wallet_api.new_transaction();
      let update_op = tr.get_type_operation('account_update', {
        account: account.id,
        fee: {
          amount: 0,
          asset_id: '1.3.0'
        },
        owner: Object.assign({}, account.owner, {
          key_auths: [
            [ownerKeyPublic, 1]
          ]
        }),
        active: Object.assign({}, account.active, {
          key_auths: [
            [activeKeyPublic, 1]
          ]
        }),
        new_options: Object.assign({}, account.options, {
          memo_key: memoKeyPublic
        })
      });

      tr.add_operation(update_op);

      return tr;
    });
  }

  static transfer(
    from_account,
    to_account,
    amount,
    memo,
    asset,
    //fee_asset_id,
    propose_account = null,
    broadcast = true, // eslint-disable-line
    encrypt_memo = true,
    optional_nonce = null
  ) {
    let memo_sender = propose_account || from_account;

    return Promise.all([
      FetchChain('getAccount', from_account),
      FetchChain('getAccount', to_account),
      FetchChain('getAccount', memo_sender),
      FetchChain('getAccount', propose_account),
      FetchChain('getAsset', asset),
      //  FetchChain("getAsset", fee_asset_id)
    ]).then((res) => {
      let [
        chain_from, chain_to, chain_memo_sender, chain_propose_account,
        chain_asset //, chain_fee_asset
      ] = res;

      let memo_from_public, memo_to_public;

      if (memo && encrypt_memo) {
        memo_from_public = chain_memo_sender.getIn(['options', 'memo_key']);

        // The 1s are base58 for all zeros (null)
        if (/111111111111111111111/.test(memo_from_public)) {
          memo_from_public = null;
        }

        memo_to_public = chain_to.getIn(['options', 'memo_key']);

        if (/111111111111111111111/.test(memo_to_public)) {
          memo_to_public = null;
        }
      }

      let propose_acount_id = propose_account ? chain_propose_account.get('id') : null;
      let memo_from_privkey;

      if (encrypt_memo && memo) {
        memo_from_privkey = activePrivateKey; // TODO: define

        if (!memo_from_privkey) {
          throw new Error('Missing private memo key for sender: ' + memo_sender);
        }
      }

      let memo_object;

      if (memo && memo_to_public && memo_from_public) {
        let nonce = optional_nonce == null ?
          TransactionHelper.unique_nonce_uint64() :
          optional_nonce;

        memo_object = {
          from: memo_from_public,
          to: memo_to_public,
          nonce,
          message: (encrypt_memo) ?
            Aes.encrypt_with_checksum(
              memo_from_privkey,
              memo_to_public,
              nonce,
              memo
            ) : Buffer.isBuffer(memo) ? memo.toString('utf-8') : memo
        };
      }
      // // Allow user to choose asset with which to pay fees #356
      // let fee_asset = chain_fee_asset.toJS();
      //
      // // Default to CORE in case of faulty core_exchange_rate
      // if( fee_asset.options.core_exchange_rate.base.asset_id === "1.3.0" &&
      //     fee_asset.options.core_exchange_rate.quote.asset_id === "1.3.0" ) {
      //    fee_asset_id = "1.3.0";
      // }

      let wallet_api = new WalletApi();
      let tr = wallet_api.new_transaction();
      let transfer_op = tr.get_type_operation('transfer', {
        // fee: {
        //     amount: 0,
        //     asset_id: fee_asset_id
        // },
        from: chain_from.get('id'),
        to: chain_to.get('id'),
        amount: {
          amount,
          asset_id: chain_asset.get('id')
        },
        memo: memo_object
      });

      if (propose_account) {
        let proposal_create_op = tr.get_type_operation('proposal_create', {
          proposed_ops: [{
            op: transfer_op
          }],
          fee_paying_account: propose_acount_id
        });
        tr.add_operation(proposal_create_op);
        tr.operations[0][1].expiration_time = parseInt(Date.now() / 1000 + 5);
      } else {
        tr.add_operation(transfer_op);
      }

      return tr;
    });
  }

  static process_transaction(tr, privateKey) {
    let publicKey = privateKey.toPublicKey().toPublicKeyString();

    return new Promise(function (resolve, reject) {
      tr.set_required_fees().then(() => {
        return tr.get_potential_signatures().then(({pubkeys,addys}) => { // eslint-disable-line
          let myPubKeys = [publicKey];

          // if (pubkeys.indexOf(publicKey) === -1) {
          //     reject();
          // }

          return tr.get_required_signatures(myPubKeys).then((requiredPubKeys) => { // eslint-disable-line
            //if (requiredPubKeys.length > 0) {
            tr.add_signer(privateKey, publicKey);
            tr.broadcast((data) => {
              resolve(data);
            }).catch((error) => {
              reject(error);
            });
            //}
          }).catch((error) => reject(error));
        }).catch((error) => reject(error));
      }).catch((error) => reject(error));
    });
  }

  // Do we want this to be a feature of the GUI Walelt?
  // static accountUpgrade(account_id, fee_asset_id = "1.3.0", lifetime = true, privateKey) {
  //
  //     let operationJSON = {
  //         "fee": {
  //             amount: 0,
  //             asset_id: fee_asset_id
  //         },
  //         "account_to_upgrade": account_id,
  //         "upgrade_to_lifetime_member": lifetime
  //     };
  //
  //     let wallet_api = new WalletApi();
  //
  //     let tr = wallet_api.new_transaction();
  //
  //     tr.add_type_operation("account_upgrade", operationJSON);
  //
  //     return AccountRepository.process_transaction(tr, privateKey);
  //
  // }
}

export default AccountRepository;