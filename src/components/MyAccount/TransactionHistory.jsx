/**
 * This is the transaction history table component
 * It uses 'antd' table to render and display transaction history data
 * It is used in the MyAccount component
 * The table contains transactions that affects the balance of the user account
 * Paging is also added for navigation (20 records per page)
 *
 * This component contains the following sub-components:
 *   {@link TimeRangePicker} : allows user to perform filtering of data based on:
 *                             1)Last 7 days 2)Last 14 days 3)This month 4)Last month 5)custom date
 *                             Last 7 days record is loaded by default on the table
 *   {@link Export}          : allows user to export data to excel file and download it

 * It uses the following 2 utility files:
 *    CurrencyUtils      : to get user's currency symbol
 *    BettingModuleUtils : to get the precision to be applied on the transaction amounts
 */

import React, { PureComponent } from 'react';
import { Table } from 'antd';
import './MyAccount.less';
import { LoadingStatus, ExportTypes } from '../../constants';
import { I18n } from 'react-redux-i18n';
import Export from '../Export';
import { CurrencyUtils, BettingModuleUtils } from '../../utility';
import TimeRangePicker from '../TimeRangePicker';
import PropTypes from 'prop-types';
import Immutable from 'immutable';

/** default page size = 20 */
const paginationParams = { pageSize: 20 };

/**
 * Generate the transaction history table columns and their keys
 * It will be provided as 'columns' to the 'antd' table
 *
 * @param {string} currencyFormat - the user's selected currency
 * @param {integer} lastIrreversibleBlockNum - Obtained from blockchain to find the status
 *                                             (processing or completed) of every transaction history data.
 *                                             It will be displayed on the 'Status' column
 */
const getColumns = (currencyFormat, lastIrreversibleBlockNum) => {
  return [
    {
      title: I18n.t('myAccount.id'),
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: I18n.t('myAccount.time'),
      render: (text, row) => {
        return row.time.format('DD/MM/YYYY HH:mm:ss');
      },
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
      render: (text, row) => {
        const blockNum = row.blockNum;
        if (lastIrreversibleBlockNum >= blockNum) {
          return <span className='completed'>{ I18n.t('myAccount.transaction_status_complete') }</span>
        } else {
          return <span className='processed'>{ I18n.t('myAccount.transaction_status_processing') }</span>
        }
      },
    },
    {
      title: I18n.t('myAccount.amount') +
      '(' + CurrencyUtils.getCurruencySymbol(currencyFormat) + ')',
      render: (text, row) => {
        const amount = row.amount;
        return CurrencyUtils.getFormattedCurrency(amount, currencyFormat, BettingModuleUtils.stakePlaces);
      },
      key: 'amount',
    }
  ];
}

class TransactionHistory extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      tableData: this.props.transactionHistory.toJS()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.transactionHistory !== nextProps.transactionHistory) {
      // Update table data if transaction history is updated
      this.setState({
        tableData: nextProps.transactionHistory.toJS()
      })
    }
  }

  render() {
    const {
      transactionHistoryLoadingStatus,
      handleSearchClick,
      handleExportClick,
      exportLoadingStatus,
      exportData,
      handleResetExport,
      lastIrreversibleBlockNum,
      currencyFormat
     } = this.props;

    const hasNoTransactionHistoryData = this.state.tableData && this.state.tableData.length === 0;

    //Transaction History table Columns
    const columns = getColumns(currencyFormat, lastIrreversibleBlockNum);

    return (
      <div className='pos-rel'>
        <div className='table-card margin-top-20'>
          <div className='filterComponent clearfix'>
            <div className='float-left'>
              <p className='card-title '>
                { I18n.t('myAccount.transaction_history') }
              </p>
            </div>
            <div className='float-right'>
              <TimeRangePicker onSearchClick={ handleSearchClick }
                onExportClick={ handleExportClick }
                />
            </div>
          </div>
          <Table
            className='bookie-table'
            locale={ { emptyText: (
                hasNoTransactionHistoryData && transactionHistoryLoadingStatus === LoadingStatus.DONE ?
                I18n.t('mybets.nodata') : I18n.t('mybets.no_transactions'))  } }
            pagination={ this.state.tableData.length > paginationParams.pageSize ? paginationParams : false }
            dataSource={ this.state.tableData }
            columns={ columns }
          />
        </div>
        <Export
          exportData={ exportData }
          exportLoadingStatus={ exportLoadingStatus }
          handleResetExport={ handleResetExport }
          type={ ExportTypes.TRANSACTION_HISTORY }
          />
      </div>
    );
  }
}

TransactionHistory.propTypes = {
  onExportClick: PropTypes.func,
  transactionHistory: PropTypes.instanceOf(Immutable.List)
}

TransactionHistory.defaultProps = {
  onExportClick: () => {},
  transactionHistory: Immutable.List()
}
export default TransactionHistory;
