import React from 'react'
import { Field, reduxForm } from 'redux-form/immutable'
let I18n = require('react-redux-i18n').I18n;

//Component to render the password field
const renderPasswordField = ({ placeholder,tabIndex, errors, input, maxLength, type,
  meta: { touched, error, value} }) => (
  <div>
      <input autoComplete='off' placeholder={ placeholder } { ...input } type={ type }
        tabIndex={ tabIndex } maxLength={ maxLength } />
      { (touched) && error && <span className='errorText'>{ error }</span> }
      { tabIndex==='1' && !error && errors && errors.length ? errors.map((err) => { return <span className='errorText' key={ err }>{ err }</span>}) : null }
  </div>
);

//Allow to type only letters and digits
const normalizePassword = (value) => {
  if (!value) {
    return value
  }
  const onlyNums = value.replace(/[^a-z0-9]/gi,'')
  if (onlyNums) {
    return onlyNums
  }
}

const ChangePasswordForm = (props) => {
  const { handleSubmit,onClickCancel,errors,loadingStatus,invalid,asyncValidating,submitting } = props
  return (
    <form onSubmit={ handleSubmit }>
      <div className='form-fields'>
        <Field name='old_password' id='old_password' errors={ errors } maxLength='52'
          normalize={ normalizePassword }
          component={ renderPasswordField }  placeholder={ I18n.t('changePassword.current_password') } type='password' tabIndex='1' />
      </div>
      <div className='form-fields'>
        <Field name='new_password' id='new_password' errors={ errors } maxLength='52'
          normalize={ normalizePassword }
          component={ renderPasswordField } placeholder={ I18n.t('changePassword.new_password') } type='password' tabIndex='2' />
      </div>
      <div className='form-fields'>
        <Field name='new_password_confirm' id='new_password_confirm' errors={ errors } maxLength='52'
          normalize={ normalizePassword }
          component={ renderPasswordField } placeholder={ I18n.t('changePassword.confirm_password') } type='password' tabIndex='3'/>
      </div>
      <div className='form-fields'>
        <button
          type='button'
          onClick={ onClickCancel }
          className={ 'btn ' + (
            (loadingStatus==='loading' && errors.length===0) ? 'btn-regular-disabled':' cancel-btn') + ' grid-100 margin-top-25' }
          disabled={ loadingStatus==='loading' && errors.length===0 }>
          { I18n.t('changePassword.cancel') }
        </button>
        <button
          className={ 'btn ' + (invalid || submitting || asyncValidating ||
          (loadingStatus==='loading' && errors.length===0) ? 'btn-regular-disabled':' btn-regular') + ' grid-100 margin-top-25' }
          disabled={ invalid || submitting || asyncValidating ||
            (loadingStatus==='loading' && errors.length===0) }
          type='submit' >
          { loadingStatus==='loading' && errors.length===0  ? I18n.t('application.loading') : I18n.t('changePassword.confirm') }
        </button>
      </div>
    </form>
  )
};

/* Change Password field validations:
 -- Minimum 22 characters required on each field
 -- All fields are mandatory
*/
const validateChangePasswordFields = (value,blankFieldErrMsg,minFieldErrMsg) => {
  const minLength = 22;
  if (!value || value.trim() === '') {
    return blankFieldErrMsg;
  } else if(value.length < minLength){
    return minFieldErrMsg;
  }
}

export default reduxForm({
  form: 'changePasswordForm',  // a unique identifier for this form
  fields: ['old_password', 'new_password', 'new_password-confirm'],
  validate: function submit(values) {
    let errors = {},
      new_password = values.get('new_password'),
      new_password_confirm = values.get('new_password_confirm');
    const minPwdError = I18n.t('changePassword.min_pwd_error');
    //Old password validations
    errors.old_password = validateChangePasswordFields(values.get('old_password'),
                          I18n.t('changePassword.enter_old_password'),minPwdError)
    //New password validations
    errors.new_password = validateChangePasswordFields(new_password,
                          I18n.t('changePassword.enter_new_password'),minPwdError)
    //Confirm-New password validations
    errors.new_password_confirm = validateChangePasswordFields(new_password_confirm,
                          I18n.t('changePassword.confirm_new_password'),minPwdError)
    //New Password/Confirm password match fields validation
    if (new_password !== new_password_confirm) {
      errors.new_password_confirm = I18n.t('signup.password_no_match');
    }
    return errors;
  }
})(ChangePasswordForm)
