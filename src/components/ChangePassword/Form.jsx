import React from 'react'
import { Field, reduxForm } from 'redux-form'
let I18n = require('react-redux-i18n').I18n;

const SignUpForm = (props) => {
  const { handleSubmit } = props
  return (
    <form onSubmit={ handleSubmit }>
      <div className='form-fields'>
        <Field name='username' component='input' type='password'/>
      </div>
      <div className='form-fields'>
        <Field name='password' component='input' type='password' />
      </div>
      <div className='form-fields'>
        <Field name='password-confirm' component='input' type='password' placeholder={ I18n.t('changePassword.confirm_password') }/>
      </div>
      <div className='form-fields'>
        <button className='btn cancel-btn grid-100 margin-top-25' type='submit'>{ I18n.t('changePassword.cancel') }</button>
        <button className='btn btn-regular grid-100 margin-top-25' type='submit' >{ I18n.t('changePassword.confirm') }</button>
      </div>
    </form>
  )
};

export default reduxForm({
  form: 'simple'  // a unique identifier for this form
})(SignUpForm)
