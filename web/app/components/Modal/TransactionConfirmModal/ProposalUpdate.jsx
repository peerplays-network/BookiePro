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


@connect(state => {
    return {
        op: state.transactionConfirm.transaction.op
    };
})
class ProposalUpdate extends React.Component {

    render() {
        let fields = [
            "active_approvals_to_add", "active_approvals_to_remove",
            "owner_approvals_to_add", "owner_approvals_to_remove",
            "key_approvals_to_add", "key_approvals_to_remove"
        ];

        return (
            <div className="mConf__content">
                <div className="mConf__title"><Translate content="transaction.trxTypes.proposal_update" /></div>
                <div className="mConf__table">
                    <div className="mConf__tableRow">
                        <div className="mConf__tableLeft"><Translate content="proposal_create.fee_paying_account" /></div>
                        <div className="mConf__tableRight">
                            <span className="mark2">
                                {this.props.op.fee_paying_account}
                            </span>
                        </div>
                    </div>
                    {f}
                </div>
            </div>
        );
    }
}

export default ProposalUpdate;
