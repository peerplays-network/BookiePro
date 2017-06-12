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
import ReactDOM from 'react-dom';
import createjs from "createjs";
import TimeHelper from "helpers/TimeHelper";
import moment from "moment-timezone";

class AwaitingTimerDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            time: null
        };

        if (this.props.start_time) {
            this.currentExpirationTime = TimeHelper.timeStringToDate(this.props.start_time);
        }

        this.timeoutId = null;

    }
    componentDidMount () {

        this.timerCallback();
    }

    componentWillUnmount () {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.start_time !== this.props.start_time) {
            return true;
        } else {
            return false;
        }

    }

    timerCallback() {

        var ms = moment().diff(moment(this.currentExpirationTime));

        if (ms < 0) {
            var d = moment.duration(ms);
            var s = d.humanize();

            this.setState({
                time: s
            });

            this.timeoutId = setTimeout(this.timerCallback.bind(this), 1000);
        } else {
            this.setState({
                time: 0
            });
        }



    }

    render() {
        return <h1>{this.state.time}</h1>

    }
}



export default AwaitingTimerDisplay;