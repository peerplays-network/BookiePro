import React, { PureComponent } from 'react';
import { Table } from 'antd';
import './MyAccount.less';
import { LoadingStatus } from '../../constants';
import { I18n } from 'react-redux-i18n';
import Export from '../Export';
import { CurrencyUtils, BettingModuleUtils } from '../../utility';
import TimeRangePicker from '../TimeRangePicker';
import PropTypes from 'prop-types';

const paginationParams = { pageSize: 20 };

const getColumns = (currencyFormat, lastIrreversibleBlockNum) => {
  return [
    {
      title: I18n.t('myAccount.id'),
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: I18n.t('myAccount.time'),
      render: (text, row) => {
        return row.time.format('DD/MM/YYYY HH:mm:ss');
      },
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
      render: (text, row) => {
        const blockNum = row.blockNum;
        if (lastIrreversibleBlockNum >= blockNum) {
          return <span className='completed'>{ I18n.t('myAccount.transaction_status_complete') }</span>
        } else {
          return <span className='processed'>{ I18n.t('myAccount.transaction_status_processing') }</span>
        }
      },
    },
    {
      title: I18n.t('myAccount.amount') +
      '(' + CurrencyUtils.getCurruencySymbol(currencyFormat) + ')',
      render: (text, row) => {
        const amount = row.amount;
        return CurrencyUtils.getFormattedCurrency(amount, currencyFormat, BettingModuleUtils.stakePlaces);
      },
      key: 'amount',
    }
  ];
}

class TransactionHistory extends PureComponent {

  render() {
    const { transactionHistoryLoadingStatus,
      generateTransactionHistoryExportDataLoadingStatus,
      transactionHistoryExportData, exportButtonClicked, handleExportFinishDownload,
      handleSearchClick, handleExportClick, lastIrreversibleBlockNum, currencyFormat} = this.props;

    const transactionHistory = this.props.transactionHistory.toJS();

    const hasNoTransactionHistoryData = transactionHistory && transactionHistory.length === 0;

    //Transaction History table Columns
    const columns = getColumns(currencyFormat, lastIrreversibleBlockNum);

    return (
      <div className='pos-rel'>
        <div className='table-card margin-top-20'>
          <div className='filterComponent clearfix'>
            <div className='float-left'>
              <p className='card-title '>
                { I18n.t('myAccount.transaction_history') }
              </p>
            </div>
            <div className='float-right'>
              <TimeRangePicker onSearchClick={ handleSearchClick } onExportClick={ handleExportClick } />
            </div>
          </div>
          <Table className='bookie-table'
            locale={ { emptyText: (
                hasNoTransactionHistoryData && transactionHistoryLoadingStatus === LoadingStatus.DONE ?
                I18n.t('mybets.nodata') : transactionHistoryLoadingStatus)  } }
                pagination={ transactionHistory.length > paginationParams.pageSize ? paginationParams : false }
                dataSource={ transactionHistory }
                columns={ columns }/>
            </div>
          { exportButtonClicked ?
            <Export
              exportData={ transactionHistoryExportData.toJS() }
              exportLoadingStatus={ generateTransactionHistoryExportDataLoadingStatus }
              handleExportFinishDownload={ handleExportFinishDownload }
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
