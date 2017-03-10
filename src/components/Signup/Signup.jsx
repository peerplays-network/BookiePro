import React from 'react'
import logo from '../../assets/images/login-logo.png';
import { Form, Input, Button, Checkbox, Icon } from 'antd' 
import SignUpForm from './form'
export default Form.create()(React.createClass({
  render() {
    return (
        <div className='ant-layout' id='main-content'>
          <div className='registerComponent' >
            <div className='wrapper'>
                <div className='text-center'>
                    <img src={ logo } alt=''/>
                    <h2 className='margin-tb-25'> Welcome to Application </h2>
                    <p className='font22 margin-btm-20'>Please create your new account</p>
                    <div className='center-ele'>
                        <SignUpForm></SignUpForm>
                    </div>
                </div>
            </div>
          </div>
        </div>
    );
  },
}));
