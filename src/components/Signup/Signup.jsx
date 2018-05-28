/**
 * The Signup component contains the {@link SignupForm} which allows user to
 * register a new Bookie account.
 *
 * The states of the component are maintained in the Redux store under 'auth'.
 */
import React, { PureComponent } from 'react';
import logo from '../../assets/images/bookie_logo_signup.png';
import { Form } from 'antd';
import SignupForm from './SignupForm';
import { NavigateActions, AuthActions, AppActions } from '../../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { I18n }  from 'react-redux-i18n';
import { AppBackgroundTypes, Config } from '../../constants';
import FloatingHelp from '../FloatingHelp';

class Signup extends PureComponent {

  constructor(props){
    super(props);
    this.onClickLogin = this.onClickLogin.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // Set app background to sports bg
    this.props.setAppBackground(AppBackgroundTypes.FIELD_BG);
  }

  componentWillUnmount() {
    // Reset app background to gradient
    this.props.setAppBackground(AppBackgroundTypes.GRADIENT_BG);
  }

  onClickLogin(event) {
    event.preventDefault();
    this.props.navigateTo('/login')
  }

  /**
   * Invoke the {@link AuthActions#signup} action
   *
   * @param {object} values - data obtained from the {@link SignupForm}
   */
  handleSubmit(values) {
    this.props.signup(values.get('accountName'), values.get('password'), this.props.depositsEnabled);
  }

  render() {
    return (
      <div className='onboardingSportsBackground signupComponent'>
        <div className='wrapper'>
          <div className='text-center'>
            <img src={ logo } className='logo' width='213px' height='100px' alt=''/>
            <p className='font18 margin-btm-24'>{I18n.t('signup.new_acc_req_text')}</p>
            <div className='center-ele'>
              <SignupForm
                loadingStatus={ this.props.status }
                onClickLogin={ this.onClickLogin }
                onSubmit={ this.handleSubmit }
                errors={ this.props.errors }
                clearSignupError={ this.props.clearSignupError }/>
            </div>
          </div>
        </div>
        <FloatingHelp />
      </div>
    );
  }
}

Signup.defaultProps = {
  depositsEnabled: Config.features.deposits,
};

const mapStateToProps = (state) => {
  return {
    errors: state.getIn(['auth','signupErrors']),
    status: state.getIn(['auth','signupLoadingStatus']),
    // Manual Feature Overrides
    /*depositsEnabled: true*/
  }
}
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
    signup: AuthActions.signup,
    clearSignupError: AuthActions.clearSignupError,
    setAppBackground: AppActions.setAppBackgroundAction,
  }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Signup))
