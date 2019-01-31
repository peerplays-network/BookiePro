import React from 'react';
import {connect} from 'react-redux';
import Translate from 'react-translate-component';
import market_utils from 'common/market_utils';
import PriceText from '../Utility/PriceText';
import CustomScroll from 'react-custom-scroll';
import AssetName from '../Explorer/BlockChain/AssetName';
import {FormattedDate} from 'react-intl';
import TimeHelper from 'helpers/TimeHelper';

class ExchangeHistory extends React.Component {
  _createRows() {
    let {marketHistory, baseAsset, quoteAsset} = this.props;

    if (marketHistory.size) {
      let index = 0;
      let key = 0;

      return marketHistory
        .filter(() => {
          index++;
          return index % 2 === 0;
        })
        .take(100)
        .map((order) => {
          let flipped = baseAsset.id.split('.')[2] > quoteAsset.id.split('.')[2];
          let paysAsset;
          let receivesAsset;
          let isAsk;
          let operationType;

          if (order.pays.asset_id === baseAsset.id) {
            paysAsset = baseAsset;
            receivesAsset = quoteAsset;
            isAsk = true;
            operationType = 'buy';
          } else {
            paysAsset = quoteAsset;
            receivesAsset = baseAsset;
            isAsk = false;
            operationType = 'sell';
          }

          let parsedOrder = market_utils.parse_order_history(
            order, paysAsset, receivesAsset, isAsk, flipped
          );

          return (
            <div className='tableRow' key={ 'history_' + key++ }>
              <div className='tableCell light col col-2'>
                <FormattedDate
                  value={ new Date(TimeHelper.timeStringToDate(parsedOrder.basicTime)) }
                  format='short'/>
              </div>
              <div className='tableCell col col-1 text_r'>
                <span
                  className={ operationType === 'buy'
                    ? 'green'
                    : 'red' }><Translate content={ 'exchange.' + operationType }/></span>
              </div>
              <div className='tableCell col col-3 text_r'>
                <PriceText
                  preFormattedPrice={ parsedOrder.price }
                  markedClass={ operationType === 'buy'
                    ? 'mark'
                    : 'red' }
                  simpleClass={ '' }/>
              </div>
              <div className='tableCell col col-3 text_r'>
                <PriceText
                  preFormattedPrice={ parsedOrder.amount }
                  markedClass={ operationType === 'buy'
                    ? 'mark'
                    : 'red' }
                  simpleClass={ '' }/>
              </div>
              <div className='tableCell col col-3 text_r'>
                <PriceText
                  preFormattedPrice={ parsedOrder.total }
                  markedClass={ operationType === 'buy'
                    ? 'mark'
                    : 'red' }
                  simpleClass={ '' }/>
              </div>
            </div>
          );
        });
    } else {
      return [];
    }
  }

  render() {
    let {baseAsset, quoteAsset} = this.props;

    return (
      <div className='ex-market-history'>
        <section className='section'>
          <div className='section__title'>
            <Translate content='exchange.history'/>
          </div>
          <div className='section__table'>
            <div className='table table3 table-sm'>
              <div className='table__head tableRow'>
                <div className='tableCell col col-2'>
                  <Translate content='exchange.date'/>
                </div>
                <div className='tableCell col col-1 text_r'>
                  <Translate content='exchange.type'/>
                </div>
                <div className='tableCell col col-3 text_r'>
                  <Translate content='exchange.price'/>
                  (<AssetName asset={ baseAsset }/>)
                </div>
                <div className='tableCell col col-3 text_r'>
                  <Translate content='exchange.quantity'/>
                  (<AssetName asset={ quoteAsset }/>)
                </div>
                <div className='tableCell col col-3 text_r'>
                  <Translate content='exchange.total'/>
                  (<AssetName asset={ baseAsset }/>)
                </div>
              </div>

              <CustomScroll allowOuterScroll={ true }>
                <div className='table__body table__scroll'>
                  {this._createRows()}
                </div>
              </CustomScroll>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    marketHistory: state.exchangePageReducer.marketHistory,
    baseAsset: state.exchangePageReducer.baseAsset,
    quoteAsset: state.exchangePageReducer.quoteAsset
  };
};

export default connect(mapStateToProps)(ExchangeHistory);