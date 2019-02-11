//unused
import React from 'react';
import {connect} from 'react-redux';
import {ExchangePageActions} from '../../actions';
import ExchangeMainStatistics from './ExchangeMainStatistics';
import ExchangeMarketsTabs from './ExchangeMarketsTabs';
import ExchangePriceChart from './ExchangePriceChart';
import ExchangeDepthChart from './ExchangeDepthChart';
import ExchangeSellOrders from './ExchangeSellOrders';
import ExchangeBuyOrders from './ExchangeBuyOrders';
import ExchangeTrade from './ExchangeTrade';
import ExchangeHistory from './ExchangeHistory';
import ExchangeOpenOrders from './ExchangeOpenOrders';
import {bindActionCreators} from 'redux';

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

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    initStarredMarkets: ExchangePageActions.initStarredMarkets,
    getMarketStats: ExchangePageActions.getMarketStats,
    subscribeMarket: ExchangePageActions.subscribeMarket,
    unSubscribeMarket: ExchangePageActions.unSubscribeMarket
  },
  dispatch
);

export default connect(null, mapDispatchToProps)(ExchangeContainer);