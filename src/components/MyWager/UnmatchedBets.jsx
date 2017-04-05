import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { LoadingStatus } from '../../constants';
var I18n = require('react-redux-i18n').I18n;
import { List } from 'immutable';
import './MyWager.less';

class UnmatchedBets extends PureComponent {
  render() {
    const { columns, unmatchedBets, unmatchedBetsLoadingStatus, currencyFormat, betsTotal } = this.props;
    return (
      <div>
        <div className='top-data clearfix'>
          <div className='float-left'>
            <p className='font16'>{ I18n.t('mybets.total') } : { (currencyFormat === 'BTC' ? 'Ƀ ' : 'm ') + (betsTotal ? betsTotal : 0) }</p>
          </div>
          <div className='float-right'>
            <div className='float-right'>
              { /* cancel all To be done */ }
              <a className='btn cancel-btn' href='' disabled={ unmatchedBets && unmatchedBets.length === 0 }>{ I18n.t('mybets.cancel_all') }</a>
            </div>
          </div>
          <div className='right-left'></div>
        </div>
        <Table className='bookie-table' pagination={ { pageSize: 10 } } rowKey='id'
          locale={ {emptyText: ( unmatchedBets && unmatchedBets.length === 0 &&
            unmatchedBetsLoadingStatus === LoadingStatus.DONE ? I18n.t('mybets.nodata') : unmatchedBetsLoadingStatus )} }
          dataSource={ List(unmatchedBets).toJS() } columns={ columns } />
      </div>
    )
  }
}

export default UnmatchedBets;
