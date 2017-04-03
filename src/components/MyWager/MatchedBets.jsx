import React, { Component } from 'react';
import { Table } from 'antd';
import { LoadingStatus } from '../../constants';
var I18n = require('react-redux-i18n').I18n;
import { List } from 'immutable';
import './MyWager.less';

class MatchedBets extends Component {
  render() {
    const { columns, matchedBets, matchedBetsLoadingStatus, currencyFormat, betsTotal } = this.props;
    return (
      <div>
        <div className='top-data clearfix'>
          <div className='float-left'>
            <p className='font18 padding-tb-5'>
              { I18n.t('mybets.total') + ' : ' + (currencyFormat === 'BTC' ? 'Ƀ ' : 'm ') + betsTotal }
            </p>
          </div>
          <div className='right-left'></div>
        </div>
        <Table className='bookie-table' pagination={ { pageSize: 10 } } rowKey='id'
          locale={ {emptyText: ( matchedBets && matchedBets.length === 0 &&
            matchedBetsLoadingStatus === LoadingStatus.DONE ? I18n.t('mybets.nodata') : matchedBetsLoadingStatus )} }
            dataSource={ List(matchedBets).toJS() } columns={ columns } />
      </div>
    )
  }
}

export default MatchedBets;
