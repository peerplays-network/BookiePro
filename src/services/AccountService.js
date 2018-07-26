import {Config} from '../constants';
import log from 'loglevel';
import CommunicationService from './CommunicationService';
import WalletService from './WalletService';
import {I18n} from 'react-redux-i18n';
import {TransactionBuilder} from 'peerplaysjs-lib';

class AccountServices {
  /**
   * Ask the faucet to create account for us
   */
  static registerThroughFaucet(attempt, accountName, keys) {
    const ownerPublicKey = keys.owner.toPublicKey().toPublicKeyString();
    const activePublicKey = keys.active.toPublicKey().toPublicKeyString();
    const memoPublicKey = keys.memo.toPublicKey().toPublicKeyString();

    return new Promise((resolve, reject) => {
      // Use random faucet
      const faucets = Config.faucetUrls;
      let index = Math.floor(Math.random() * Object.keys(faucets).length);
      let faucetAddress = faucets[index];

      // Call faucet api to register for account
      return fetch(faucetAddress + '/api/v1/accounts', {
        method: 'post',
        mode: 'cors',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          account: {
            name: accountName,
            owner_key: ownerPublicKey,
            active_key: activePublicKey,
            memo_key: memoPublicKey,
            refcode: '',
            referrer: ''
          }
        })
      })
        .then(response => response.json()
        )
        .then(responseJson => {
          // Check if the registration is rejected by the faucet
          if (responseJson.error) {
            log.error(responseJson.error);
            const baseErrorMessage = responseJson.error.base && responseJson.error.base[0];
            const remoteIpErrorMessage =
              responseJson.error.remote_ip && responseJson.error.remote_ip[0];
            const errorMessage =
              baseErrorMessage || remoteIpErrorMessage || I18n.t('unknown_error');
            const error = new Error(errorMessage);
            log.error('Fail to register for account by the faucet', error);
            reject(error);
          } else {
            log.debug('Account created by the faucet', responseJson);
            resolve(responseJson);
          }
        })
        .catch(error => {
          // Fail, retry for fixed amount of attempt
          if (attempt <= 0) {
            log.warn('Retry registering for account by the faucet');
            reject(error);
          } else {
            log.error('Fail to register for account by the faucet', error);
            attempt--;
            return AccountServices.registerThroughFaucet(attempt, accountName, keys)
              .then(res => resolve(res))
              .catch(err => reject(err));
          }
        });
    });
  }

  /**
   * Register through registrar
   */

  static registerThroughRegistrar(accountName, keys) {
    return CommunicationService.getFullAccount(Config.accountRegistar.name)
      .then(registrarAccount => {
        const tr = new TransactionBuilder();
        tr.add_type_operation('account_create', {
          fee: {
            amount: 0,
            asset_id: 0
          },
          registrar: registrarAccount.getIn(['account', 'id']),
          referrer: registrarAccount.getIn(['account', 'id']),
          referrer_percent: 0,
          name: accountName,
          owner: {
            weight_threshold: 1,
            account_auths: [],
            key_auths: [[keys.owner.toPublicKey().toPublicKeyString(), 1]],
            address_auths: []
          },
          active: {
            weight_threshold: 1,
            account_auths: [],
            key_auths: [[keys.active.toPublicKey().toPublicKeyString(), 1]],
            address_auths: []
          },
          options: {
            memo_key: keys.active.toPublicKey().toPublicKeyString(),
            voting_account: '1.2.5',
            num_witness: 0,
            num_committee: 0,
            votes: []
          }
        });
        return WalletService.processTransaction(Config.accountRegistar.keys, tr);
      })
      .catch(error => {
        log.error('Fail to register for account by other account', error);
      });
  }

  /**
   * Check if the given accountName and password is correct
   * accountName
   * password
   * account - account object from blockchain
   */
  static authenticateAccount(account, keys) {
    // Invalid params
    if (!account || !keys) {
      return false;
    }

    // NOTE: Uncomment this to check the key pairs of logged in account
    // For checking key
    // const x = {
    //   ownerPublicKey: keys.owner.toPublicKey().toPublicKeyString(),
    //   activePublicKey: keys.active.toPublicKey().toPublicKeyString(),
    //   memoPublicKey: keys.memo.toPublicKey().toPublicKeyString(),
    //   ownerPrivateKey: keys.owner.toWif(),
    //   activePrivateKey: keys.active.toWif(),
    //   memoPrivateKey: keys.memo.toWif()
    // };
    const activePublicKey = keys.active.toPublicKey().toPublicKeyString();
    const ownerPublicKey = keys.owner.toPublicKey().toPublicKeyString();

    let isAuthenticated = false;
    // Check the similarity of keys
    const activeKeyAuths = account.getIn(['active', 'key_auths']);
    const ownerKeyAuths = account.getIn(['owner', 'key_auths']);
    // Check active keys
    let activeKeyMatches = false;

    if (activeKeyAuths) {
      activeKeyAuths.forEach(keyArr => {
        if (keyArr.first() && keyArr.first() === activePublicKey) {
          activeKeyMatches = true;
          return false;
        }
      });
    }

    // Check owner keys
    let ownerKeyMatches = false;

    if (ownerKeyAuths) {
      ownerKeyAuths.forEach(keyArr => {
        if (keyArr.first() && keyArr.first() === ownerPublicKey) {
          ownerKeyMatches = true;
          return false;
        }
      });
    }

    isAuthenticated = activeKeyMatches && ownerKeyMatches;
    return isAuthenticated;
  }
  /**
   * Get the list of matching account name
   * account - account object list from blockchain
   */
  //Check if account name is already taken
  static lookupAccounts(startChar, limit) {
    return CommunicationService.callBlockchainDbApi('lookup_accounts', [startChar, limit]);
  }
}

export default AccountServices;
