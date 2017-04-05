import React, { Component } from 'react';
import { Card,Breadcrumb,Icon,Form } from 'antd'
var I18n = require('react-redux-i18n').I18n;
import ChangePasswordForm from './ChangePasswordForm'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigateActions,AccountActions } from '../../actions';

class ChangePassword extends Component{

  constructor(props){
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onClickCancel = this.onClickCancel.bind(this);
    this.onHomeLinkClick = this.onHomeLinkClick.bind(this);
  }

  handleSubmit(values) {
    //Change password
    this.props.changePassword(values.get('old_password'), values.get('new_password'));
  }

  /* Redirect to 'My Account' screen when clicked on
  --'Cancel' button
  --'My Account' link on the Breadcrumb*/
  onClickCancel(e) {
    e.preventDefault();
    this.props.navigateTo('/my-account');
    this.props.resetChangePwdLoadingStatus();
  }

  //Redirect to 'Home' screen when clicked on 'Home' link on the Breadcrumb
  onHomeLinkClick(e){
    e.preventDefault();
    this.props.navigateTo('/exchange');
    this.props.resetChangePwdLoadingStatus();
  }

  render(){
    return(
      <div className='change-password'>
        <Breadcrumb className='bookie-breadcrumb'>
          <Breadcrumb.Item><a onClick={ this.onHomeLinkClick }>{ I18n.t('myAccount.home') }</a></Breadcrumb.Item>
          <Breadcrumb.Item><a onClick={ this.onClickCancel }>{ I18n.t('myAccount.my_account') }</a></Breadcrumb.Item>
          <Breadcrumb.Item>{ I18n.t('myAccount.change_password') }</Breadcrumb.Item>
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
                    <button className='btn btn-regular grid-100 margin-top-25' type='button' onClick={ this.onClickCancel }>
                      { I18n.t('changePassword.back_to_my_account') }
                    </button>
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
    changePassword: AccountActions.changePassword,
    resetChangePwdLoadingStatus: AccountActions.resetChangePwdLoadingStatus
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ChangePassword))
