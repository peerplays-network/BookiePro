import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { LoadingStatus } from '../../constants';
import { MyWagerUtils, CurrencyUtils } from '../../utility';
import { I18n } from 'react-redux-i18n';
import { List } from 'immutable';
import './MyWager.less';
import _ from 'lodash';
import PropTypes from 'prop-types';

class UnmatchedBets extends PureComponent {

  constructor(props) {
    super(props);

    const { unmatchedBets, currencyFormat, onCancelBetClick, onEventClick } = props;

    this.state = {
      tableData: unmatchedBets.toJS(),
      columns: MyWagerUtils.getUnmatchedBetsColumns(currencyFormat, onCancelBetClick, onEventClick)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.unmatchedBets !== nextProps.unmatchedBets) {
      this.setState({
        tableData: nextProps.unmatchedBets.toJS()
      })
    }
    if (this.props.currencyFormat !== nextProps.currencyFormat ||
        this.props.onCancelBetClick !== nextProps.onCancelBetClick ||
        this.props.onEventClick !== nextProps.onEventClick) {
      this.setState({
        columns: MyWagerUtils.getUnmatchedBetsColumns(nextProps.currencyFormat, nextProps.onCancelBetClick, nextProps.onEventClick)
      })
    }
  }

  render() {
    const { unmatchedBetsLoadingStatus, currencyFormat, betsTotal, onCancelAllBetsClick } = this.props;
    const currencySymbol = CurrencyUtils.getCurruencySymbol(currencyFormat);
    return (
      <div className='table-card'>
        <div className='filterComponent clearfix'>
          <div className='float-left'>
            <p className='card-title'>{ I18n.t('mybets.total') } : <span>{ currencySymbol + (betsTotal ? betsTotal : 0) }</span> </p>
          </div>
            <div className='float-right'>
              <button className='btn cancel-btn' onClick={ onCancelAllBetsClick }
                disabled={ this.state.tableData.length === 0 }>{ I18n.t('mybets.cancel_all') }</button>
            </div>
        </div>
          <Table className='bookie-table' pagination={ { pageSize: 20 } } rowKey='id'
            locale={ {emptyText: ( this.state.tableData.length === 0 &&
              unmatchedBetsLoadingStatus === LoadingStatus.DONE ? I18n.t('mybets.nodata') : unmatchedBetsLoadingStatus )} }
            dataSource={ this.state.tableData } columns={ this.state.columns } >
          </Table>
      </div>
    )
  }
}

UnmatchedBets.propTypes = {
  unmatchedBets: PropTypes.instanceOf(List).isRequired
}
export default UnmatchedBets;
