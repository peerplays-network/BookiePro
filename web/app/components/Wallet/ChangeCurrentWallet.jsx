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
import {Link} from 'react-router';
import {connect} from 'react-redux';
import Translate from 'react-translate-component';
import {changeCurrentWallet} from 'actions/RWalletActions';

const mapStateToProps = (state) => {
  return {
    newWallet: state.wallet.newWallet,
    currentWallet: state.wallet.currentWallet,
    walletNames: state.wallet.walletNames
  };
};

@connect(mapStateToProps, {changeCurrentWallet})
export default class ChangeCurrentWallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentWallet: this.props.currentWallet
    };
  }

  render() {
    var options = [];

    this
      .props
      .walletNames
      .forEach((walletName) => {
        options.push(
          <option key={ walletName } value={ walletName }>{walletName.toLowerCase()}</option>
        );
      });

    var isDirty = this.state.currentWallet !== this.props.currentWallet;

    return (
      <div>
        <section className='block-list'>
          <header><Translate content='wallet.active_wallet'/>:</header>

          <ul>
            <li className='with-dropdown'>
              {this
                .props
                .walletNames
                .count() <= 1
                ? <div style={ {
                  paddingLeft: 10
                } }>{this.state.currentWallet}</div>
                : (
                  <select
                    value={ this.state.currentWallet }
                    onChange={ this
                      .onChange
                      .bind(this) }>
                    {options}
                  </select>
                )}
            </li>
          </ul>
        </section>

        <Link to='wallet/create'>
          <div className='button outline'><Translate content='wallet.new_wallet'/></div>
        </Link>

        {isDirty
          ? (
            <div
              className='button outline'
              onClick={ this
                .onConfirm
                .bind(this) }>
              <Translate content='wallet.change' name={ this.state.currentWallet }/>
            </div>
          )
          : null}
      </div>
    );
  }

  onConfirm() {
    this
      .props
      .changeCurrentWallet(this.state.currentWallet);

    if (window.electron) {
      window.location.hash = '';
      window
        .remote
        .getCurrentWindow()
        .reload();
    } else {
      window.location.href = '/';
    }
  }

  onChange(event) {
    var currentWallet = event.target.value;
    this.setState({currentWallet});
  }

}