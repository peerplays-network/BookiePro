import {ChainStore} from 'peerplaysjs-lib';
import {Apis} from 'peerplaysjs-ws';

const MAX_RECURSION_ATTEMPTS = 10;

class Repository {
  //account
  static getAccount(accountIdOrName, numRecursion = 0) {
    return new Promise((resolve, reject) => {
      let fullAccount = ChainStore.getAccount(accountIdOrName);

      if (numRecursion > MAX_RECURSION_ATTEMPTS) {
        console.warn('[APP] MAX_RECURSION_ATTEMPTS Repository.getAccount()');
        return reject();
      }

      if (fullAccount === null) {
        return reject();
      }

      if (fullAccount) {
        return resolve(fullAccount);
      }

      setTimeout(() => {
        this.getAccount(accountIdOrName, ++numRecursion)
          .then((res) => resolve(res)).catch((err) => reject(err));
      }, 100);
    });
  }

  /**
   * This method will attempt to lookup witness by account_id.
   * @param {string} accountId
   * @param {number} numRecursion
   * @returns {Promise}
   */
  static getWitnessById(accountId, numRecursion = 0) {
    return new Promise((resolve, reject) => {
      let witness = ChainStore.getWitnessById(accountId);

      if (numRecursion > MAX_RECURSION_ATTEMPTS) {
        console.warn('[APP] MAX_RECURSION_ATTEMPTS Repository.getWitnessById()');
        return resolve();
      }

      if (witness === null) {
        return resolve();
      }

      if (witness) {
        return resolve(witness);
      }

      setTimeout(() => {
        this.getWitnessById(accountId, ++numRecursion)
          .then((res) => resolve(res)).catch((err) => reject(err));
      }, 200);
    });
  }

  /**
   *
   * @param {array} ids - vote ids
   * @param {number} numRecursion
   * @returns {Promise}
   */
  static getObjectsByVoteIds(ids, numRecursion = 0) {
    return new Promise((resolve, reject) => {
      let votes = ChainStore.getObjectsByVoteIds(ids);

      if (numRecursion > MAX_RECURSION_ATTEMPTS) {
        console.warn('[APP] MAX_RECURSION_ATTEMPTS Repository.getObjectsByVoteIds()');
        return resolve();
      }

      if (votes === null) {
        return resolve();
      }

      if (votes) {
        return resolve(votes);
      }

      setTimeout(() => {
        this.getWitnessById(ids, ++numRecursion)
          .then((res) => resolve(res)).catch((err) => reject(err));
      }, 200);
    });
  }



  static getAccountRefsOfKey(key) {
    return new Promise((resolve, reject) => {
      let accountRefs = ChainStore.getAccountRefsOfKey(key);

      if (accountRefs === null) {
        return reject();
      }

      if (accountRefs) {
        return resolve(accountRefs);
      }

      setTimeout(() => {
        this.getAccountRefsOfKey(key).then((res) => resolve(res)).catch((err) => reject(err));
      }, 100);
    });
  }

  static fetchFullAccount(accountIdOrName, numRecursion = 0) {
    return new Promise((resolve, reject) => {
      if (numRecursion > MAX_RECURSION_ATTEMPTS) {
        console.warn('[APP] MAX_RECURSION_ATTEMPTS Repository.fetchFullAccount()');
        return resolve(null);
      }

      let fullAccount = ChainStore.fetchFullAccount(accountIdOrName);

      if (fullAccount === null) {
        return reject();
      }

      if (fullAccount) {
        return resolve(fullAccount);
      }

      setTimeout(() => {
        this.fetchFullAccount(accountIdOrName, ++numRecursion)
          .then((res) => resolve(res)).catch((err) => reject(err));
      }, 100);
    });
  }

  static fetchRecentHistory(accountIdOrName) {
    return new Promise((resolve, reject) => {
      let history = ChainStore.fetchRecentHistory(accountIdOrName);

      if (history === null) {
        return reject();
      }

      if (history) {
        return resolve(history);
      }

      setTimeout(() => {
        this.fetchFullAccount(accountIdOrName)
          .then((res) => resolve(res)).catch((err) => reject(err));
      }, 100);
    });
  }
  //----------
  static lookupAccounts(startChar, limit) {
    return Apis.instance().db_api().exec('lookup_accounts', [
      startChar, limit
    ]);
  }

  //asset
  static getAsset(assetIdOrSymbol, numRecursion = 0) {
    return new Promise((resolve, reject) => {
      if (numRecursion > MAX_RECURSION_ATTEMPTS) {
        console.warn('[APP] MAX_RECURSION_ATTEMPTS Repository.getAsset()');
        return resolve(null);
      }

      let asset = ChainStore.getAsset(assetIdOrSymbol);

      if (asset === null) {
        return resolve(asset);
      }

      if (asset) {
        return resolve(asset);
      }

      setTimeout(() => {
        this.getAsset(assetIdOrSymbol, ++numRecursion)
          .then((res) => resolve(res)).catch((err) => reject(err));
      }, 100);
    });
  }

  //balance
  static getAccountBalance(accountId, assetType) {

    return new Promise((resolve, reject) => {

      let balance = ChainStore.getAccountBalance(accountId, assetType);

      if (balance === null) {
        return reject();
      }

      if (balance) {
        return resolve(balance);
      }

      setTimeout(() => {
        this.getAccountBalance(accountId, assetType)
          .then((res) => resolve(res)).catch((err) => reject(err));
      }, 100);
    });
  }

  //block
  //----------
  static fetchBlockById(id) {

    return Apis.instance().db_api().exec('get_block', [id]).then(function (block) {
      return block;
    }).catch(function (error) {
      console.log('BlocksRepository', error);
    });
  }

  //object
  static fetchObject(id) {
    return new Promise((resolve, reject) => {

      let object = ChainStore.fetchObject(id);

      if (object === null) {
        return reject();
      }

      if (object) {
        return resolve(object);
      }

      setTimeout(() => {
        this.fetchObject(id).then((res) => resolve(res)).catch((err) => reject(err));
      }, 100);
    });
  }

  static getObject(id, force = false, numRecursion = 0) {
    return new Promise((resolve, reject) => {

      if (numRecursion > MAX_RECURSION_ATTEMPTS) {
        console.warn('[APP] MAX_RECURSION_ATTEMPTS Repository.getObject()');
        return resolve(null);
      }

      let object = ChainStore.getObject(id, force);

      if (object === null) {
        return resolve(object);
      }

      if (object) {
        return resolve(object);
      }

      setTimeout(() => {
        this.getObject(id, force, ++numRecursion)
          .then((res) => resolve(res)).catch((err) => reject(err));
      }, 100);
    });
  }

  static getTournamentIdsInState(accountId, stateString) {

    return new Promise((resolve, reject) => {

      let object = ChainStore.getTournamentIdsInState(accountId, stateString);

      if (object === null) {
        return reject();
      }

      if (object) {
        return resolve(object);
      }

      setTimeout(() => {
        this.getTournamentIdsInState(accountId, stateString)
          .then((res) => resolve(res)).catch((err) => reject(err));
      }, 100);
    });

  }

  static getRegisteredTournamentIds(accountId, stateString) {

    return new Promise((resolve, reject) => {
      let object = ChainStore.getRegisteredTournamentIds(accountId);

      if (object === null) {
        return reject();
      }

      if (object) {
        return resolve(object);
      }

      setTimeout(() => {
        this.getRegisteredTournamentIds(accountId, stateString)
          .then((res) => resolve(res)).catch((err) => reject(err));
      }, 200);
    });

    // return Apis.instance().db_api().exec( 'get_tournaments_in_state', [stateString, 100] );
  }

  static getTournamentIdsInStateDirectly(stateString) {
    return Apis.instance().db_api().exec('get_tournaments_in_state', [stateString, 100]);
  }

  static getLastTournamentId() {
    return ChainStore.getLastTournamentId();
  }
  static getTournaments(last_tournament_id, limit, start_tournament_id) {
    return ChainStore.getTournaments(last_tournament_id, limit, start_tournament_id);
  }

  static _updateObject(object, notify_subscribers) {
    let emit = true;
    return ChainStore._updateObject(object, notify_subscribers, emit);
  }

  static resetCache() {
    return ChainStore.resetCache();
  }

  static getRecentBlocks() {
    return ChainStore.getRecentBlocks();
  }

  static getRecentOperations() {
    return ChainStore.getRecentOperations();
  }
}

export default Repository;