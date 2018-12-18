import React from 'react';
import {connect} from 'react-redux';
import utils from 'common/utils';
import {FormattedDate} from 'react-intl';
import Translate from 'react-translate-component';

class RecentBlocks extends React.Component {
  render() {
    let {latestBlocks} = this.props,
      blocks = latestBlocks.map((block) => {
        return (
          <div className='tableRow' key={ block.id }>
            <div className='tableCell'>#{utils.format_number(block.id, 0)}</div>
            <div className='tableCell text__gray text_r'>
              <FormattedDate value={ block.timestamp } format='time'/>
            </div>
            <div className='tableCell'>{block.witness_account_name}
              - {block.witness}</div>
            <div className='tableCell text_r'>
              {utils.format_number(block.transactions.length, 0)}
            </div>
          </div>
        );
      }).toArray();

    return (
      <div className='table__section'>
        <h2 className='h2'><Translate
          className=''
          content='explore.blockchain.recent_blocks.title'
          component='span'/>
        </h2>

        <div className='table table2 table-db-rec-blocks'>
          <div className='table__head tableRow'>
            <div className='tableCell'>
              <Translate
                className=''
                content='explore.blockchain.recent_blocks.block_id'
                component='span'/>
            </div>
            <div className='tableCell text_r'>
              <Translate
                className=''
                content='explore.blockchain.recent_blocks.date'
                component='span'/>
            </div>
            <div className='tableCell'>
              <Translate
                className=''
                content='explore.blockchain.recent_blocks.witness'
                component='span'/>
            </div>
            <div className='tableCell text_r'>
              <Translate
                className=''
                content='explore.blockchain.recent_blocks.transaction_count'
                component='span'/>
            </div>
          </div>
          <div className='table__body'>
            {blocks}
          </div>
        </div>
      </div>
    );
  }
}

RecentBlocks = connect((state) => {
  return {latestBlocks: state.explorerBlockchainPage.latestBlocks};
})(RecentBlocks);

export default RecentBlocks;