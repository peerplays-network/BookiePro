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

import React from 'react'
import Translate from "react-translate-component";
import counterpart from "counterpart";
import { connect } from 'react-redux';
import Inspector from "react-json-inspector";
import {FormattedNumber} from 'react-intl';
import assetUtils from "common/asset_utils";


@connect(state => {
    return {
        account: state.transactionConfirm.transaction.account,
        transactionObject: state.transactionConfirm.transaction.transactionObject,
        memo_key: state.transactionConfirm.transaction.memo_key,
        voting_account: state.transactionConfirm.transaction.voting_account,
        num_committee: state.transactionConfirm.transaction.num_committee,
        num_witnesses: state.transactionConfirm.transaction.num_witnesses,
        fee: state.transactionConfirm.transaction.fee
    };
})
class AccountUpdate extends React.Component {

    render() {
        const options = this.props.transactionObject.operations[0][1];
        let feeValue = this.props.fee ? this.props.fee.amount / Math.pow(10, this.props.fee.asset.precision) : 0;
        let feeSymbol = this.props.fee ? this.props.fee.asset.symbol : null;

        return (
            <div className="mConf__table">
                <div className="mConf__tableRow">
                    <div className="mConf__tableLeft"><Translate content="account.name" /></div>
                    <div className="mConf__tableRight">
                        <span className="mark2">
                            {this.props.account}
                        </span>
                    </div>
                </div>
                { this.props.voting_account ?
                     <div className="mConf__tableRow">
                         <div className="mConf__tableLeft"><Translate content="account.votes.proxy" /></div>
                         <div className="mConf__tableRight">
                             <span className="mark2">
                                 {this.props.voting_account}
                             </span>
                         </div>
                     </div> : this.props.num_witnesses || this.props.num_committee ?
                     <div className="mConf__tableRow">
                         <div className="mConf__tableLeft"><Translate content="account.votes.proxy" /></div>
                         <div className="mConf__tableRight">
                             <span className="mark2">
                                <Translate content="account.votes.no_proxy" />
                             </span>
                         </div>
                     </div> : null
                }
                { this.props.num_committee ?
                    <div className="mConf__tableRow">
                       <div className="mConf__tableLeft"><Translate content="account.options.num_committee" /></div>
                       <div className="mConf__tableRight">
                           <span className="mark2">
                              {this.props.num_committee}
                           </span>
                       </div>
                    </div> : null
                }
                { this.props.num_witnesses ?
                    <div className="mConf__tableRow">
                       <div className="mConf__tableLeft"><Translate content="account.options.num_witnesses" /></div>
                       <div className="mConf__tableRight">
                           <span className="mark2">
                              {this.props.num_witnesses}
                           </span>
                       </div>
                    </div> : null
                }
                { this.props.num_witnesses && this.props.num_committee ?
                    <div className="mConf__tableRow">
                       <div className="mConf__tableLeft"><Translate content="account.votes.votes" /></div>
                       <div className="mConf__tableRight">
                           <span className="mark2">
                              {JSON.stringify( this.props.transactionObject.operations[0][1].new_options.votes) }
                           </span>
                       </div>
                    </div> : null
                }
                { this.props.memo_key ?
                    <div className="mConf__tableRow">
                        <div className="mConf__tableLeft"><Translate content="account.options.memo_key" /></div>
                        <div className="mConf__tableRight">
                           <span className="mark2">
                              {`${this.props.memo_key.substring(0,10)}...`}
                           </span>
                        </div>
                    </div> : null
                }
                <div className="mConf__tableRow">
                    <div className="mConf__tableLeft"><Translate content="account.options.common_options" /></div>
                    <div className="mConf__tableRight">
                        <span className="mark2">
                           <Inspector data={ options } search={false} />
                        </span>
                    </div>
                </div>
                <div className="mConf__tableRow">
                    <div className="mConf__tableLeft"><Translate content="transfer.fee" /></div>
                    <div className="mConf__tableRight">
                        <FormattedNumber
                            value={feeValue}
                            minimumFractionDigits={0}
                            maximumFractionDigits={this.props.fee.asset.precision}
                        /> {assetUtils.getSymbol(feeSymbol)}
                    </div>
                </div>
            </div>
        );
    }
}

export default AccountUpdate;
