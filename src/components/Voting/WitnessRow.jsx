import React from 'react';
import {connect} from 'react-redux';
import TimeAgo from '../Utility/TimeAgo';
import FormattedAsset from '../Utility/FormattedAsset';

class WitnessRow extends React.Component {
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.mostRecent !== this.props.mostRecent
    );
  }

  render() {
    let {witnessAccount, witness, rank, asset, blockInterval} = this.props;

    if (!witness ) {
      return null;
    }

    let lastAsloteTime = new Date(
      Date.now() - ((this.props.mostRecent - witness.last_aslot ) * blockInterval * 1000)
    );

    return (
      <div className='tableRow'>
        <div className='tableCell'>{rank}</div>
        <div className='tableCell'>{witnessAccount.name}</div>
        <div className='tableCell light text_r'><TimeAgo time={ new Date(lastAsloteTime) }/></div>
        <div className='tableCell text_r'>{witness.last_confirmed_block_num}</div>
        <div className='tableCell text_r'>{witness.total_missed}</div>
        <div className='tableCell text_r'>
          <FormattedAsset
            amount={ witness.total_votes }
            asset={ asset.id }
            decimalOffset={ asset.precision } /> {asset.symbol}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    asset: state.voting.witnesses.asset,
    blockInterval: state.voting.witnesses.blockInterval,
    mostRecent: state.voting.witnesses.currentAslot
  };
};

export default connect(mapStateToProps)(WitnessRow);
