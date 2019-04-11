/**
 * The QuickBetDrawer is used for placing bets. Its only component is called
 * Betslip where collection of items, betslips, are stored. When a user clicks on
 * an offer from the SimpleBettingWidget (Quick Market Betting Widget), a betslip
 * with the Odds indicated in the offet will be created in the QuickBetDrawer.
 *
 * The betslips are only stored in the Bookie application. Once a betslip has been
 * submitted to the Blockchain (placed a bet), the betslip will be deleted. If
 * the user navigates to other pages in the application while there are some betslips
 * sitting in the QuickBetDrawer, the user will be prompted to cancel the page
 * navigation or delete all betslips and move on.
 *
 * The QuickBetDrawer groups betslips by sport event. All betslips associated to
 * the same sports event are stored in one {@link BetTable}. However when the user
 * places the bets, all of the betslips will be submitted to the Blockchain and
 * are removed from the QuickBetDrawer.
 *
 * The state of the QuickBetDrawer is maintained in the Redux store as `quickBetDrawer`.
 */
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import Ps from 'perfect-scrollbar';
import SplitPane from 'react-split-pane';
import {I18n} from 'react-redux-i18n';
import {bindActionCreators} from 'redux';
import {Button} from 'antd';
import {BetActions, NavigateActions, QuickBetDrawerActions} from '../../../actions';
import {BettingModuleUtils, CurrencyUtils} from '../../../utility';
import BetTable from '../BetTable';
import {Empty, OverlayUtils} from '../Common';
import {BettingDrawerStates, Config} from '../../../constants';
import {MyAccountPageSelector} from '../../../selectors';
import Subtotal from '../MarketDrawer/Subtotal';
import CommonMessage from '../../CommonMessage/CommonMessage';
import CommonMessageUtils from '../../../utility/CommonMessageUtils';

const renderContent = (props) => (
  <div className='content' ref='bettingtable'>
    <CommonMessage
      location='betslip'
    />
    {props.bets.isEmpty() && (
      <Empty
        showSuccess={ props.overlay === BettingDrawerStates.SUBMIT_BETS_SUCCESS }
        className='quick_bet_drawer.unconfirmed_bets'
        navigateTo={ props.navigateTo }
      />
    )}
    {!props.bets.isEmpty() &&
      // convert the list of keys into vanilla JS array for iterating
      props.bets
        .keySeq()
        .toArray()
        .map((eventId) => (
          <BetTable
            key={ eventId }
            data={ props.bets.get(eventId).get('unconfirmedBets') }
            title={ props.bets.get(eventId).get('event_name') }
            deleteOne={ props.deleteBet }
            deleteMany={ props.clickDeleteBets }
            updateOne={ props.updateBet }
            dimmed={ props.obscureContent }
            currencyFormat={ props.currencyFormat }
            oddsFormat={ props.oddsFormat }
            isValidBetTotal={ props.isValidBetTotal }
            autoOddsPopulated={ props.autoOddsPopulated }
          />
        ))
    }
  </div>
);

class QuickBetDrawer extends PureComponent {
  addRemoveMessage() {
    this.props.betslipAddRemove(
      this.props.betsError[0], this.props.betsError[1]
    );
  }
  
  componentDidMount() {
    Ps.initialize(ReactDOM.findDOMNode(this.refs.bettingtable));
    this.addRemoveMessage();
  }

  componentDidUpdate(prevProps) {
    // Get the button element in the footer.
    let rect = document.getElementById('btn--place-bet');
    let footerID = 'qbd-footer';

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

    Ps.update(ReactDOM.findDOMNode(this.refs.bettingtable));
    
    if (prevProps.betsError[0] !== this.props.betsError[0]) {
      this.addRemoveMessage();
    }

  }

  render() {
    return (
      <div id='quick-bet-drawer' ref='drawer'>
        <SplitPane split='horizontal' defaultSize='40px' allowResize={ false }>
          <div className='title'>
            <div className='label'>{I18n.t('quick_bet_drawer.header')}</div>
          </div>
          <SplitPane
            split='horizontal'
            minSize={ 40 }
            defaultSize={ 40 }
            primary='second'
            allowResize={ false }
            pane1Style={ {overflowY: 'hidden'} }
          >
            {renderContent(this.props)}
            {!this.props.bets.isEmpty() && (
              <div 
                className={
                  `quick-bet-drawer__footer${this.props.obscureContent ? '-dimmed' : ''}`
                }
                id='qbd-footer'
              >
                <Subtotal
                  betAmount={ this.props.totalBetAmountFloat }
                  transactionFee={ this.props.transactionFee }
                  currencyFormat={ this.props.currencyFormat }
                />
                <Button
                  className={ `btn place-bet btn${
                    this.props.numberOfGoodBets > 0 ? '-regular' : '-disabled'
                  }` }
                  id='btn--place-bet'
                  onClick={ () => this.props.clickPlaceBet(
                    this.props.totalBetAmountFloat, 
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
        </SplitPane>
        {OverlayUtils.render(
          'quick_bet_drawer.unconfirmed_bets',
          this.props,
          () => this.props.makeBets(this.props.originalBets),
          () => this.props.deleteBets(this.props.betsToBeDeleted)
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const originalBets = state.getIn(['quickBetDrawer', 'bets']);
  const currencyType = CurrencyUtils.getCurrencyType(ownProps.currencyFormat);
  var availableBalance = state.getIn(
    ['balance', 'availableBalancesByAssetId', Config.coreAsset, 'balance']
  );
  var autoOddsPopulated = 0;
  var profit, odds, stake;
  let page = Immutable.Map();
  originalBets.forEach((bet) => {
    const eventId = bet.get('event_id');
    const betType = bet.get('bet_type');

    // Page content are first grouped by event_id
    if (!page.has(eventId)) {
      const eventObj = Immutable.Map()
        .set('event_id', eventId)
        .set('event_name', bet.get('event_name'))
        .set('unconfirmedBets', Immutable.Map());
      page = page.set(eventId, eventObj);
    }

    // Then page content is further grouped by market type (back or lay)
    let unconfirmedBets = page.getIn([eventId, 'unconfirmedBets']);

    if (!unconfirmedBets.has(betType)) {
      unconfirmedBets = unconfirmedBets.set(betType, Immutable.List());
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
    if ( profit && odds && stake){
      autoOddsPopulated = autoOddsPopulated + 1;
    }

    // Add the bet to the list of bets with the same market type
    let betListBybetType = unconfirmedBets.get(betType);
    betListBybetType = betListBybetType.push(bet);
    // Put everything back in their rightful places
    unconfirmedBets = unconfirmedBets.set(betType, betListBybetType);
    page = page.setIn([eventId, 'unconfirmedBets'], unconfirmedBets);
  });
  
  // Total Bet amount
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
  const overlay = state.getIn(['quickBetDrawer', 'overlay']);
  const currencyFormat = MyAccountPageSelector.currencyFormatSelector(state);
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

  var betsError = CommonMessageUtils.determineMessageAndId(
    originalBets.size, numberOfBadBets, sufficientFunds
  );

  // Overlay
  const obscureContent =
    overlay !== BettingDrawerStates.NO_OVERLAY &&
    overlay !== BettingDrawerStates.SUBMIT_BETS_SUCCESS;

  const currencySymbol = CurrencyUtils.getCurrencySymbol(
    currencyFormat,
    numberOfGoodBets === 0 ? 'white' : 'black'
  );

  return {
    originalBets,
    bets: page,
    overlay,
    obscureContent,
    betsToBeDeleted: state.getIn(['quickBetDrawer', 'betsToBeDeleted']),
    eventNameInDeleteBetsConfirmation: state.getIn([
      'quickBetDrawer',
      'eventNameInDeleteBetsConfirmation'
    ]),
    numberOfGoodBets,
    numberOfBadBets: numberOfBadBets,
    totalBetAmountFloat: totalAmount,
    oddsFormat: MyAccountPageSelector.oddsFormatSelector(state),
    transactionFee,
    currencySymbol,
    totalBetAmountString,
    availableBalance,
    isValidBetTotal,
    betsError,
    autoOddsPopulated
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    navigateTo: NavigateActions.navigateTo,
    deleteBet: QuickBetDrawerActions.deleteBet,
    clickDeleteBets: QuickBetDrawerActions.clickDeleteBets,
    deleteBets: QuickBetDrawerActions.deleteBets,
    updateBet: QuickBetDrawerActions.updateBet,
    clickPlaceBet: QuickBetDrawerActions.clickPlaceBet,
    makeBets: BetActions.makeBets,
    hideOverlay: QuickBetDrawerActions.hideOverlay,
    betslipAddRemove: CommonMessageUtils.betslipAddRemove
  },
  dispatch
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuickBetDrawer);
