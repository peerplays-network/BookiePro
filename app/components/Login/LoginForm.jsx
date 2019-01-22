import React from 'react';
import {Field, reduxForm} from 'redux-form';
import {ChainValidation} from 'peerplaysjs-lib';
import Translate from 'react-translate-component';
import AccountRepository from 'repositories/AccountRepository';
import {LoginActions} from '../../actions';

const renderField = ({
  tabIndex,
  className,
  errors,
  placeholder,
  input,
  type,
  iconClass,
  meta: {
    touched,
    error
  }
}) => (
  <label className='row'>
    <Translate
      component='input'
      autoFocus={ tabIndex === '1' }
      autoComplete='off' { ...input }
      type={ type }
      placeholder={ placeholder }
      tabIndex={ tabIndex }
      className={ (touched && error)
        ? (className + ' error')
        : className }
      attributes={ {placeholder: placeholder} }
    />
    <span className='fieldPic'>
      <span className={ iconClass }/>
    </span>
    {(touched) && error && <span className='error__hint'>{error}</span>}
    {!error && errors && errors.length ? errors.map((err) => {
      return (<span className='error__hint' key={ err }>{err}</span>);
    }) : <span className='error__hint'>&nbsp;</span>}
  </label>
);

const normalizeAccount = (value, previousValue) => {
  if(!value.length) {
    return value;
  }

  if(/[^A-Za-z0-9-]/.test(value)) {
    return previousValue && previousValue.toLowerCase();
  }

  return value;
};

class LoginForm extends React.Component {
  componentWillMount() {
    this.props.initialize({
      remember_me: true
    });
  }

  render() {
    const {
      handleSubmit,
      btnStatus,
      errors,
      invalid,
      asyncValidating,
      submitting
    } = this.props;

    let RestoreBtn;

    switch(btnStatus) {
      case 'default':
        RestoreBtn = (
          <button
            className='btn btn-sbm btn-fsz-18 pull-right'
            type='submit'
            disabled={ invalid || submitting || asyncValidating }>
            <Translate className='btnText' content='login.login_btn' />
          </button>
        );
        break;
      case 'loading':

        RestoreBtn = (
          <button
            className='btn btn-sbm btn-fsz-18 pull-right btn-loader'
            type='button'
            disabled={ true }
          >
            <span className='loader loader-white loader-xs'/>
          </button>
        );
        break;
      case 'done':
        RestoreBtn = (
          <button className='btn btn-sbm btn-fsz-18 pull-right'  disabled={ true }>
            <span className='loaderIcon icon-verify'/>
            <Translate className='btnText' content='buttons.done' />
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
          tabIndex='1'
        />
        <Field
          name='password'
          className='field field-pic'
          iconClass='fieldIcon icon-password'
          component={ renderField }
          placeholder='login.login_form_login_password_placeholder'
          type='password'
          tabIndex='2'
        />
        <div className='login__options'>
          {RestoreBtn}
        </div>
      </form>
    );
  }
}

// Decorate the form component
LoginForm = reduxForm({
  form: 'loginForm', // a unique name for this form,
  validate: function submit(values) {
    const errors = {};
    let accountError = ChainValidation.is_account_name_error(values.accountName);

    if (accountError) {
      errors.accountName = (
        <Translate content='errors.login_error'/>
      );//accountError;
    }

    let MAX_PASSWORD_CHARACTERS = 22;

    if (!values.password || values.password.length < MAX_PASSWORD_CHARACTERS) {
      errors.password = (
        <Translate
          content='errors.password_must_be_X_characters_or_more'
          cnt={ MAX_PASSWORD_CHARACTERS }
        />
      );
    }

    return errors;
  },
  asyncValidate: (values, dispatch) => {
    return AccountRepository.lookupAccounts(values.accountName, 100).then((result) => {
      let account = result.find((a) => a[0] === values.accountName);

      if(!account) {
        dispatch(LoginActions.setLoginAccount(null));
        throw {accountName: <Translate content='errors.account_not_found' />};
      } else {
        dispatch(LoginActions.setLoginAccount(account));
      }
    });
  },
  asyncBlurFields: [ 'accountName' ]
})(LoginForm);

export default LoginForm;