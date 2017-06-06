import React, { PureComponent } from 'react';
import {  Table } from 'antd';
import { LoadingStatus, ExportTypes } from '../../constants';
import './MyWager.less';
import { I18n } from 'react-redux-i18n';
import Export from '../Export';
import TimeRangePicker from '../TimeRangePicker';

class ResolvedBets extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      tableData: this.props.resolvedBets.toJS()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.resolvedBets !== nextProps.resolvedBets) {
      // Update table data if transaction history is updated
      this.setState({
        tableData: nextProps.resolvedBets.toJS()
      })
    }
  }

  render() {
    const {
      columns,
      resolvedBetsLoadingStatus,
      currencyFormat,
      betsTotal,
      handleSearchClick,
      handleExportClick,
      exportData,
      exportLoadingStatus,
      handleResetExport
    } = this.props;

    return (
      <div className='table-card'>
        <div>
          <div className='filterComponent clearfix'>
            <div className='float-left'>
              <p className='card-title'>{ I18n.t('mybets.total') } : <span>{ currencyFormat + (betsTotal ? betsTotal : 0) }</span> </p>
            </div>
            <div className='float-right'>
              <TimeRangePicker
                onSearchClick={ handleSearchClick }
                onExportClick={ handleExportClick }
              />
            </div>
          </div>
          <Table pagination={ { pageSize: 20 } }
            locale={ { emptyText: ( this.state.tableData && this.state.tableData.length === 0 &&
              resolvedBetsLoadingStatus === LoadingStatus.DONE ? I18n.t('mybets.nodata') : resolvedBetsLoadingStatus )} }
            className='bookie-table' dataSource={ this.state.tableData } columns={ columns }/>
        </div>
        <Export
          type={ ExportTypes.RESOLVED_BETS }
          exportData={ exportData }
          exportLoadingStatus={ exportLoadingStatus }
          handleResetExport={ handleResetExport }
          />
      </div>
    )
  }
}

export default ResolvedBets;
