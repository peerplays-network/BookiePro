import React from 'react';
import Translate from 'react-translate-component';
import {connect} from 'react-redux';
import asset_utils from 'common/asset_utils';

@connect((state) => {
  return {
    transaction: state.transactionConfirm.transaction.transactionObject,
    account_to_upgrade: state.transactionConfirm.transaction.account_to_upgrade,
    upgrade_to_lifetime_member: state.transactionConfirm.transaction.upgrade_to_lifetime_member,
    account: state.transactionConfirm.transaction.account,
    asset: state.transactionConfirm.transaction.asset
  };
})

class AccountUpgrade extends React.Component {
  render() {
    let transaction = this.props.transaction,
      asset = this.props.asset,
      operation;
    let trx = transaction.serialize();

    if (trx.operations.length && trx.operations[0][1]) {
      operation = trx.operations[0][1];
    } else {
      return null;
    }

    let amountFeeValue = asset && operation.fee.amount
      ? operation.fee.amount / Math.pow(10, asset.precision)
      : 0;

    return (
      <div className='mConf__content'>
        <div className='mConf__table'>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'>
              <Translate content='explorer.block.account_upgrade' />
            </div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {
                  this.props.account
                    ? this.props.account.get('name')
                    : this.props.account_to_upgrade
                }
              </span>
            </div>
          </div>

          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='explorer.block.lifetime' /></div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.upgrade_to_lifetime_member ? 'true' : 'false'}
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
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

export default AccountUpgrade;
