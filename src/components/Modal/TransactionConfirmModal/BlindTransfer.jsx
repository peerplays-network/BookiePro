import React from 'react';
import Translate from 'react-translate-component';
import {connect} from 'react-redux';
import Inspector from 'react-json-inspector';

class BlindTransfer extends React.Component {
  render() {
    return (
      <div className='mConf__content'>
        <div className='mConf__title'>
          <Translate content='transaction.trxTypes.blind_transfer' />
        </div>
        <div className='mConf__table'>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='transaction.inputs' /></div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                <Inspector data={ this.props.inputs } search={ false } />
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
    inputs: state.transactionConfirm.transaction.inputs,
    outputs: state.transactionConfirm.transaction.outputs
  };
};

export default connect(mapStateToProps)(BlindTransfer);
