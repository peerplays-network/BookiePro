import React, { PureComponent } from 'react';
import { Field, Fields, reduxForm } from 'redux-form/immutable';
import { Button } from 'antd';
import { ChainValidation } from 'graphenejs-lib';
import copy from 'copy-to-clipboard';
import RandomString from 'randomstring';
import { saveAs } from '../../utility/fileSaver.js';
import { AccountService } from '../../services';
import { LoadingStatus } from '../../constants';
import { I18n, Translate }  from 'react-redux-i18n';

//Component to render the plain fields
const renderField = ({ tabIndex, errors, placeholder, input, type, meta: { touched, error } }) => (
  <div>
      <input autoFocus={ tabIndex === '1' } autoComplete='off'  { ...input }
         type={ type } placeholder={ placeholder } tabIndex={ tabIndex }/>
       { (touched) && error && <span className='errorText'>{error}</span> }
      { !error && errors && errors.length ?
        errors.map((currentError) => { return <span className='errorText' key={ currentError }>{ currentError }</span>}) : null }
  </div>
);

//Component to render the password field
const renderPasswordField = ({ onClickCopy, tabIndex, errors, input, type, meta: { touched, error, value} }) => (
  <div>
      <input autoComplete='off' readOnly { ...input } type={ type } tabIndex={ tabIndex } />
      <button className='btn btn-regular copy-btn' onClick={ onClickCopy.bind(this, input.value) }>{I18n.t('signup.copy_text')}</button>
      { (touched) && error && <span className='errorText'>{ error }</span> }
  </div>
);

//Component to render the retype-password field
const renderRetypePasswordField = ({ tabIndex, className, errors, input, type, meta: { touched, error } }) => (
  <div>
      <input autoComplete='off' type={ type } { ...input } tabIndex={ tabIndex } />
      { (touched) && error && <span className='errorText'>{ error }</span> }
  </div>
);

//Component to render the checkboxes
const renderCheckboxField = ({ pseudoText,tabIndex, errors, placeholder, input, label, type, meta: { touched, error, dirty } }) => (
  <div className='float-left width300 text-left align-checkbox'>
    <input autoComplete='off' { ...input } type={ type } placeholder={ placeholder } tabIndex={ tabIndex }/>
    <label>{ pseudoText }</label>
  </div>
);

//Component to render the 'Copy' button
const renderRecoveryButtonFields = (fields) => (
  <div>
    <div className='loginCreate__btnWrap'>
        <Button type='primary' htmlType='submit'
          className={ 'btn ' + (fields.password.input.value!==fields.password_retype.input.value ? 'btn-regular-disabled':' btn-green') + ' grid-100' }
          onClick={ fields.onClick.bind(this, fields.password.input.value) }
          disabled={ fields.password.input.value!==fields.password_retype.input.value }>
          {I18n.t('signup.download_rec_text')}
        </Button>
    </div>
  </div>
)

class SignupForm extends PureComponent {

  componentWillMount() {
    //Auto-generate the password before the component mounts
    this.initializePassword();
  }

  //Initialize the password field with a 52 character long random string
  initializePassword() {
    this.props.initialize({
      password: RandomString.generate({
        length: 52,
        charset: 'alphanumeric'
      })
    });
  }

  //Download the password in a text file
  onClickDownload(password,event) {
    event.preventDefault();
    let blob = new Blob([ password ], {
      type: 'text/plain'
    });
    saveAs(blob, 'account-recovery-file.txt');
  }

  //Copy the password to clipboard
  onClickCopy(password,event) {
    event.preventDefault();
    copy(password);
  }

  //Render the redux-form
  render() {
    const { handleSubmit,onClickLogin,errors,loadingStatus,invalid,asyncValidating,submitting } = this.props;
    return (
        <form onSubmit={ handleSubmit }>
          <div className='form-fields'>
              <Field name='accountName' id='accountName' errors={ errors }
                component={ renderField }  placeholder={ I18n.t('signup.acc_name') } type='text' tabIndex='1' />
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
                className={ 'btn ' + (invalid || submitting || asyncValidating ||
                loadingStatus===LoadingStatus.LOADING ? 'btn-regular-disabled':' btn-regular') + ' grid-100 margin-top-18' }
              disabled={ invalid || submitting || asyncValidating || loadingStatus===LoadingStatus.LOADING }
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
  },
  //Async Validation to check if the account name is already taken
  asyncValidate: (values) => {
    return AccountService.lookupAccounts(values.get('accountName'), 1)
        .then(result => {
          let account = result.find(account => account.get(0) === values.get('accountName'));
          if(account) {
            throw { accountName: I18n.t('signup.acc_name_taken') };
          }
        });
  },
  asyncBlurFields: [ 'accountName' ]
})(SignupForm)
