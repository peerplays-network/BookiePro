import React, { PureComponent } from 'react';
import { Table,DatePicker,Select,LocaleProvider } from 'antd';
import './MyAccount.less';
import { LoadingStatus } from '../../constants';
import { I18n } from 'react-redux-i18n';

const Option = Select.Option;
const paginationParams = { pageSize: 20 };

class TransactionHistory extends PureComponent {

  render() {
    const { transactionHistory,transHistLoadingStatus,dataColumns,handleSearchClick,periodChange,showDateFields,
     onStartChange,onEndChange,disabledFromDate,disabledToDate,fromDate,toDate } = this.props;
    return (
      <div className='transaction-table'>
        <div className='top-data clearfix'>
          <div className='float-left'>
            <p
              className='font16 page-title '>
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
                      <label>{ I18n.t('myAccount.date') }</label>
                        <DatePicker
                         disabledDate={ disabledFromDate }
                         format='YYYY-MM-DD HH:mm:ss'
                         placeholder='From'
                         onChange={ onStartChange } />
                        <span className='margin-lr-10 font16'>  - </span>
                        <DatePicker
                          disabledDate={ disabledToDate }
                          format='YYYY-MM-DD HH:mm:ss'
                          placeholder='To'
                          onChange={ onEndChange }/>
                    </div>
                  </LocaleProvider> : null
                }
                <div className='ant-form-item'>
                  <button
                    className={ 'btn ' + (showDateFields && (fromDate===null || toDate===null) ? 'btn-regular-disabled':' btn-regular') }
                    disabled={ showDateFields && (fromDate===null || toDate===null) }
                    onClick={ handleSearchClick }>{ I18n.t('application.search') }</button>
                  <button className='btn btn-regular margin-left-10'>{ I18n.t('application.export') }</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Table className='bookie-table'
          locale={ {emptyText: ( transactionHistory && transactionHistory.length === 0 &&
          transHistLoadingStatus === LoadingStatus.DONE ? I18n.t('mybets.nodata') : transHistLoadingStatus )} }
          pagination={ paginationParams }
          dataSource={ transactionHistory }
          columns={ dataColumns }/>
      </div>

    )
  }
}

export default TransactionHistory;
