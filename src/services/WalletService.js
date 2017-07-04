import _ from 'lodash';
import { PrivateKey } from 'peerplaysjs-lib';
import log from 'loglevel';
import { I18n } from 'react-redux-i18n';

class WalletService {
  // Process fake transaction (for testing)
  static processFakeTransaction(state, transactionObject) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 500);
    })
  }

  /**
   * Process the given transaction
   */
  static processTransaction(state, transaction) {
    // Get stored private keys and public keys
    const storedPrivateKeys = state.getIn(['account','privateKeyWifsByRole']);
    const storedPublicKeys = state.getIn(['account', 'publicKeyStringsByRole']);

    // Set required fees
    return transaction.set_required_fees().then(() => {
      // Get potential signatures
      // Inside, it's trying to ask the blockchain based on the seller account id attached in the transaction
      return transaction.get_potential_signatures();
    }).then(( result ) => {
      const potentialPublicKeys = result.pubkeys;
      // Check if none of the potential public keys is equal to our public keys
      const myPubKeys = storedPublicKeys.filter(publicKey => _.includes(potentialPublicKeys, publicKey)).toArray();
      if (_.isEmpty(myPubKeys)) {
        throw new Error(I18n.t('processTransaction.no_valid_signatures'));
      }
      // Filter potential signatures to get required keys needed to sign the transaction
      return transaction.get_required_signatures(myPubKeys);
    }).then((requiredPublicKeys) => {
      // Add required keys to the transaction
      _.forEach(requiredPublicKeys, (requiredPublicKey) => {
        const role = storedPublicKeys.findKey((publicKey) => publicKey === requiredPublicKey);
        // Get private key pair
        const requiredPrivateKey = PrivateKey.fromWif(storedPrivateKeys.get(role));
        // Add signature
        transaction.add_signer(requiredPrivateKey, requiredPublicKey);
      });
      // Broadcast transaction
      return transaction.broadcast();
    }).then(() => {
      // Log transaction excluded it's signatures
      if (log.getLevel() === log.levels.DEBUG) {
        const filteredTransaction = _.pickBy(transaction.toObject(), (v, k) => k !== 'signatures');
        log.debug('Processing Transaction Success\nTransaction:', filteredTransaction);
      }

    }).catch((error) => {
      // Intercept and log error
      log.error('Processing Transaction fails', error);
      // Throw the error to be caught by next promise in chain
      throw error;
    });

  }
}

export default WalletService;
