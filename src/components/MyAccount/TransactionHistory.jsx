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
  constructor(props) {
    super(props);
    this.state = {
      disableSearchAndExportButtons: false,
    }
    this.onPeriodChange = this.onPeriodChange.bind(this);
  }

  onPeriodChange(periodType, startDate, endDate) {
    const disableSearchAndExportButtons = (periodType === TimeRangePeriodTypes.CUSTOM) && (!startDate|| !endDate);
    this.setState({ disableSearchAndExportButtons })
    // Call parent callback
    this.onPeriodChange(periodType, startDate, endDate);
  }

  render() {
    const { transactionHistory,transactionHistoryLoadingStatus,
      transactionHistoryExport,transactionHistoryExportLoadingStatus,
      exportButtonClicked,resetTransactionHistoryExportLoadingStatus,clearTransactionHistoryExport,
      handleSearchClick,handleExportClick, onPeriodChange } = this.props;

    const hasNoTransactionHistoryData = transactionHistory && transactionHistory.length === 0,
      hasNoTransactionHistoryDataExport = transactionHistoryExport && transactionHistoryExport.length === 0;

    const disableSearchAndExportButtons = this.state.disableSearchAndExportButtons;

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
                <div
                  className='ant-form-inline'>
                  <TimeRangePicker className='ant-form-item' onPeriodChange={ onPeriodChange }/>
                  <div className='ant-form-item'>
                    <button
                      className={ 'btn ' + (disableSearchAndExportButtons ? 'btn-regular-disabled':' btn-regular') }
                      disabled={ disableSearchAndExportButtons }
                      onClick={ handleSearchClick }>{ I18n.t('application.search') }</button>
                    <button
                      className={ 'btn ' + ((disableSearchAndExportButtons ? 'btn-regular-disabled':' btn-regular') + ' margin-left-10') }
                      disabled={ disableSearchAndExportButtons }
                      onClick={ handleExportClick }>
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
    )
  }
}

TransactionHistory.propTypes = {
  onPeriodChange: PropTypes.func
}

TransactionHistory.defaultProps = {
  onPeriodChange: () => {}
}
export default TransactionHistory;
