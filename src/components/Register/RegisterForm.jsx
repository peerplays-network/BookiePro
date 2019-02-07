import React from 'react';
import {Field, Fields, reduxForm} from 'redux-form';
import Translate from 'react-translate-component';
import {ChainValidation} from 'peerplaysjs-lib';
import AccountRepository from 'repositories/AccountRepository';
import classNames from 'classnames';
import {saveAs} from 'common/filesaver.js';
import copy from 'copy-to-clipboard';
import RandomString from 'randomstring';

const renderField = ({
  tabIndex,
  className,
  errors,
  placeholder,
  input,
  label,
  type,
  iconClass,
  meta: {
    touched,
    error
  }
}) => {

  return (
    <label className='loginCreate__row'>
      <span className='loginCreate__fieldWrap'>
        <Translate
          component='input'
          autoFocus={ tabIndex === '1' }
          autoComplete='off' { ...input }
          type={ type }
          attributes={ {placeholder: placeholder} }
          tabIndex={ tabIndex }
          className={ (touched && error) ? (className + ' error') : className }
        />

        <span className='fieldPic'>
          <span className={ iconClass }/>
        </span>
        {(touched) && error && <span className='error__hint'>{error}</span>}
        {!error && errors && errors.length ? errors.map((err) => {
          return <span className='error__hint' key={ err }>{err}</span>;
        }) : <span className='error__hint'>&nbsp;</span>
        }
      </span>
    </label>
  );
};

const renderPasswordField = ({
  onClickCopy,
  tabIndex,
  className,
  placeholder,
  input,
  label,
  type,
  meta: {
    touched,
    error,
  }
}) => {
  return (
    <label className='loginCreate__row'>
      <Translate className='loginCreate__label' content='sign_up.your_password_is'/>
      <span className='loginCreate__fieldWrap'>
        <Translate
          component='input'
          autoComplete='off'
          readOnly { ...input }
          type={ type }
          attributes={ {placeholder: placeholder} }
          tabIndex={ tabIndex }
          className={ (touched && error) ? (className + ' error') : className }
        />
        <button
          className='btn btn-copy loginCreate__copy js-copy-btn'
          type='button'
          onClick={ onClickCopy.bind(this, input.value) }
        >
          <Translate content='sign_up.copy_btn'/>
        </button>
      </span>
      {(touched) && error && <span className='error__hint'>{error}</span>}
    </label>
  );
};

const renderRetypePasswordField = ({
  tabIndex,
  className,
  placeholder,
  input,
  type,
  meta: {
    touched,
    error,
  }
}) => {
  return (
    <label className='loginCreate__row'>
      <Translate className='loginCreate__label' content='sign_up.reenter_password'/>
      <span className='loginCreate__fieldWrap'>
        <Translate
          component='input'
          autoComplete='off' { ...input }
          type={ type }
          placeholder={ placeholder }
          tabIndex={ tabIndex }
          className={ (touched && error) ? (className + ' error') : className }
          attributes={ {placeholder: placeholder} }
        />
      </span>
      {(touched) && error && <span className='error__hint'>{error}</span>}
    </label>
  );
};

const renderCheckboxField = ({
  pseudoText,
  tabIndex,
  className,
  placeholder,
  input,
  type,
  meta: {
    touched,
    error,
  }
}) => {
  return (
    <label className={ classNames('customCheck__label c-black', {checked: input.checked}) }>
      <span className='customCheck__labelRelative'>
        <input
          autoComplete='off' { ...input }
          type={ type }
          placeholder={ placeholder }
          tabIndex={ tabIndex }
          className={ (touched && error)
            ? (className + ' error')
            : className }
        />
        <span className='customCheck__checkPseudo'></span>
      </span>
      <span className='customCheck__labelPseudo'>{pseudoText}</span>
    </label>
  );
};

const renderRecoveryButtonFields = (fields) => {
  return (
    <div>
      <div className='loginCreate__btnWrap'>
        <button
          className='btn btn-sbm loginCreate__btn'
          type='button'
          onClick={ fields.onClick.bind(this, fields.password.input.value) }
          disabled={ !fields.password.meta.valid }
        >
          <Translate className='btnText' content='sign_up.download_btn' />
        </button>
      </div>
    </div>
  );
};

const normalizeAccount = (value, previousValue) => {

  if (!value.length) {
    return value;
  }

  if (/[^A-Za-z0-9-]/.test(value)) {
    return previousValue && previousValue.toLowerCase();
  }

  return value;
};


class RegisterForm extends React.Component {
  componentWillMount() {
    this.handleInitialize();
  }

  handleInitialize() {
    this.props.initialize({
      password: RandomString.generate({
        length: 52,
        charset: 'alphanumeric'
      })
    });
  }

  onClickDownload(val) {
    let blob = new Blob([ val ], {
      type: 'text/plain'
    });
    saveAs(blob, 'account-recovery-file.txt');
  }

  onClickCopy(password) {
    copy(password);
  }

  onClickLogin(e) {
    this.props.onClickLogin();
    e.preventDefault();
  }

  render() {
    const {
      handleSubmit,
      registerStatus,
      errors,
      invalid,
      asyncValidating,
      submitting
    } = this.props;

    let CreateButton;

    switch(registerStatus) {
      case 'default':
        CreateButton = (
          <button
            className='btn btn-sbm loginCreate__btn'
            type='submit'
            disabled={ invalid || submitting || asyncValidating }
          >
            <Translate className='btnText' content='sign_up.create_btn' />
          </button>
        );
        break;
      case 'loading':
        CreateButton = (
          <button
            className='btn btn-sbm loginCreate__btn btn-loader'
            type='button'
            disabled={ true }
          >
            <span className='loader loader-white loader-xs'/>
          </button>
        );
        break;
      case 'done':
        CreateButton = (
          <button className='btn btn-sbm loginCreate__btn' disabled={ true }>
            <span className='loaderIcon icon-verify'/>
            <Translate className='btnText' content='sign_up.done' />
          </button>
        );
        break;
    }

    return (
      <form onSubmit={ handleSubmit }>
        <Field
          name='accountName'
          className='field field-pic'
          errors={ errors }
          iconClass='fieldIcon icon-user'
          component={ renderField }
          placeholder='login.login_form_login_account_placeholder'
          type='text'
          normalize={ normalizeAccount }
          tabIndex='1'/>
        <Field
          name='password'
          className='field field-copy field-red'
          errors={ errors }
          component={ renderPasswordField }
          placeholder='login.login_form_login_password_placeholder'
          type='text'
          normalize={ normalizeAccount }
          onClickCopy={ this.onClickCopy.bind(this) }
          tabIndex='2'
        />
        <Field
          name='password_retype'
          className='field'
          errors={ errors }
          component={ renderRetypePasswordField }
          placeholder='login.login_form_login_password_placeholder'
          type='text'
          normalize={ normalizeAccount }
          tabIndex='3'
        />
        <Translate component='div' className='loginCreate__note1' content='sign_up.note1' />
        <Translate component='div' className='loginCreate__note2' content='sign_up.note2' />
        <Translate component='div' className='loginCreate__note3' content='sign_up.note3' />
        <Fields
          names={ [ 'password' ] }
          component={ renderRecoveryButtonFields }
          onClick={ this.onClickDownload.bind(this) }
        />
        <div className='loginCreate__check'>
          <div className='customCheck__row'>
            <Field
              name='understand'
              id='understand'
              component={ renderCheckboxField }
              className='customCheck__check'
              type='checkbox'
              pseudoText={ <Translate component='span' content='sign_up.pseudoText1' /> }/
            >
          </div>
        </div>
        <div className='loginCreate__check'>
          <div className='customCheck__row'>
            <Field
              name='secure'
              id='secure'
              component={ renderCheckboxField }
              className='customCheck__check'
              type='checkbox'
              pseudoText={ <Translate component='span' content='sign_up.pseudoText2' /> }
            />
          </div>
        </div>
        <div className='loginCreate__btnWrap-2'>
          {CreateButton}
          <div className='loginCreate__note4'>
            <Translate
              component='span'
              content='sign_up.already_have_account'
            />
            <b>
              <a
                href='#login'
                onClick={ this.onClickLogin.bind(this) }
                className='mark2'
              >
                <Translate component='span' content='sign_up.login_link' />
              </a>
            </b>
          </div>
        </div>
      </form>
    );
  }
}

// Decorate the form component
export default RegisterForm = reduxForm({
  form: 'registerAccountForm', // a unique name for this form,
  fields: ['accountName', 'password', 'password_retype', 'secure', 'understand'],
  validate: function submit(values) {
    let errors = {},
      MAX_PASSWORD_CHARACTERS = 22;
    let accountError = ChainValidation.is_account_name_error(values.accountName);

    if (accountError) {
      errors.accountName = (<Translate content='errors.login_error' />);//accountError;
    } else {
      if (!ChainValidation.is_cheap_name(values.accountName)) {
        errors.accountName =(<Translate content='errors.login_error' />);
      }
    }

    if (!values.password || values.password.length < MAX_PASSWORD_CHARACTERS) {
      errors.password = (
        <Translate
          content='errors.password_must_be_X_characters_or_more'
          cnt={ MAX_PASSWORD_CHARACTERS } />
      );
    }

    if (values.password && values.password !== values.password_retype) {
      errors.password_retype = <Translate content='errors.password_retype_match' />;
    }

    if (!values.understand) {
      errors.understand = <Translate content='errors.field_is_required' />;
    }

    if (!values.secure) {
      errors.secure = <Translate content='errors.field_is_required' />;
    }

    return errors;
  },
  asyncValidate: (values) => {
    return AccountRepository.lookupAccounts(values.accountName, 100).then((result) => {
      let account = result.find((a) => a[0] === values.accountName);

      if (account) {
        throw {accountName: <Translate content='errors.name_is_taken' />};
      }
    });
  },
  asyncBlurFields: [ 'accountName' ]
})(RegisterForm);