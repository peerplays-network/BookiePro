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
import {connect} from 'react-redux';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import className from 'classnames';
import {deleteWallet} from 'actions/RWalletActions';

const mapStateToProps = (state) => {
  return {walletNames: state.wallet.walletNames};
};

@connect(mapStateToProps, {deleteWallet})
export default class Delete extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedWallet: null,
      confirm: 0
    };
  }

  _onCancel() {
    this.setState({confirm: 0, selectedWallet: null});
  }

  _onRemove() {
    this.setState({confirm: 1});
  }

  _onConfirm() {
    // WalletManagerStore.onDeleteWallet(this.state.selected_wallet);
    this._onCancel();
  }

  _onChange(event) {
    let selectedWallet = event.target.value;
    this.setState({selectedWallet});
  }

  render() {
    if (this.state.confirm === 1) {
      return (
        <div style={ {
          paddingTop: 20
        } }>
          <h4><Translate content='wallet.delete_confirm_line1'/></h4>
          <Translate component='p' content='wallet.delete_confirm_line3'/>
          <br/>
          <div
            className='button outline'
            onClick={ this
              ._onConfirm
              .bind(this) }>
            <Translate
              content='wallet.delete_confirm_line4'
              name={ this.state.selectedWallet }/>
          </div>
          <div
            className='button outline'
            onClick={ this
              ._onCancel
              .bind(this) }>
            <Translate content='wallet.cancel'/>
          </div>

        </div>
      );
    }

    var options = [];
    options.push(
      <option key='select_option' value=''>
        {counterpart.translate('settings.delete_select')}&hellip;
      </option>
    );

    this
      .props
      .walletNames
      .forEach((walletName) => {
        options.push(
          <option key={ walletName } value={ walletName }>{walletName.toLowerCase()}</option>
        );
      });

    var is_dirty = !!this.state.selectedWallet;

    return (
      <div style={ {
        paddingTop: 20
      } }>
        <section className='block-list'>
          <header><Translate content='wallet.delete_wallet'/></header>
          <ul>
            <li className='with-dropdown'>
              <select
                value={ this.state.selectedWallet || '' }
                style={ {
                  margin: '0 auto'
                } }
                onChange={ this
                  ._onChange
                  .bind(this) }>
                {options}
              </select>
            </li>
          </ul>
        </section>
        <div
          className={ className('button outline', {
            disabled: !is_dirty
          }) }
          onClick={ this
            ._onRemove
            .bind(this) }>
          <Translate
            content={ this.state.selectedWallet
              ? 'wallet.delete_wallet_name'
              : 'wallet.delete_wallet' }
            name={ this.state.selectedWallet }/>
        </div>
      </div>
    );
  }
}