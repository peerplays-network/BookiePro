import React from 'react';
import Translate from 'react-translate-component';
import {connect} from 'react-redux';
import FormattedAsset from '../Utility/FormattedAsset';
class CallOrderUpdate extends React.Component {
  render() {
    return (
      <div className='mConf__content'>
        <div className='mConf__title'>
          <Translate content='transaction.trxTypes.call_order_update' />
        </div>
        <div className='mConf__table'>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'>
              <Translate content='transaction.funding_account' />
            </div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.funding_account}
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'>
              <Translate content='transaction.delta_collateral'/>
            </div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                <FormattedAsset
                  amount={ this.props.delta_collateral.amount }
                  asset={ this.props.delta_collateral.asset_id }
                />
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='transaction.delta_debt' /></div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                <FormattedAsset
                  amount={ this.props.delta_debt.amount }
                  asset={ this.props.delta_debt.asset_id }
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
    funding_account: state.transactionConfirm.transaction.funding_account,
    delta_collateral: state.transactionConfirm.transaction.delta_collateral,
    delta_debt: state.transactionConfirm.transaction.delta_debt
  };
};

export default connect(mapStateToProps)(CallOrderUpdate);
