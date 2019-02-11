//unused
import React from 'react';
import {connect} from 'react-redux';
import TradeBlock from './TradeBlock';

class ExchangeTrade extends React.Component {
  render() {
    let {baseAsset, quoteAsset, baseAssetBalance, quoteAssetBalance} = this.props;

    return (
      <div className='clearfix'>
        <div className='col col-6 ex-buy-pp'>
          {(baseAsset && quoteAsset)
            ? <TradeBlock
              quoteAsset={ quoteAsset }
              baseAsset={ baseAsset }
              balance={ baseAssetBalance }
              tradeAsset={ baseAsset }
              operationType={ 'buy' }/>
            : null}
        </div>
        <div className='col col-6 ex-sell-pp'>
          {(baseAsset && quoteAsset)
            ? <TradeBlock
              quoteAsset={ quoteAsset }
              baseAsset={ baseAsset }
              balance={ quoteAssetBalance }
              tradeAsset={ quoteAsset }
              operationType={ 'sell' }/>
            : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    baseAsset: state.exchangePageReducer.baseAsset,
    quoteAsset: state.exchangePageReducer.quoteAsset,
    baseAssetBalance: state.exchangePageReducer.baseAssetBalance,
    quoteAssetBalance: state.exchangePageReducer.quoteAssetBalance
  };
};

export default connect(mapStateToProps)(ExchangeTrade);