import React, { PureComponent } from 'react';
import { Table } from 'antd';
import './MyAccount.less';
import { LoadingStatus, TimeRangePeriodTypes } from '../../constants';
import { I18n } from 'react-redux-i18n';
import Export from '../Export';
import { CurrencyUtils } from '../../utility';
import TimeRangePicker from '../TimeRangePicker';
import PropTypes from 'prop-types';

const paginationParams = { pageSize: 20 };

class TransactionHistory extends PureComponent {
  render() {
    const { transactionHistory,transactionHistoryLoadingStatus,
      transactionHistoryExport,transactionHistoryExportLoadingStatus,
      exportButtonClicked,resetTransactionHistoryExportLoadingStatus,clearTransactionHistoryExport,
      handleSearchClick,handleExportClick } = this.props;

    const hasNoTransactionHistoryData = transactionHistory && transactionHistory.length === 0,
      hasNoTransactionHistoryDataExport = transactionHistoryExport && transactionHistoryExport.length === 0;

    //Transaction History table Columns
    const columns = [
      {
        title: I18n.t('myAccount.id'),
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: I18n.t('myAccount.time'),
        dataIndex: 'time',
        key: 'time'
      },
      {
        title: I18n.t('myAccount.description'),
        dataIndex: 'desc',
        key: 'desc'
      },
      {
        title: I18n.t('myAccount.status'),
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: I18n.t('myAccount.amount') +
        '(' + CurrencyUtils.getCurruencySymbol(this.props.currencyFormat) + ')',
        dataIndex: 'amount',
        key: 'amount',
      }
    ];

    return (
      <div className='pos-rel'>
        <div className='table-card margin-top-20'>
          <div className='filterComponent clearfix'>
            <div className='float-left'>
              <p
                className='card-title '>
                { I18n.t('myAccount.transaction_history') }</p>
            </div>
            <div className='float-right'>
              <div className='filter'>
                <div className='ant-form-inline'>
                  <TimeRangePicker onSearchClick={ handleSearchClick } />
                  <div className='ant-form-item'>
                    <button
                      className={ 'btn btn-regular margin-left-10' }
                      onClick={ this.onExportClick }>
                      { I18n.t('application.export') }
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Table className='bookie-table'
          locale={ { emptyText: (
            (hasNoTransactionHistoryData && transactionHistoryLoadingStatus === LoadingStatus.DONE ?
              I18n.t('mybets.nodata') : transactionHistoryLoadingStatus) ||
              hasNoTransactionHistoryDataExport) } }
              pagination={ transactionHistory.length > 20 ? paginationParams : false }
              dataSource={ transactionHistory }
              columns={ columns }/>
          </div>
          { exportButtonClicked ?
            <Export
              exportData={ transactionHistoryExport }
              exportLoadingStatus={ transactionHistoryExportLoadingStatus }
              resetExportLoadingStatus={ resetTransactionHistoryExportLoadingStatus }
              clearExportDataStore={ clearTransactionHistoryExport }
              screenName={ I18n.t('myAccount.screenName') }
              />: null }
            </div>
    );
  }
}

TransactionHistory.propTypes = {
  onExportClick: PropTypes.func
}

TransactionHistory.defaultProps = {
  onExportClick: () => {}
}
export default TransactionHistory;
