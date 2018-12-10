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

import React, {Component} from 'react';
import cname from 'classnames';
import Translate from 'react-translate-component';
import {connect} from 'react-redux';
import LoadingIndicator from '../LoadingIndicator';

const mapStateToProps = (state) => {
  return {
    account_refs: state.accountRefs.account_refs,
    pubkeys: state.balanceClaimActive.pubkeys,
    addresses: state.balanceClaimActive.addresses,
    walletNames: state.balanceClaimActive.walletNames,
    address_to_pubkey: state.balanceClaimActive.address_to_pubkey,
    state: state.balanceClaimActive.state
  };
};

@connect(mapStateToProps, {})
export default class BalanceClaimActive extends Component {
  render() {
    if (!this.props.account_refs.size) {
      return (
        <div>
          <h5><Translate content='wallet.no_balance'/></h5>
        </div>
      );
    }

    if (this.props.loading) {
      return (
        <div>
          <br/>
          <h5><Translate content='wallet.loading_balances'/>&hellip;</h5>
          <br/>
          <LoadingIndicator type='three-bounce'/>
        </div>
      );
    }

    if (!this.props.balances || !this.props.balances.size) {
      return (
        <div>
          <br/>
          <h5><Translate content='wallet.no_balance'/></h5>
        </div>
      );
    }

    var import_ready = this.props.selected_balances.size && this.props.claim_account_name;
    var claim_balance_label = import_ready
      ? ` (${this.props.claim_account_name})`
      : null;

    return (
      <div>
        <div className='content-block center-content'>
          <h3 className='no-border-bottom'><Translate content='wallet.claim_balances'/></h3>
        </div>
        <div className='grid-block vertical'>
          <div
            className='grid-content'
            style={ {
              overflowY: 'hidden !important'
            } }>
            <div className='full-width-content center-content'>
              {/* <MyAccounts
                key={ this.props.balances }
                accounts={ Immutable.List(this.props.account_refs) }
                onChange={ this
                  .onClaimAccountChange
                  .bind(this) }/> */}
            </div>
            <br></br>
          </div>
          <br/>
          {/* <BalanceClaimSelector/> */}
        </div>
        <br/><br/>
        <div
          className={ cname('button success', {
            disabled: !import_ready
          }) }
          onClick={ this
            .onClaimBalance
            .bind(this) }>
          <Translate content='wallet.claim_balance'/>{claim_balance_label}</div>
        <div
          className='button cancel'
          onClick={ this
            .onBack
            .bind(this) }><Translate content='wallet.cancel'/></div>
      </div>
    );
  }
}
