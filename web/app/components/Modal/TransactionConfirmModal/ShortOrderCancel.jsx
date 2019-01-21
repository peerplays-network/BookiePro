import React from 'react';
import Translate from 'react-translate-component';
import {connect} from 'react-redux';

class ShortOrderCancel extends React.Component {
  render() {
    return (
      <div className='mConf__content'>
        <div className='mConf__title'>
          <Translate content='transaction.trxTypes.short_order_cancel' />
        </div>
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
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    order: state.transactionConfirm.transaction.order,
    fee_paying_account: state.transactionConfirm.transaction.fee_paying_account
  };
};

export default connect(mapStateToProps)(ShortOrderCancel);
