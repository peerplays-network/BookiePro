import React from 'react';
import Translate from 'react-translate-component';
import {connect} from 'react-redux';

@connect((state) => {
  return {
    fee_paying_account: state.transactionConfirm.transaction.fee_paying_account,
    key_data: state.transactionConfirm.transaction.key_data
  };
})
class KeyCreate extends React.Component {
  render() {
    return (
      <div className='mConf__content'>
        <div className='mConf__title'><Translate content='transaction.trxTypes.key_create' /></div>
        <div className='mConf__table'>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'>
              <Translate content='explorer.block.fee_payer' />
            </div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.fee_paying_account}
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='explorer.block.key' /></div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.key_data}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default KeyCreate;
