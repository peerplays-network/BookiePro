/**
 * The Betslip component contains all the pending bets a user has selected but
 * not yet placed. Its behaviors are almost identical to the Betslip in QuickBetDrawer.
 * The only difference is that this Betslip only contains betslips associated with
 * one sport event so they are all displayed in one {@link BetTable}.
 *
 * The betslips are stored in the Redux store under `marketDrawer`->`unconfirmedBets`.
 */
import React, {PureComponent} from 'react';
import SplitPane from 'react-split-pane';
import {I18n} from 'react-redux-i18n';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Immutable from 'immutable';
import Ps from 'perfect-scrollbar';
import {Button} from 'antd';
import {BetActions, MarketDrawerActions, NavigateActions} from '../../../actions';
import {BettingModuleUtils, CurrencyUtils} from '../../../utility';
import BetTable from '../BetTable';
import './BetSlip.less';
import {Empty, OverlayUtils} from '../Common';
import {BettingDrawerStates, Config} from '../../../constants';
import {MyAccountPageSelector} from '../../../selectors';

const renderContent = (props) => (
  <div className='content' ref='unconfirmedBets'>
    {props.bets.isEmpty() && (
      <Empty
        showSuccess={ props.showBetSlipSuccess }
        className='market_drawer.unconfirmed_bets'
        navigateTo={ props.navigateTo }
      />
    )}
    {!props.bets.isEmpty() && (
      <BetTable
        data={ props.bets }
        title={ I18n.t('market_drawer.unconfirmed_bets.header') }
        deleteOne={ props.deleteUnconfirmedBet }
        deleteMany={ props.clickDeleteUnconfirmedBets }
        updateOne={ props.updateUnconfirmedBet }
        dimmed={ props.obscureContent }
        currencyFormat={ props.currencyFormat }
        oddsFormat={ props.oddsFormat }
<<<<<<< HEAD
        isValidBetTotal={ props.isValidBetTotal }
        betError={ props.betError }
        autoOddsPopulated={ props.autoOddsPopulated }
=======
        activeTab={ props.activeTab }
        disabled={ props.disabled }
>>>>>>> origin/develop
      />
    )}
  </div>
);

class BetSlip extends PureComponent {
  componentDidMount() {
    Ps.initialize(ReactDOM.findDOMNode(this.refs.unconfirmedBets));
  }

  componentDidUpdate() {
    Ps.update(ReactDOM.findDOMNode(this.refs.unconfirmedBets));
  }

  render() {
    let expandedFooterStyle = '';
    if (this.props.isValidBetTotal){
      expandedFooterStyle = '50px';
    } else {
      expandedFooterStyle = '100px';
    }
    return (
      <div className='betslip'>
        <SplitPane
          split='horizontal'
          minSize={ 40 }
          defaultSize={ 40 }
          primary='second'
          allowResize={ false }
<<<<<<< HEAD
          pane1Style={ { 'overflowY': 'hidden', 'paddingBottom': expandedFooterStyle} }
=======
          pane1Style={ {overflowY: 'hidden'} }
>>>>>>> origin/develop
        >
          {renderContent(this.props)}
          {!this.props.bets.isEmpty() && (
            <div className={ `footer ${this.props.obscureContent ? 'dimmed' : ''}` }>
              { !this.props.isValidBetTotal ?
                <div className='bet_balance_error'>{this.props.betsError}</div> : 
                null
              }
              <Button
<<<<<<< HEAD
                className={ `btn place-bet` }
                onClick={ () => this.props.clickPlaceBet(this.props.totalBetAmountFloat, this.props.currencyFormat) }
                disabled={ !this.props.isValidBetTotal }
=======
                className={ 'btn place-bet' }
                onClick={ () => this.props.clickPlaceBet(
                  this.props.totalBetAmountFloat,
                  this.props.currencyFormat
                )
                }
                disabled={ this.props.numberOfGoodBets === 0 }
>>>>>>> origin/develop
              >
                {I18n.t('quick_bet_drawer.unconfirmed_bets.content.place_bet_button')}
                {this.props.currencySymbol}
                {this.props.totalBetAmountString}
              </Button>
            </div>
          )}
        </SplitPane>
        {OverlayUtils.render(
          'market_drawer.unconfirmed_bets',
          this.props,
          () => this.props.makeBets(this.props.originalBets),
          () => this.props.deleteUnconfirmedBets(this.props.unconfirmedbetsToBeDeleted)
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const disabled = ownProps.activeTab === 'PLACEDBETS';
  const originalBets = state.getIn(['marketDrawer', 'unconfirmedBets']);
  var availableBalance = state.getIn(['balance', 'availableBalancesByAssetId', Config.coreAsset, 'balance']);

  var betsError = I18n.t('bet_error.insufficient_balance');
  var autoOddsPopulated = 0;
  var profit, odds, stake;

  let page = Immutable.Map();
  originalBets.forEach((bet) => {
    const betType = bet.get('bet_type');

    // Page content are grouped by market type (back or lay)
    if (!page.has(betType)) {
      page = page.set(betType, Immutable.List());
    }
<<<<<<< HEAD
    profit = bet.get('profit');
    stake = bet.get('stake');
    odds = bet.get('odds');

    profit = profit === undefined || profit === '';
    stake = stake === undefined || stake === '';

    odds = odds !== undefined || odds !== '';

    // If odds exists, it has either been provided by the user and is an incomplete bet or it has been provided via clicking a bet from the /exchange.
    // If odds exists, autopopulated bets increment.
    if( profit && odds && stake){
      autoOddsPopulated = autoOddsPopulated + 1;
    }
    
=======

>>>>>>> origin/develop
    // Add the bet to the list of bets with the same market type
    let betListByBetType = page.get(betType);
    betListByBetType = betListByBetType.push(bet);
    // Put everything back in their rightful places
    page = page.set(betType, betListByBetType);
  });

  // Name   : totalAmount Calculation
  // Author : Keegan Francis : k.francis@pbsa.info
  // Ticket : BOOK-430
  // Purpose: totalAmount is calculated by iterating over the bet objects and
  //           taking either the stake (back) or the profit (lay). The result
  //           will be the amount subtracted from your account when a bet is placed.
  const totalAmount = originalBets.reduce((total, bet) => {
    const stake =
      bet.get('bet_type') === 'back'
        ? parseFloat(bet.get('stake'))
        : parseFloat(bet.get('liability'));
    return total + (isNaN(stake) ? 0.0 : stake);
  }, 0.0);
  // Add the transaction fee to the place bet button.
  /*Precision value will affect whether or not the full number will be displayed, 
  regardless of it being added. */
  let transactionFee =
    ownProps.currencyFormat === 'BTF' ? Config.btfTransactionFee : Config.mbtfTransactionFee;

  // Add a transaction action fee for each bet.
  transactionFee = originalBets.size * transactionFee;

  // Number of Good bets
<<<<<<< HEAD
  const numberOfGoodBets = originalBets.reduce((sum, bet) => {
    return sum + (BettingModuleUtils.isValidBet(bet, availableBalance, ownProps.currencyFormat) | 0);
  }, 0);
  // Overlay
  const overlay = state.getIn(['marketDrawer', 'overlay']);
  const obscureContent = overlay !== BettingDrawerStates.NO_OVERLAY && overlay !== BettingDrawerStates.SUBMIT_BETS_SUCCESS;
  const totalBetAmountString = CurrencyUtils.toFixed('transaction', totalAmount + transactionFee, ownProps.currencyFormat);
  const numberOfBadBets = originalBets.size - numberOfGoodBets;
  // Convert the balance to a human recognizable number.
  // mili[coin] = balance / 100,000
  // [coin] = balance / 100,000,000
  availableBalance = ownProps.currencyFormat.indexOf('m') === 0 ? availableBalance / Math.pow(10, 5) : availableBalance / Math.pow(10, 8);

  const sufficientFunds = parseFloat(totalBetAmountString) <= availableBalance;

  const isValidBetTotal = numberOfBadBets === 0 && sufficientFunds && numberOfGoodBets > 0;

  // If bet total valid and no invalid bets...
  const whiteOrBlack = (numberOfGoodBets !== originalBets.size && !isValidBetTotal) || (numberOfGoodBets === originalBets.size && !isValidBetTotal);
  const betError = (error)=> {
    if(autoOddsPopulated === 0 || isValidBetTotal){
      betsError = '';
    }
  }
=======
  const numberOfGoodBets = originalBets
    .reduce((sum, bet) => sum + (BettingModuleUtils.isValidBet(bet) | 0), 0);
    
  // Overlay
  const overlay = state.getIn(['marketDrawer', 'overlay']);
  const obscureContent =
    overlay !== BettingDrawerStates.NO_OVERLAY &&
    overlay !== BettingDrawerStates.SUBMIT_BETS_SUCCESS;
>>>>>>> origin/develop
  return {
    originalBets,
    bets: page,
    overlay,
    obscureContent,
    unconfirmedbetsToBeDeleted: state.getIn(['marketDrawer', 'unconfirmedbetsToBeDeleted']),
    numberOfGoodBets,
    numberOfBadBets: numberOfBadBets,
    totalBetAmountFloat: totalAmount,
    oddsFormat: MyAccountPageSelector.oddsFormatSelector(state),
<<<<<<< HEAD
    currencySymbol: CurrencyUtils.getCurrencySymbol(ownProps.currencyFormat, whiteOrBlack ? 'white' : 'black'),
    totalBetAmountString: totalBetAmountString,
    availableBalance: availableBalance,
    isValidBetTotal: isValidBetTotal,
    betError,
    betsError,
    autoOddsPopulated
=======
    currencySymbol: CurrencyUtils.getCurrencySymbol(
      ownProps.currencyFormat,
      numberOfGoodBets === 0 ? 'white' : 'black'
    ),
    totalBetAmountString: CurrencyUtils.toFixed(
      'transaction',
      totalAmount + transactionFee,
      ownProps.currencyFormat
    ),
    disabled
>>>>>>> origin/develop
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    navigateTo: NavigateActions.navigateTo,
    deleteUnconfirmedBet: MarketDrawerActions.deleteUnconfirmedBet,
    clickDeleteUnconfirmedBets: MarketDrawerActions.clickDeleteUnconfirmedBets,
    deleteUnconfirmedBets: MarketDrawerActions.deleteUnconfirmedBets,
    updateUnconfirmedBet: MarketDrawerActions.updateUnconfirmedBet,
    clickPlaceBet: MarketDrawerActions.clickPlaceBet,
    makeBets: BetActions.makeBets,
    hideOverlay: MarketDrawerActions.hideOverlay
  },
  dispatch
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BetSlip);
