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

      // Beatrice faucet api endpoint is different.
      let apiEP = '/api/v1/accounts';
      
      if (process.env.name === 'beatrice') {
        apiEP = '/faucet';
      }

      // Call faucet api to register for account
      return fetch(faucetAddress + apiEP, {
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
        .then((response) => response.json())
        .then((responseJson) => {
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
        .catch((error) => {
          // Fail, retry for fixed amount of attempt
          if (attempt <= 0) {
            log.warn('Retry registering for account by the faucet');
            reject(error);
          } else {
            log.error('Fail to register for account by the faucet', error);
            attempt--;
            return AccountServices.registerThroughFaucet(attempt, accountName, keys)
              .then((res) => resolve(res))
              .catch((err) => reject(err));
          }
        });
    });
  }

  /**
   * Register through registrar
   */

  static registerThroughRegistrar(accountName, keys) {
    return CommunicationService.getFullAccount(Config.accountRegistar.name)
      .then((registrarAccount) => {
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
      .catch((error) => {
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

    /* Keys are generated within Bookie from the user input from the login form.
       Account: the result of a call to the blockchain for an account object containing relvant 
       account information. */
    let isAuthenticated = false,
      activeKeyMatches = false,
      ownerKeyMatches = false;

    // Bookie keys generated in KeyGeneratorService.js
    let activePublicKey = keys.active.toPublicKey().toPublicKeyString();
    let ownerPublicKey = keys.owner.toPublicKey().toPublicKeyString();

    // Account keys from blockchain.
    const activeKeyAuths = account.getIn(['active', 'key_auths']);
    const ownerKeyAuths = account.getIn(['owner', 'key_auths']);

    // Check if the owner keys match.
    ownerKeyMatches = this.keysMatch(ownerPublicKey, ownerKeyAuths);

    // If the owner keys do not match, switch the owner & active keys in the authentication check.
    if (!ownerKeyMatches) {
      ownerKeyMatches = this.keysMatch(activePublicKey, ownerKeyAuths);
      activeKeyMatches = this.keysMatch(ownerPublicKey, activeKeyAuths);
    } else {
      // If the first check of ownerKeyMatches is true, we only need to check 
      // the remaining activeKeyMatch.
      activeKeyMatches = this.keysMatch(activePublicKey, activeKeyAuths);
    }

    // If both service generated keys match both blockchain account object keys, allow 
    // user to login.
    isAuthenticated = activeKeyMatches && ownerKeyMatches;
    return isAuthenticated;
  }

  // Check if the bookie generated key matched the blockchain key.
  static keysMatch(serviceKey, bcKey) {
    let keyMatch = false;

    if (bcKey) {
      bcKey.forEach((keyArr) => {
        if (keyArr.first() && keyArr.first() === serviceKey) {
          keyMatch = true;
        }
      });
    }

    return keyMatch;
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
