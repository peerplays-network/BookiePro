import React from 'react';
import Translate from 'react-translate-component';
import {connect} from 'react-redux';
import assetUtils from 'common/asset_utils';
import {FormattedNumber} from 'react-intl';

class LimitOrderCancel extends React.Component {
  render() {
    let feeValue = this.props.fee
      ? this.props.fee.amount / Math.pow(10, this.props.fee.asset.precision)
      : 0;
    let feeSymbol = this.props.fee
      ? this.props.fee.asset.symbol
      : null;

    return (
      <div className='mConf__content'>
        <div className='mConf__table'>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='transaction.order_id' /></div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.order}
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='explorer.block.fee_payer' /></div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.fee_paying_account}
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='transfer.fee' /></div>
            <div className='mConf__tableRight'>
              <FormattedNumber
                value={ feeValue }
                minimumFractionDigits={ 0 }
                maximumFractionDigits={ this.props.fee.asset.precision }
              /> {assetUtils.getSymbol(feeSymbol)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    order: state.transactionConfirm.transaction.order,
    fee_paying_account: state.transactionConfirm.transaction.fee_paying_account,
    fee: state.transactionConfirm.transaction.fee
  };
};

export default connect(mapStateToProps)(LimitOrderCancel);
