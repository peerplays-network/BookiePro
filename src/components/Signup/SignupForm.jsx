/**
 * This component represents the Sign Up form.
 * It uses 'redux-form' library to generate form fields and perform field validations.
 * It is used in the Signup component.
 */
import React, { PureComponent } from 'react';
import { Field, Fields, reduxForm } from 'redux-form/immutable';
import { Button } from 'antd';
import { ChainValidation } from 'peerplaysjs-lib';
import copy from 'copy-to-clipboard';
import RandomString from 'randomstring';
import { FileSaverUtils } from '../../utility';
import { LoadingStatus } from '../../constants';
import { I18n, Translate }  from 'react-redux-i18n';
import { AuthUtils } from '../../utility';

const { saveAs } = FileSaverUtils;

/**
 * This statless function generates the Account Nanem field. It is passed as the
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
const renderField = ({ tabIndex, errors, placeholder, input, type, meta: { touched, error } }) => (
  <div>
      <input autoFocus={ tabIndex === '1' } autoComplete='off'  { ...input }
         type={ type } placeholder={ placeholder } tabIndex={ tabIndex }/>
       { (touched) && error && <span className='errorText'>{error}</span> }
      { !error && errors && errors.size ?
        errors.map((currentError) => { return <span className='errorText' key={ currentError }>{ currentError }</span>}) : null }
  </div>
);

 /**
  * This statless function generates the password field along with the Copy button.
  * It is passed as the `component` prop to the redux-form's 'Field/Fields' components.
  *
  * @param {object} - other custom props passed to the 'Field' component.
  *
  * The parameter `object` contains the following:
  *   onClickCopy : used to bind to the click event of the 'Copy' button generated.
  *                 Clicking on the button will copy the password to clipboard
  *   tabIndex    : the tab index of the input control
  *   errors      : an object containing errors obtained after peforming validations
  *                 It is used to display the error text below the input field generated
  *   input       : interally used by 'redux-form' to connect the input component to Redux
  *   type        : the type of input control
  *   meta        : contains metadata about the state of this field that redux-form is tracking.
  *     Some of the props that are used under meta prop are:
  *       touched : true if the field has been touched. By default this will be set when the field is blurred.
  *       error   : The error for this field if its value is not passing validation.
  *                 Both synchronous, asynchronous, and submit validation errors will be reported here.
  *       value   : the input value
  */
const renderPasswordField = ({ onClickCopy, tabIndex, errors, input, type, meta: { touched, error, value} }) => (
  <div>
      <input autoComplete='off' readOnly { ...input } type={ type } tabIndex={ tabIndex } />
      <button className='btn btn-regular inputWithButton' onClick={ onClickCopy.bind(this, input.value) }>{I18n.t('signup.copy_text')}</button>
      { (touched) && error && <span className='errorText'>{ error }</span> }
  </div>
);

/**
 * This statless function generates the ReType Password field. It is passed as the
 * `component` prop to the redux-form's 'Field/Fields' components.
 *
 * @param {object} - other custom props passed to the 'Field' component.
 *
 * The parameter `object` contains the following:
 *   tabIndex    : the tab index of the input control
 *   errors      : an object containing errors obtained after peforming validations
 *                 It is used to display the error text below the input field generated
 *   input       : interally used by 'redux-form' to connect the input component to Redux
 *   type        : the type of input control
 *   meta        : contains metadata about the state of this field that redux-form is tracking.
 *     Some of the props that are used under meta prop are:
 *       touched : true if the field has been touched. By default this will be set when the field is blurred.
 *       error   : The error for this field if its value is not passing validation.
 *                 Both synchronous, asynchronous, and submit validation errors will be reported here.
 */
const renderRetypePasswordField = ({ tabIndex, errors, input, type, meta: { touched, error } }) => (
  <div>
      <input autoComplete='off' placeholder={ I18n.t('signup.repeat_password') } type={ type } { ...input } tabIndex={ tabIndex } />
      { (touched) && error && <span className='errorText'>{ error }</span> }
  </div>
);

 /**
  * This statless function generates the Acknowledgement checkboxes. It is passed
  * as the `component` prop to the redux-form's 'Field/Fields' components.
  *
  * @param {object} - other custom props passed to the 'Field' component.
  *
  * The parameter `object` contains the following:
  *   id          : id of the checkbox
  *   pseudoText  : the text for the label appearing besides the checkbox
  *   tabIndex    : the tab index of the input control
  *   errors      : an object containing errors obtained after peforming validations
  *                 It is used to display the error text below the input field generated
  *   placeholder : the placeholder text for the input control
  *   input       : interally used by 'redux-form' to connect the input component to Redux
  *   label       : ??
  *   type        : the type of input control
  *   meta        : contains metadata about the state of this field that redux-form is tracking.
  *     Some of the props that are used under meta prop are:
  *       touched : true if the field has been touched. By default this will be set when the field is blurred.
  *       error   : The error for this field if its value is not passing validation.
  *                 Both synchronous, asynchronous, and submit validation errors will be reported here.
  *       value   : the input value
  */
const renderCheckboxField = ({ id,pseudoText,tabIndex, errors, placeholder, input, label, type, meta: { touched, error } }) => (
  <div className='float-left width300 text-left align-checkbox'>
    <input id={ id } autoComplete='off' { ...input } type={ type } placeholder={ placeholder } tabIndex={ tabIndex }/>
    <label htmlFor={ id }> <span>{ pseudoText }</span></label>
  </div>
);

 /**
  * Render the 'Save Password File' button based on the form's data
  *
  * The button will be rendered as `disabled` if either of the following conditions
  * is true:
  *   - any of the 2 password fields is/are empty
  *   - the 2 password fields do not match
  *
  * A new function is created a the click handler by binding the password value
  * to it.
  *
  * @param {object} fields - a JS object that contains the form's data
  */
const renderRecoveryButtonFields = (fields) => (
  <div>
    <Button type='primary' htmlType='submit'
      className={ 'btn ' + (fields.password.input.value!==fields.password_retype.input.value ? 'btn-disabled':' btn-download') + ' grid-100' }
      onClick={ fields.onClick.bind(this, fields.password.input.value) }
      disabled={ fields.password.input.value!==fields.password_retype.input.value }>
      {I18n.t('signup.download_rec_text')}
    </Button>
  </div>
)

class SignupForm extends PureComponent {

  componentWillMount() {
    this.initializePassword();
  }

  /** Initialize the password field with a 52 character long random string */
  initializePassword() {
    this.props.initialize({
      password: RandomString.generate({
        length: 52,
        charset: 'alphanumeric'
      })
    });
  }

  /**
   * Download the password in a text file
   *
   * @param {string} password - the password to be downloaded in text file
   * @param {object} event - the 'Save Password File' button click event
   */
  onClickDownload(password,event) {
    event.preventDefault();
    let blob = new Blob([ password ], {
      type: 'text/plain'
    });
    saveAs(blob, 'account-recovery-file.txt');
  }

  /**
   * Copy the password to clipboard
   *
   * @param {string} password - the password to be copied
   * @param {object} event - the 'Copy' button click event
   */
  onClickCopy(password,event) {
    event.preventDefault();
    copy(password);
  }

  /** Clear any API generated error from store whenever the account name is changed */
  onChangeAccountName(){
    if(this.props.errors.size > 0)
      this.props.clearSignupError();
  }

  render() {
    const { handleSubmit,onClickLogin,errors,loadingStatus,invalid,submitting } = this.props;
    return (
        <form onSubmit={ handleSubmit }>
          <div className='form-fields'>
              <Field name='accountName' id='accountName' errors={ errors }
                normalize={ AuthUtils.normalizeAccountName }
                component={ renderField }  placeholder={ I18n.t('signup.acc_name') } type='text' tabIndex='1'
                onChange={ this.onChangeAccountName.bind(this) } />
          </div>
          <div className='form-fields pos-rel'>
          <Field name='password' errors={ errors } component={ renderPasswordField }
                  type='text' onClickCopy={ this.onClickCopy.bind(this) } tabIndex='2'/>
          </div>
          <div className='form-fields'>
            <Field name='password_retype' errors={ errors }
                component={ renderRetypePasswordField }
                type='text' tabIndex='3'/>
          </div>
          <div className='form-fields savePasswordBox'>
            <div className='download-file'>
              <p className='passwordMessage'>
                { I18n.t('signup.password_warning_1') }<span className='boldTextInMessage'>{ I18n.t('signup.password_warning_2') }</span>{ I18n.t('signup.password_warning_3') }
              </p>
              <div className='text-center'>
                <Fields names={ ['password','password_retype'] } component={ renderRecoveryButtonFields } onClick={ this.onClickDownload.bind(this) }/>
              </div>
            </div>
          </div>
          <div className='clearfix center-object'>
            {/*TODO: bold text inside warning*/}
            <Field name='understand' id='understand'
                component={ renderCheckboxField } type='checkbox'
                  pseudoText={ <Translate value='signup.cannot_recover_password_warning' dangerousHTML/> }  tabIndex='4'/>
            <Field name='secure' id='secure'
                component={ renderCheckboxField } type='checkbox'
                pseudoText={ I18n.t('signup.securely_saved_password_warning') }  tabIndex='5'/>
          </div>
          <div className='form-fields margin-btm-20 '>
              <button type='submit'
                className={ 'btn ' + (invalid || submitting ||
                loadingStatus===LoadingStatus.LOADING ? 'btn-disabled':' btn-regular') + ' grid-100 margin-top-18' }
              disabled={ invalid || submitting || loadingStatus===LoadingStatus.LOADING }
              >{ loadingStatus===LoadingStatus.LOADING ? I18n.t('application.loading') : I18n.t('signup.create_account') }</button>
          </div>
          <div className='form-fields'>
            <p> { I18n.t('signup.already_account') } <a className='text-underline blue-text' href='#' onClick={ onClickLogin }> { I18n.t('signup.log_in') } </a> </p>
          </div>
        </form>
    )
  }
}

export default reduxForm({
  form: 'registerAccountForm',  // a unique identifier for this form
  fields: ['accountName', 'password', 'password_retype', 'secure', 'understand'],
  //Form field validations
  validate: function submit(values) {
    let errors = {};
    //Account name field validations
    let accountError = ChainValidation.is_account_name_error(values.get('accountName'));
    if(accountError) {
      errors.accountName = accountError;
    } else {
      if (!ChainValidation.is_cheap_name(values.get('accountName'))) {
        errors.accountName = I18n.t('signup.premium_acc_text');
      }
    }
    //Password-Re-type password fields validation
    if (values.get('password') && values.get('password') !== values.get('password_retype')) {
      errors.password_retype = I18n.t('signup.password_no_match');
    }
    //Checkboxes validations
    if (!values.get('understand')) {
      errors.understand = I18n.t('signup.field_req');
    }
    if (!values.get('secure')) {
      errors.secure = I18n.t('signup.field_req');
    }
    return errors;
  }
})(SignupForm)
