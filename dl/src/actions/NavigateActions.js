import {push, replace} from 'react-router-redux';
import SendPageActions from './SendPageActions';//TODO::rm

class NavigateActions {
  static navigateTo(path) {
    return (dispatch) => {
      if (path) {
        dispatch(push(path));
      } else {
        console.error('Unimplemented path', path);
      }
    };
  }

  static navigateToDashboard() {
    return (dispatch) => {
      dispatch(push('/'));
    };
  }

  static navigateToDashboardAdvancedOptions() {
    return (dispatch) => {
      dispatch(push('/dashboard/advanced-options'));
    };
  }

  static navigateToDepositWithDraw() {
    return (dispatch) => {
      dispatch(push('/deposit-withdraw'));
    };
  }

  static navigateToVestingBalances() {
    return (dispatch) => {

      dispatch(push('/account/vesting'));
    };
  }

  static navigateToSignUp() {
    return (dispatch) => {
      dispatch(push('/sign-up'));
    };
  }

  static navigateToSignIn(redirectAfterLogin = null, withReplace = true) {
    return (dispatch) => {
      let url = redirectAfterLogin ? `/login?next=${redirectAfterLogin}` : '/login';

      if (withReplace) {
        dispatch(replace(url));
      } else {
        dispatch(push(url));
      }
    };
  }

  static navigateToForgotPassword() {
    return (dispatch) => {
      dispatch(push('/forgot-password'));
    };
  }

  static navigateToForgotPasswordDecrypt() {
    return (dispatch) => {
      dispatch(push('/forgot-password/decrypt'));
    };
  }

  static navigateToForgotPasswordChange() {
    return (dispatch) => {
      dispatch(push('/forgot-password/change'));
    };
  }

  static navigateToExchangeMarket(id) {
    return (dispatch) => {
      dispatch(push('/exchange/' + id));
    };
  }

  static navigateToSend(selectedSymbol = null) {
    return (dispatch) => {
      if (selectedSymbol) {
        dispatch(SendPageActions.setSelectedSymbol(selectedSymbol));
      }//TODO::rm

      dispatch(push('/send'));
    };
  }

  static navigateToClaim(climType) {
    return (dispatch) => {
      dispatch(push(`/claims/${climType}`));
    };
  }

  static navigateToSettingsClaim() {
    return (dispatch) => {
      dispatch(push('/settings/claim'));
    };
  }
}

export default NavigateActions;