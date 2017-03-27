import { Config } from '../constants';
import { Apis } from "graphenejs-ws";

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
  static authenticateAccount(account, keys) {
    // Andrianto Lie [5:49 PM]
const x = {
     ownerPublicKey: keys.owner.toPublicKey().toPublicKeyString(),
     activePublicKey: keys.active.toPublicKey().toPublicKeyString(),
     memoPublicKey: keys.active.toPublicKey().toPublicKeyString(),
     ownerPrivateKey: keys.owner.toWif(),
     activePrivateKey: keys.active.toWif(),
     memoPrivateKey: keys.memo.toWif()
   };
   console.log(x);
    const activePublicKey = keys.active.toPublicKey().toPublicKeyString();
    const ownerPublicKey = keys.owner.toPublicKey().toPublicKeyString();

    let isAuthenticated = false;
    if (account) {
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
    }
    return isAuthenticated;
  }
  /**
   * Get the list of matching account name
   * account - account object list from blockchain
   */
  //Check if account name is already taken
  static lookupAccounts(startChar, limit) {
    return Apis.instance().db_api().exec("lookup_accounts", [
      startChar, limit
    ]);
  }
}

export default AccountServices;
