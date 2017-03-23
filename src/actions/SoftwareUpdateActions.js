import { ActionTypes, Config } from '../constants';
import { ChainStore, FetchChain } from 'graphenejs-lib';

let accountSubscriber;

/**
 * Public actions
 */
class SoftwareUpdateActions {
  static setReferenceAccountAction(referenceAccount) {
    return {
      type: ActionTypes.SOFTWARE_UPDATE_SET_REFERENCE_ACCOUNT,
      referenceAccount
    }
  }

  /**
   * Set the account and subscribe to it
   */
  static setReferenceAccount(account) {
    return (dispatch, getState) => {
      const accountName = Config.softwareUpdateReferenceAccountName;

      // Unsubscribe previous account subscriber
      if (accountSubscriber) {
        ChainStore.unsubscribe(accountSubscriber);
      }
      // Define new account subscriber and subscribe to ChainStore
      accountSubscriber = () => {
        const previousAccount = getState().getIn(['softwareUpdate','referenceAccount']);
        const updatedAccount = ChainStore.getAccount(accountName);
        // Dispatch updated account
        if (previousAccount && !previousAccount.equals(updatedAccount)) {
          dispatch(SoftwareUpdateActions.setReferenceAccount(updatedAccount));
        }
      };
      ChainStore.subscribe(accountSubscriber);
      // Set the reference account
      dispatch(SoftwareUpdateActions.setReferenceAccountAction(account));
    }
  }

  static listenToSoftwareUpdate(attempt=3) {
    return (dispatch) => {
      const accountName = Config.softwareUpdateReferenceAccountName;
      // Fetch reference account in asycn manner
      FetchChain('getAccount', accountName).then((account) => {
        dispatch(SoftwareUpdateActions.setReferenceAccount(account));
      }).catch((error) => {
        console.error('error is', error);
        // retry
        if (attempt > 0) {
          console.log(attempt--);
          dispatch(SoftwareUpdateActions.listenToSoftwareUpdate(attempt--));
        }
      });
    }
  }
}
export default SoftwareUpdateActions;
