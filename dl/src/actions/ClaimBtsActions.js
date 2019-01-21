import ActionTypes from '../constants/ActionTypes';
import {PrivateKey} from 'peerplaysjs-lib'; // eslint-disable-line
import counterpart from 'counterpart';
import AccountRepository from '../repositories/AccountRepository';
import LoginService from '../services/LoginService';
import NavigateActions from '../actions/NavigateActions';

class ClaimBtsPrivateActions {
  /**
   * Private Redux Action Creator (CLAIM_BTS_SET_STATUS)
   *
   * button Status
   *
   * @param {string} status - loading|default
   * @returns {{type, payload: {status: *}}}
   */
  static setStatus(status) {
    return {
      type: ActionTypes.CLAIM_BTS_SET_STATUS,
      payload: {
        status: status
      }
    };
  }

  /**
   * Private Redux Action Creator (CLAIM_BTS_SET_ERRORS)
   * ClaimBtsForm: common errors
   * @param {array} errors
   * @returns {{type, payload: {errors: []}}}
   */
  static setErrors(errors) {
    return {
      type: ActionTypes.CLAIM_BTS_SET_ERRORS,
      payload: {
        errors: errors
      }
    };
  }
}
class ClaimBtsActions {
  /**
 * Change button Status
 *
 * @param status
 * @returns {{type, payload: {status: *}}}
 */
  static setStatus(status) {
    return ClaimBtsPrivateActions.setStatus(status);
  }

  /**
 * Login bts account by private key
 *
 * @param {string} private_bts_key
 * @returns {function(*=)}
 */
  static loginAccountFromBts(private_bts_key) {
    return (dispatch) => {
      let privateKey = PrivateKey.fromWif(private_bts_key),
        publicKey = privateKey.toPublicKey().toPublicKeyString();
      AccountRepository.getAccountRefsOfKey(publicKey).then((accountIds) => {
        let accountsPromises = [];

        if (accountIds && accountIds.length) {
          accountIds.forEach((accountId) => {
            accountsPromises.push(AccountRepository.fetchFullAccount(accountId));
          });

          return Promise.all(accountsPromises);
        } else {
          return [];
        }
      }).then((results) => {
        let findResult = results.find((result) => {
          let keysNames = ['owner', 'active'];
          let isLogin = false;

          for (let i = 0; i < keysNames.length; i++) {
            let userKey = keysNames[i];

            if (
              result
              && result[1]
              && result[1]['account']
              && result[1]['account'][userKey]['key_auths']
              && result[1]['account'][userKey]['key_auths'].length
            ) {
              let findResult = result[1]['account'][userKey]['key_auths'].find((keyArr) => {
                return keyArr[0] && keyArr[0] === publicKey;
              });

              if (findResult) {
                isLogin = true;
              }
            }
          }

          return isLogin;
        });

        if (findResult) {
          let account = findResult[1]['account'];

          return LoginService.systemLoginByPrivateKey(
            account, private_bts_key, dispatch
          ).then(() => {
            dispatch(NavigateActions.navigateToDashboard());
            dispatch(ClaimBtsPrivateActions.setStatus('default'));
          }).catch(() => {
            dispatch(ClaimBtsPrivateActions.setStatus('default'));
          });
        } else {
          dispatch(ClaimBtsPrivateActions.setErrors(
            [counterpart.translate('errors.incorrect_private_key')]
          ));
          dispatch(ClaimBtsPrivateActions.setStatus('default'));
        }
      }).catch((err) => {
        console.warn('Error:', err);
        dispatch(ClaimBtsPrivateActions.setErrors(
          [counterpart.translate('errors.incorrect_private_key')]
        ));
        dispatch(ClaimBtsPrivateActions.setStatus('default'));
      });
    };
  }
}

export default ClaimBtsActions;