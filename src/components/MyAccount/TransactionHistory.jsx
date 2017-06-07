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

const paginationParams = { pageSize: 20 };

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
                I18n.t('mybets.nodata') : transactionHistoryLoadingStatus)  } }
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
