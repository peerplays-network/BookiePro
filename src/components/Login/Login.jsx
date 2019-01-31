import React from 'react';
import {connect} from 'react-redux';
import Logo from '../Forms/Logo';
import LoginForm from './LoginForm';
import {NavigateActions, LoginActions} from '../../actions';
import LanguageSwitcher from '../Common/LanguageSwitcher';
import Translate from 'react-translate-component';
import {bindActionCreators} from 'redux';

class Login extends React.Component {
  handleSubmit(values) {
    let next;

    if (this.props.location.query && this.props.location.query.next) {
      next = this.props.location.query.next;
    }

    this.props.setLoginStatus('loading');

    setTimeout(() => {
      this.props.login(values.accountName, values.password, values.remember_me, next);
    }, 0);
  }

  navigateToBTSClaim(e) {
    this.props.navigateToClaim('bts');
    e.preventDefault();
  }

  navigateToSignUp() {
    this.props.navigateToSignUp();
  }

  navigateToForgotPassword(e) {
    this.props.navigateToForgotPassword();
    e.preventDefault();
  }

  render() {
    return (
      <div className='main'>
        <div className='yHelper active'></div>
        <section className='content'>
          <div className='box box-inPadding'>
            <div className='dialog dialog-login'>
              <LanguageSwitcher />
              <Logo />
              <Translate
                component='h1'
                className='h1'
                content='login.login_form_title'
                tm={ <span className='tm'>TM</span> }
              />
              <div className='section__text'>
                <Translate component='p' className='' content='login.note_1' />
                <Translate component='p' className='' content='login.note_2' />
                <Translate component='p' className='' content='login.note_3' />
                <Translate component='p' className='' content='login.note_4' />
              </div>

              <div className='form'>
                <LoginForm errors={ this.props.errors } btnStatus={ this.props.status }
                  onSubmit={ this.handleSubmit.bind(this) }
                  navigateToForgotPassword={ this.navigateToForgotPassword.bind(this) } />
              </div>
              <div className='login__footer'>
                <Translate
                  component='div'
                  className='login__footerTitle'
                  content='login.login_form_sign_up_label'
                />
                <button
                  className='btn btn-sign btn-fsz-18'
                  onClick={ this.navigateToSignUp.bind(this) }
                >
                  <Translate className='btnText' content='auth.sign_up_btn' />
                </button>
                <div className='login__footerLinkWrap'>
                  <a
                    href='#claims/bts'
                    onClick={ this.navigateToBTSClaim.bind(this) }
                    className='login__footerLink mark2'><Translate
                      unsafe={ true }
                      className=''
                      content='login.bts_sharedrop'
                    />
                  </a>
                </div>
                <div className='login__footerNoteWrap'>
                  <Translate
                    component='p'
                    unsafe={ true }
                    className='login__footerNote'
                    content='login.sharedrop_note'
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    status: state.loginPage.status,
    errors: state.loginPage.errors,
    locale: state.settings.locale
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    login: LoginActions.login,
    setLoginStatus: LoginActions.setLoginStatus,
    navigateToSignUp: NavigateActions.navigateToSignUp,
    navigateToForgotPassword: NavigateActions.navigateToForgotPassword,
    navigateToClaim: NavigateActions.navigateToClaim
  },
  dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(Login);