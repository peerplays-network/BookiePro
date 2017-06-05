import React, { PureComponent } from 'react';
import {  Table } from 'antd';
import { LoadingStatus } from '../../constants';
import './MyWager.less';
import { List } from 'immutable';
import { I18n } from 'react-redux-i18n';
import Export from '../Export';
import TimeRangePicker from '../TimeRangePicker';

class ResolvedBets extends PureComponent {
  render() {
    const { columns, resolvedBets, resolvedBetsLoadingStatus, currencyFormat, betsTotal ,
      exportButtonClicked, resolvedBetsExport, resolvedBetsExportLoadingStatus,
      handleExportFinishDownload, handleSearchClick, handleExportClick
      } = this.props;

    return (
      <div className='table-card'>
        <div>
          <div className='filterComponent clearfix'>
            <div className='float-left'>
              <p className='card-title'>{ I18n.t('mybets.total') } : <span>{ currencyFormat + (betsTotal ? betsTotal : 0) }</span> </p>
            </div>
            <div className='float-right'>
              <TimeRangePicker onSearchClick={ handleSearchClick }
                onExportClick={ handleExportClick }
                searchResultsCount={  resolvedBets.length }
                />
            </div>
          </div>
          <Table pagination={ {pageSize: 20} }
            locale={ {emptyText: ( resolvedBets && resolvedBets.length === 0 &&
              resolvedBetsLoadingStatus === LoadingStatus.DONE ? I18n.t('mybets.nodata') : resolvedBetsLoadingStatus )} }
            className='bookie-table' dataSource={ List(resolvedBets).toJS() } columns={ columns }/>
        </div>
        { exportButtonClicked ?
          <Export
            exportData={ List(resolvedBetsExport).toJS() }
            exportLoadingStatus={ resolvedBetsExportLoadingStatus }
            handleExportFinishDownload={ handleExportFinishDownload }
            screenName={ I18n.t('mybets.screenName') }
            />: null }
        </div>
    )
  }
}

export default ResolvedBets;
