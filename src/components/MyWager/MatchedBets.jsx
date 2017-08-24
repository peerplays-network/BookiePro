/**
 * MatchedBets to list Matched transactions
 * a bet may have been matched with more than one bet
 * sum of back bet’s stack + sum of lay bet’s liability displayed at top. display Total in format depending on Setting – Bitcoin units
 * bets displayed in chronological order, nearest to oldest, 20 records per screen, with pagination at the bottom of the screen.
 * MatchedBets used in mybets tabbed list
 */
import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { LoadingStatus } from '../../constants';
import { I18n } from 'react-redux-i18n';
import { List } from 'immutable';
import { MyWagerUtils, CurrencyUtils } from '../../utility';
import './MyWager.less';
import PropTypes from 'prop-types';

class MatchedBets extends PureComponent {
  constructor(props) {
    super(props);

    const { matchedBets, currencyFormat } = props;

    this.state = {
      tableData: matchedBets.toJS(),
      columns: MyWagerUtils.getMatchedBetsColumns(currencyFormat)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.matchedBets !== nextProps.matchedBets) {
      this.setState({
        tableData: nextProps.matchedBets.toJS()
      })
    }
    if (this.props.currencyFormat !== nextProps.currencyFormat) {
      this.setState({
        columns: MyWagerUtils.getMatchedBetsColumns(nextProps.currencyFormat)
      })
    }
  }

  render() {
    const {  matchedBetsLoadingStatus, currencyFormat, betsTotal } = this.props;
    const currencySymbol = CurrencyUtils.getCurruencySymbol(currencyFormat);
    return (
      <div className='table-card'>
        <div className='filterComponent'>
          <div className='float-left'>
            <p className='card-title'>
              { I18n.t('mybets.total') } : <span>{ currencySymbol + (betsTotal ? betsTotal : 0) }</span>
            </p>
          </div>
        </div>
          <Table className='bookie-table' pagination={ { pageSize: 20 } } rowKey='id'
            locale={ {emptyText: ( this.state.tableData.length === 0 &&
              matchedBetsLoadingStatus === LoadingStatus.DONE ? I18n.t('mybets.nodata') : matchedBetsLoadingStatus )} }
              dataSource={ this.state.tableData } columns={ this.state.columns } />
      </div>
    )
  }
}
MatchedBets.propTypes = {
  matchedBets: PropTypes.instanceOf(List).isRequired
}
export default MatchedBets;
