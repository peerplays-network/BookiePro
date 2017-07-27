import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactDOM from 'react-dom';
import Ps from 'perfect-scrollbar';
import { BetActions, MarketDrawerActions, NavigateActions } from '../../../actions';
import { BettingModuleUtils, CurrencyUtils } from '../../../utility';
import UnmatchedBets from './UnmatchedBets';
import MatchedBets from './MatchedBets';
import './PlacedBets.less';
import { Empty, Overlay, Waiting, PlaceBetConfirm } from '../Common';
import { BettingDrawerStates } from '../../../constants'

const renderOverlay = (props) => {
  switch (props.overlay) {
    case BettingDrawerStates.SUBMIT_BETS_CONFIRMATION:
      return (
        <PlaceBetConfirm
          className='market_drawer.placed_bets.confirmation'
          goodBets={ props.numberOfGoodBets }
          badBets={ props.numberOfBadBets }
          amount={ props.totalBetAmountString }
          cancelAction={ props.hideOverlay }
          confirmAction={ () => props.editBets(props.unmatchedBets) }
        />
      )
    case BettingDrawerStates.SUBMIT_BETS_ERROR:
      return (
        <Overlay
          className='market_drawer.placed_bets.error'
          cancelAction={ props.hideOverlay }
          confirmAction={ () => props.editBets(props.unmatchedBets) }
        />
      )
    case BettingDrawerStates.DELETE_BETS_CONFIRMATION:
      return (
        <Overlay
          className='market_drawer.placed_bets.delete_bets'
          cancelAction={ props.hideOverlay }
          confirmAction={ () => props.deleteUnmatchedBets(props.unmatchedbetsToBeDeleted) }
        />
      )
    case BettingDrawerStates.INSUFFICIENT_BALANCE_ERROR:
      return (
        <Overlay
          className='market_drawer.placed_bets.insufficient_balance'
          confirmAction={ props.hideOverlay }
        />
      )
    case BettingDrawerStates.DISCONNECTED_ERROR:
      return (
        <Overlay
          className='market_drawer.placed_bets.disconnected'
          cancelAction={ props.hideOverlay }
        />
      )
    case BettingDrawerStates.SUBMIT_BETS_WAITING:
      return <Waiting/>
    default:
      return;
  }
}

class PlacedBets extends PureComponent {
  componentDidMount() {
    Ps.initialize(ReactDOM.findDOMNode(this.refs.placedBets));
  }

  componentDidUpdate() {
    Ps.update(ReactDOM.findDOMNode(this.refs.placedBets));
  }

  // TODO We only need this when the user refresh the browser in web mode
  //      However, this should not happen in the actual desktop app
  componentWillMount() {
    // Extract the current Betting Market Group Id the user is viewing
    // This is required to filter the data from all ongoing bets
    // TODO REVIEW feel free to replace this with a better method!
    const bettingMarketGroupId = window.location.href.split('/').pop();
    this.props.getPlacedBets(bettingMarketGroupId);
  }

  render() {
    return (
      <div className='placed-bets'>
        <div className='content' ref='placedBets'>
          { !this.props.isEmpty &&
            <UnmatchedBets
               currencyFormat={ this.props.currencyFormat }
               totalBetAmountFloat={ this.props.totalBetAmountFloat }
               totalBetAmountString={ this.props.totalBetAmountString }
            />
          }
          { !this.props.isEmpty && <MatchedBets currencyFormat={ this.props.currencyFormat }/> }
          { this.props.isEmpty &&
            <Empty
              showSuccess={ this.props.overlay === BettingDrawerStates.SUBMIT_BETS_SUCCESS }
              className='market_drawer.placed_bets'
              navigateTo={ this.props.navigateTo }
            />
          }
        </div>
        { renderOverlay(this.props) }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const unmatchedBets = state.getIn(['marketDrawer', 'unmatchedBets']);
  const matchedBets = state.getIn(['marketDrawer', 'matchedBets']);
  // Total Bet amount for updated bets ONLY
  const updatedBets = unmatchedBets.filter(bet => bet.get('updated'));
  const totalAmount = updatedBets.reduce((total, bet) => {
    const stake = parseFloat(bet.get('stake'));
    const originalStake = parseFloat(bet.get('original_stake'));
    return total + (!isNaN(stake) && !isNaN(originalStake) ? stake - originalStake : 0.0);
  }, 0.0);
  // Number of Good bets
  const numberOfGoodBets = updatedBets.reduce((sum, bet) => {
    return sum + (BettingModuleUtils.isValidBet(bet) | 0);
  }, 0);
  // Overlay
  const overlay = state.getIn(['marketDrawer', 'overlay']);
  return {
    unmatchedBets,
    isEmpty: unmatchedBets.isEmpty() && matchedBets.isEmpty(),
    overlay,
    unmatchedbetsToBeDeleted: state.getIn(['marketDrawer', 'unmatchedbetsToBeDeleted']),
    numberOfGoodBets,
    numberOfBadBets: updatedBets.size - numberOfGoodBets,
    totalBetAmountFloat: totalAmount,
    totalBetAmountString: CurrencyUtils.getCurruencySymbol(ownProps.currencyFormat) +
                          CurrencyUtils.toFixed('stake', totalAmount, ownProps.currencyFormat),
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
    getPlacedBets: MarketDrawerActions.getPlacedBets,
    editBets: BetActions.editBets,
    deleteUnmatchedBets: MarketDrawerActions.deleteUnmatchedBets,
    hideOverlay: MarketDrawerActions.hideOverlay,
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlacedBets);
