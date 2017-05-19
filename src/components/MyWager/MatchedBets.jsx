import React, { Component } from 'react';
import { Table } from 'antd';
import { LoadingStatus } from '../../constants';
import { I18n } from 'react-redux-i18n';
import { List } from 'immutable';
import './MyWager.less';

class MatchedBets extends Component {
  render() {
    const { columns, matchedBets, matchedBetsLoadingStatus, currencyFormat, betsTotal } = this.props;
    return (
      <div className='table-card'>
        <div className='filterComponent'>
          <div className='float-left'>
            <p className='card-title'>
              { I18n.t('mybets.total') + ' : ' + currencyFormat + (betsTotal ? betsTotal : 0) }
            </p>
          </div>
        </div>
          <Table className='bookie-table' pagination={ { pageSize: 20 } } rowKey='id'
            locale={ {emptyText: ( matchedBets && matchedBets.length === 0 &&
              matchedBetsLoadingStatus === LoadingStatus.DONE ? I18n.t('mybets.nodata') : matchedBetsLoadingStatus )} }
              dataSource={ List(matchedBets).toJS() } columns={ columns } />
      </div>
    )
  }
}

export default MatchedBets;
