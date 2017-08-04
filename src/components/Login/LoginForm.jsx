import React from 'react';
import { Field, reduxForm } from 'redux-form/immutable';
import { I18n } from 'react-redux-i18n';
import { LoadingStatus } from '../../constants';
import { AuthUtils } from '../../utility';

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

const LoginForm = (props) => {
  const { pristine, handleSubmit, invalid, submitting, asyncValidating, onClickSignup, errors, status } = props;
  return (
    <form onSubmit={ handleSubmit }>
      <div className='form-fields'>
        <Field name='userName' component={ renderField } type='text' placeholder={ I18n.t('login.username') }
         normalize={ AuthUtils.normalizeAccountName } tabIndex='1'/>
      </div>
      <div className='form-fields'>
        <Field name='password' component={ renderField } type='password'
					errors={ errors.toJS() } placeholder={ I18n.t('login.password') } tabIndex='2'/>
      </div>
      <div className='form-fields'>
				<button
					className={ 'btn ' + ((pristine || invalid || submitting || asyncValidating ||
					status===LoadingStatus.LOADING)
						? 'btn-disabled' : 'btn-regular') + ' grid-100 margin-top-25' } type='submit'
					disabled={ pristine || invalid || submitting || asyncValidating || status===LoadingStatus.LOADING }>
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

export default reduxForm({form: 'login'})(LoginForm)
