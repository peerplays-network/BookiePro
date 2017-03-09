import { Config } from '../constants';

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
            'owner_key': ownerPublicKey,
            'active_key': activePublicKey,
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
}

export default AccountServices;
