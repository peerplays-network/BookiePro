import React from 'react';
import Translate from 'react-translate-component';
import {connect} from 'react-redux';
import FormattedAsset from '../Utility/FormattedAsset';

class AssetBurn extends React.Component {
  render() {
    return (
      <div className='mConf__content'>
        <div className='mConf__title'><Translate content='transaction.trxTypes.asset_burn' /></div>
        <div className='mConf__table'>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='explorer.account.title' /></div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.payer}
              </span>
            </div>
          </div>

          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='transfer.amount' /></div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                <FormattedAsset
                  amount={ this.props.amount_to_burn.amount }
                  asset={ this.props.amount_to_burn.asset_id }
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    payer : state.transactionConfirm.transaction.payer,
    amount_to_burn : state.transactionConfirm.transaction.amount_to_burn
  };
};

export default connect(mapStateToProps)(AssetBurn);
