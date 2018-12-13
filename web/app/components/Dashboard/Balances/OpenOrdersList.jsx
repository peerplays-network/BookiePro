import React from 'react';
import {connect} from 'react-redux';
import TimeAgo from '../../Utility/TimeAgo';
import Translate from 'react-translate-component';
import asset_utils from 'common/asset_utils';

@connect((state) => {
  return {
    openOrders: state.dashboardPage.openOrders,
    headBlockNumber: state.dashboardPage.headBlockNumber,
    blockInterval: state.dashboardPage.blockInterval
  };
})
class OpenOrdersList extends React.Component {
  render() {
    let orders = this.props.openOrders.map((order) => {
      let time = new Date(
        Date.now() - ((this.props.headBlockNumber - order.block) * this.props.blockInterval * 1000)
      );

      if (!order.price || !order.amount || !order.total) {
        return null;
      }

      return (
        <div key={ order.id } className='tableRow'>
          <div className='tableCell'>{order.sellOrBuy}</div>
          <div className='tableCell text_r'>{
            `${order.price.amount} ${
              asset_utils.getSymbol(order.price.quoteAsset.symbol)
            }/${asset_utils
              .getSymbol(order.price.baseAsset.symbol)}`}
          </div>
          <div className='tableCell text_r'>{`${order.amount.amount} ${asset_utils
            .getSymbol(order.amount.asset.symbol)}`}
          </div>
          <div className='tableCell text_r'>{`${order.total.amount} ${asset_utils
            .getSymbol(order.total.asset.symbol)}`}
          </div>
          <div className='tableCell text__gray text_r'>
            <TimeAgo time={ new Date(time) }/>
          </div>
        </div>
      );
    });

    if (!orders.length) {
      orders = (
        <div className='tableRow'>
          <div className='tableCell'>
            <Translate content='dashboard.none'/>
          </div>
          <div className='tableCell text_r'>
            <Translate content='dashboard.n_a'/>
          </div>
          <div className='tableCell text_r'>
            <Translate content='dashboard.n_a'/>
          </div>
          <div className='tableCell text_r'>
            <Translate content='dashboard.n_a'/>
          </div>
          <div className='tableCell text__gray text_r'>
            <Translate content='dashboard.n_a'/>
          </div>
        </div>
      );
    }

    return (
      <div className='table__wrap'>
        <h3 className='content__headTitle mb-15'>
          <Translate content='exchange.my_orders'/>
        </h3>
        <div className='table table2 table-db-open-orders'>
          <div className='table__head tableRow'>
            <div className='tableCell'>
              <Translate content='exchange.buy_or_sell'/>
            </div>
            <div className='tableCell text_r'>
              <Translate content='exchange.price'/>
            </div>
            <div className='tableCell text_r'>
              <Translate content='exchange.quantity'/>
            </div>
            <div className='tableCell text_r'>
              <Translate content='exchange.total'/>
            </div>
            <div className='tableCell text_r'>
              <Translate content='exchange.date'/>
            </div>
          </div>
          <div className='table__body'>
            {orders}
          </div>
        </div>
      </div>
    );
  }
}
export default OpenOrdersList;
