import React from 'react';
import {connect} from 'react-redux';
import utils from 'common/utils';
import {FormattedNumber, FormattedRelative} from 'react-intl';
import counterpart from 'counterpart';
import moment from 'moment-timezone';

class Statistics extends React.Component {
  render() {
    let {
      head_block_number,
      active_witnesses,
      active_committee_members,
      recently_missed_count,
      current_supply,
      confidential_supply,
      avgTime,
      time,
      trxPerSec,
      trxPerBlock,
      coreAsset
    } = this.props;

    let precision = utils.get_asset_precision(coreAsset.get('precision')),
      decimals = Math.max(0, coreAsset.get('precision') - 5),
      symbol = coreAsset.get('symbol');

    return (
      <div className='tab__deployHead'>
        <div className='title'>
          {counterpart.translate('explore.statistic.title')}
        </div>
        <div className='assets__list assets__list-inside'>
          <div className='assets__item col col-2'>
            <div className='assets__label'>
              {counterpart.translate('explore.statistic.current_block')}
            </div>
            <div className='assets__labeled'>#{utils.format_number(head_block_number, 0)}</div>
          </div>
          <div className='assets__item col col-2 text_r'>
            <div className='assets__label'>
              {counterpart.translate('explore.statistic.last_block')}
            </div>
            <div className='assets__labeled'>
              <FormattedRelative
                updateInterval={ 500 }
                value={ parseInt(moment.utc(time).format('x')) }
                initialNow={ parseInt(moment.utc().format('x')) }/>
            </div>
          </div>
          <div className='assets__item col col-2 text_r'>
            <div className='assets__label'>
              {counterpart.translate('explore.statistic.trx_s')}
            </div>
            <div className='assets__labeled'>
              {utils.format_number(trxPerSec, 2)}
            </div>
          </div>
          <div className='assets__item col col-2 text_r'>
            <div className='assets__label'>
              {counterpart.translate('explore.statistic.average_confirmation_time')}
            </div>
            <div className='assets__labeled mark'>{utils.format_number(avgTime / 2, 2)}s</div>
          </div>
          <div className='assets__item col col-2 text_r'>
            <div className='assets__label'>
              {counterpart.translate('explore.statistic.active_witness')}
            </div>
            <div className='assets__labeled mark'>{active_witnesses.size}</div>
          </div>
        </div>
        <div className='assets__list assets__list-inside'>
          <div className='assets__item col col-2'>
            <div className='assets__label'>
              {counterpart.translate('explore.statistic.active_comittee_members')}
            </div>
            <div className='assets__labeled'>{active_committee_members.size}</div>
          </div>
          <div className='assets__item col col-2 text_r'>
            <div className='assets__label'>
              {counterpart.translate('explore.statistic.trx_block')}
            </div>
            <div className='assets__labeled'>{utils.format_number(trxPerBlock, 2)}</div>
          </div>
          <div className='assets__item col col-2 text_r'>
            <div className='assets__label'>
              {counterpart.translate('explore.statistic.recently_missed_blocks')}
            </div>
            <div className='assets__labeled'>{recently_missed_count}</div>
          </div>
          <div className='assets__item col col-2 text_r'>
            <div className='assets__label'>
              {counterpart.translate('explore.statistic.current_supply')}
            </div>
            <div className='assets__labeled mark'>
              <FormattedNumber
                value={ current_supply
                  ? current_supply / precision
                  : 0 }
                minimumFractionDigits={ 0 }
                maximumFractionDigits={ decimals }/>
              <div className='assets__unit'>{symbol}</div>
            </div>
          </div>
          <div className='assets__item col col-2 text_r'>
            <div className='assets__label'>
              {counterpart.translate('explore.statistic.stealth_supply')}
            </div>
            <div className='assets__labeled mark'>
              <FormattedNumber
                value={ confidential_supply
                  ? confidential_supply / precision
                  : 0 }
                minimumFractionDigits={ 0 }
                maximumFractionDigits={ decimals }/>
              <div className='assets__unit'>{symbol}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    head_block_number : state.explorerBlockchainPage.head_block_number,
    active_witnesses : state.explorerBlockchainPage.active_witnesses,
    active_committee_members : state.explorerBlockchainPage.active_committee_members,
    recently_missed_count : state.explorerBlockchainPage.recently_missed_count,
    current_supply : state.explorerBlockchainPage.current_supply,
    confidential_supply : state.explorerBlockchainPage.confidential_supply,
    trxPerSec : state.explorerBlockchainPage.trxPerSec,
    trxPerBlock : state.explorerBlockchainPage.trxPerBlock,
    avgTime : state.explorerBlockchainPage.avgTime,
    updatedAt : state.explorerBlockchainPage.updatedAt,
    time : state.explorerBlockchainPage.time,
    coreAsset : state.explorerBlockchainPage.coreAsset
  };
};

export default connect(mapStateToProps)(Statistics);