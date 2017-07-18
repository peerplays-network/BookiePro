import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import Ps from 'perfect-scrollbar';
import SplitPane from 'react-split-pane';
import { I18n } from 'react-redux-i18n';
import { bindActionCreators } from 'redux';
import { Button } from 'antd';
import { BetActions, NavigateActions, QuickBetDrawerActions } from '../../../actions';
import { BettingModuleUtils, CurrencyUtils } from '../../../utility';
import BetTable from '../BetTable';
import { Empty, Overlay, Waiting, PlaceBetConfirm } from '../Common';

const renderContent = (props) => (
  <div className='content' ref='bettingtable'>
    { props.bets.isEmpty() &&
      <Empty
        showSuccess={ props.showBetSlipSuccess }
        className='quick_bet_drawer.unconfirmed_bets'
        navigateTo={ props.navigateTo }
      />
    }
    { !props.bets.isEmpty() &&
      // convert the list of keys into vanilla JS array for iterating
      props.bets.keySeq().toArray().map((eventId) => (
        <BetTable
          key={ eventId }
          data={ props.bets.get(eventId).get('unconfirmedBets') }
          title={ props.bets.get(eventId).get('event_name') }
          deleteOne={ props.deleteBet }
          deleteMany={ props.clickDeleteBets }
          updateOne={ props.updateBet }
          dimmed={ props.obscureContent }
          currencyFormat={ props.currencyFormat }
        />
      ))
    }
  </div>
)

class QuickBetDrawer extends PureComponent {

  componentDidMount() {
    Ps.initialize(ReactDOM.findDOMNode(this.refs.bettingtable));
  }

  componentDidUpdate() {
    Ps.update(ReactDOM.findDOMNode(this.refs.bettingtable));
  }

  render() {
    return (
      <div id='quick-bet-drawer' ref='drawer'>
        <SplitPane split='horizontal' defaultSize='40px' allowResize={ false }>
          <div className='title'>
            <div className='label'>{ I18n.t('quick_bet_drawer.header') }</div>
          </div>
          <SplitPane
            split='horizontal'
            minSize={ 40 }
            defaultSize={ 40 }
            primary='second'
            allowResize={ false }
            pane1Style={ { 'overflowY': 'hidden' } }
          >
            { renderContent(this.props) }
            {
              !this.props.bets.isEmpty() &&
              <div className={ `footer ${this.props.obscureContent ? 'dimmed' : ''}` }>
                <Button
                  className={ `btn place-bet btn-regular${this.props.numberOfGoodBets > 0 ? '' : '-disabled'}` }
                  onClick={ () => this.props.clickPlaceBet(this.props.totalBetAmountFloat, this.props.currencyFormat) }
                  disabled={ this.props.numberOfGoodBets === 0  }
                >
                  { I18n.t('quick_bet_drawer.unconfirmed_bets.content.place_bet_button', { amount : this.props.totalBetAmountString }) }
                </Button>
              </div>
            }
          </SplitPane>
        </SplitPane>
        { this.props.showBetSlipConfirmation &&
          <PlaceBetConfirm
            className='quick_bet_drawer.unconfirmed_bets.confirmation'
            goodBets={ this.props.numberOfGoodBets }
            badBets={ this.props.numberOfBadBets }
            amount={ this.props.totalBetAmountString }
            cancelAction={ this.props.cancelPlaceBet }
            confirmAction={ () => this.props.makeBets(this.props.originalBets) }
          />
        }
        { this.props.showBetSlipError &&
          <Overlay
            className='quick_bet_drawer.unconfirmed_bets.error'
            cancelAction={ this.props.cancelPlaceBet }
            confirmAction={ () => this.props.makeBets(this.props.originalBets) }
          />
        }
        { this.props.showDeleteBetsConfirmation &&
          <Overlay
            className='quick_bet_drawer.unconfirmed_bets.delete_bets'
            cancelAction={ this.props.cancelDeleteBets }
            confirmAction={ () => this.props.deleteBets(this.props.betsToBeDeleted) }
            replacements={ { event: this.props.eventNameInDeleteBetsConfirmation } }
          />
        }
        { this.props.showInsufficientBalanceError &&
          <Overlay
            className='quick_bet_drawer.unconfirmed_bets.insufficient_balance'
            confirmAction={ this.props.hideInsufficientBalanceError }
          />
        }
        { this.props.showDisconnectedError &&
          <Overlay
            className='quick_bet_drawer.unconfirmed_bets.disconnected'
            cancelAction={ this.props.hideDisconnectedError }
          />
        }
        { this.props.showBetSlipWaiting && <Waiting /> }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const originalBets = state.getIn(['quickBetDrawer', 'bets']);
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
    // Add the bet to the list of bets with the same market type
    let betListBybetType = unconfirmedBets.get(betType);
    betListBybetType = betListBybetType.push(bet);
    // Put everything back in their rightful places
    unconfirmedBets = unconfirmedBets.set(betType, betListBybetType);
    page = page.setIn([eventId, 'unconfirmedBets'], unconfirmedBets);
  });
  // Total Bet amount
  const totalAmount = originalBets.reduce((total, bet) => {
    const stake = parseFloat(bet.get('stake'));
    return total + (isNaN(stake) ? 0.0 : stake);
  }, 0.0);
  // Number of Good bets
  const numberOfGoodBets = originalBets.reduce((sum, bet) => {
    return sum + (BettingModuleUtils.isValidBet(bet) | 0);
  }, 0);
  // Other statuses
  const showBetSlipConfirmation = state.getIn(['quickBetDrawer', 'showBetSlipConfirmation']);
  const showBetSlipWaiting = state.getIn(['quickBetDrawer', 'showBetSlipWaiting']);
  const showBetSlipError = state.getIn(['quickBetDrawer', 'showBetSlipError']);
  const showBetSlipSuccess = state.getIn(['quickBetDrawer', 'showBetSlipSuccess']);
  const showDeleteBetsConfirmation = state.getIn(['quickBetDrawer', 'showDeleteBetsConfirmation']);
  const showInsufficientBalanceError = state.getIn(['quickBetDrawer', 'showInsufficientBalanceError']);
  const showDisconnectedError = state.getIn(['quickBetDrawer', 'showDisconnectedError']);
  return {
    originalBets,
    bets: page,
    showBetSlipConfirmation,
    showBetSlipWaiting,
    showBetSlipError,
    showBetSlipSuccess,
    showDeleteBetsConfirmation,
    showInsufficientBalanceError,
    showDisconnectedError,
    obscureContent: showBetSlipConfirmation || showBetSlipWaiting || showBetSlipError || showDeleteBetsConfirmation ||
                    showInsufficientBalanceError || showDisconnectedError,
    betsToBeDeleted: state.getIn(['quickBetDrawer', 'betsToBeDeleted']),
    eventNameInDeleteBetsConfirmation: state.getIn(['quickBetDrawer', 'eventNameInDeleteBetsConfirmation']),
    numberOfGoodBets,
    numberOfBadBets: originalBets.size - numberOfGoodBets,
    totalBetAmountFloat: totalAmount,
    totalBetAmountString: CurrencyUtils.getCurruencySymbol(ownProps.currencyFormat) +
                          CurrencyUtils.toFixed('stake', totalAmount, ownProps.currencyFormat),
  };
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
    deleteBet: QuickBetDrawerActions.deleteBet,
    clickDeleteBets: QuickBetDrawerActions.clickDeleteBets,
    cancelDeleteBets: QuickBetDrawerActions.cancelDeleteBets,
    deleteBets: QuickBetDrawerActions.deleteBets,
    updateBet: QuickBetDrawerActions.updateBet,
    clickPlaceBet: QuickBetDrawerActions.clickPlaceBet,
    cancelPlaceBet: QuickBetDrawerActions.cancelPlaceBet,
    makeBets: BetActions.makeBets,
    hideInsufficientBalanceError: QuickBetDrawerActions.hideInsufficientBalanceError,
    hideDisconnectedError: QuickBetDrawerActions.hideDisconnectedError,
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuickBetDrawer);
