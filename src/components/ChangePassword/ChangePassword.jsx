import React, { Component } from 'react';
import { Card,Breadcrumb,Icon,Form } from 'antd'
var I18n = require('react-redux-i18n').I18n;
import ChangePasswordForm from './Form'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigateActions,AccountActions } from '../../actions';

class ChangePassword extends Component{

  constructor(props){
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onClickCancel = this.onClickCancel.bind(this);
  }

  handleSubmit(values) {
    //Change password
    this.props.changePassword(values.get('old_password'), values.get('new_password'));
  }

  onClickCancel(e) {
    e.preventDefault();
    this.props.navigateTo('/my-account')
  }

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
              {
                //Display the form initially (initially and when the data is getting saved. (Loading will be displayed on 'Submit' button))
                this.props.loadingStatus!=='done'  ?
                <ChangePasswordForm
                  onSubmit={ this.handleSubmit }
                  onClickCancel={ this.onClickCancel }
                  loadingStatus={ this.props.loadingStatus }
                  errors={ this.props.errors }
                  /> : null
              }
              {
                //Show the success message when the password has been changed successfully (DONE) and the form will be hidden
                this.props.loadingStatus==='done' && this.props.errors.length===0  ?
                <div className='text-center'>
                  <Icon type='lock big-icon'/>
                  <p className='font16 margin-tb-20'>{ I18n.t('changePassword.successText') }</p>
                </div> : null
              }
            </div>
          </div>
        </Card>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const account = state.get('account');
  return {
    loadingStatus: account.get('changePasswordLoadingStatus'),
    errors: account.get('changePasswordError') != null ? account.get('changePasswordError').toJS() : []
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
    changePassword: AccountActions.changePassword
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ChangePassword))
