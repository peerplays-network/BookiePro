import _ from 'lodash';

class WalletService {

  /**
   * Process the given transaction
   */
  static processTransaction(state, transactionObject) {
    // Get stored private keys and public keys
    const storedPrivateKeys = state.getIn(['account','keys']).toJS();
    const storedPublicKeys = _.mapValues(storedPrivateKeys, (privateKey) => {
      return privateKey.toPublicKey().toPublicKeyString();
    });

    // Set required fees
    return transactionObject.set_required_fees().then(() => {
      // Get potential signatures
      // Inside, it's trying to ask the blockchain based on the seller account id attached in the transaction
      return transactionObject.get_potential_signatures();
    }).then(( result ) => {
      const potentialPublicKeys = result.pubkeys;
      // Check if none of the potential public keys is equal to our public keys
      const myPubKeys = _.intersection(potentialPublicKeys, _.values(storedPublicKeys));
      if (_.isEmpty(myPubKeys)) {
        throw new Error('No Potential Signatures');
      }
      // Filter potential signatures to get required keys needed to sign the transaction
      return transactionObject.get_required_signatures(myPubKeys);
    }).then((requiredPublicKeys) => {
      // Add required keys to the transaction
      _.forEach(requiredPublicKeys, (requiredPublicKey) => {
        const role = _.findKey(storedPublicKeys, (publicKey) => publicKey === requiredPublicKey);
        // Get private key pair
        const requiredPrivateKey = storedPrivateKeys[role];
        // Add signature
        transactionObject.add_signer(requiredPrivateKey, requiredPublicKey);
      });
      // Broadcast transaction
      return transactionObject.broadcast();
    }).then((res) => {
      console.log('Processing Transaction Success', res);
      // Return res to be caught by the next promise in chain
      return res;
    }).catch((error) => {
      console.error('Processing Transaction fails', error);
      // Throw the error to be caught by next promise in chain
      throw error;
    });

  }
}

export default WalletService;
