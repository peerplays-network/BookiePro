import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import utils from 'common/utils';
import AssetName from '../Explorer/BlockChain/AssetName';

class ExchangeMainStatistics extends React.Component {

  render() {
    let {
      latestPriceText,
      latestPriceChangeType,
      baseAssetName,
      quoteAssetName,
      change,
      volumeBase,
      lowBase,
      highBase
    } = this.props;

    return (
      <div className='ex-chartNav'>
        <section className='section'>
          <div className='ex-chartNav__top'>
            <div className='ex-chartNav__topItem'>
              <AssetName asset={ baseAssetName }/>
              /
              <br/>
              <AssetName asset={ quoteAssetName }/>
            </div>
            <div className='ex-chartNav__topItem text_r'>
              <div
                className={ classNames('ex-chartNav__label', {
                  'red': latestPriceChangeType === 'down',
                  'green': latestPriceChangeType === 'up'
                }) }>
                <span>{latestPriceText}</span>
                <span
                  className={ classNames('ex-chartNav__arrow icon-arrow-top2', {
                    'down': latestPriceChangeType === 'down',
                    'up': latestPriceChangeType === 'up'
                  }) }/>
              </div>
              <div className='ex-chartNav__labeled'>Latest</div>
            </div>
            <div className='ex-chartNav__topItem text_r'>
              <div className='ex-chartNav__label'>
                <span>{highBase}</span>
              </div>
              <div className='ex-chartNav__labeled'>24hr High</div>
            </div>
            <div className='ex-chartNav__topItem text_r'>
              <div className='ex-chartNav__label'>
                <span>{lowBase}</span>
              </div>
              <div className='ex-chartNav__labeled'>24hr Low</div>
            </div>
            <div className='ex-chartNav__topItem text_r'>
              <div
                className={ classNames('ex-chartNav__label', {
                  'red': change < 0,
                  'green': change > 0
                }) }>
                <span>{change}
                  %</span>
                <span
                  className={ classNames('ex-chartNav__arrow icon-arrow-top2', {
                    'down': change < 0,
                    'up': change > 0
                  }) }/>
              </div>
              <div className='ex-chartNav__labeled'>24hr Change</div>
            </div>
            <div className='ex-chartNav__topItem text_r'>
              <div className='ex-chartNav__label'>
                <span>{utils.format_volume(volumeBase)}</span>
              </div>
              <div className='ex-chartNav__labeled'>24hr Volume</div>
            </div>
            <div className='ex-chartNav__labeled'>
              <AssetName asset={ baseAssetName }/>
              &
              <AssetName asset={ quoteAssetName }/>
            </div>
          </div>
          <div className='ex-chartNav__bottom'></div>
        </section>
      </div>
    );
  }
}

ExchangeMainStatistics = connect((state) => {
  return {
    baseAssetName: state.exchangePageReducer.baseAssetName,
    quoteAssetName: state.exchangePageReducer.quoteAssetName,
    latestPriceText: state.exchangePageReducer.latestPriceText,
    latestPriceChangeType: state.exchangePageReducer.latestPriceChangeType,
    lowBase: state.exchangePageReducer.lowBase,
    highBase: state.exchangePageReducer.highBase,
    change: state.exchangePageReducer.change,
    volumeBase: state.exchangePageReducer.volumeBase,
    volumeQuote: state.exchangePageReducer.volumeQuote
  };
}, {})(ExchangeMainStatistics);

export default ExchangeMainStatistics;