import React from 'react';
import Translate from 'react-translate-component';
import {connect} from 'react-redux';

class AssetUpdateFeedProducers extends React.Component {
  render() {
    let producers = [];

    this.props.new_feed_producers.forEach((producer) => {
      producers.push(<div>{producer}<br/></div>);
    });
    return (
      <div className='mConf__content'>
        <div className='mConf__title'>
          <Translate content='transaction.trxTypes.asset_update_feed_producers'/>
        </div>
        <div className='mConf__table'>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'>
              <Translate content='explorer.block.asset_update'/>
            </div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.asset_to_update}
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'>
              <Translate content='explorer.block.new_producerse'/>
            </div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {producers}
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
    new_feed_producers: state.transactionConfirm.transaction.new_feed_producers,
    asset_to_update: state.transactionConfirm.transaction.asset_to_update
  };
};

export default connect(mapStateToProps)(AssetUpdateFeedProducers);
