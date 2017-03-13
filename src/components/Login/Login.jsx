import React, { Component } from 'react'
import logo from '../../assets/images/login-logo.png';
import { Form } from 'antd'
import LoginForm from './Form.jsx'
import { NavigateActions } from '../../actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class Login extends Component {
  constructor(props) {
    super(props);
    this.onClickSignup = this.onClickSignup.bind(this);
  }

  onClickSignup(e) {
    e.preventDefault();
    this.props.navigateTo('/signup')
  }

  render() {
    return (
        <div className='ant-layout' id='main-content'>
          <div className='loginComponent' >
            <div className='wrapper'>
                <div className='text-center'>
                    <img src={ logo } alt=''/>
                    <h2 className='login-welcome'> Welcome to Application </h2>
                    <div className='center-ele'>
                        <LoginForm onClickSignup={ this.onClickSignup } />
                    </div>
                </div>
            </div>
          </div>
        </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo
  }, dispatch);
}
export default connect(null, mapDispatchToProps)(Form.create()(Login))
