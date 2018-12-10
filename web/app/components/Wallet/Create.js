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

/**
 * Created by shumer on 10/6/16.
 */
import React, {Component} from 'react';
import Translate from 'react-translate-component';
import className from 'classnames';
import PasswordConfirm from './PasswordConfirm';
import BrainkeyInput from './BrainkeyInput';

export default class Create extends Component {

  constructor(props) {
    super(props);
    this.state = {
      wallet_public_name: 'default',
      valid_password: null,
      errors: {},
      isValid: false,
      create_submitted: false,
      custom_brainkey: false,
      brnkey: null
    };
  }

    static propTypes = {
      hideTitle: React.PropTypes.bool
    };

    onDone() {
      window.history.back();
    }

    onSubmit(e) { // eslint-disable-line

    }

    formChange(event) { // eslint-disable-line

    }

    onPassword(valid_password) { // eslint-disable-line

    }

    onBrainkey(brnkey) { // eslint-disable-line

    }

    onBack(e) { // eslint-disable-line

    }

    onCustomBrainkey() {

    }

    render() {
      let state = this.state;
      let errors = state.errors;
      let has_wallet = !!this.props.current_wallet;

      if (
        this.state.create_submitted &&
        this.state.wallet_public_name === this.props.current_wallet
      ) {
        return (
          <div>
            <h4><Translate content='wallet.wallet_created' /></h4>
            <span onClick={ this.onDone.bind(this) } className='button success'>
              <Translate content='wallet.done' />
            </span>
          </div>
        );
      }

      return (
        <div>
          <form
            style={ {maxWidth: '40rem'} }
            onSubmit={ this.onSubmit.bind(this) }
            onChange={ this.formChange.bind(this) }
            noValidate
          >
            <div className='grid-content' style={ {textAlign: 'left'} }>
              <Translate component='p' content='wallet.create_importkeys_text' />
              <Translate component='p' content='wallet.create_text' />
            </div>

            <PasswordConfirm onValid={ this.onPassword.bind(this) }/>
            { has_wallet ? (
              <div className='grid-content no-overflow'>
                <br/>
                <section>
                  <label><Translate content='wallet.name' /></label>
                  <input
                    type='text'
                    id='wallet_public_name'
                    defaultValue={ this.state.wallet_public_name }
                  />
                </section>
                <div className='has-error'>{errors.wallet_public_name}</div>
                <br/>
              </div>) : null}

            <div className='grid-content no-overflow'>

              { this.state.custom_brainkey ? (
                <div>
                  <label><Translate content='wallet.brainkey' /></label>
                  <BrainkeyInput onChange={ this.onBrainkey.bind(this) }/>
                </div>) : null}

              <button className={ className('button',{disabled: !(this.state.isValid)}) }>
                <Translate content='wallet.create_wallet' />
              </button>

              <button className='button secondary' onClick={ this.onBack.bind(this) }>
                <Translate content='wallet.cancel' />
              </button>

            </div>

            { ! this.state.custom_brainkey ? (
              <div style={ {paddingTop: 20} }>
                <label>
                  <a onClick={ this.onCustomBrainkey.bind(this) }> { /* eslint-disable-line */ }
                    <Translate content='wallet.custom_brainkey' /></a>
                </label>
              </div>) : null}
          </form>
        </div>);
    }
}