import React, { PureComponent } from 'react';
import { Table, LocaleProvider } from 'antd';
import { LoadingStatus } from '../../constants';
import { I18n } from 'react-redux-i18n';
import { List } from 'immutable';
import './MyWager.less';
import _ from 'lodash';

class UnmatchedBets extends PureComponent {
  render() {
    const { columns, unmatchedBets, unmatchedBetsLoadingStatus, currencyFormat, betsTotal, cancelBet,
      cancelAllBets } = this.props;
    let unmatchedBetsColumns = _.clone(columns);
    //cancel column added here to attach bet cancel click event handler
    if(unmatchedBetsColumns)
      unmatchedBetsColumns.push(
        {
          title: '',
          dataIndex: 'cancel',
          key: 'cancel',
          onCellClick: function(record, event){cancelBet(record, event);}
        }
      );
    return (
      <div className='table-card'>
        <div className='filterComponent clearfix'>
          <div className='float-left'>
            <p className='card-title'>{ I18n.t('mybets.total') } : { currencyFormat + (betsTotal ? betsTotal : 0) }</p>
          </div>
            <div className='float-right'>
              <button className='btn cancel-btn' onClick={ cancelAllBets }
                disabled={ unmatchedBets && unmatchedBets.size === 0 }>{ I18n.t('mybets.cancel_all') }</button>
            </div>
        </div>
        <LocaleProvider locale={ I18n.t('application.locale') }>
          <Table className='bookie-table' pagination={ { pageSize: 20 } } rowKey='id'
            locale={ {emptyText: ( unmatchedBets && unmatchedBets.size === 0 &&
              unmatchedBetsLoadingStatus === LoadingStatus.DONE ? I18n.t('mybets.nodata') : unmatchedBetsLoadingStatus )} }
            dataSource={ List(unmatchedBets).toJS() } columns={ unmatchedBetsColumns } >
          </Table>
        </LocaleProvider>
      </div>
    )
  }
}

export default UnmatchedBets;
