import React from 'react';
import Translate from 'react-translate-component';
import {connect} from 'react-redux';
import FormattedAsset from '../Utility/FormattedAsset';
import Inspector from 'react-json-inspector';

class TransferFromBlind extends React.Component {
  render() {
    return (
      <div className='mConf__content'>
        <div className='mConf__title'>
          <Translate content='transaction.trxTypes.transfer_from_blind' />
        </div>
        <div className='mConf__table'>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='transfer.to' /></div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.to}
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
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'>
              <Translate content='transaction.blinding_factor' />
            </div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.blinding_factor}
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='transaction.outputs' /></div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                <Inspector data={ this.props.outputs } search={ false } />
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
    amount: state.transactionConfirm.transaction.amount,
    to: state.transactionConfirm.transaction.to,
    blinding_factor: state.transactionConfirm.transaction.blinding_factor,
    outputs: state.transactionConfirm.transaction.outputs
  };
};

export default connect(mapStateToProps)(TransferFromBlind);
