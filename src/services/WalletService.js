import _ from 'lodash';

class WalletService {
  static processTransaction(state, transactionObject) {
    const storedPrivateKeys = state.account.keys;
    const storedPublicKeys = _.map(storedPrivateKeys, (privateKey) => {
      return privateKey.toPublicKey().toPublicKeyString()
    });
    // Set required fees
    return transactionObject.set_required_fees().then(() => {
      // Get potential signatures
      // Inside, it's trying to ask the blockchain based on the seller account id attached in the transaction
      return transactionObject.get_potential_signatures();
    }).then(({ potentialPublicKeys }) => {
      // Check if none of the potential public keys is equal to our public keys
      const myPubKeys = _.intersection(potentialPublicKeys, storedPublicKeys);
      if (_.isEmpty(myPubKeys)) {
        throw new Error('No Potential Signatures');
      }
      // Filter potential signatures to get required keys needed to sign the transaction
      return transactionObject.get_required_signatures(myPubKeys);
    }).then((requiredPublicKeys) => {
      _.forEach(requiredPublicKeys, (requiredPublicKey) => {
        // Get private key pair
        const requiredPrivKey = accountPrivateKeys[requiredPubKey];
        // Add signature
        transactionObject.add_signer(requiredPrivKey, requiredPubKey);
      });
      // Broadcast transaction
      return transactionObject.broadcast()
    }).then((res) => {
      console.log('PROCESSING TRANSACTION SUCCESS', res);
    }).catch((error) => {
      console.error('PROCESSING TRANSACTION FAIL', error);
    });

  }
}

export default WalletService;
