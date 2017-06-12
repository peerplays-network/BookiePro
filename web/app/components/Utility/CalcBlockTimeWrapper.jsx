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

import React, { Component } from 'react';
import { connect } from 'react-redux';

class CalcBlockTimeWrapper extends Component {

    calc_block_time(block_number) {
        const state = this.context.store.getState();
        const block_interval = state.chain.block_interval;
        const head_block = state.chain.head_block_number;
        const head_block_time = new Date(state.chain.time);
        const seconds_below = (head_block - block_number) * block_interval;
        return new Date(head_block_time - seconds_below * 1000);
    }

    componentWillReceiveProps(next_props) {

        if(next_props.block_number !== this.props.block_number) {
            return true;

        }
        return false;
    }

    shouldComponentUpdate(nextProps, nextState) {

       return nextProps.block_number !== this.props.block_number;
    }

    render() {
        return (
            <span className="wrapper" key={this.props.block_number}>
                    {this.props.children({head_block_number: this.props.head_block_number, block_number: this.props.block_number, time: this.calc_block_time(this.props.block_number)})}
            </span>
        );
    }
}

function mapStateToProps(state) {

    return { head_block_number: state.chain.head_block_number };
}


CalcBlockTimeWrapper.contextTypes = { store: React.PropTypes.object };
CalcBlockTimeWrapper.propTypes = {
    children: React.PropTypes.func.isRequired
};

export default connect(mapStateToProps)(CalcBlockTimeWrapper);