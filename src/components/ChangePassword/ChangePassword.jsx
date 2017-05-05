import React, { PureComponent } from 'react';
import { Card,Breadcrumb,Icon,Form } from 'antd'
import { I18n,Translate }  from 'react-redux-i18n';
import ChangePasswordForm from './ChangePasswordForm'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigateActions,AccountActions } from '../../actions';
import { LoadingStatus } from '../../constants';
import Immutable from 'immutable';

class ChangePassword extends PureComponent{

  constructor(props){
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.navigateToMyAccount = this.navigateToMyAccount.bind(this);
    this.navigateToHome = this.navigateToHome.bind(this);
  }

  handleSubmit(values) {
    //Change password
    this.props.changePassword(values.get('old_password'), values.get('new_password'));
  }

  //Navigate to the required location
  navigateToLocation(event, targetLocation){
    event.preventDefault();
    this.props.navigateTo(targetLocation);
    this.props.resetChangePwdLoadingStatus();
  }

  /* Redirect to 'My Account' screen when clicked on
  --'Back to My Account' button (after successful password change)
  --'My Account' link on the Breadcrumb */
  navigateToMyAccount(event) {
    this.navigateToLocation(event, '/my-account');
  }

  //Redirect to 'Home' screen when clicked on 'Home' link on the Breadcrumb
  navigateToHome(event){
    this.navigateToLocation(event, '/exchange');
  }

  render(){
    return(
      <div className='change-password section-padding'>
        <Breadcrumb className='bookie-breadcrumb'>
          <Breadcrumb.Item><a onClick={ this.navigateToHome }>{ I18n.t('myAccount.home') }</a></Breadcrumb.Item>
          <Breadcrumb.Item><a onClick={ this.navigateToMyAccount }>{ I18n.t('myAccount.my_account') }</a></Breadcrumb.Item>
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
                this.props.loadingStatus!==LoadingStatus.DONE  ?
                <ChangePasswordForm
                  onSubmit={ this.handleSubmit }
                  loadingStatus={ this.props.loadingStatus }
                  errors={ this.props.errors }/> : null
              }
              {
                //Show the success message when the password has been changed successfully (DONE) and the form will be hidden
                this.props.loadingStatus===LoadingStatus.DONE && this.props.errors.isEmpty()  ?
                <div className='text-center'>
                  <Icon type='lock big-icon'/>
                  <p className='font16 margin-tb-20'>{ <Translate value='changePassword.successText' dangerousHTML/> }</p>
                    <button className='btn btn-regular grid-100 margin-top-25' type='button' onClick={ this.navigateToMyAccount }>
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
  const loadingStatus = account.get('changePasswordLoadingStatus');
  const errors = loadingStatus === LoadingStatus.ERROR ? account.get('changePasswordErrors') : Immutable.List();
  return {
    loadingStatus,
    errors
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
