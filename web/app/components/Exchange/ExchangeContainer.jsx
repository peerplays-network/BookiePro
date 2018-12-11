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
import ExchangePageActions from 'actions/ExchangePageActions';
import ExchangeMainStatistics from './ExchangeMainStatistics';
import ExchangeMarketsTabs from './ExchangeMarketsTabs';
import ExchangePriceChart from './ExchangePriceChart';
import ExchangeDepthChart from './ExchangeDepthChart';
import ExchangeSellOrders from './ExchangeSellOrders';
import ExchangeBuyOrders from './ExchangeBuyOrders';
import ExchangeTrade from './ExchangeTrade';
import ExchangeHistory from './ExchangeHistory';
import ExchangeOpenOrders from './ExchangeOpenOrders';

class ExchangeContainer extends React.Component {

  componentDidMount() {
    let symbols = this.props.params.marketId.split('_');
    this.init(symbols[1], symbols[0]);
  }

  componentWillReceiveProps(nextProps) {
    let symbols = nextProps.params.marketId.split('_');
    this.init(symbols[1], symbols[0]);
  }

  componentWillUnmount() {
    this.props.unSubscribeMarket();
  }

  init(baseAssetSymbol, quoteAssetSymbol) {

    this.props.initStarredMarkets();
    this.props.subscribeMarket(baseAssetSymbol, quoteAssetSymbol);
    this.props.getMarketStats();
  }

  render() {
    return (
      <div className='main'>
        <section className='content'>
          <div className='box'>
            <div className='content__head noBd'>
              <h1 className='content__headTitle'>Exchange</h1>
            </div>
            <div className='ex_wrap'>
              <div className='ex_content col col-9'>
                <ExchangeMainStatistics/>
                <ExchangePriceChart/>
                <ExchangeTrade/>
                <ExchangeDepthChart/>

                <div className='clearfix'>
                  <ExchangeBuyOrders/>
                  <ExchangeSellOrders/>
                </div>

                <ExchangeHistory/>
              </div>
              <aside className='ex_aside col col-3'>
                <ExchangeMarketsTabs/>
                <ExchangeOpenOrders/>
              </aside>

            </div>
            <div className='h100'></div>
          </div>
        </section>
      </div>
    );
  }
}

ExchangeContainer = connect((state) => { /* eslint-disable-line */
  return {};
}, {
  initStarredMarkets: ExchangePageActions.initStarredMarkets,
  getMarketStats: ExchangePageActions.getMarketStats,
  subscribeMarket: ExchangePageActions.subscribeMarket,
  unSubscribeMarket: ExchangePageActions.unSubscribeMarket
})(ExchangeContainer);

export default ExchangeContainer;