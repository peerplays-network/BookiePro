import React from 'react';
import {connect} from 'react-redux';
import Translate from 'react-translate-component';
import Logo from '../Forms/Logo';
import RegisterForm from './RegisterForm';
import LanguageSwitcher from '../Common/LanguageSwitcher';
import RegisterActions from 'actions/RegisterActions';
import NavigateActions from 'actions/NavigateActions';

@connect(
  (state) => {
    return {
      registerStatus: state.register.status,
      errors: state.register.errors,
    };
  },
  {
    setRegisterStatus: RegisterActions.setRegisterStatus,
    register: RegisterActions.register,
    navigateToSignIn: NavigateActions.navigateToSignIn
  }
)
class Register extends React.Component {
  handleSubmit(values) {
    this.props.setRegisterStatus('loading');
    setTimeout(() => {
      this.props.register(values.accountName, values.password);
    }, 0);
  }

  onClickLogin() {
    this.props.navigateToSignIn(null, false);
  }

  render() {
    return (
      <div className='main'>
        <div className='yHelper'></div>
        <section className='content'>
          <div className='box box-inPadding'>
            <div className='dialog dialog-login'>
              <LanguageSwitcher />
              <Logo />
              <Translate
                component='h1'
                className='h1'
                content='sign_up.welcome'
                tm={ <span className='tm'>TM</span> }
              />
              <Translate component='h2' className='h2' content='sign_up.please_create' />
              <div className='form'>
                <RegisterForm
                  errors={ this.props.errors }
                  registerStatus={ this.props.registerStatus }
                  onClickLogin={ this.onClickLogin.bind(this) }
                  onSubmit={ this.handleSubmit.bind(this) }
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
export default Register;