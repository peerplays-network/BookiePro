/**
 * This component represents the Change Password form.
 * It uses 'redux-form' library to generate form fields and perform field validations.
 * It is used in the ChangePassword component.
 */
import React,{ PureComponent } from 'react';
import { Field, Fields, reduxForm } from 'redux-form/immutable';
import { Button } from 'antd';
import { I18n }  from 'react-redux-i18n';
import { LoadingStatus } from '../../constants';
import { FileSaverUtils } from '../../utility';
const { saveAs } = FileSaverUtils;

/**
 * Following is the stateless function that is passed as the 'component' prop to
 * redux-form's 'Field' components. It is used for generating all the password field input controls.
 *
 * @param {object} - other custom props passed to the 'Field' component.
 *
 * The parameter `object` contains the following:
 *   placeholder : the placeholder text for the input control
 *   tabIndex    : the tab index of the input control
 *   errors      : an object containing errors obtained after peforming validations
 *                 It is used to display the error text below the input field generated
 *   input       : interally used by 'redux-form' to connect the input component to Redux
 *   maxLength   : the maximum number of characters allowed on the field
 *   type        : the type of input control
 *   meta        : contains metadata about the state of this field that redux-form is tracking.
 *     Some of the props that are used under meta prop are:
 *       touched : true if the field has been touched. By default this will be set when the field is blurred.
 *       error   : The error for this field if its value is not passing validation.
 *                 Both synchronous, asynchronous, and submit validation errors will be reported here.
 *       value   : the input value
 */
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

  constructor(props) {
    super(props);
    this.state = {
      isPwDownloaded: false
    };
  }

  /**
   * Download the password in a text file
   *
   * @param {string} password - the password to be downloaded in text file
   * @param {object} event - the 'Save Password File' click event
   */
  onClickDownload(password,event) {
    event.preventDefault();
    let blob = new Blob([ password ], {
      type: 'text/plain'
    });
    saveAs(blob, 'account-recovery-file.txt');
    this.setState({ isPwDownloaded :true})
  }

  /**
   * Render the 'Save Password File' button based on the form's data
   *
   * The button will be rendered as `disabled` if any of the following conditions
   * is true:
   *   - any of the 3 fields is/are empty
   *   - any of the password fields is/are less than the minimum length
   *   - the New Password and the Retyped New Password do not match
   *
   * @param {object} fields - a JS object that contains the form's data
   */
  renderRecoveryButtonFields = (fields) =>{
    const minimumLength = 22;
    const disabled = fields.recoveryDisabled
      || fields.new_password.input.value !== fields.new_password_confirm.input.value
      || fields.new_password_confirm.input.value.length < minimumLength;
    return (
      <div>
          <Button type='primary' htmlType='submit'
            className={ 'btn ' + (disabled ? 'btn-regular-disabled':' btn-download') + ' grid-100' }
            onClick={ fields.onClick.bind(this, fields.new_password.input.value) }
            disabled={ disabled }>
            {I18n.t('signup.download_rec_text')}
          </Button>
      </div>
    )
  }

  render(){
    const { isPwDownloaded } = this.state;
    const { handleSubmit,reset,loadingStatus,invalid,asyncValidating,submitting,pristine } = this.props;
    const errors = this.props.errors.toJS(), isLoading = (loadingStatus===LoadingStatus.LOADING && errors.length===0)
    const recoveryDisabled = invalid || submitting || asyncValidating || isLoading;
    const confirmBtnDisabled = recoveryDisabled || !isPwDownloaded;
    const oldPasswordDisabled = isLoading || pristine || submitting;

    return (
      <form onSubmit={ handleSubmit }>

        <div>{ I18n.t('changePassword.enter_old_password_hint') }</div>
        <div className='form-fields'>
          <Field name='old_password' id='old_password' errors={ errors } maxLength='52'
            component={ renderPasswordField }  placeholder={ I18n.t('changePassword.current_password') } type='password' tabIndex='1' />
        </div>

        <div>{ I18n.t('changePassword.enter_new_password_hint') }</div>
        <div className='form-fields'>
          <Field name='new_password' id='new_password' errors={ errors } maxLength='52'
            component={ renderPasswordField } placeholder={ I18n.t('changePassword.new_password') } type='password' tabIndex='2' />
        </div>

        <div>{ I18n.t('changePassword.confirm_new_password_hint') }</div>
        <div className='form-fields'>
          <Field name='new_password_confirm' id='new_password_confirm' errors={ errors } maxLength='52'
            component={ renderPasswordField } placeholder={ I18n.t('changePassword.confirm_password') } type='password' tabIndex='3'/>
        </div>

        <div className='form-fields savePasswordBox'>
          <div className='download-file'>
            <p className='passwordMessage'>
              { I18n.t('signup.password_warning_1') }<span className='boldTextInMessage'>{ I18n.t('signup.password_warning_2') }</span>{ I18n.t('signup.password_warning_3') }
            </p>
            <div className='text-center'>
              <Fields
                props={ { recoveryDisabled } }
                names={ ['new_password','new_password_confirm'] }
                component={ this.renderRecoveryButtonFields }
                onClick={ this.onClickDownload.bind(this) }/>
            </div>
          </div>
        </div>

        <div className='form-fields text-center'>
          <div>{ Field.old_password }</div>
          <button hidden type='button' onClick={ reset }
            disabled={ oldPasswordDisabled }
            className={ 'btn ' + ((oldPasswordDisabled) ? 'btn-regular-disabled':' btn-regular') + ' grid-100 margin-top-25' }>
            { I18n.t('changePassword.cancel') }
          </button>
          <button type='submit'
            className={ 'btn ' + ( confirmBtnDisabled ? 'btn-regular-disabled':' btn-regular') + ' grid-100 margin-top-25' }
            disabled={ confirmBtnDisabled }>
            { isLoading ? I18n.t('application.loading') : I18n.t('changePassword.confirm') }
          </button>
        </div>
      </form>
    )
  }
};

/**
 * Change Password field validations:
 * - Minimum 22 characters required on each field
 * - All fields are mandatory
 *
 * @param {string} password - the password field value to validate
 * @param {string} blankFieldErrorMessage - the error message to be displayed
 * when the password value is empty
 * @param {string} minimumLengthErrorMessage - the error message to be displayed
 * when the password value is too short
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
  fields: ['old_password', 'new_password', 'new_password_confirm'],
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
