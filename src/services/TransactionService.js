import {setTransaction} from 'actions/RTransactionConfirmActions';
import {PrivateKey} from 'peerplaysjs-lib';
import WalletApi from 'rpc_api/WalletApi';
import AccountRepository from 'repositories/AccountRepository';
import Repository from 'repositories/chain/repository';

let wallet_api = new WalletApi();
/**
 * TODO::ref setTransaction!
 */

/**
 * Transaction Service
 * It used to highlight the logic of the transaction
 *
 */
class TransactionService {
  /**
   * Import balance
   *
   * @param balance_claims
   * @param deposit_to_account
   * @param privateKeyWif
   * @param transactionFunctionCallback
   */
  static importBalances(
    balance_claims,
    deposit_to_account,
    privateKeyWif,
    transactionFunctionCallback
  ) {
    let tr = wallet_api.new_transaction();
    let assetsHashIds = {};
    let assetsPromises = [];

    for (let balance_claim of balance_claims) {
      tr.add_type_operation('balance_claim', balance_claim);

      if (
        balance_claim.total_claimed.asset_id
        && !assetsHashIds[balance_claim.total_claimed.asset_id]
      ) {
        assetsHashIds[balance_claim.total_claimed.asset_id] = balance_claim.total_claimed.asset_id;
        assetsPromises.push(Repository.getAsset(balance_claim.total_claimed.asset_id));
      }
    }

    // tr.set_expire_seconds( (15 * 60) + balance_claims.length * 5);

    let privateKey = PrivateKey.fromWif(privateKeyWif),
      publicKey = privateKey.toPublicKey().toPublicKeyString();
    tr.add_signer(privateKey, publicKey);
    let promises = [Repository.getAccount(deposit_to_account), Promise.all(assetsPromises)];

    return Promise.all(promises).then(([account, assets]) => {
      return setTransaction('balance_claim', {
        operation: balance_claims,
        assets: assets,
        account: account,
        ownerKey: privateKeyWif,
        proposedOperation: '',
        transactionFunction: TransactionService.transactionFunction,
        transactionFunctionCallback: transactionFunctionCallback,
        transactionObject: tr,
        functionArguments: tr
      });
    });
  }

  /**
   * Upgrade account
   *
   * @param account_id
   * @param fee_asset_id
   * @param lifetime
   * @param transactionFunctionCallback
   */
  static upgradeAccount(
    account_id,
    fee_asset_id = '1.3.0',
    lifetime = true,
    transactionFunctionCallback
  ) {
    let operationJSON = {
      'fee': {
        amount: 0,
        asset_id: fee_asset_id
      },
      'account_to_upgrade': account_id,
      'upgrade_to_lifetime_member': lifetime
    };

    let tr = wallet_api.new_transaction();
    tr.add_type_operation('account_upgrade', operationJSON);
    let promises = [
      Repository.getAccount(account_id),
      Repository.getAsset(fee_asset_id),
      tr.set_required_fees()
    ];

    return Promise.all(promises).then(([account, asset]) => {
      return setTransaction('account_upgrade', {
        account: account,
        asset: asset.toJS(),
        account_to_upgrade: account_id,
        operation: operationJSON,
        upgrade_to_lifetime_member: lifetime,
        proposedOperation: '',
        transactionFunction: TransactionService.transactionFunction,
        transactionFunctionCallback: transactionFunctionCallback,
        transactionObject: tr,
        functionArguments: tr
      });
    });
  }

  /**
   * Claim Vesting
   *
   * @param account_id
   * @param cvb
   * @param forceAll
   * @param transactionFunctionCallback
   */
  static claimVestingBalance(account_id, cvb, forceAll = false, transactionFunctionCallback) {
    let balance = cvb.balance.amount,
      earned = cvb.policy[1].coin_seconds_earned,
      vestingPeriod = cvb.policy[1].vesting_seconds,
      availablePercent = forceAll ? 1 : earned / (vestingPeriod * balance);
    let operationJSON = {
      fee: {
        amount: '0',
        asset_id: '1.3.0'
      },
      owner: account_id,
      vesting_balance: cvb.id,
      amount: {
        amount: Math.floor(balance * availablePercent),
        asset_id: cvb.balance.asset_id
      }
    };

    let tr = wallet_api.new_transaction();
    tr.add_type_operation('vesting_balance_withdraw', operationJSON);
    let promises = [
      Repository.getAccount(account_id),
      Repository.getAsset(cvb.balance.asset_id),
      tr.set_required_fees()
    ];

    return Promise.all(promises).then(([account, asset]) => {
      return setTransaction('vesting_balance_withdraw', {
        account: account,
        asset: asset.toJS(),
        account_to_upgrade: account_id,
        operation: operationJSON,
        proposedOperation: '',
        transactionFunction: TransactionService.transactionFunction,
        transactionFunctionCallback: transactionFunctionCallback,
        transactionObject: tr,
        functionArguments: tr
      });
    });
  }


  /**
   * Common trx function
   *
   * @param tr
   * @returns {function(*, *)}
   */
  static transactionFunction(tr) {
    return (dispatch, getState) => {
      return new Promise((resolve, reject) => {
        let encrypted_key = getState().walletData.wallet.encrypted_brainkey;
        const activePrivateKeyBuffer = getState().walletData.aesPrivate
          .decryptHexToBuffer(encrypted_key);
        const activePrivateKey = PrivateKey.fromBuffer(activePrivateKeyBuffer);

        AccountRepository.process_transaction(tr, activePrivateKey).then(() => {
          resolve();
        }).catch((err) => reject(err));
      });
    };
  }
}

export default TransactionService;