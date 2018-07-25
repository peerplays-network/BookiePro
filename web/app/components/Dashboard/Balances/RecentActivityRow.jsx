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
import TimeAgo from "../../Utility/TimeAgo";
import { getKeyFromState } from 'actions/RWalletUnlockNewActions';
import { setViewModalStatus } from 'actions/MemoActions';
import Translate from "react-translate-component";
import MemoService from 'services/MemoService';

@connect(state => {
    return {
        headBlockNumber: state.dashboardPage.headBlockNumber,
        blockInterval: state.dashboardPage.blockInterval,
        viewMemo: state.dashboardPage.viewMemo,
        walletLocked: state.wallet.locked,
        walletIsOpen: state.wallet.isOpen,
        aes: state.walletData.aesPrivate,
        memoKey: state.privateKey ? state.privateKey.keys.get('memo').encrypted_key : null
    }
}, {
    getKeyFromState,
    setViewModalStatus
})
class RecentActivityRow extends React.Component {

    constructor(props) {
        super(props);
        this.memoClick = this.memoClick.bind(this);
    }

    /**
     * memoClick()
     *
     * When a memo is clicked, the user is requesting to view the contents of the memo.
     * The memo will be shown in a modal if the user passes the authentication proess in getKeyFromState()
     * 
     * @memberof RecentActivityRow
     */
    memoClick() {
        // geyKeyFromState returns a promise with a callback containing the requested key as a parameter
        // getKeyFromState triggers a modal wherin the user is prompted to enter their password. The password is then used to decrypt the memo key from state
        this.props.getKeyFromState('memo').then((memoKey) => {

            // Use the memo service to decode the message
            let message = MemoService.decodeMemo(memoKey, this.props.memo.from, this.props.memo.nonce, this.props.memo.message);            

            // If message exists, then the message was decoded successfully.
            // Put the message into an object with other relevant information and pass the memo into reduc for viewing in the modal
            // message will either be the decoded message or an error message explaining why the message could not be decoded
            if (message) {  
                let memo = {
                    message,
                    sender: this.props.sender,
                    receiver: this.props.receiver,
                    time: this.getTransactionDate(this.props.headBlockNumber, this.props.block, this.props.blockInterval)
                };

                this.props.setViewModalStatus(true, memo);
            }
            
            // // DEBUG
            // console.log('Last Memo Message');
            // console.log("Message: ", message);
        });
    }

    getTransactionDate(headBlockNumber, transactionBlock, blockInterval) {
        return new Date(Date.now() - ((headBlockNumber - transactionBlock ) * blockInterval * 1000));
    }

    render() {
        let {type, sender, receiver, description, block, memo, handleMemoClick } = this.props;

        let time = this.getTransactionDate(this.props.headBlockNumber, block, this.props.blockInterval);

        return (
            <div className="tableRow">
                <div className="tableCell">
                    <div className="btn btn-mark pulledLeftMinus20">{type}</div>
                    { memo && (
                        <p className='viewMemo' onClick={ this.memoClick }><Translate content="dashboard.recent_activity.viewMemo" /></p>
                    )}
                </div>
                <div className="tableCell">{sender ? sender : '—'}</div>
                <div className="tableCell">{receiver ? receiver : '—'}</div>
                <div className="tableCell">{description}</div>
                <div className="tableCell text__gray text_r"><TimeAgo time={new Date(time)}/></div>
            </div>
        );
    }
}

export default RecentActivityRow;
