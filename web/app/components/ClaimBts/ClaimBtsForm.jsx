/*
 *  Copyright (c) 2015 Cryptonomex, Inc., and contributors.
 *
 *  The MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

import React from 'react';
import {Field, reduxForm} from 'redux-form';
import counterpart from 'counterpart';

import {key, PrivateKey} from 'peerplaysjs-lib'; // eslint-disable-line

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
    error,
    dirty // eslint-disable-line
  }
}) => (

  <label className='row'>
    <input
      autoFocus={ tabIndex === '1' }
      autoComplete='off'
      { ...input }
      type={ type }
      placeholder={ placeholder }
      tabIndex={ tabIndex }
      className={ (touched && error)
        ? (className + ' error')
        : className }
    />
    <span className='fieldPic'>
      <span className={ iconClass }/>
    </span>
    {(touched) && error && <span className='error__hint'>{error}</span>}
    {!error && errors && errors.length
      ? errors.map((err) => {
        return (
          <span className='error__hint' key={ err }>
            {err}
          </span>
        );
      })
      : <span className='error__hint'>&nbsp;</span>}
  </label>
);

class ClaimBtsForm extends React.Component {

  componentWillMount() {
    this.props.initialize({});
  }

  render() {
    const {handleSubmit, btnStatus, errors, invalid, submitting} = this.props;
    let SubmitButton;

    switch (btnStatus) {
      case 'default':
        SubmitButton = (
          <button
            className='btn btn-sbm btn-fsz-18 pull-right'
            type='submit'
            disabled={ invalid || submitting }>
            <span className='btnText'>
              {counterpart.translate('login_bts.login_btn')}
            </span>
          </button>
        );
        break;
      case 'loading':
        SubmitButton = (
          <button
            className='btn btn-sbm btn-fsz-18 pull-right btn-loader'
            type='button'
            disabled={ true }>
            <span className='loader loader-white loader-xs'/>
          </button>
        );
        break;
    }

    return (
      <form onSubmit={ handleSubmit }>
        <Field
          name='private_bts_key'
          errors={ errors }
          className='field field-pic'
          iconClass='fieldIcon icon-password'
          component={ renderField }
          placeholder={ counterpart.translate('login_bts.login_key_placeholder') }
          type='password'
          tabIndex='1'
        />
        <div className='login__options'>
          {SubmitButton}
        </div>
      </form>
    );
  }
}

// Decorate the form component
ClaimBtsForm = reduxForm({
  form: 'claimBtsLoginForm', // a unique name for this form,
  validate: (values) => {
    const errors = {};
    const MAX_PASSWORD_CHARACTERS = 22;

    if (!values.private_bts_key) {
      errors.private_bts_key = counterpart.translate('errors.paste_your_redemption_key_here');
    } else {
      try {
        PrivateKey.fromWif(values.private_bts_key);
      } catch (e) {
        errors.private_bts_key = counterpart.translate(
          'errors.paste_your_redemption_key_here', {cnt: MAX_PASSWORD_CHARACTERS}
        ); //e.message;
      }
    }

    return errors;
  }
})(ClaimBtsForm);

export default ClaimBtsForm;