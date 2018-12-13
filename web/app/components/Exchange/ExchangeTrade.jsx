import React from 'react';
import {connect} from 'react-redux';
import Translate from 'react-translate-component';
import {FormattedNumber} from 'react-intl';
import classNames from 'classnames';
import utils from 'common/utils';
import market_utils from 'common/market_utils';
import {ChainStore} from 'peerplaysjs-lib';
import MarketRepository from 'repositories/MarketRepository';
import AssetRepository from 'repositories/AssetRepository';
import {setWalletPosition} from 'actions/RWalletUnlockActions';
import {setTransaction} from 'actions/RTransactionConfirmActions';
import SendPageActions from 'actions/SendPageActions';
import AssetName from '../Explorer/BlockChain/AssetName';

@connect((state) => {
  return {
    coreAsset: state.exchangePageReducer.coreAsset,
    currentAccount: state.account.currentAccount,
    walletLocked: state.wallet.locked,
    walletIsOpen: state.wallet.isOpen
  };
}, {
  setWalletPosition,
  setTransaction
})
class TradeBlock extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      price: 0,
      amount: 0,
      total: 0
    };
  }

  componentWillUpdate(nextProps) {
    const {walletLocked} = this.props;

    if (!nextProps.walletLocked && nextProps.walletLocked !== walletLocked) {
      this.__createOrder(nextProps.walletLocked);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.baseAsset &&
      nextProps.quoteAsset && (
        nextProps.baseAsset.id !== this.props.baseAsset.id ||
        nextProps.quoteAsset.id !== this.props.quoteAsset.id
      )
    ) {
      this.setState({price: 0, amount: 0, total: 0});
    }
  }

  _onChangePrice(e) {
    let value = e.target.value;

    value = value.length > 1 && value.slice(0, 1) === 0 && value.slice(1, 2) !== '.'
      ? value.slice(1)
      : value;

    if (!isNaN(parseFloat(value)) && (isFinite(value) || value === '')) {
      let {baseAsset, quoteAsset} = this.props; /* eslint-disable-line */
      let {amount} = this.state;

      if (this._checkMaxPrecision(value, baseAsset.precision)) {
        return false;
      }

      let limitValue = market_utils.limitByPrecision(value, baseAsset);
      let total = amount * limitValue;

      this.setState({
        price: (limitValue)
          ? limitValue.trim()
          : 0,
        total: (amount && value)
          ? market_utils.limitByPrecision(total, baseAsset)
          : 0
      });
    }
  }

  _onChangeAmount(e) {
    let value = e.target.value;

    value = value.length > 1 && value.slice(0, 1) === 0 && value.slice(1, 2) !== '.'
      ? value.slice(1)
      : value;

    if (!isNaN(parseFloat(value)) && (isFinite(value) || value === '')) {
      let {baseAsset, quoteAsset} = this.props;
      let {price} = this.state;

      if (this._checkMaxPrecision(value, quoteAsset.precision)) {
        return false;
      }

      let limitAmount = market_utils.limitByPrecision(value, quoteAsset);
      let total = limitAmount * price;

      this.setState({
        amount: (limitAmount)
          ? limitAmount.trim()
          : 0,
        total: (price && value)
          ? market_utils.limitByPrecision(total, baseAsset)
          : 0
      });
    }

  }

  _onChangeTotal(e) {
    let value = e.target.value;

    value = value.length > 1 && value.slice(0, 1) === 0 && value.slice(1, 2) !== '.'
      ? value.slice(1)
      : value;

    let {quoteAsset, baseAsset} = this.props;
    let {price} = this.state;

    if (!isNaN(parseFloat(value)) && (isFinite(value) || value === '')) {
      if (this._checkMaxPrecision(value, baseAsset.precision)) {
        return false;
      }

      let limitTotal = market_utils.limitByPrecision(value, baseAsset);

      this.setState({
        total: (limitTotal)
          ? limitTotal.trim()
          : 0,
        amount: (price && value)
          ? market_utils.limitByPrecision(limitTotal / price, quoteAsset)
          : 0
      });

    }
  }

  _checkMaxPrecision(value, precision) {
    let valueString = value.toString();
    let splitString = valueString.split('.');

    if (splitString.length === 2 && splitString[1].length > precision) {
      return true;
    }

    return false;
  }

  _onSubmit(e) { /* eslint-disable-line */
    let {tradeAsset, walletLocked} = this.props;

    if (this.__validateOrder(true)) {
      let isPredictionMarket = (tradeAsset.bitasset && tradeAsset.bitasset.is_prediction_market); /* eslint-disable-line */

      // TODO if (type === "sell" && isPredictionMarket && short) {     return
      // this._createPredictionShort(buyAsset, sellAsset, buyAssetAmount,
      // sellAssetAmount, feeID); }

      this.__createOrder(walletLocked);
    }
  }

  __countFee() {
    let {coreAsset, tradeAsset} = this.props;

    let fee = utils.estimateFee('limit_order_create', [], ChainStore.getObject('2.0.0')) || 0;

    if (!tradeAsset || tradeAsset.id === '1.3.0') {
      return fee;
    } else {
      let toRate = tradeAsset.options.core_exchange_rate,
        fromRate = coreAsset.options.core_exchange_rate;

      let price = utils.convertPrice(fromRate, toRate, coreAsset.id, tradeAsset.id);
      let eqValue = utils.convertValue(price, fee, coreAsset, tradeAsset);

      return Math.floor(eqValue + 0.5);
    }
  }

  __validateOrder(showNotification) {
    let {tradeAsset, balance} = this.props;
    let {price, amount, total} = this.state;

    if (price <= 0 || amount <= 0 || total <= 0) {
      if (showNotification) {
        // this.props.setNotification({ 	message: "Price, amount and total should be
        // specified", 	level: "error" });
      }

      return false;
    }

    let paymentPrecision = utils.get_asset_precision(tradeAsset.precision);
    let totalFormatted = total * paymentPrecision;

    if (balance.available < totalFormatted) {
      if (showNotification) {
        // notify.addNotification({ 	message: "Insufficient funds to place order.
        // Required: " + total + " " + tradeAsset.symbol, 	level: "error" });
      }

      return false;
    }

    let fee = this.__countFee();
    let sum = fee + totalFormatted;

    if (balance.available < sum) {
      if (showNotification) {
        // notify.addNotification({ 	message: "Insufficient funds pay fees. Required: "
        // + (sum / paymentPrecision) + " " + tradeAsset.symbol, 	level: "error" });
      }

      return false;
    }

    return true;
  }

  __createOrder(walletLocked) {
    if (!this.__validateOrder()) {
      return;
    }

    let {operationType, walletModalOpened} = this.props;

    if (walletLocked && !walletModalOpened) {
      this.props.setWalletPosition(true);
      return;
    }

    if (walletLocked) {
      return;
    }

    console.info(`[Create order ${operationType}]`);
    let expiration = new Date();
    expiration.setYear(expiration.getFullYear() + 5);
    let {currentAccount, baseAsset, quoteAsset} = this.props;
    let {amount, total} = this.state;

    let sellAsset = (operationType === 'buy'
        ? baseAsset
        : quoteAsset),
      buyAsset = (operationType === 'buy'
        ? quoteAsset
        : baseAsset),
      sellAmount = utils.get_satoshi_amount((operationType === 'buy'
        ? total
        : amount), sellAsset),
      buyAmount = utils.get_satoshi_amount((operationType === 'buy'
        ? amount
        : total), buyAsset);

    MarketRepository
      .createOrder(currentAccount, sellAmount, sellAsset, buyAmount, buyAsset, expiration, false)
      .then((tr) => {
        tr.set_required_fees(sellAsset.id).then(() => {
          AssetRepository
            .fetchAssetsByIds([sellAsset.id])
            .then((assets) => {
              this.props.setTransaction('limit_order_create', {
                operationType: operationType,
                amount_to_sell: {
                  amount: sellAmount,
                  asset_id: sellAsset.id
                },
                min_to_receive: {
                  amount: buyAmount,
                  asset_id: buyAsset.id
                },
                seller: currentAccount,
                expiration: expiration,
                fee: {
                  amount: tr.operations[0][1].fee.amount,
                  asset: assets[0]
                },
                proposedOperation: `Place order to ${operationType} ${amount} ${quoteAsset.symbol}`,
                transactionFunction: SendPageActions.transferTransaction,
                transactionObject: tr,
                functionArguments: tr
              });

              this.setState({price: 0, amount: 0, total: 0});
            });
        });
      });
  }

  render() {
    let {quoteAsset, baseAsset, balance, tradeAsset, operationType} = this.props;
    let {price, amount, total} = this.state;

    let balanceAmount = 0,
      balancePrecision = 1;

    if (balance && balance.available) {
      balancePrecision = balance.asset.precision;

      let balanceCoefficient = utils.get_asset_precision(balance.asset.precision);
      balanceAmount = !isNaN(balance.available / balanceCoefficient)
        ? (balance.available / balanceCoefficient)
        : 0;
    }

    return (
      <section className='section'>
        <div className='section__title'>
          <Translate content={ 'exchange.' + operationType }/>
          <AssetName asset={ quoteAsset }/>
        </div>
        <div className='section__form'>
          <div className='row5 clearfix'>
            <div className='col col-ex-label'>
              <label className='label label-fsz-sm'>
                <Translate content='exchange.price'/>
              </label>
            </div>
            <div className='col col-ex-field'>
              <input
                type='text'
                className='field field-type4'
                value={ price }
                onChange={ this._onChangePrice.bind(this) }/>
            </div>
            <div className='col col-ex-mark'>
              <div className={ classNames('btn', 'btn-mark2', operationType) }>
                <AssetName asset={ baseAsset }/>
              </div>
            </div>
          </div>
          <div className='row5 clearfix'>
            <div className='col col-ex-label'>
              <label className='label label-fsz-sm'>
                <Translate content='exchange.quantity'/>
              </label>
            </div>
            <div className='col col-ex-field'>
              <input
                type='text'
                className='field field-type4'
                value={ amount }
                onChange={ this._onChangeAmount.bind(this) }/>
            </div>
            <div className='col col-ex-mark'>
              <div className={ classNames('btn', 'btn-mark2', operationType) }>
                <AssetName asset={ quoteAsset }/>
              </div>
            </div>
          </div>
          <div className='row4 clearfix'>
            <div className='col col-ex-label'>
              <label className='label label-fsz-sm'><Translate content='exchange.total'/></label>
            </div>
            <div className='col col-ex-field'>
              <input
                type='text'
                className='field field-type4'
                value={ total }
                onChange={ this._onChangeTotal.bind(this) }/>
            </div>
            <div className='col col-ex-mark'>
              <div className={ classNames('btn', 'btn-mark2', operationType) }>
                <AssetName asset={ baseAsset }/>
              </div>
            </div>
          </div>
          <div className='row5 clearfix'>
            <div className='col col-ex-label'>
              <label className='label'>
                <Translate content='exchange.balance'/>:
              </label>
            </div>
            <div className='col col-ex-field ov'>
              <button
                className={ classNames('btn', 'btn-sm', 'pull-right', 'btn-' + operationType) }
                onClick={ this._onSubmit.bind(this) }>
                <Translate content={ 'exchange.' + operationType }/>
                <AssetName asset={ quoteAsset }/>
              </button>
              <div className='text'>
                <FormattedNumber
                  value={ balanceAmount }
                  minimumFractionDigits={ 0 }
                  maximumFractionDigits={ balancePrecision }/>
                <AssetName asset={ tradeAsset }/>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

@connect((state) => {
  return {
    baseAsset: state.exchangePageReducer.baseAsset,
    quoteAsset: state.exchangePageReducer.quoteAsset,
    baseAssetBalance: state.exchangePageReducer.baseAssetBalance,
    quoteAssetBalance: state.exchangePageReducer.quoteAssetBalance
  };
}, {})
export default class ExchangeTrade extends React.Component {
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
