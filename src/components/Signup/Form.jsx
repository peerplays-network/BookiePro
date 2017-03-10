import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { Button } from 'antd'
const SignUpForm = (props) => {
  const { handleSubmit, pristine, submitting } = props
  return (
    <form onSubmit={ handleSubmit }>
      <div className='form-fields'>
        <Field name='username' component='input' type='text' placeholder='john_do'/>
      </div>
      <div className='form-fields pos-rel'>
        <Field name='password' component='input' type='password' placeholder='Last Name'/>
        <button className='btn btn-regular copy-btn'> Copy </button>
      </div>
      <div className='form-fields'>
        <Field name='password-confirm' component='input' type='password' defaultValue='1212121212'/>
      </div>
      <div className='form-fields'>
        <div className='download-file'>
          <p className='margin-btm-20 font22'>If you lose your password, you will lose all of your funds! Keep your password safe!
            To download a text file of your password, click the download button below:</p>
          <div className='text-center'>
            <Button type='primary' htmlType='submit' className='btn btn-green grid-100' >
              Downlaod Recovery File
            </Button>
          </div>
        </div>
      </div>
      <div className='form-fields text-left'>
        <Field name='employed' id='employed' component='input' type='checkbox'/>
        <label htmlFor='employed'>I understand that Peerplays cannot recover my password.</label>
      </div>
      <div className='form-fields text-left'>
        <Field name='employed' id='employed' component='input' type='checkbox'/>
        <label htmlFor='employed'>I have securely saved my password recovery file.</label>
      </div>
      <div className='form-fields'>
        <button className='btn btn-regular grid-100 margin-top-25' type='submit' disabled={ pristine || submitting }>Create Account</button>
      </div>
      <div className='form-fields'>
        <p className='font16'> Already have an account? <a className='underline blue-text' href='/login'> Log In </a> </p>
      </div>
    </form>
  )
};

export default reduxForm({
  form: 'simple'  // a unique identifier for this form
})(SignUpForm)
