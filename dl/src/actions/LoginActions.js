import LoginPageConstants from '../constants/LoginPage';
import counterpart from 'counterpart';
import KeyGeneratorService from '../services/KeyGeneratorService';
import LoginService from '../services/LoginService';
import NavigateActions from './NavigateActions';
import AccountRepository from '../repositories/AccountRepository';

/**
 * Private Action Creator (LOGIN_SET_STATUS)
 * @param status
 * @returns {{type: LoginPageConstants.LOGIN_SET_STATUS, status: *}}
 */
function setLoginStatusAction(status) {
  return {
    type: LoginPageConstants.LOGIN_SET_STATUS,
    status: status
  };
}

/**
 * Private Action Creator (LOGIN_SET_ACCOUNT_FOR_LOGIN)
 * @param {String} account
 * @returns {{type: (LoginPageConstants.LOGIN_SET_ACCOUNT_FOR_LOGIN), accountForLogin: *}}
 */
function setLoginAccountAction(account) {
  return {
    type: LoginPageConstants.LOGIN_SET_ACCOUNT_FOR_LOGIN,
    accountForLogin: account
  };
}

/**
 * Private Action Creator (LOGIN_SET_LOGIN_ERRORS)
 * @param {Array} errors
 * @returns {{type: (LoginPageConstants.LOGIN_SET_LOGIN_ERRORS), errors: *}}
 */
function setLoginErrorsAccountAction(errors) {
  return {
    type: LoginPageConstants.LOGIN_SET_LOGIN_ERRORS,
    errors: errors
  };
}

class LoginActions {
  /**
 * Login form: Button state
 *
 * @param {String} status
 * @returns {Function}
 */
  static setLoginStatus(status) {
    return (dispatch) => {
      dispatch(setLoginStatusAction(status));
    };
  }

  /**
 * Login form: Set up a login account
 *
 * @param account
 * @returns {Function}
 */
  static setLoginAccount(account) {
    return (dispatch) => {
      dispatch(setLoginErrorsAccountAction([]));
      dispatch(setLoginAccountAction(account));
    };
  }

  /**
 * Login form: Setting Common validation errors
 *
 * @param errors Array
 * @returns {Function}
 */
  static setLoginErrorsAccount(errors) {
    return (dispatch) => {
      dispatch(setLoginErrorsAccountAction(errors));
    };
  }

  /**
 * Sign In account in app
 *
 * @param {string} accountName
 * @param {string} password
 * @param {boolean} rememberMe
 * @param {?string} next redirect url
 * @returns {function(*=, *)}
 */
  static login(accountName, password, rememberMe = false, next = null) {
    return (dispatch, getState) => {
      let state = getState(),
        keys = KeyGeneratorService.generateKeys(accountName, password),
        activePublicKey = keys.active.toPublicKey().toPublicKeyString(),
        ownerPublicKey = keys.owner.toPublicKey().toPublicKeyString(),
        isLogin = false;

      AccountRepository.fetchFullAccount(state.loginPage.accountForLogin[1])
        .then(function (result) {
          if (
            result
            && result[1]
            && result[1]['account']
            && result[1]['account']['active']['key_auths']
            && result[1]['account']['active']['key_auths'].length
          ) {
            result[1]['account']['active']['key_auths'].forEach(function (keyArr) {
              if (keyArr[0] && (keyArr[0] === activePublicKey || keyArr[0] === ownerPublicKey)) {
                isLogin = true;
              }
            });
          }

          if (isLogin) {
            let account = result[1]['account'];

            return LoginService.systemLogin(account, password, rememberMe, dispatch).then(() => {
              if (next) {
                dispatch(NavigateActions.navigateTo(next));
              } else {
                dispatch(NavigateActions.navigateToDashboard());
              }

              dispatch(LoginActions.setLoginStatus('default'));
            });
          } else {
            dispatch(LoginActions.setLoginStatus('default'));
            dispatch(LoginActions.setLoginErrorsAccount([
              counterpart.translate('errors.incorrect_username_or_password')
            ]));
          }
        });
    };
  }
}

export default LoginActions;