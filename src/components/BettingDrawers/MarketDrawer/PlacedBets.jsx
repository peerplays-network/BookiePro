/**
 * The PlacedBets component contains bets that have been submitted to the blockchain.
 * The bets are further grouped by their statues, Unmatched and Matched, and are
 * stored in two different components.
 *
 * See {@link UnmatchedBets} and {@link MatchedBets} for more details.
 */
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
import { Empty, OverlayUtils } from '../Common';
import { BettingDrawerStates, Config } from '../../../constants'

class PlacedBets extends PureComponent {
  componentDidMount() {
    Ps.initialize(ReactDOM.findDOMNode(this.refs.placedBets));
  }

  componentDidUpdate() {
    Ps.update(ReactDOM.findDOMNode(this.refs.placedBets));
  }

  /**
   * The #componentWillMount function is overriden here in order to retrieve the
   * placed bets from the Blockchain. Normally, this operation is done during the
   * startup process of the Bookie app. However we are doing this EXPLICITLY here
   * because during development time, developers who woork on this page may manually
   * refresh this page to do changes and sometimes the data did not get loaded
   * properly. So this is the temporary solution to that problem.
   *
   * REVIEW: We only need this when the user refresh the browser in web mode
   *         However, this should not happen in the actual desktop app
   */
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
        {
          OverlayUtils.render('market_drawer.placed_bets', this.props,
                              () => this.props.editBets(this.props.unmatchedBets),
                              () => this.props.deleteUnmatchedBets(this.props.unmatchedbetsToBeDeleted),
                              () => this.props.deleteUnmatchedBet(this.props.unmatchedBetToBeDeleted))
        }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const unmatchedBets = state.getIn(['marketDrawer', 'unmatchedBets']);
  const matchedBets = state.getIn(['marketDrawer', 'matchedBets']);
  // Total Bet amount for updated bets ONLY
  const updatedBets = unmatchedBets.filter(bet => bet.get('updated'));
  
  // Update the total amount based on changed bets.
  const totalAmount = updatedBets.reduce((total, bet) => {    
    const stake = bet.get('bet_type') === 'back' ? parseFloat(bet.get('stake')) : parseFloat(bet.get('liability'));
    const originalStake = bet.get('bet_type') === 'back' ? parseFloat(bet.get('original_stake')) : parseFloat(bet.get('original_liability'));

    return total + (!isNaN(stake) && !isNaN(originalStake) ? stake - originalStake : 0.0);
  }, 0.0);

  // Add the transaction fee to the place bet button. 
  /*Precision value will affect whether or not the full number will be displayed, regardless of it being added. */
  let transactionFee = ownProps.currencyFormat === 'BTF' ? Config.btfTransactionFee : Config.mbtfTransactionFee;
  // Add a transaction fee for each updated bet.
  if (updatedBets.size > 0) {
    transactionFee = updatedBets.size * transactionFee;
  }

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
    unmatchedBetToBeDeleted: state.getIn(['marketDrawer', 'unmatchedBetToBeDeleted']),
    numberOfGoodBets,
    numberOfBadBets: updatedBets.size - numberOfGoodBets,
    totalBetAmountFloat: totalAmount + transactionFee,
    totalBetAmountString: CurrencyUtils.toFixed('transaction', totalAmount + transactionFee, ownProps.currencyFormat)
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
    getPlacedBets: MarketDrawerActions.getPlacedBets,
    editBets: BetActions.editBets,
    deleteUnmatchedBets: MarketDrawerActions.deleteUnmatchedBets,
    deleteUnmatchedBet: MarketDrawerActions.deleteUnmatchedBet,
    hideOverlay: MarketDrawerActions.hideOverlay,
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlacedBets);
