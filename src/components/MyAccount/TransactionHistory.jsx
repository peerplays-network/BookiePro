import React, { Component } from 'react';
import { Table,DatePicker,Select } from 'antd';
var I18n = require('react-redux-i18n').I18n;
import './MyAccount.less';
import dateFormat from 'dateformat';

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
    title: I18n.t('myAccount.amount'),
    dataIndex: 'amount',
    key: 'amount',
  }
];
const Option = Select.Option;

class TransactionHistory extends Component {

  state = {
    startValue: null,
    endValue: null,
    endOpen: false
  };

  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  }

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }

  render() {

    const { transactionHistory,currencyFormat,handleSearchClick,periodChange,showDateFields,onStartChange,onEndChange} = this.props;
    const paginationParams = { pageSize: 20 };
    //Format and bind data.
    let newTxList = [];
    transactionHistory.forEach(row => {
      let rowObj = {
        key: row.get('id'),
        id: row.get('id'),
        'time': dateFormat(row.get('time'), "dd/mm/yyyy h:MM TT"),
        'desc': row.get('description'),
        'status': <span
          className={ row.get('status') ==='Processing' ? 'processed'
            : (row.get('status') ==='Completed' ? 'completed' : '') }>{ row.get('status') }</span>,
        'amount': row.getIn(['op',1,'fee', 'amount']) + ' ' + currencyFormat
      };
      newTxList.push(rowObj);
    });

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
                  <label>
                    { I18n.t('myAccount.period') }</label>
                  <Select className='bookie-select' defaultValue='last7Days' style={ {width: 150} } onChange={ periodChange }>
                    <Option value='last7Days'>Last 7 days</Option>
                    <Option value='last14Days'>Last 14 days</Option>
                    <Option value='thisMonth'>This month</Option>
                    <Option value='lastMonth'>Last month</Option>
                    <Option value='custom'>Custom</Option>
                  </Select>
                </div>
              {
                showDateFields
                  ?   <div
                      className='ant-form-item'>
                      <label>
                        { I18n.t('myAccount.date') }</label>
                        <DatePicker
                        disabledDate={ this.disabledStartDate }
                        format='YYYY-MM-DD HH:mm:ss'
                        //value={ startDate }
                        placeholder='From'
                        onChange={ onStartChange }
                      />
                      <span className='margin-lr-10 font16'>  - </span>
                        <DatePicker
                         disabledDate={ this.disabledEndDate }
                         format='YYYY-MM-DD HH:mm:ss'
                         //value={ endDate }
                         placeholder='To'
                         onChange={ onEndChange }
                         />
                    </div>
                : null
              }
                <div className='ant-form-item'>
                  <a className='btn btn-regular' onClick={ handleSearchClick }>Search</a>
                  <a className='btn btn-regular margin-left-10'>Export</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Table className='bookie-table'
               pagination={ paginationParams }
               dataSource={ newTxList }
               columns={ columns }/>
      </div>

    )
  }
}

export default TransactionHistory;
