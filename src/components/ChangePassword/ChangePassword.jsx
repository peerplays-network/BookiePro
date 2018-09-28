/**
 * The ChangePassword component is available in MyAccount. It contains the
 * {@link ChangePasswordForm} which allows user to complete the password change
 * process.
 *
 * The updated password will be submitted to the blockchain via the
 * {@link AuthActions#changePassword} action. The new password will be updated
 * under the `auth` in the Redux store if the operation was successful.
 */
import React, {PureComponent} from 'react';
import {Card, Breadcrumb, Form} from 'antd';
import {I18n, Translate} from 'react-redux-i18n';
import ChangePasswordForm from './ChangePasswordForm';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {NavigateActions, AuthActions} from '../../actions';
import {LoadingStatus} from '../../constants';
import Immutable from 'immutable';
import PeerPlaysLogo from '../PeerPlaysLogo';

class ChangePassword extends PureComponent {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOldPasswordCheck = this.handleOldPasswordCheck.bind(this);
    this.navigateToMyAccount = this.navigateToMyAccount.bind(this);
    this.navigateToHome = this.navigateToHome.bind(this);
  }
  componentWillUnmount() {
    this.props.resetChangePwdLoadingStatus();
  }
  /**
   * Invoke the {@link AuthActions#changePassword} action
   *
   * @param {object} values - data obtained from the {@link ChangePasswordForm}
   */
  handleSubmit(values) {
    this.props.changePassword(values.get('old_password'), values.get('new_password'));
  }

  /**
   * Invoke the {@link AuthActions#validateOldPasswordField} action
   *
   * @param {object} values - data obtained from the {@link ChangePasswordForm}
   * @memberof ChangePassword
   */
  handleOldPasswordCheck(values) {
    this.props.validateOldPasswordField(values.currentTarget.value);
  }

  /**
   * Navigate to the `targetLocation` and reset the page loading status back to
   * DEFAULT.
   *
   * @param {object} event - the click event
   * @param {string} targetLocation - the target location to navigate to
   */
  navigateToLocation(event, targetLocation) {
    event.preventDefault();
    this.props.navigateTo(targetLocation);
  }

  /**
   * Redirect to 'My Account' screen when a user clicks on the following:
   * - 'Back to My Account' button (after successful password change)
   * - 'My Account' link on the Breadcrumb
   *
   * @param {object} event - the event associated with clicking
   * on the 'Back to My Account' button or 'My Account' link on breadcrumb
   */
  navigateToMyAccount(event) {
    this.navigateToLocation(event, '/my-account');
  }

  /**
   * Redirect to 'Home' screen when a user clicks on the 'Home' link on the breadcrumb
   *
   * @param {object} event - the 'Home' link click event
   */
  navigateToHome(event) {
    this.navigateToLocation(event, '/betting/exchange');
  }

  render() {
    return (
      <div className='change-password section-padding'>
        <Breadcrumb className='bookie-breadcrumb'>
          <Breadcrumb.Item>
            <a onClick={ this.navigateToHome }>{I18n.t('myAccount.home')} </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a onClick={ this.navigateToMyAccount }>{I18n.t('myAccount.my_account')} </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{I18n.t('myAccount.change_password')}</Breadcrumb.Item>
        </Breadcrumb>
        <Card
          className='bookie-card'
          title={ I18n.t('changePassword.title') }
          bordered={ false }
          style={ {width: '100%'} }
        >
          <div className='registerComponent'>
            <div className='center-form'>
              {//Display the form initially (initially and when the data is getting saved.
              // (Loading will be displayed on 'Submit' button))
                this.props.loadingStatus !== LoadingStatus.DONE ? (
                  <ChangePasswordForm
                    onSubmit={ this.handleSubmit }
                    onBlur={ this.handleOldPasswordCheck }
                    loadingStatus={ this.props.loadingStatus }
                    errors={ this.props.errors }
                  />
                ) : null}
              {//Show the success message when the password has been changed successfully (DONE)
              // and the form will be hidden
                this.props.loadingStatus === LoadingStatus.DONE && this.props.errors.isEmpty() ? (
                  <div className='text-center'>
                    <i className='icon-lock' />
                    <p className='font16'>
                      {<Translate value='changePassword.successText' dangerousHTML />}
                    </p>
                    <button
                      className='btn btn-regular grid-100 btn-top-margin'
                      type='button'
                      onClick={ this.navigateToMyAccount }
                    >
                      {I18n.t('changePassword.back_to_my_account')}
                    </button>
                  </div>
                ) : null}
            </div>
          </div>
        </Card>
        <div>
          <PeerPlaysLogo />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const loadingStatus = state.getIn(['auth', 'changePasswordLoadingStatus']);
  const errors =
    loadingStatus === LoadingStatus.ERROR
      ? state.getIn(['auth', 'changePasswordErrors'])
      : Immutable.List();
  return {
    loadingStatus,
    errors,
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    navigateTo: NavigateActions.navigateTo,
    changePassword: AuthActions.changePassword,
    validateOldPasswordField: AuthActions.validateOldPasswordField,
    resetChangePwdLoadingStatus: AuthActions.resetChangePwdLoadingStatus,
  },
  dispatch
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create()(ChangePassword));
