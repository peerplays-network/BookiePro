/**
 * This component represents the login form
 * It uses 'redux-form' library to generate form fields and perform field validations.
 * It is used in Login component
 */
import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form/immutable';
import { I18n, Translate } from 'react-redux-i18n';
import { LoadingStatus } from '../../constants';
import { AuthUtils } from '../../utility';

/**
 * This statless function generates the username and password field. It is passed as the
 * `component` prop to the redux-form's 'Field/Fields' components.
 *
 * @param {object} - other custom props passed to the 'Field' component.
 *
 * The parameter `object` contains the following:
 *   tabIndex    : the tab index of the input control
 *   errors      : an object containing errors obtained after peforming validations
 *                 It is used to display the error text below the input field generated
 *   placeholder : the placeholder text for the input control
 *   input       : interally used by 'redux-form' to connect the input component to Redux
 *   type        : the type of input control
 *   meta        : contains metadata about the state of this field that redux-form is tracking.
 *     Some of the props that are used under meta prop are:
 *       touched : true if the field has been touched. By default this will be set when the field is blurred.
 *       error   : The error for this field if its value is not passing validation.
 *                 Both synchronous, asynchronous, and submit validation errors will be reported here.
 *       value   : the input value
 */
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

/**
 * accountname validation - normalize - restrict user to enter invalid characters
 * signup button disabled if username or password not entered
 */
const LoginForm = (props) => {
  const { handleSubmit, invalid, submitting, asyncValidating, onClickSignup, errors, status } = props;
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
				<div className='eulaAgree clearfix center-object'>
					<label><Translate className='eulaMsg' value='registration.eulaAgree' dangerousHTML/>
						<Field
							name='eulaAgree'
							id='eulaAgree'
							component='input'
							type='checkbox'
							className='eulaCheckbox'
							tabIndex='3'
						/>
					</label>
				</div>
				<button
						className={ 'btn ' + ((!props.hasEulaChecked || !props.hasPassword || invalid || submitting || asyncValidating ||
						status===LoadingStatus.LOADING)
							? 'btn-disabled' : 'btn-regular') + ' grid-100 margin-top-25' } type='submit'
						disabled={ (!props.hasEulaChecked || !props.hasPassword || invalid || submitting || asyncValidating || status===LoadingStatus.LOADING) }>
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

let form = reduxForm({form: 'login'})(LoginForm);

const selector = formValueSelector('login');
form = connect(
	state => {
	  const hasUserName = selector(state, 'userName');
	  const hasPassword = selector(state, 'password');
	  const hasEulaChecked = selector(state, 'eulaAgree');
	  return{
		  hasUserName: !!hasUserName,
		  hasPassword: !!hasPassword,
		  hasEulaChecked: !!hasEulaChecked
	  }
}
)(form)

export default form;
