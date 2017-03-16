import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { ChainValidation } from 'graphenejs-lib';
import { AccountService } from '../../services';
import { LoginActions } from '../../actions';
var I18n = require('react-redux-i18n').I18n;

//Component for text field
const renderField = ({  tabIndex, className, errors, placeholder, input, label, type, iconClass,
	meta: {  touched, error, dirty }  }) => (

	<div>
		<input autoFocus={ tabIndex === '1' } autoComplete='off' { ...input } type={ type }
      placeholder={ placeholder } tabIndex={ tabIndex }
			className={ (touched && error) ? (className + ' error') : className }/>
		{ (touched) && error && <span className='errorText'>{ error }</span> }
	</div>
);

//disallow invalid text to be entered in accountName
const normalizeAccount = (value, previousValue) => {

  if(!value.length) {
  	return value;
  }

  if(/[^a-z0-9-]/.test(value)) {
  	return previousValue && previousValue.toLowerCase();
  }

  return value;
};

const LoginForm = (props) => {
  const { handleSubmit, invalid, submitting, asyncValidating, onClickSignup, errors, status } = props;

  return (
    <form onSubmit={ handleSubmit }>
      <div className='form-fields'>
        <Field name='accountName' component={ renderField } type='text' placeholder='AccountName'
          errors={ errors } normalize={ normalizeAccount } tabIndex='1'/>
      </div>
      <div className='form-fields pos-rel'>
        <Field name='password' component={ renderField } type='password' placeholder='Password' tabIndex='2'/>
				{ //show server errors on submit
					errors.length && !invalid ? <span className='errorText' key={ errors }>{ errors }</span>  :	null }
      </div>
      <div className='form-fields'>
				<button className='btn btn-regular grid-100 margin-top-25' type='submit'
					disabled={ invalid || submitting || asyncValidating }>
					{ //set loadingstatus on submit
						status !== 'default' ? status : I18n.t('login.title') }
				</button>
      </div>
			<div className='form-fields signup-link'>
        <a className='font16' href='#' onClick={ onClickSignup }> { I18n.t('login.signup') } </a>
      </div>
    </form>
  )
};

export default reduxForm({
  form: 'login'  , // a unique name for this form,
	//Form fields validation
  validate: function submit(values) {
  	const errors = {  };
  	let accountError = ChainValidation.is_account_name_error(values.accountName);

  	if(accountError) {
  		errors.accountName = accountError;
  	 }

  	if(!values.password || values.password.length < 22) {
  		errors.password = I18n.t('login.password_length');
  	 }

  	return errors;
  },
	//asynchronously validate username and store in state
  asyncValidate: (values, dispatch) => {
    return AccountService.lookupAccounts(values.accountName, 100)
    .then(result => {
			 let account = result.find(a => a[0] === values.accountName);
      if(!account) {
				 dispatch(LoginActions.setLoginAccount(null));
		     throw { accountName: I18n.t('login.account_name_notfound') };
      } else
        dispatch(LoginActions.setLoginAccount(account));
    });
	 },
  asyncBlurFields: [ 'accountName' ]
})(LoginForm)
