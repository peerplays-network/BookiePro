import React from 'react'
import logo from '../../assets/images/login-logo.png';
import { Form } from 'antd'
import LoginForm from './Form.jsx'
export default Form.create()(React.createClass({
  render() {
    return (
        <div className='ant-layout' id='main-content'>
          <div className='loginComponent' >
            <div className='wrapper'>
                <div className='text-center'>
                    <img src={ logo } alt=''/>
                    <h2 className='login-welcome'> Welcome to Application </h2>
                    <div className='center-ele'>
                        <LoginForm></LoginForm>
                    </div>
                </div>
            </div>
          </div>
        </div>
    );
  },
}));
