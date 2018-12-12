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
// import {WalletChange, WalletDelete} from "../Wallet/WalletManager";
import BalanceClaimActive from 'components/Wallet/BalanceClaimActive';
import Translate from 'react-translate-component';
import ChangeCurrentWallet from 'components/Wallet/ChangeCurrentWallet';
import DeleteWallet from 'components/Wallet/Delete';

export default class WalletSettings extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      lookupActive: false
    };
  }

  onLookup() {
    this.setState({
      lookupActive: !this.state.lookupActive
    });
  }

  render() {
    let {lookupActive} = this.state;

    return (
      <div>
        <ChangeCurrentWallet />
        <DeleteWallet />
        <section style={ {padding: '15px 0'} } className='block-list'>
          <header><Translate content='wallet.balance_claims' />:</header>
        </section>
        <div style={ {paddingBottom: 10} }>
          <Translate content='settings.lookup_text' />:
        </div>
        <div className='button outline' onClick={ this.onLookup.bind(this) }>Lookup balances</div>
        {lookupActive ? <BalanceClaimActive /> : null}
      </div>
    );
  }
};
