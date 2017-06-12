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
import {FormattedRelative} from "react-intl";
import {ChainStore} from "peerplaysjs-lib";

class TimeAgo extends React.Component {

    static propTypes = {
        time: React.PropTypes.any.isRequired,
        chain_time: React.PropTypes.bool,
        component: React.PropTypes.element,
        className: React.PropTypes.string
    };

    static defaultProps = {
        chain_time: true
    };

    shouldComponentUpdate(nextProps) {
        return (
            nextProps.time !== this.props.time
        );
    }

    render() {
        let {time, chain_time} = this.props;
        var offset_mills = chain_time ? ChainStore.getEstimatedChainTimeOffset() : 0
        if (!time) {
            return null;
        }

        if (typeof time === "string" && time.indexOf("+") === -1) {
            time += "+00:00";
        }

        let timePassed = Math.round( ( new Date().getTime() - new Date(time).getTime() + offset_mills ) / 1000 );
        let interval;

        if (timePassed < 60) { // 60s
            interval = 500; // 0.5s
        } else if (timePassed < 60 * 60){ // 1 hour
            interval = 60 * 500; // 30 seconds
        } else {
            interval = 60 * 60 * 500 // 30 minutes
        }

        return (
            <span
                className={this.props.className}
                ref={"timeago_ttip_" + time}
                data-tip={new Date(time)}
                data-place="top"
                data-type="light"
            >
                <FormattedRelative
                    updateInterval={interval}
                    value={new Date(time).getTime() + offset_mills * 0.75}
                    initialNow={Date.now()}
                />
            </span>
        );

    }
}

export default TimeAgo;
