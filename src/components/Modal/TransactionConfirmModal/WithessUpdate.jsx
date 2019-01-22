import React from 'react';
import Translate from 'react-translate-component';
import {connect} from 'react-redux';

class WitnessUpdate extends React.Component {
  render() {
    return (
      <div className='mConf__content'>
        <div className='mConf__title'>
          <Translate content='transaction.trxTypes.witness_update' />
        </div>
        <div className='mConf__table'>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='explorer.block.witness' /></div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.witness_account}
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
    witness_account : state.transactionConfirm.transaction.witness_account
  };
};

export default connect(mapStateToProps)(WitnessUpdate);
