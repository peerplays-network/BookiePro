/**
 * The PlacedBets component contains bets that have been submitted to the blockchain.
 * The bets are further grouped by their statues, Unmatched and Matched, and are
 * stored in two different components.
 *
 * See {@link UnmatchedBets} and {@link MatchedBets} for more details.
 */
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ReactDOM from 'react-dom';
import Ps from 'perfect-scrollbar';
import {BetActions, MarketDrawerActions, NavigateActions} from '../../../actions';
import {BettingModuleUtils, CurrencyUtils} from '../../../utility';
import UnmatchedBets from './UnmatchedBets';
import MatchedBets from './MatchedBets';
import './PlacedBets.less';
import {Empty, OverlayUtils} from '../Common';
import {BettingDrawerStates, Config, LoadingStatus} from '../../../constants';
import Loading from '../../Loading';
import CommonMessage from '../../CommonMessage/CommonMessage';

class PlacedBets extends PureComponent {

  constructor(props) {
    super(props);
    // By default, there should be no loading screen shown on the betting drawer
    this.props.updatePlacedBetsLoadingStatus(LoadingStatus.DEFAULT);
  }

  componentDidMount() {
    Ps.initialize(ReactDOM.findDOMNode(this.refs.placedBets));
  }

  componentDidUpdate(prevProps) {
    Ps.update(ReactDOM.findDOMNode(this.refs.placedBets));

    // If there are no bets, then the loading screen can go away
    if (this.props.isEmpty) {
      this.props.updatePlacedBetsLoadingStatus(LoadingStatus.DONE);
    } else if (!this.props.isEmpty) {
      // A different set of conditions needs to be true when the placed Bets tab has bets within it
      if (this.props.overlay === 'NO_OVERLAY') {
        if (prevProps.unmatchedBets.size !== this.props.unmatchedBets.size) {
          // If we've received an update wherein there are a different number of bets,
          //  assume that we're done loading those new bets into the betslip
          //  - This clause catches the deletion of bets for any reason
          //  - This clause catches the placement of 'completely' new bets (not updated)
          this.props.updatePlacedBetsLoadingStatus(LoadingStatus.DONE);
        } else if (prevProps.overlay === 'SUBMIT_BETS_SUCCESS') {
          // If we've successfully "submitted" new bets.
          //  - This clause catches updating bets
          this.props.updatePlacedBetsLoadingStatus(LoadingStatus.DONE);
        }
      }
    }
  }

  render() {
    return (
      <div className='placed-bets'>
        <CommonMessage
          location='betslip'
        />
        <div className='content' ref='placedBets'>

          {this.props.placedBetsLoadingStatus === 'loading' ? <Loading /> : ''}
          {!this.props.isEmpty && (
            <UnmatchedBets
              currencyFormat={ this.props.currencyFormat }
              totalBetAmountFloat={ this.props.totalBetAmountFloat }
              totalBetAmountString={ this.props.totalBetAmountString }
              activeTab={ this.props.activeTab }
              disabled={ this.props.disabled }
            />
          )}
          {!this.props.isEmpty && (
            <MatchedBets
              currencyFormat={ this.props.currencyFormat }
              averageOdds={ this.props.averageOdds }
              activeTab={ this.props.activeTab }
              disabled={ this.props.disabled }
            />
          )}
          {this.props.isEmpty && (
            <Empty
              showSuccess={ this.props.overlay === BettingDrawerStates.SUBMIT_BETS_SUCCESS }
              className='market_drawer.placed_bets'
              navigateTo={ this.props.navigateTo }
            />
          )}
        </div>
        {OverlayUtils.render(
          'market_drawer.placed_bets',
          this.props,
          () => this.props.editBets(this.props.unmatchedBets),
          () => this.props.deleteUnmatchedBets(this.props.unmatchedbetsToBeDeleted),
          () => this.props.deleteUnmatchedBet(this.props.unmatchedBetToBeDeleted)
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const disabled = ownProps.activeTab === 'BETSLIP';
  const averageOdds = state.getIn(['marketDrawer', 'groupByAverageOdds']);
  const unmatchedBets = state.getIn(['marketDrawer', 'unmatchedBets']);
  const matchedBets = state.getIn(['marketDrawer', 'matchedBets']);
  // Total Bet amount for updated bets ONLY
  const updatedBets = unmatchedBets.filter((bet) => bet.get('updated'));

  // Update the total amount based on changed bets.
  const totalAmount = updatedBets.reduce((total, bet) => {
    const stake =
      bet.get('bet_type') === 'back'
        ? parseFloat(bet.get('stake'))
        : parseFloat(bet.get('liability'));
    const originalStake =
      bet.get('bet_type') === 'back'
        ? parseFloat(bet.get('original_stake'))
        : parseFloat(bet.get('original_liability'));

    return total + (!isNaN(stake) && !isNaN(originalStake) ? stake - originalStake : 0.0);
  }, 0.0);

  // Add the transaction fee to the place bet button.
  /*Precision value will affect whether or not the full number will be displayed, 
  regardless of it being added. */
  let transactionFee =
    ownProps.currencyFormat === Config.features.currency ?
      Config.coinTransactionFee :
      Config.mCoinTransactionFee;

  // Add a transaction fee for each updated bet.
  if (updatedBets.size > 0) {
    transactionFee = updatedBets.size * transactionFee;
  }

  // Number of Good bets
  const numberOfGoodBets = updatedBets
    .reduce((sum, bet) => sum + (BettingModuleUtils.isValidBet(bet) | 0), 0);
    
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
    totalBetAmountString: CurrencyUtils.toFixed(
      'transaction',
      totalAmount + transactionFee,
      ownProps.currencyFormat
    ),
    disabled,
    averageOdds,
    placedBetsLoadingStatus: state.getIn(['marketDrawer', 'unmatchedBetsLoadingStatus'])
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    navigateTo: NavigateActions.navigateTo,
    getPlacedBets: MarketDrawerActions.getPlacedBets,
    editBets: BetActions.editBets,
    deleteUnmatchedBets: MarketDrawerActions.deleteUnmatchedBets,
    deleteUnmatchedBet: MarketDrawerActions.deleteUnmatchedBet,
    hideOverlay: MarketDrawerActions.hideOverlay,
    updatePlacedBetsLoadingStatus: MarketDrawerActions.updatePlacedBetsLoadingStatus
  }, 
  dispatch
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlacedBets);
