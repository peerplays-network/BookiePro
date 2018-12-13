import React from 'react';
import Translate from 'react-translate-component';
import {connect} from 'react-redux';
import FormattedAsset from '../Utility/FormattedAsset';

@connect((state) => {
  return {
    from_account: state.transactionConfirm.transaction.from_account,
    asset_id: state.transactionConfirm.transaction.asset_id,
    amount: state.transactionConfirm.transaction.amount
  };
})
class AssetFundFeePool extends React.Component {
  render() {
    return (
      <div className='mConf__content'>
        <div className='mConf__title'>
          <Translate content='transaction.trxTypes.asset_fund_fee_pool' />
        </div>
        <div className='mConf__table'>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='explorer.account.title' /></div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.from_account}
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='explorer.asset.title' /></div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.asset_id}
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='transfer.amount' /></div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                <FormattedAsset amount={ this.props.amount } asset='1.3.0' />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AssetFundFeePool;
