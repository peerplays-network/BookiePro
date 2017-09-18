/**
 * ResolvedBets to list Resolved transactions.
 * This includes following sub-components
 *   {@link TimeRangePicker} - Allows user to select period for which transactions can be seached or exported
 *   {@link Export} - Allows user to Export resolved transactions in excel
 *
 * ResolvedBets used in mybets tabbed list
 */
import React, { PureComponent } from 'react';
import {  Table } from 'antd';
import { LoadingStatus, ExportTypes } from '../../constants';
import './MyWager.less';
import { I18n } from 'react-redux-i18n';
import Export from '../Export';
import TimeRangePicker from '../TimeRangePicker';
import { MyWagerUtils, CurrencyUtils } from '../../utility';
import { List } from 'immutable';
import PropTypes from 'prop-types';

/** ResolvedBets component used in mybets tabbed list */
class ResolvedBets extends PureComponent {

  constructor(props) {
    super(props);

    const { resolvedBets, currencyFormat } = props;
    this.state = {
      tableData: resolvedBets.toJS(),
      columns: MyWagerUtils.getResolvedBetsColumns(currencyFormat)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.resolvedBets !== nextProps.resolvedBets) {
      // Update table data if resolved bets is updated
      this.setState({
        tableData: nextProps.resolvedBets.toJS()
      })
    }
    if (this.props.currencyFormat !== nextProps.currencyFormat) {
      this.setState({
        columns: MyWagerUtils.getResolvedBetsColumns(nextProps.currencyFormat)
      })
    }
  }

  render() {
    const {
      resolvedBetsLoadingStatus,
      currencyFormat,
      betsTotal,
      handleSearchClick,
      handleExportClick,
      exportData,
      exportLoadingStatus,
      handleResetExport
    } = this.props;

    const currencySymbol = CurrencyUtils.getCurruencySymbol(currencyFormat);

    return (
      <div className='table-card'>
        <div>
          <div className='filterComponent clearfix'>
            <div className='float-left'>
              <p className='card-title'>{ I18n.t('mybets.total') } : <span>{ currencySymbol + (betsTotal ? betsTotal : 0) }</span> </p>
            </div>
            <div className='float-right'>
              <TimeRangePicker
                onSearchClick={ handleSearchClick }
                onExportClick={ handleExportClick }
              />
            </div>
          </div>
          <Table pagination={ { pageSize: 20 } }
            locale={ { emptyText: ( this.state.tableData.length === 0 &&
              resolvedBetsLoadingStatus === LoadingStatus.DONE ? I18n.t('mybets.nodata') : I18n.t('mybets.no_bets') )} }
            className='bookie-table' dataSource={ this.state.tableData } columns={ this.state.columns }/>
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

ResolvedBets.propTypes = {
  resolvedBets: PropTypes.instanceOf(List).isRequired
}

export default ResolvedBets;
