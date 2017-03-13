import React from 'react'
import { Field, reduxForm } from 'redux-form'


const LoginForm = (props) => {
  const { handleSubmit, pristine, submitting, onClickSignup } = props
  return (
    <form onSubmit={ handleSubmit }>
      <div className='form-fields'>
        <Field name='username' component='input' type='text' placeholder='Username'/>
      </div>
      <div className='form-fields pos-rel'>
        <Field name='password' component='input' type='password' placeholder='Password'/>
      </div>
      <div className='form-fields'>
        <button className='btn btn-regular grid-100 margin-top-25' type='submit' disabled={ pristine || submitting }>Login</button>
      </div>
      <div className='form-fields signup-link'>
        <a className='font16' href='#' onClick={ onClickSignup }> SIGN UP </a>
      </div>
    </form>
  )
};

export default reduxForm({
  form: 'login'  // a unique identifier for this form
})(LoginForm)
