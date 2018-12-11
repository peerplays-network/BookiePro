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
import ChainTypes from '../Utility/ChainTypes';
import BindToChainState from '../Utility/BindToChainState';

@BindToChainState()
class LinkToAccountById extends React.Component {
  static propTypes = {
    account: ChainTypes.ChainObject.isRequired,
    subpage: React.PropTypes.string.isRequired
  };

  static defaultProps = {
    subpage: 'overview'
  };

  shouldComponentUpdate(nextProps) {
    let returnValue = true;

    if (
      nextProps.account.get('name') &&
      this.props.account.get('name') &&
      nextProps.account.get('name') === this.props.account.get('name')
    ) {
      returnValue = false;
    }

    return returnValue;
  }

  render() {
    let account_name = this
      .props
      .account
      .get('name');

    if (!account_name) {
      return (
        <span>
          {this.props.account.get('id')}
        </span>
      );
    } else {
      // TODO handle account already existing better.
      // console.log( "account_name exists: ", this.props.account.get("id"),
      // this.props.account.get("name") );
    }

    return (
      <Link onClick={ this.props.onClick ? this.props.onClick : () => {} }>
        {account_name}
      </Link>
    );
  }
}

export default LinkToAccountById;
