import React from 'react';
import Translate from 'react-translate-component';
import {connect} from 'react-redux';
import asset_utils from 'common/asset_utils';

@connect((state) => {
  return {
    asset: state.transactionConfirm.transaction.asset,
    account: state.transactionConfirm.transaction.account,
    transaction: state.transactionConfirm.transaction.transactionObject,
  };
})
class VestingBalanceWithdraw extends React.Component {
  render() {
    let {account, transaction, asset} = this.props;
    let trx = transaction.serialize();
    let operation;

    if (trx.operations.length && trx.operations[0][1]) {
      operation = trx.operations[0][1];
    } else {
      return null;
    }

    let amountValue = asset && operation.amount.amount
      ? operation.amount.amount / Math.pow(10, asset.precision)
      : 0;
    let amountFeeValue = asset && operation.fee.amount
      ? operation.fee.amount / Math.pow(10, asset.precision)
      : 0;

    return (
      <div className='mConf__content'>
        <div className='mConf__table'>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='transfer.to' /></div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {account ? account.get('name') : ''}
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='transfer.amount' /></div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {
                  amountValue
                    ? amountValue
                    : operation.buy_in.amount.amount
                } / {
                  asset
                    ? asset_utils.getSymbol(asset.symbol)
                    : operation.amount.asset_id
                }
              </span>
            </div>
          </div>
          <div  className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='transfer.fee' /></div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {
                  amountFeeValue
                    ? amountFeeValue
                    : operation.fee.amount
                } / {
                  asset
                    ? asset_utils.getSymbol(asset.symbol)
                    : operation.fee.asset_id
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default VestingBalanceWithdraw;
