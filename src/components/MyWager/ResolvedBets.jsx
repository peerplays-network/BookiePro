import React, { Component } from 'react';
import {  Table,DatePicker,Select,LocaleProvider } from 'antd';
import { LoadingStatus } from '../../constants';
import './MyWager.less';
import { List } from 'immutable';
import { I18n } from 'react-redux-i18n';
import Export from '../Export';

class ResolvedBets extends Component {
  render() {
    const { columns, resolvedBets, resolvedBetsLoadingStatus, currencyFormat, betsTotal ,
      period, disabledStartDate, disabledEndDate, onStartDateSelect, onEndDateSelect, onPeriodSelect, onSearchClick,
      startDate, endDate, onResolvedBetsExport, exportButtonClicked, resolvedBetsExport, resolvedBetsExportLoadingStatus,
      resetResolvedBetsExportLoadingStatus, clearResolvedBetsExport
      } = this.props;
    const isValidDate = (period === 'custom' &&
      ((startDate===null || (startDate !== null && !startDate.isValid()))
      || ((endDate===null || (endDate !== null && !endDate.isValid())))));
    return (
      <div className='table-card'>
        <div>
          <div className='filterComponent clearfix'>
            <div className='float-left'>
              <p className='card-title'>{ I18n.t('mybets.total') } : { currencyFormat + (betsTotal ? betsTotal : 0) }</p>
            </div>
            <div className='float-right'>
              <div className='filter'>
                <div className='ant-form-inline'>
                  <div className='ant-form-item'>
                    <label> { I18n.t('mybets.period') }</label>
                    <Select className='bookie-select' value={ period } onChange={ onPeriodSelect }
                        style={ {width: 150} }>
                      <Select.Option value='last7Days'>{I18n.t('mybets.last_7_Days') }</Select.Option>
                      <Select.Option value='last14Days'>{I18n.t('mybets.last_14_Days') }</Select.Option>
                      <Select.Option value='thisMonth'>{I18n.t('mybets.this_Month') }</Select.Option>
                      <Select.Option value='lastMonth'>{I18n.t('mybets.last_Month') }</Select.Option>
                      <Select.Option value='custom'>{I18n.t('mybets.custom') }</Select.Option>
                    </Select>
                  </div>
                  {
                    period === 'custom' ?
                    <LocaleProvider locale={ I18n.t('application.locale') }>
                      <div className='ant-form-item'>
                        <label>{ I18n.t('mybets.date') }</label>
                          <DatePicker
                           disabledDate={ disabledStartDate }
                           allowClear={ false }
                           format='YYYY-MM-DD'
                           placeholder={ I18n.t('mybets.from') }
                           onChange={ onStartDateSelect } />
                          <span className='margin-lr-10 font16'>  - </span>
                          <DatePicker
                            disabledDate={ disabledEndDate }
                            format='YYYY-MM-DD'
                            placeholder={ I18n.t('mybets.to') }
                            onChange={ onEndDateSelect }/>
                      </div>
                    </LocaleProvider>
                    :null
                  }
                  <div className='ant-form-item'>
                    <button
                      className={ (isValidDate ? 'btn-regular-disabled':'btn-regular') + ' btn' }
                      disabled={ isValidDate }
                      onClick={ onSearchClick }>{I18n.t('mybets.search') }</button>
                    <button
                      className={ (isValidDate ? 'btn-regular-disabled':'btn-regular') + ' btn margin-left-10' }
                      disabled={ isValidDate || exportButtonClicked }
                      onClick={ onResolvedBetsExport }>{I18n.t('mybets.export') }</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        <LocaleProvider locale={ I18n.t('application.locale') }>
          <Table pagination={ {pageSize: 10} }
            locale={ {emptyText: ( resolvedBets && resolvedBets.length === 0 &&
              resolvedBetsLoadingStatus === LoadingStatus.DONE ? I18n.t('mybets.nodata') : resolvedBetsLoadingStatus )} }
            className='bookie-table' dataSource={ List(resolvedBets).toJS() } columns={ columns }/>
        </LocaleProvider>
        </div>
        { exportButtonClicked ?
          <Export
            exportData={ List(resolvedBetsExport).toJS() }
            exportLoadingStatus={ resolvedBetsExportLoadingStatus }
            resetExportLoadingStatus={ resetResolvedBetsExportLoadingStatus }
            clearExportDataStore={ clearResolvedBetsExport }
            screenName={ I18n.t('mybets.screenName') }
            />: null }
        </div>
    )
  }
}

export default ResolvedBets;
