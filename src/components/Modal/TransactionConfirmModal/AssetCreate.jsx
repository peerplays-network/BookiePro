//unused
import React from 'react';
import Translate from 'react-translate-component';
import {connect} from 'react-redux';
import utils from 'common/utils';
import Inspector from 'react-json-inspector';

class AssetCreate extends React.Component {
  render() {
    return (
      <div className='mConf__content'>
        <div className='mConf__title'>
          <Translate content='transaction.trxTypes.asset_create' />
        </div>
        <div className='mConf__table'>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='explorer.assets.issuer' /></div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.op.issuer}
              </span>
            </div>
          </div>

          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='explorer.assets.symbol' /></div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.op.symbol}
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'>
              <Translate content='explorer.assets.precision' />
            </div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.op.precision}
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'>
              <Translate content='account.user_issued_assets.max_supply' />
            </div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {utils.format_asset(this.props.op.common_options.max_supply, this.props.op)}
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'>
              <Translate content='account.user_issued_assets.description' />
            </div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.op.common_options.description}
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='transaction.market_fee' /></div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.op.common_options.market_fee_percent / 100}%
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'>
              <Translate content='transaction.max_market_fee' />
            </div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {utils.format_asset(this.props.op.common_options.max_market_fee,this.props.op)}
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'>
              <Translate content='explorer.block.common_options' />
            </div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                <Inspector data={ this.props.op } search={ false } />
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
    op: state.transactionConfirm.transaction.op
  };
};

export default connect(mapStateToProps)(AssetCreate);
