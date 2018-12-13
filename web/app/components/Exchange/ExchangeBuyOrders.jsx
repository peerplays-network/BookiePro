import React from 'react';
import {connect} from 'react-redux';
import Translate from 'react-translate-component';
import utils from 'common/utils';
import PriceText from '../Utility/PriceText';
import CustomScroll from 'react-custom-scroll';
import AssetName from '../Explorer/BlockChain/AssetName';

class ExchangeBuyOrders extends React.Component {

  _createOrderRows() {
    let {bidsOrders, baseAsset, quoteAsset} = this.props,
      basePrecision = baseAsset
        ? utils.get_asset_precision(baseAsset.precision)
        : 1;

    let orderKey = 0,
      orders = bidsOrders.map((order) => {
        let price = order.price,
          amount = order.amount,
          averageTotal = order.totalForSale,
          formattedPrice = utils.price_to_text(
            Math.round(price * basePrecision)
            / basePrecision, quoteAsset, baseAsset, baseAsset.precision),
          formattedAmount = utils.price_to_text(
            amount, baseAsset, quoteAsset, quoteAsset.precision),
          formattedTotal = utils.price_to_text(
            order.value, baseAsset, quoteAsset, baseAsset.precision),
          formattedAverageTotal = utils.price_to_text(
            averageTotal, baseAsset, quoteAsset, baseAsset.precision);

        return (
          <div className='tableRow' key={ 'bodOrderKey' + orderKey++ }>
            <div className='tableCell col col-3'>
              <PriceText
                preFormattedPrice={ formattedPrice }
                markedClass={ 'mark' }
                simpleClass={ '' }/>
            </div>
            <div className='tableCell col col-3 text_r'>
              <PriceText
                preFormattedPrice={ formattedAmount }
                markedClass={ 'mark' }
                simpleClass={ '' }/>
            </div>
            <div className='tableCell col col-3 text_r'>
              <PriceText
                preFormattedPrice={ formattedTotal }
                markedClass={ 'mark' }
                simpleClass={ '' }/>
            </div>
            <div className='tableCell col col-3 text_r'>
              <PriceText
                preFormattedPrice={ formattedAverageTotal }
                markedClass={ 'mark' }
                simpleClass={ '' }/>
            </div>
          </div>
        );
      });

    return orders;
  }

  render() {
    let {baseAsset, quoteAsset} = this.props;

    return (
      <div className='col col-6 ex-buy-orders'>
        <section className='section'>
          <div className='section__title'><Translate content='exchange.bids'/></div>
          <div className='section__table'>
            <div className='table table3 table-sm'>
              <div className='table__head tableRow'>
                <div className='tableCell col col-3'><Translate content='exchange.price'/></div>
                <div className='tableCell col col-3 text_r'><AssetName asset={ quoteAsset }/></div>
                <div className='tableCell col col-3 text_r'><AssetName asset={ baseAsset }/></div>
                <div className='tableCell col col-3 text_r'><Translate content='exchange.total'/>
                  (<AssetName asset={ baseAsset }/>)</div>
              </div>
              <CustomScroll allowOuterScroll={ true }>
                <div className='table__body table__scroll'>
                  {(baseAsset && quoteAsset)
                    ? this._createOrderRows()
                    : null}
                </div>
              </CustomScroll>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

ExchangeBuyOrders = connect((state) => {
  return {
    baseAsset: state.exchangePageReducer.baseAsset,
    quoteAsset: state.exchangePageReducer.quoteAsset,
    bidsOrders: state.exchangePageReducer.bidsOrders};
})(ExchangeBuyOrders);

export default ExchangeBuyOrders;
