import React, { Component } from 'react';
import {  Table,DatePicker,Select } from 'antd';
import { LoadingStatus } from '../../constants';
import './MyWager.less';
import { List } from 'immutable';
import { I18n } from 'react-redux-i18n';
const Option = Select.Option;

class ResolvedBets extends Component {
  state = {
    period: 'last7Days',
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
  render() {
    const { startValue, endValue, columns, resolvedBets, resolvedBetsLoadingStatus, currencyFormat, betsTotal } = this.props;
    return (
      <div>
        <div className='top-data clearfix'>
          <div className='float-left'>
            <p className='font16'>{ I18n.t('mybets.total') } : { (currencyFormat === 'BTC' ? 'Ƀ ' : 'm ') + (betsTotal ? betsTotal : 0) }</p>
          </div>
          <div className='float-right'>
            <div className='filter'>
              <div className='ant-form-inline'>
                <div className='ant-form-item'>
                  <label>{ I18n.t('application.period') }</label>
                  <Select className='bookie-select' value={ this.state.period } style={ {width: 150} }>
                    <Option value='last7Days'>{I18n.t('application.last_7_Days') }</Option>
                    <Option value='last14Days'>{I18n.t('application.last_14_Days') }</Option>
                    <Option value='thisMonth'>{I18n.t('application.this_Month') }</Option>
                    <Option value='lastMonth'>{I18n.t('application.last_Month') }</Option>
                    <Option value='custom'>{I18n.t('application.custom') }</Option>
                  </Select>
                </div>
                <div className='ant-form-item'>
                  <label> Date</label>
                  <DatePicker
                    disabledDate={ this.disabledStartDate }
                    showTime
                    format='YYYY-MM-DD HH:mm:ss'
                    value={ startValue }
                    placeholder='From'
                    />
                  <span className='margin-lr-10 font16'>
                    -
                  </span>
                  <DatePicker
                    disabledDate={ this.disabledEndDate }
                    showTime
                    format='YYYY-MM-DD HH:mm:ss'
                    value={ endValue }
                    placeholder='To'
                    />
                </div>
                <div className='ant-form-item'>
                  <a className='btn btn-regular' href=''>{I18n.t('application.search') }</a>
                  <a className='btn btn-regular margin-left-10' href=''>{I18n.t('application.export') }</a>
                </div>
              </div>
            </div>
          </div>
          <div className='right-left'></div>
        </div>

        <Table pagination={ {pageSize: 10} }
          locale={ {emptyText: ( resolvedBets && resolvedBets.length === 0 &&
            resolvedBetsLoadingStatus === LoadingStatus.DONE ? I18n.t('mybets.nodata') : resolvedBetsLoadingStatus )} }
          className='bookie-table' dataSource={ List(resolvedBets).toJS() } columns={ columns }/>
      </div>
    )
  }
}

export default ResolvedBets;
