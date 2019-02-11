//unused
import React from 'react';
import Translate from 'react-translate-component';
import {connect} from 'react-redux';
import FormattedAsset from '../Utility/FormattedAsset';

class AssetSettle extends React.Component {
  render() {
    return (
      <div className='mConf__content'>
        <div className='mConf__title'>
          <Translate content='transaction.trxTypes.asset_settle'/>
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
                {this.props.amount.asset_id}
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='transfer.amount' /></div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                <FormattedAsset
                  amount={ this.props.amount.amount }
                  asset={ this.props.amount.asset_id }
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
    account : state.transactionConfirm.transaction.account,
    amount : state.transactionConfirm.transaction.amount
  };
};

export default connect(mapStateToProps)(AssetSettle);
