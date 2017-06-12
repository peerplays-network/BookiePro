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
import Translate from "react-translate-component";
import counterpart from "counterpart";
import {FormattedNumber} from 'react-intl';

import TimeAgo from "../Utility/TimeAgo";

class SendHistory extends React.Component {
    render() {
        const action = this.props.action === 'send' ? <Translate content="operation.action.send"/> : <Translate content="operation.action.receive"/>;
        const status = this.props.status === 'pending' ? <Translate content="operation.pending" blocks={this.props.blocks} /> :
              <Translate content="operation.done" />;
        const precision = Math.pow(10, this.props.precision);
        return (
            <div className="tableRow">
                <div className="tableCell">{action}</div>
                <div className="tableCell text__gray "><TimeAgo time={this.props.time} /></div>
                <div className="tableCell ">{status}</div>
                <div className="tableCell ">{this.props.symbol}</div>
                <div className="tableCell text_r">
                  <FormattedNumber
                    value={(this.props.amount && !isNaN(this.props.amount / precision)) ? (this.props.amount / precision) : 0}
                    minimumFractionDigits={0}
                    maximumFractionDigits={this.props.precision}
                /></div>
            </div>
        );
    }
}

export default SendHistory;
