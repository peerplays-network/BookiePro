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
import connectToStores from 'alt/utils/connectToStores';
import Immutable from 'immutable';
import cname from 'classnames';
import BrainkeyActions from 'actions/BrainkeyActions';
import BrainkeyStoreFactory from 'stores/BrainkeyStore';
import BindToChainState from 'components/Utility/BindToChainState';
import ChainTypes from 'components/Utility/ChainTypes';
import BrainkeyInput from 'components/Wallet/BrainkeyInput';
import {pairs} from 'lodash';
import Translate from 'react-translate-component';

import AccountCard from 'components/Dashboard/AccountCard';

class BrainkeyBaseComponent extends Component {
  static getStores() {
    return [BrainkeyStoreFactory.getInstance('wmc')];
  }
  static getPropsFromStores() {
    var props = BrainkeyStoreFactory
      .getInstance('wmc')
      .getState();
    return props;
  }
}

@connectToStores
export default class Brainkey extends BrainkeyBaseComponent {
  componentWillUnmount() {
    console.log('brnkey componentWillUnmount');
    BrainkeyStoreFactory.closeInstance('wmc');
  }
  render() {
    return (
      <span>
        <h3><Translate content='wallet.brainkey'/></h3>
        <BrainkeyInputAccept>
          <ViewBrainkey/>
        </BrainkeyInputAccept>
      </span>
    );
  }
}

@connectToStores
class ViewBrainkey extends BrainkeyBaseComponent {
  render() {
    var short_brnkey = this
      .props
      .brnkey
      .substring(0, 10);
    console.log('this.props.account_ids.toArray()', this.props.account_ids.toArray());
    return <span>
      <div>
        <span className=''>{short_brnkey}</span>&hellip;</div>
      <p></p>
      {this.props.account_ids.size
        ? <BrainkeyAccounts accounts={ Immutable.List(this.props.account_ids.toArray()) }/>
        : <h5><Translate content='wallet.no_accounts'/></h5>}
    </span>;
  }
};
@BindToChainState({keep_updating: true})
class BrainkeyAccounts {

  static propTypes = {
    accounts: ChainTypes.ChainAccountsList.isRequired
  }

  render() {
    var rows = pairs(this.props.accounts)
      .filter((account) => !!account[1])
      .map((account) => account[1]
        .get('name'))
      .sort()
      .map((name) => <AccountCard key={ name } account={ name }/>);
    return <span>
      {rows}
    </span>;
  }

}

export class BrainkeyInputAccept extends Component {
  constructor() {
    super();
    this.state = {
      brnkey: '',
      accept: false
    };
  }

  render() {
    if (this.state.accept) {
      return <span>{this.props.children}</span>;
    }

    var ready = this.state.brnkey && this.state.brnkey !== '';
    return (
      <span className='grid-container'>
        <div>
          <BrainkeyInput
            onChange={ this
              .onBrainkeyChange
              .bind(this) }/>
        </div>
        <div
          className={ cname('button success', {
            disabled: !ready
          }) }
          onClick={ this
            .onAccept
            .bind(this) }><Translate content='wallet.accept'/></div>
      </span>
    );
  }

  onBrainkeyChange(brnkey) {
    this.setState({brnkey});
  }

  onAccept() {
    this.setState({accept: true});
    BrainkeyActions.setBrainkey(this.state.brnkey);
  }
}
