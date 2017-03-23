import React, { Component } from 'react';
import { Table,DatePicker,Select } from 'antd';
var I18n = require('react-redux-i18n').I18n;
import './MyAccount.less';
import { ChainTypes } from '../../utility';



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

class TransactionHistory extends Component {

  constructor(props){
    super(props);
    this.searchTransactionHistory = this.searchTransactionHistory.bind(this);
  }
  state = {
    startValue: null,
    endValue: null,
    endOpen: false,
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

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }

  onStartChange = (value) => {
    this.onChange('startValue', value);
  }

  onEndChange = (value) => {
    this.onChange('endValue', value);
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  }
  static propTypes = {
    dynGlobalObject: ChainTypes.ChainObject.isRequired,
    globalObject: ChainTypes.ChainObject.isRequired,
  };

  static defaultProps = {
    dynGlobalObject: '2.1.0',
    globalObject: '2.0.0',

  };

  searchTransactionHistory = () => {
    alert(this.state.startValue < this.state.endValue);
  }

  render() {

    const {startValue, endValue, endOpen } = this.state;
    const { transactionHistory,currencyFormat } = this.props;
    const paginationParams = { pageSize: 5 };

    let newTxList = [];
    transactionHistory.forEach(row => {
      let rowObj = {
        key: row.id,
        id: row.id,
        'time': row.time,
        'desc': row.description,
        'status': <span
          className='completed'>{ row.status }</span>,
        'amount': row.op[1].fee.amount + ' ' + currencyFormat
      };
      newTxList.push(rowObj);
    });

    return (
      <div className='transaction-table'>
        <div className='top-data clearfix'>
          <div className='float-left'>
            <p
              className='font18 padding-tb-5 page-title '>
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
                  <Select
                    className='bookie-select'
                    defaultValue='default'
                    style={ {width: 150} }>
                    <Option
                      value='default'>
                      Last 14
                      days</Option>
                    <Option
                      value='jack'>Jack</Option>
                    <Option
                      value='lucy'>Lucy</Option>
                    <Option
                      value='Yiminghe'>yiminghe</Option>
                  </Select>
                </div>
                <div
                  className='ant-form-item'>
                  <label>
                    { I18n.t('myAccount.date') }</label>
                    <DatePicker
                    disabledDate={ this.disabledStartDate }
                    showTime
                    format='YYYY-MM-DD HH:mm:ss'
                    value={ startValue }
                    placeholder='Start'
                    onChange={ this.onStartChange }
                    onOpenChange={ this.handleStartOpenChange }
                  />
                  <span className='margin-lr-10 font16'>  - </span>
                    <DatePicker
                     disabledDate={ this.disabledEndDate }
                     showTime
                     format='YYYY-MM-DD HH:mm:ss'
                     value={ endValue }
                     placeholder='End'
                     onChange={ this.onEndChange }
                     open={ endOpen }
                     onOpenChange={ this.handleEndOpenChange }
                     />
                </div>
                <div className='ant-form-item'>
                  <a className='btn btn-regular' onClick={ this.searchTransactionHistory }>Search</a>
                  <a className='btn btn-regular margin-lr-10'>Export</a>
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
