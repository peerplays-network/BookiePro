import React from 'react';
import { Field, reduxForm } from 'redux-form/immutable';
import { ChainValidation } from 'graphenejs-lib';
import { AccountService } from '../../services';
import { I18n } from 'react-redux-i18n';
import { LoadingStatus } from '../../constants';

//Component for text field
const renderField = ({  tabIndex, className, errors, placeholder, input, type,
	meta: {  touched, error, dirty }  }) => (

	<div>
		<input autoFocus={ tabIndex === '1' } autoComplete='off' { ...input } type={ type }
      placeholder={ placeholder } tabIndex={ tabIndex }
			className={ (touched && error) ? (className + ' error') : className }/>
		{ (touched) && error && <span className='errorText'>{ error }</span> }
		{ !error && errors && errors.length ?
			errors.map((currentError) => { return <span className='errorText' key={ currentError }>{ currentError }</span>}) : null }
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
        <Field name='userName' component={ renderField } type='text' placeholder={ I18n.t('login.username') }
         normalize={ normalizeAccount } tabIndex='1'/>
      </div>
      <div className='form-fields'>
        <Field name='password' component={ renderField } type='password'
					errors={ errors.toJS() } placeholder={ I18n.t('login.password') } tabIndex='2'/>
      </div>
      <div className='form-fields'>
				<button
					className={ 'btn ' + ((invalid || submitting || asyncValidating ||
					status===LoadingStatus.LOADING)
						? 'btn-regular-disabled' : 'btn-regular') + ' grid-100 margin-top-25' } type='submit'
					disabled={ invalid || submitting || asyncValidating || status===LoadingStatus.LOADING }>
					{ //set loadingstatus on submit
						status===LoadingStatus.LOADING ? I18n.t('application.loading') : I18n.t('login.title')
					}
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
  	let accountError = ChainValidation.is_account_name_error(values.get('userName'));

  	if(accountError) {
			//overriding blockchain error with general error
			//Note: even if the username format is incorrect it will show this generic error
			//TODO: confirm if we really need to show generic error for these errors
  		errors.userName = I18n.t('login.username_notfound');
  	 }

  	if(!values.get('password') || values.get('password').length < 22) {
  		errors.password = I18n.t('login.password_short');
  	 }

  	return errors;
  },
	//asynchronously validate username and store in state
  asyncValidate: (values, dispatch) => {
    return AccountService.lookupAccounts(values.get('userName'), 1)
    .then(result => {
			 let account = result.find(a => a.get(0) === values.get('userName'));
      if(!account)
				 throw { userName: I18n.t('login.username_notfound') };
    });
	 },
  asyncBlurFields: [ 'userName' ]
})(LoginForm)
