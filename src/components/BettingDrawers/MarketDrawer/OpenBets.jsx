/**
 * The OpenBets component contains bets that have been submitted to the blockchain.
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
import './OpenBets.less';
import {Empty, OverlayUtils} from '../Common';
import {BettingDrawerStates, Config, LoadingStatus} from '../../../constants';
import Loading from '../../Loading';
import CommonMessage from '../../CommonMessage/CommonMessage';

class OpenBets extends PureComponent {

  constructor(props) {
    super(props);
    // By default, there should be no loading screen shown on the betting drawer
    this.props.updateOpenBetsLoadingStatus(LoadingStatus.DEFAULT);
  }

  componentDidMount() {
    Ps.initialize(ReactDOM.findDOMNode(this.refs.openBets));
  }

  componentDidUpdate(prevProps) {
    Ps.update(ReactDOM.findDOMNode(this.refs.openBets));

    // If there are no bets, then there is no need for the loading screen
    if (this.props.isEmpty) {
      this.props.updateOpenBetsLoadingStatus(LoadingStatus.DONE);
    } else if (this.props.overlay === 'NO_OVERLAY') {
      // No overlay is a precondition for the rest of the
      //  conditions for there not being a loading screen.
      if (
        prevProps.overlay !== this.props.overlay &&
        prevProps.overlay !== 'DELETE_BET_CONFIRMATION' &&
        prevProps.overlay !== 'DELETE_BETS_CONFIRMATION'
      ) {
        // If there are bets in the betslip, then we need to make sure there is
        // "nothing in progress" before we remove the loading screen
        // The Betslip is "doing something" one of the following is true
        //  - The user has just confirmed they would like to delete one or more bets
        //  - The BMG has switched states and triggered the deletion of Bets in the betslip
        this.props.updateOpenBetsLoadingStatus(LoadingStatus.DONE);
      } else if (prevProps.unmatchedBets.size !== this.props.unmatchedBets.size) {
        // If there is a different number of bets in the unmatchedBets array, then the app has
        //  just finished adding/removing something.
        this.props.updateOpenBetsLoadingStatus(LoadingStatus.DONE);
      } else if (prevProps.overlay === 'SUBMIT_BETS_SUCCESS') {
        this.props.updateOpenBetsLoadingStatus(LoadingStatus.DONE);
      }
    }
  }

  render() {
    let showLoadingScreen;

    switch (this.props.openBetsLoadingStatus) {
      case LoadingStatus.LOADING:
      case LoadingStatus.BET_DELETE:
      case LoadingStatus.BET_PLACE:
        showLoadingScreen = true;
        break;
      default:
        showLoadingScreen = false;
    }

    return (
      <div className='open-bets'>
        <div className='content' ref='openBets'>
          <CommonMessage
            location='betslip'
          />
          {showLoadingScreen ? <Loading /> : ''}
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
              className='market_drawer.open_bets'
              navigateTo={ this.props.navigateTo }
            />
          )}
        </div>
        {!showLoadingScreen &&
          OverlayUtils.render(
            'market_drawer.open_bets',
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
  const availableBalance = state.getIn(
    ['balance', 'availableBalancesByAssetId', Config.coreAsset, 'balance']
  );
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
  // 
  // Precision value will affect whether or not the full number will be displayed, 
  //  regardless of it being added.
  let transactionFee =
    ownProps.currencyFormat === Config.features.currency ?
      Config.coinTransactionFee :
      Config.mCoinTransactionFee;

  // Add a transaction fee for each updated bet.
  if (updatedBets.size > 0) {
    transactionFee = updatedBets.size * transactionFee;
  }

  // Number of Good bets
  const numberOfGoodBets = updatedBets.reduce((sum, bet) => {
    return sum +
      (BettingModuleUtils.isValidBet(bet, availableBalance, ownProps.currencyFormat) | 0);
  }, 0);
  // Overlay
  const overlay = state.getIn(['marketDrawer', 'overlay']);
  const currencyType = CurrencyUtils.getCurrencyType(ownProps.currencyFormat);
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
      currencyType
    ),
    availableBalance: availableBalance,
    disabled,
    averageOdds,
    openBetsLoadingStatus: state.getIn(['marketDrawer', 'unmatchedBetsLoadingStatus'])
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    navigateTo: NavigateActions.navigateTo,
    getOpenBets: MarketDrawerActions.getOpenBets,
    editBets: BetActions.editBets,
    deleteUnmatchedBets: MarketDrawerActions.deleteUnmatchedBets,
    deleteUnmatchedBet: MarketDrawerActions.deleteUnmatchedBet,
    hideOverlay: MarketDrawerActions.hideOverlay,
    updateOpenBetsLoadingStatus: MarketDrawerActions.updateOpenBetsLoadingStatus
  }, 
  dispatch
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OpenBets);
