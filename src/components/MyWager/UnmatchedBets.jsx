/**
 * This component displays the list of unmatched transactions of the user. Unmatched bets are bets
 * that are pending for someone to make an opposite bet with same odds to match on
 *
 * It uses 'antd' table to render and display matched bets data
 * The list contains 'Event Name' which will allow the user to redirect to event full market screen.
 * The user can edit unmatched bet from the market drawer.
 *
 * This component displays:
 *   i.   Total : sum of back bet’s stack + sum of lay bet’s liability displayed at top.
 *                display Total in format depending on Setting – Bitcoin units
 *   ii.  bets displayed in chronological order, nearest to oldest, 20 records per screen,
 *        with pagination at the bottom of the screen.
 *   iii. 'Cancel All' button : to cancel all bets at top right side
 *   iv.  'Cancel' button : next to every bet record - cancel relevant transaction
 *
 * This component is used in {@link MyBets}
 */
import React, { PureComponent } from 'react';
import { Table, Modal } from 'antd';
import { LoadingStatus } from '../../constants';
import { MyWagerUtils, CurrencyUtils } from '../../utility';
import { I18n } from 'react-redux-i18n';
import { List } from 'immutable';
import './MyWager.less';
import _ from 'lodash';
import PropTypes from 'prop-types';

/** Unmatchedbets component used in mybets tabbed list */
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
    const { unmatchedBetsLoadingStatus, currencyFormat, betsTotal, onCancelAllBetsClick,
      isCancelAllConfirmModalVisible, handleCancelAllBets, declineCancelAllBets } = this.props;
    const currencySymbol = CurrencyUtils.getCurruencySymbol(currencyFormat);
    return (
      <div className='table-card'>
        <div className='filterComponent clearfix'>
          <div className='float-left'>
            <p className='card-title'>{ I18n.t('mybets.total') } : <span>{ currencySymbol + (betsTotal ? betsTotal : 0) }</span> </p>
          </div>
          { this.state.tableData.length !== 0 ?
          <div className='float-right'>
            <button className='btn cancel-btn' onClick={ onCancelAllBetsClick }
              disabled={ this.state.tableData && this.state.tableData.length === 0 }>{ I18n.t('mybets.cancel_all') }</button>
          </div>
          : null }
        </div>
        <Table className='bookie-table' pagination={ { pageSize: 20 } } rowKey='id'
          locale={ {emptyText: ( this.state.tableData.length === 0 &&
            unmatchedBetsLoadingStatus === LoadingStatus.DONE ? I18n.t('mybets.nodata') : unmatchedBetsLoadingStatus )} }
          dataSource={ this.state.tableData } columns={ this.state.columns } >
        </Table>
        <Modal
          wrapClassName={ 'vertical-center-modal' }
          title={ I18n.t('mybets.cancel_all_confirm', {currencySymbol, betsTotal}) }
          visible={ isCancelAllConfirmModalVisible }
          onOk={ handleCancelAllBets }
          onCancel={ declineCancelAllBets }
          okText='Confirm'
          cancelText='Cancel'>
        </Modal>
      </div>
    )
  }
}

UnmatchedBets.propTypes = {
  unmatchedBets: PropTypes.instanceOf(List).isRequired
}
export default UnmatchedBets;
