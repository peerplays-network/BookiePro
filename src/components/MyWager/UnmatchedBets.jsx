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
import './MyWager.less';
import _ from 'lodash';
import PropTypes from 'prop-types';

/** Unmatchedbets component used in mybets tabbed list */
class UnmatchedBets extends PureComponent {

  constructor(props) {
    super(props);

    const { unmatchedBets, currencyFormat, onCancelBetClick, onEventClick } = props;

    this.state = {
      tableData: unmatchedBets,
      columns: MyWagerUtils.getUnmatchedBetsColumns(currencyFormat, onCancelBetClick, onEventClick)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.unmatchedBets !== nextProps.unmatchedBets) {
      this.setState({
        tableData: nextProps.unmatchedBets
      })
    }
    if (this.props.currencyFormat !== nextProps.currencyFormat ||
        this.props.onCancelBetClick !== nextProps.onCancelBetClick) {
      this.setState({
        columns: MyWagerUtils.getUnmatchedBetsColumns(nextProps.currencyFormat, nextProps.onCancelBetClick, nextProps.onEventClick)
      })
    }
  }

  getModalTitle(textA, textB, value, currencySymbol) {
    return (
      <div>
        { textA } {currencySymbol } { value } { textB }
      </div>
    )
  }

  render() {
    const { unmatchedBetsLoadingStatus, currencyFormat, betsTotal, onCancelAllBetsClick,
      isCancelAllConfirmModalVisible, handleCancelAllBets, declineCancelAllBets } = this.props;
    const currencySymbol = CurrencyUtils.getCurrencySymbol(currencyFormat, 'white');
    return (
      <div className='table-card'>
        <div className='filterComponent clearfix'>
          <div className='float-left'>
            <p className='card-title'>{ I18n.t('mybets.total') } { currencySymbol } { (betsTotal ? betsTotal : 0) }</p>
          </div>
          { this.state.tableData.length !== 0 ?
          <div className='float-right'>
            <button className='btn btn-cancel' onClick={ onCancelAllBetsClick }
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
          title={ this.getModalTitle(I18n.t('mybets.cancel_all_confirm_part_a'), I18n.t('mybets.cancel_all_confirm_part_b'), betsTotal, currencySymbol) }
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
  unmatchedBets: PropTypes.instanceOf(Array).isRequired
}
export default UnmatchedBets;
