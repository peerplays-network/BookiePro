import React,{ PureComponent } from 'react';
import { Field, reduxForm } from 'redux-form/immutable';
import { I18n }  from 'react-redux-i18n';
import { LoadingStatus } from '../../constants';

//Component to render the password field
const renderPasswordField = ({ placeholder,tabIndex, errors, input, maxLength, type,
  meta: { touched, error, value} }) => (
  <div>
      <input autoComplete='off' placeholder={ placeholder } { ...input } type={ type }
        tabIndex={ tabIndex } maxLength={ maxLength } />
      { (touched) && error && <span className='errorText'>{ error }</span> }
      { tabIndex==='1' && !error && errors && errors.length ?
        errors.map((currentError) => { return <span className='errorText' key={ currentError }>{ currentError }</span>}) : null }
  </div>
);

class ChangePasswordForm extends PureComponent {
  render(){
    const { handleSubmit,reset,loadingStatus,invalid,asyncValidating,submitting,pristine } = this.props;
    const errors = this.props.errors.toJS(), isLoading = (loadingStatus===LoadingStatus.LOADING && errors.length===0)
    return (
      <form onSubmit={ handleSubmit }>
        <div className='form-fields'>
          <Field name='old_password' id='old_password' errors={ errors } maxLength='52'
            component={ renderPasswordField }  placeholder={ I18n.t('changePassword.current_password') } type='password' tabIndex='1' />
        </div>
        <div className='form-fields'>
          <Field name='new_password' id='new_password' errors={ errors } maxLength='52'
            component={ renderPasswordField } placeholder={ I18n.t('changePassword.new_password') } type='password' tabIndex='2' />
        </div>
        <div className='form-fields'>
          <Field name='new_password_confirm' id='new_password_confirm' errors={ errors } maxLength='52'
            component={ renderPasswordField } placeholder={ I18n.t('changePassword.confirm_password') } type='password' tabIndex='3'/>
        </div>
        <div className='form-fields'>
          <div>{ Field.old_password }</div>
          <button type='button' onClick={ reset }
            disabled={ isLoading || pristine || submitting }
            className={ 'btn ' + ((isLoading || pristine || submitting) ?
                        'btn-regular-disabled':' cancel-btn') + ' grid-100 margin-top-25' }>
            { I18n.t('changePassword.cancel') }
          </button>
          <button type='submit'
            className={ 'btn ' + (invalid || submitting || asyncValidating || isLoading ?
                        'btn-regular-disabled':' btn-regular') + ' grid-100 margin-top-25' }
            disabled={ invalid || submitting || asyncValidating || isLoading }>
            { isLoading ? I18n.t('application.loading') : I18n.t('changePassword.confirm') }
          </button>
        </div>
      </form>
    )
  }
};

/* Change Password field validations:
 -- Minimum 22 characters required on each field
 -- All fields are mandatory
*/
const validateChangePasswordFields = (password,blankFieldErrorMessage,minimumLengthErrorMessage) => {
  const minimumLength = 22;
  if (!password || password.trim() === '') {
    return blankFieldErrorMessage;
  } else if(password.length < minimumLength){
    return minimumLengthErrorMessage;
  }
}

export default reduxForm({
  form: 'changePasswordForm',  // a unique identifier for this form
  fields: ['old_password', 'new_password', 'new_password-confirm'],
  validate: function submit(values) {
    let errors = {},
      new_password = values.get('new_password'),
      new_password_confirm = values.get('new_password_confirm');
    const minimumLengthErrorMessage = I18n.t('changePassword.min_pwd_error');
    //Old password validations
    errors.old_password = validateChangePasswordFields(values.get('old_password'),
                          I18n.t('changePassword.enter_old_password'),minimumLengthErrorMessage)
    //New password validations
    errors.new_password = validateChangePasswordFields(new_password,
                          I18n.t('changePassword.enter_new_password'),minimumLengthErrorMessage)
    //Confirm-New password validations
    errors.new_password_confirm = validateChangePasswordFields(new_password_confirm,
                          I18n.t('changePassword.confirm_new_password'),minimumLengthErrorMessage)
    //New Password/Confirm password match fields validation
    if (new_password !== new_password_confirm) {
      errors.new_password_confirm = I18n.t('signup.password_no_match');
    }
    return errors;
  }
})(ChangePasswordForm)
