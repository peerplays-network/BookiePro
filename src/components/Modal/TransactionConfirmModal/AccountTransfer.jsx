import React from 'react';
import Translate from 'react-translate-component';
import {connect} from 'react-redux';

class AccountTransfer extends React.Component {
  render() {
    return (
      <div className='mConf__content'>
        <div className='mConf__title'>
          <Translate content='transaction.trxTypes.account_transfer' />
        </div>
        <div className='mConf__table'>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='transfer.from' /></div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.account}
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
  };
};

export default connect(mapStateToProps)(AccountTransfer);
