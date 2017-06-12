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
import Translate from "react-translate-component";
import Statistics from "./Statistics";
import TimeChart from "./TimeChart";
import TransactionChart from "./TransactionChart";
import RecentBlocks from "./RecentBlocks";
import ActivityBlocks from "./ActivityBlocks";

import {connect} from 'react-redux';

import SLoader from '../../Loaders/SLoader';

class BlockChainContainer extends React.Component {

    render() {


        let {dataIsFetched} = this.props;

        if (!dataIsFetched) {

            return (
                <div className="main">
                    <section className="content">
                        <div className="box">
                            <SLoader />
                        </div>
                    </section>
                </div>
            );

        }

        return (
            <div id="blockchain" className="tab__deploy" style={{display: 'block'}}>

                <Statistics />

                <div className="box-inner box-inner-2">

                    <div className="clearfix">
                        <div className="col col-6 pr-10">
                            <div className="chart__wrap box-white-inside">
                                <Translate component="div" className="chart__title" content="explore.blockchain.block_times" />
                                <TimeChart />
                            </div>
                        </div>

                        <div className="col col-6 pl-10">
                            <div className="chart__wrap box-white-inside">
                                <Translate component="div" className="chart__title" content="explore.blockchain.trx_block" />
                                <TransactionChart />
                            </div>
                        </div>
                    </div>

                    <ActivityBlocks />

                    <RecentBlocks />

                </div>
            </div>
        )
    }
}


BlockChainContainer = connect(
    (state) => {
        return {
            dataIsFetched: state.explorerBlockchainPage.dataIsFetched
        };
    }
)(BlockChainContainer);



export default BlockChainContainer;
