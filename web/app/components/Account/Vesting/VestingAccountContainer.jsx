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

import React from "react";
import {connect} from "react-redux";
import Translate from "react-translate-component";
import VestingBalance from "./VestingBalance";
import AccountVestingPageActions from "actions/AccountVestingPageActions";

@connect((state) => {
  return {balances: state.accountVestingPageReducer.balances};
}, {
  fetchData: AccountVestingPageActions.fetchData,
  claimVestingBalance: AccountVestingPageActions.claimVestingBalance,
  resetAccountVestingData: AccountVestingPageActions.resetAccountVestingData
})
class VestingAccountContainer extends React.Component {

  componentWillMount() {
    this
      .props
      .fetchData();
  }

  componentWillUnmount() {
    this
      .props
      .resetAccountVestingData();
  }

  onHandleClaimClick(vb) {
    this
      .props
      .claimVestingBalance(vb);
  }

  render() {

    let {balances} = this.props,
      symbol = CORE_ASSET;

    return (
      <div className="main">
        <section className="content">
          <div className="box">
            <div className="table__section">
              <div className="table__title type2"><Translate content="vesting_balances.title"/> 
                {(symbol)
                  ? `(${symbol})`
                  : null}:
              </div>
              <div className="table table2 table-vBalances">
                <div className="table__head tableRow">
                  <div className="tableCell"><Translate content="vesting_balances.balance_number"/></div>
                  <div className="tableCell"><Translate content="vesting_balances.cashback"/>
                  </div>
                  <div className="tableCell text_r"><Translate content="vesting_balances.earned"/></div>
                  <div className="tableCell text_r"><Translate content="vesting_balances.required"/></div>
                  <div className="tableCell text_r"><Translate content="vesting_balances.remaining"/></div>
                  <div className="tableCell "><Translate content="vesting_balances.available"/></div>
                  <div className="tableCell text_c"></div>
                </div>
                <div className="table__body">

                  {balances.map((vb) => {
                    return <VestingBalance
                      key={vb.id}
                      handleClaimClick={this
                      .onHandleClaimClick
                      .bind(this)}
                      vb={vb}/>
                  })}

                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default VestingAccountContainer;