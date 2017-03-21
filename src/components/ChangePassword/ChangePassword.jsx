import React, { Component } from 'react';
import { Card,Breadcrumb, Icon } from 'antd'
var I18n = require('react-redux-i18n').I18n;
import Form from './Form'
class ChangePassword extends Component{
  render(){
    return(
      <div className='change-password'>
        <Breadcrumb className='bookie-breadcrumb'>
          <Breadcrumb.Item><a
            href='/'>  { I18n.t('myAccount.home') } </a></Breadcrumb.Item>
          <Breadcrumb.Item><a
            href='/'>{ I18n.t('myAccount.my_account') } </a></Breadcrumb.Item>
          <Breadcrumb.Item> Change Password</Breadcrumb.Item>
        </Breadcrumb>
        <Card className='bookie-card'
              title={ I18n.t('changePassword.title') }
              bordered={ false }
              style={ {width: '100%'} }>
          <div className='registerComponent'>
            <div className='center-form'>
              <Form></Form>
              <div className='text-center'>
                <Icon type='lock big-icon'/>
                <p className='font16 margin-tb-20'>{ I18n.t('changePassword.successText') }</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }
}
export default ChangePassword