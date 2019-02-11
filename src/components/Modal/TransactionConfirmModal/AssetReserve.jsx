//unused
import React from 'react';
import Translate from 'react-translate-component';
import {connect} from 'react-redux';

class AssetReserve extends React.Component {
  render() {
    return (
      <div className='mConf__content'>
        <div className='mConf__title'>
          <Translate content='transaction.trxTypes.asset_reserve' />
        </div>
        <div className='mConf__table'>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='modal.reserve.from' /></div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.payer}
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='explorer.asset.title' /></div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.amount_to_reserve.asset_id}
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='transfer.amount' /></div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.amount_to_reserve.amount}
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
    amount_to_reserve : state.transactionConfirm.transaction.amount_to_reserve
  };
};

export default connect(mapStateToProps)(AssetReserve);
