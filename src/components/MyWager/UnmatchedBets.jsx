import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { LoadingStatus } from '../../constants';
var I18n = require('react-redux-i18n').I18n;
import { List } from 'immutable';
import './MyWager.less';

class UnmatchedBets extends PureComponent {
  render() {
    const { columns, unmatchedBets, unmatchedBetsLoadingStatus, currencyFormat, betsTotal, cancelBet,
      cancelAllBets } = this.props;
    //cancel column added here to attach bet cancel click event handler
    if(columns)
      columns.push(
        {
          title: '',
          dataIndex: 'cancel',
          key: 'cancel',
          onCellClick: function(record, event){cancelBet(record, event);}
        }
      );
    return (
      <div>
        <div className='top-data clearfix'>
          <div className='float-left'>
            <p className='font16'>{ I18n.t('mybets.total') } : { (currencyFormat === 'BTC' ? 'Ƀ ' : 'm ') + (betsTotal ? betsTotal : 0) }</p>
          </div>
          <div className='float-right'>
            <div className='float-right'>
              <button className='btn cancel-btn' onClick={ cancelAllBets }
                disabled={ unmatchedBets && unmatchedBets.size === 0 }>{ I18n.t('mybets.cancel_all') }</button>
            </div>
          </div>
          <div className='right-left'></div>
        </div>
        <Table className='bookie-table' pagination={ { pageSize: 10 } } rowKey='id'
          locale={ {emptyText: ( unmatchedBets && unmatchedBets.size === 0 &&
            unmatchedBetsLoadingStatus === LoadingStatus.DONE ? I18n.t('mybets.nodata') : unmatchedBetsLoadingStatus )} }
          dataSource={ List(unmatchedBets).toJS() } columns={ columns } >
        </Table>
      </div>
    )
  }
}

export default UnmatchedBets;
