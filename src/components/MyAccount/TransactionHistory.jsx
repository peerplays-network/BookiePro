import React, { PureComponent } from 'react';
import { Table,DatePicker,Select,LocaleProvider } from 'antd';
import './MyAccount.less';
import { LoadingStatus } from '../../constants';
import { I18n, Translate } from 'react-redux-i18n';
import Export from '../Export'

const Option = Select.Option;
const paginationParams = { pageSize: 20 };
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
    title: <Translate value='myAccount.bitcoinIcon' dangerousHTML/> ,
    dataIndex: 'amount',
    key: 'amount',
  }
];

class TransactionHistory extends PureComponent {

  render() {
    const { transactionHistory,transactionHistoryLoadingStatus,
      transactionHistoryExport,transactionHistoryExportLoadingStatus,
      exportButtonClicked,resetTransactionHistoryExportLoadingStatus,clearTransactionHistoryExport,
      handleSearchClick,handleExportClick,periodChange,showDateFields,
      onStartChange,onEndChange,disabledFromDate,disabledToDate,fromDate,toDate } = this.props;
    const hasNoTransactionHistoryData = transactionHistory && transactionHistory.length === 0,
      hasNoTransactionHistoryDataExport = transactionHistoryExport && transactionHistoryExport.length === 0,
      disableButtons = showDateFields && (fromDate===null || toDate===null);

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
                  <div
                    className='ant-form-item'>
                    <label>{ I18n.t('application.period') }</label>
                    <Select className='bookie-select' defaultValue='last7Days' style={ {width: 150} } onChange={ periodChange }>
                      <Option value='last7Days'>{ I18n.t('application.last_7_Days') }</Option>
                      <Option value='last14Days'>{ I18n.t('application.last_14_Days') }</Option>
                      <Option value='thisMonth'>{ I18n.t('application.this_Month') }</Option>
                      <Option value='lastMonth'>{ I18n.t('application.last_Month') }</Option>
                      <Option value='custom'>{ I18n.t('application.custom') }</Option>
                    </Select>
                  </div>
                  { showDateFields ?
                    <LocaleProvider locale={ I18n.t('application.locale') }>
                      <div className='ant-form-item'>
                        <label><i className='calendar-icon'></i></label>
                          <DatePicker
                           disabledDate={ disabledFromDate }
                           allowClear={ false }
                           format='YYYY/MM/DD'
                           placeholder='From'
                           onChange={ onStartChange } />
                          <span className='margin-lr-10 font16'>  - </span>
                          <DatePicker
                            disabledDate={ disabledToDate }
                            allowClear={ false }
                            format='YYYY-MM-DD'
                            placeholder='To'
                            onChange={ onEndChange }/>
                      </div>
                    </LocaleProvider> : null
                  }
                  <div className='ant-form-item'>
                    <button
                      className={ 'btn ' + (disableButtons ? 'btn-regular-disabled':' btn-regular') }
                      disabled={ disableButtons }
                      onClick={ handleSearchClick }>{ I18n.t('application.search') }</button>
                    <button
                      className={ 'btn ' + ((disableButtons ? 'btn-regular-disabled':' btn-regular') + ' margin-left-10') }
                      disabled={ disableButtons }
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
            pagination={ paginationParams }
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

export default TransactionHistory;
