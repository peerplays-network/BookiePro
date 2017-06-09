import { Config } from '../constants';
import log from 'loglevel';
import CommunicationService from './CommunicationService';
import { I18n } from 'react-redux-i18n';

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
          'Accept': 'application/json',
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          'account': {
            'name': accountName,
             //NOTE: there is sth strange in the faucet api here where owner_key is assigned to account.active.key_auths
             //NOTE: and active_key is assigned to account.owner.key_auths for the resulting created account,
             //NOTE: that's why owner_key is assigned with activePublicKey here and active_key is assigned with ownerPublicKey here
             //NOTE: this is also the current implementation in peerplays-redux-ui
             //TODO: change to the right place if the faucet api is changed
            'owner_key': activePublicKey,
            'active_key': ownerPublicKey,
            'memo_key': memoPublicKey,
            'refcode': '',
            'referrer': ''
          }
        })
      }).then((response) => {
        // Convert response to json
        return response.json();
      }).then((responseJson) => {
        // Check if the registration is rejected by the faucet
        if (responseJson.error) {
          const baseErrorMessage = responseJson.error.base && responseJson.error.base[0]
          const remoteIpErrorMessage = responseJson.error.remote_ip && responseJson.error.remote_ip[0]
          const errorMessage = baseErrorMessage || remoteIpErrorMessage || I18n.t('unknown_error');
          const error = new Error(errorMessage);
          log.error('Fail to register for account by the faucet', error);
          reject(error);
        } else {
          log.debug('Account created by the faucet', responseJson);
          resolve(responseJson);
        }
      }).catch(error => {
        // Fail, retry for fixed amount of attempt
        if(attempt <= 0) {
          log.warn('Retry registering for account by the faucet')
          reject(error);
        }
        else {
          log.error('Fail to register for account by the faucet', error);
          attempt--;
          return AccountServices.registerThroughFaucet(attempt, accountName, keys).then(res => resolve(res)).catch(err => reject(err));
        }
      })
    })
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
    //   memoPublicKey: keys.active.toPublicKey().toPublicKeyString(),
    //   ownerPrivateKey: keys.owner.toWif(),
    //   activePrivateKey: keys.active.toWif(),
    //   memoPrivateKey: keys.memo.toWif()
    // };
    // console.log(x);
    // console.log('account', account.toJS())
    const activePublicKey = keys.active.toPublicKey().toPublicKeyString();
    const ownerPublicKey = keys.owner.toPublicKey().toPublicKeyString();

    let isAuthenticated = false;
    // Check the similarity of keys
    const activeKeyAuths = account.getIn(['active', 'key_auths']);
    const ownerKeyAuths = account.getIn(['owner', 'key_auths']);
    // Check active keys
    let activeKeyMatches = false;
    if (activeKeyAuths) {
      activeKeyAuths.forEach((keyArr) => {
        if (keyArr.first() && keyArr.first() === activePublicKey) {
          activeKeyMatches = true;
          return false;
        }
      });
    }
    // Check owner keys
    let ownerKeyMatches = false;
    if (ownerKeyAuths) {
      ownerKeyAuths.forEach((keyArr) => {
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
    return CommunicationService.callBlockchainDbApi('lookup_accounts', [
      startChar, limit
    ]);
  }
}

export default AccountServices;
