//unused
import React from 'react';
import Translate from 'react-translate-component';
import {connect} from 'react-redux';
import FormattedAsset from '../Utility/FormattedAsset';

class AssetClaimFees extends React.Component {
  render() {
    return (
      <div className='mConf__content'>
        <div className='mConf__title'>
          <Translate content='transaction.trxTypes.asset_claim_fees' />
        </div>
        <div className='mConf__table'>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='transaction.claimed' /></div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                <FormattedAsset
                  amount={ this.props.amount_to_claim.amount }
                  asset={ this.props.amount_to_claim.asset_id }
                />
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='transaction.deposit_to' /></div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.issuer}
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
    amount_to_claim: state.transactionConfirm.transaction.amount_to_claim,
    issuer: state.transactionConfirm.transaction.issuer
  };
};

export default connect(mapStateToProps)(AssetClaimFees);
