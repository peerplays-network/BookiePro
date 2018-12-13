import React from 'react';
import Translate from 'react-translate-component';
import {connect} from 'react-redux';
import {FormattedNumber} from 'react-intl';
import assetUtils from 'common/asset_utils';

@connect((state) => {
  return {
    nameFrom: state.transactionConfirm.transaction.nameFrom,
    nameTo: state.transactionConfirm.transaction.nameTo,
    amount: state.transactionConfirm.transaction.amount,
    fee: state.transactionConfirm.transaction.fee
  };
})
class Transfer extends React.Component {
  render() {
    const {amount, fee} = this.props;
    const amountValue = (
      amount.amount && !isNaN(amount.amount / Math.pow(10,amount.asset.precision)))
      ? (amount.amount / Math.pow(10,amount.asset.precision))
      : 0;
    let feeValue = fee
      ? fee.amount / Math.pow(10, fee.asset.precision)
      : 0;
    let feeSymbol = this.props.fee
      ? this.props.fee.asset.symbol
      : null;

    return (
      <div className='mConf__table'>
        <div className='mConf__tableRow'>
          <div className='mConf__tableLeft'><Translate content='transaction.from' /></div>
          <div className='mConf__tableRight'>
            <span className='mark2'>{this.props.nameFrom}</span>
          </div>
        </div>
        <div className='mConf__tableRow'>
          <div className='mConf__tableLeft'><Translate content='transaction.to' /></div>
          <div className='mConf__tableRight'>
            <span className='mark2'>{this.props.nameTo}</span>
          </div>
        </div>
        <div className='mConf__tableRow'>
          <div className='mConf__tableLeft'><Translate content='transfer.amount' /></div>
          <div className='mConf__tableRight'>
            <FormattedNumber
              value={ amountValue }
              minimumFractionDigits={ 0 }
              maximumFractionDigits={ this.props.amount.asset.precision }
            /> {assetUtils.getSymbol(this.props.amount.asset.symbol)}
          </div>
        </div>
        <div className='mConf__tableRow'>
          <div className='mConf__tableLeft'><Translate content='transfer.fee' /></div>
          <div className='mConf__tableRight'>
            <FormattedNumber
              value={ feeValue }
              minimumFractionDigits={ 0 }
              maximumFractionDigits={ fee.asset.precision }
            /> {assetUtils.getSymbol(feeSymbol)}
          </div>
        </div>
      </div>
    );
  }
}

export default Transfer;
