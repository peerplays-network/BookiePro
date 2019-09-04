/**
 * The Place Bets component contains all the pending bets a user has selected but
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
import Subtotal from './Subtotal';
import CommonMessage from '../../CommonMessage/CommonMessage';
import CommonMessageUtils from '../../../utility/CommonMessageUtils';

const renderContent = (props) => (
  <div className='content' ref='unconfirmedBets'>
    <CommonMessage
      location='betslip'
    />
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
        isValidBetTotal={ props.isValidBetTotal }
        betError={ props.betError }
        autoOddsPopulated={ props.autoOddsPopulated }
        activeTab={ props.activeTab }
        disabled={ props.disabled }
      />
    )}
  </div>
);

class PlaceBet extends PureComponent {
  addRemoveMessage() {
    this.props.betslipAddRemove(
      this.props.betsError[0], this.props.betsError[1]
    );
  }

  componentDidMount() {
    Ps.initialize(ReactDOM.findDOMNode(this.refs.unconfirmedBets));
    this.addRemoveMessage();
  }

  componentDidUpdate(prevProps) {
    // Get the button element in the footer.
    let rect = document.getElementById('btn--place-bet');
    let footerID = 'pb-footer';

    // If the `rect` exists, we will proceed to get its location in the DOM.
    if (rect) {
      // Determine if the 'rect' is visible within its scrollable element. 'content
      let rectParent = rect.parentElement.parentElement.parentElement.parentElement;

      BettingModuleUtils.inViewport(rect, rectParent, footerID);

      // Add event listener for scrolling/resize on the place bet button parent div. 
      // Just a precaution.
      rectParent.addEventListener('scroll', () => {
        BettingModuleUtils.inViewport(rect, rectParent, footerID);
      });
      // Window event listener for immediate update of footer while resizing.
      window.addEventListener('resize', () => {
        BettingModuleUtils.inViewport(rect, rectParent, footerID);
      });
    }

    Ps.update(ReactDOM.findDOMNode(this.refs.unconfirmedBets));

    if (prevProps.betsError[0] !== this.props.betsError[0]) {
      this.addRemoveMessage();
    }
  }

  render() {
    return (
      <div className='betslip'>
        <SplitPane
          split='horizontal'
          minSize={ 40 }
          defaultSize={ 40 }
          primary='second'
          allowResize={ false }
          pane1Style={ {'overflowY': 'hidden'} }
        >
          {renderContent(this.props)}
          {!this.props.bets.isEmpty() && (
            <div 
              className={
                `place-bet-drawer__footer${this.props.obscureContent ? '-dimmed' : ''}`
              }
              id='pb-footer'
            >
              <Subtotal
                betAmount={ this.props.totalBetAmountFloat }
                transactionFee={ this.props.transactionFee }
                currencyFormat={ this.props.currencyFormat }
              />
              <Button
                className={ 'btn place-bet' }
                id={ 'btn--place-bet' }
                onClick={ () => this.props.clickPlaceBet(
                  this.props.totalBetAmountString,
                  this.props.currencyFormat
                )
                }
                disabled={ !this.props.isValidBetTotal }
              >
                {I18n.t('quick_bet_drawer.unconfirmed_bets.content.place_bet_button')}
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
  const disabled = ownProps.activeTab === 'OPENBETS';
  const originalBets = state.getIn(['marketDrawer', 'unconfirmedBets']);
  var availableBalance = state.getIn(
    ['balance', 'availableBalancesByAssetId', Config.coreAsset, 'balance']
  );
  const currencyType = CurrencyUtils.getCurrencyType(ownProps.currencyFormat);
  var autoOddsPopulated = 0;
  var profit, odds, stake;

  let page = Immutable.Map();
  originalBets.forEach((bet) => {
    const betType = bet.get('bet_type');

    // Page content are grouped by market type (back or lay)
    if (!page.has(betType)) {
      page = page.set(betType, Immutable.List());
    }

    profit = bet.get('profit');
    stake = bet.get('stake');
    odds = bet.get('odds');

    profit = profit === undefined || profit === '';
    stake = stake === undefined || stake === '';

    odds = odds !== undefined || odds !== '';

    // If odds exists, it has either been provided by the user and is an incomplete bet or it has 
    // been provided via clicking a bet from the /exchange.
    // If odds exists, autopopulated bets increment.
    if( profit && odds && stake){
      autoOddsPopulated = autoOddsPopulated + 1;
    }
    
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
    ownProps.currencyFormat === Config.features.currency ?
      Config.coinTransactionFee :
      Config.mCoinTransactionFee;

  // Add a transaction action fee for each bet.
  transactionFee = originalBets.size * transactionFee;
  // Number of Good bets
  const numberOfGoodBets = originalBets.reduce((sum, bet) => {
    return sum + 
    (BettingModuleUtils.isValidBet(bet, availableBalance, currencyType) | 0);
  }, 0);
  // Overlay
  const overlay = state.getIn(['marketDrawer', 'overlay']);
  const obscureContent =
    overlay !== BettingDrawerStates.NO_OVERLAY &&
    overlay !== BettingDrawerStates.SUBMIT_BETS_SUCCESS;
  const totalBetAmountString = CurrencyUtils.toFixed(
    'transaction',
    totalAmount + transactionFee,
    currencyType
  );
  const numberOfBadBets = originalBets.size - numberOfGoodBets;

  // Convert the balance to a human recognizable number.
  // mili[coin] = balance / 100,000
  // [coin] = balance / 100,000,000
  if (currencyType === 'mCoin') {
    availableBalance = availableBalance / Math.pow(10, 5);
  } else {
    availableBalance = availableBalance / Math.pow(10, 8);
  }

  const sufficientFunds = parseFloat(totalBetAmountString) <= availableBalance;
  const isValidBetTotal = numberOfBadBets === 0 && sufficientFunds && numberOfGoodBets > 0;

  // Determine if there are any common errors.
  var betsError = CommonMessageUtils.determineMessageAndId(
    originalBets.size, numberOfBadBets, sufficientFunds
  );

  const currencyFormat = MyAccountPageSelector.currencyFormatSelector(state);
  const currencySymbol = CurrencyUtils.getCurrencySymbol(
    currencyFormat,
    numberOfGoodBets === 0 ? 'white' : 'black'
  );

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
    transactionFee,
    totalBetAmountString,
    availableBalance,
    isValidBetTotal,
    betsError,
    autoOddsPopulated,
    currencySymbol,
    disabled
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
    hideOverlay: MarketDrawerActions.hideOverlay,
    betslipAddRemove: CommonMessageUtils.betslipAddRemove
  },
  dispatch
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlaceBet);
