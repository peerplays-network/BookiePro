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
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import Immutable from 'immutable';
import {connect} from 'react-redux';
import {FormattedNumber} from 'react-intl';
import utils from 'common/utils';

import {accountSearch} from 'actions/RAccountActions';

@connect((state) => {
  return {
    searchValue: state.account.search.searchTerm,
    accountsList: state.account.search.searchAccounts,
    coreAsset: state.account.search.coreAsset
  };
}, {accountSearch})
class Accounts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: props.searchValue,
      accountsList: Immutable.List()
    };
  }

  componentWillUnmount() {
    this.props.accountSearch('');
  }

  onSearch(e) {
    this.props.accountSearch(e.target.value);
    this.setState({searchValue: e.target.value});
  }

  render() {
    let {searchValue, accountsList} = this.props;

    if (accountsList.length > 0 && searchValue && searchValue.length > 0) {
      accountsList = accountsList.filter((a) => {
        return a[0].indexOf(searchValue) !== -1;
      }).sort((a, b) => {
        if (a[0] > b[0]) {
          return 1;
        } else if (a[0] < b[0]) {
          return -1;
        } else {
          return 0;
        }
      });
    }

    let list = accountsList.map((a) => {
      let amount = a[2] / Math.pow(10, this.props.coreAsset.precision);
      let supply = parseInt(this.props.coreAsset.options.max_supply, 10);
      let percent = utils.format_number((a[2] / supply) * 100, 4);
      return (
        <div key={ a } className='tableRow'>
          <div className='tableCell'>{a[0]}</div>
          <div className='tableCell'>{a[1]}</div>
          <div className='tableCell text_r'>
            <FormattedNumber
              value={ amount }
              minimumFractionDigits={ 0 }
              maximumFractionDigits={ 5 }/> {this.props.coreAsset.symbol}
          </div>
          <div className='tableCell text_r'>{a[2]
            ? `${percent} %`
            : 'N / A'}</div>
          <div className='tableCell text_r'></div>
        </div>
      );
    });
    return (
      <div id='accounts' className='tab__deploy' style={ {display: 'block'} }>
        <div className='tab__deployHead'>
          <div className='title col'>
            <Translate content='explore.accounts.explore_bitshares_accounts'/>
          </div>
          {/*Possible: addClass focus to div.fieldSearch__wrap*/}
          <div className='fieldWrap fieldSearch__wrap col col-3'>
            <input type='submit' className='fieldSearch__sbm'/>
            <span className='fieldSearch__icon icon-search'></span>
            <a href='' className='fieldSearch__clear'> {/* eslint-disable-line */}
              <span className='fieldSearch__clearIcon icon-close'></span>
            </a>

            <input
              type='text'
              className='field field-search'
              placeholder={ counterpart.translate('explore.accounts.search_accounts') }
              value={ this.state.searchValue }
              onChange={ this.onSearch.bind(this) }/>
          </div>
        </div>
        {searchValue
          ? <div className='box-inner box-inner-2'>
            <div className='table table2 table-explore-acc'>
              <div className='table__head tableRow'>
                <div className='tableCell'>
                  <Translate content='explore.accounts.account_name'/>
                </div>
                <div className='tableCell'>
                  <Translate content='explore.accounts.id'/>
                    #
                </div>
                <div className='tableCell text_r'>
                  <Translate content='explore.accounts.core_token_balance'/>
                </div>
                <div className='tableCell text_r'>
                  <Translate content='explore.accounts.percent_of_total_supply'/>
                </div>
                <div className='tableCell text_r'>
                  {/*<div className="table__sortingWrap">
                    <a href="" className="table__sorting">
                      <span className="table__sortingIcon up active icon-arrow-top2"></span>
                      <span className="table__sortingIcon table__sorting down icon-arrow-top2">
                      </span>
                    </a>
                  </div>*/}
                </div>
              </div>
              <div className='table__body'>
                {list}
              </div>
            </div>
          </div>
          : null
        }
      </div>
    );
  }
}

export default Accounts;
