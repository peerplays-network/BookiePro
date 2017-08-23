/**
 * This is login react component to sign-in in to the system
 * If the user authenticated then account information is stored in redux state 'account.account'
 */
import React, { PureComponent } from 'react';
import logo from '../../assets/images/bookie_logo_login.png';
import { Form } from 'antd';
import LoginForm from './LoginForm.jsx';
import { NavigateActions, AuthActions, AppActions } from '../../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ChainValidation } from 'peerplaysjs-lib';
import {SubmissionError} from 'redux-form'
import { I18n } from 'react-redux-i18n';
import { AccountService } from '../../services';
import { AppBackgroundTypes } from '../../constants';
import FloatingHelp from '../FloatingHelp';

/** Login component */
class Login extends PureComponent {
  constructor(props) {
    super(props);
    this.onClickSignup = this.onClickSignup.bind(this);
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

  //Navigate to signup page
  onClickSignup(e) {
    e.preventDefault();
    this.props.navigateTo('/signup');
  }

  /**
   * validates accountName password and navigate to home page
   * @param {object} e - The sign up form field values
   */
  handleSubmit(e) {
    const errors = {};
  	let accountError = ChainValidation.is_account_name_error(e.get('userName'));
    if(!e.get('password') || e.get('password').length < 22){
      errors.password = I18n.t('login.password_short');
    }
  	if(accountError){
      //overriding blockchain error with general error
			//Note: even if the username format is incorrect it will show this generic error
			//TODO: confirm if we really need to show generic error for these errors
  		errors.userName = I18n.t('login.username_notfound');
    throw new SubmissionError(errors);
	  }
    else{
      //getting username search result and checking whether such user exists
  	  return AccountService.lookupAccounts(e.get('userName'), 1).then(result =>
      {
  		  let account = result.find(a => a.get(0) === e.get('userName'));
  	    if(!account)
  			  errors.userName = I18n.t('login.username_notfound');

      if(Object.keys(errors).length !== 0 )
        throw new SubmissionError(errors);
      else
        this.props.login(e.get('userName'), e.get('password'));
	    });
  }
  }

  render() {
    return (
      <div className='loginBackground'>
        <div className='loginComponent' >
          <div className='wrapper'>
            <div className='text-center'>
              <img src={ logo } height='148' width='132' alt=''/>
              <div className='center-ele'>
                <LoginForm onClickSignup={ this.onClickSignup }
                  onSubmit={ this.handleSubmit } errors={ this.props.errors } status={ this.props.status } />
              </div>
            </div>
          </div>
        </div>
        <FloatingHelp />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return ({
    errors: state.getIn(['auth','loginErrors']),
    status: state.getIn(['auth','loginLoadingStatus'])
  });
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
    login: AuthActions.login,
    setAppBackground: AppActions.setAppBackgroundAction,
  }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Login))
