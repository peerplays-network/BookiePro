import { Config } from '../constants';
import KeyGeneratorService from './KeyGeneratorService';

class AccountServices {

  /**
   * Ask the faucet to create account for us
   */
  static registerThroughFaucet(attempt, accountName, password) {
    const keys = KeyGeneratorService.generateKeys(accountName, password);
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
        console.log('json response', responseJson);
        // Check if the registration is rejected by the faucet
        if (responseJson.error) {
          const errorMessage = responseJson.error.base ? responseJson.error.base[0] : 'Signup Fail';
          reject(new Error(errorMessage));
        } else {
          resolve(responseJson);
        }
      }).catch(err => {
        // Fail, retry for fixed amount of attempt
        if(attempt <= 0) {
          reject(err);
        }
        else {
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
  static authenticateAccount(accountName, password, account) {
    const keys = KeyGeneratorService.generateKeys(accountName, password);
    const activePublicKey = keys.active.toPublicKey().toPublicKeyString();

    let isAuthenticated = false;
    if (account) {
      // Check the similarity of active key with the generated active key
      const activeKeyAuths = account.getIn(['active', 'key_auths']);
      if (activeKeyAuths) {
        activeKeyAuths.forEach(function (keyArr) {
          if (keyArr.first() && keyArr.first() === activePublicKey) {
            isAuthenticated = true;
          }
        });
      }
    }
    return isAuthenticated;
  }
}

export default AccountServices;
