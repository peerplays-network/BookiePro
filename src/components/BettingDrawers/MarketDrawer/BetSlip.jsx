import React, { PureComponent } from 'react';
import SplitPane from 'react-split-pane';
import { I18n, Translate } from 'react-redux-i18n';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BetActions, MarketDrawerActions, NavigateActions } from '../../../actions';
import Immutable from 'immutable';
import Ps from 'perfect-scrollbar';
import { Button } from 'antd';
import EditableBetTable from '../EditableBetTable';
import './BetSlip.less';

const renderOverlay = (props, className, transactionFee=0) => (
  <div className='overlay'>
    <div className='instructions'>
      <Translate value={ `market_drawer.unconfirmed_bets.${ className }.instructions` } amount={ transactionFee } dangerousHTML/>
    </div>
    <div className='buttons'>
      <Button onClick={ props.cancelPlaceBet }>
        { I18n.t(`market_drawer.unconfirmed_bets.${ className }.cancel_button`) }
      </Button>
      <Button onClick={ () => props.makeBets(props.originalBets) }>
        { I18n.t(`market_drawer.unconfirmed_bets.${ className }.confirm_button`) }
      </Button>
    </div>
  </div>
)

const renderContent = (props) => (
  <div className='content' ref='unconfirmedBets'>
    { props.bets.isEmpty() &&
      <div className='empty'>
        <div className='instructions'>
          {  props.showBetSlipSuccess &&
             I18n.t('market_drawer.unconfirmed_bets.success.instructions')
          }
          { !props.showBetSlipSuccess &&
            <Translate value='market_drawer.unconfirmed_bets.empty.instructions' dangerousHTML/>
          }
        </div>
        <div className='my-bet-button'>
          <Button onClick={ () => props.navigateTo('/my-wager/') }>
            { I18n.t('market_drawer.unconfirmed_bets.empty.my_bet_button') }
          </Button>
        </div>
      </div>
    }
    { !props.bets.isEmpty() &&
      <EditableBetTable
        data={ props.bets }
        title={ I18n.t('market_drawer.unconfirmed_bets.header') }
        deleteOne={ props.deleteUnconfirmedBet }
        deleteMany={ props.deleteUnconfirmedBets }
        updateOne={ props.updateUnconfirmedBet }
        dimmed={ props.obscureContent }
      />
    }
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
    return (
      <div className='betslip'>
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
              <Button className='place-bet' onClick={ this.props.clickPlaceBet }>
                { I18n.t('market_drawer.unconfirmed_bets.content.place_bet_button', { amount : 0.295}) }
              </Button>
            </div>
          }
        </SplitPane>
        { this.props.showBetSlipConfirmation && renderOverlay(this.props, 'confirmation', 0.051) }
        { this.props.showBetSlipError && renderOverlay(this.props, 'error') }
        { // TODO: Replace this with an approved spinning icon.
          // The waiting text is just a placeholder
          this.props.showBetSlipWaiting &&
          <div className='waiting'>
            <div className='instructions'>
              Waiting...
            </div>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const originalBets = state.getIn(['marketDrawer', 'unconfirmedBets']);
  let page = Immutable.Map();
  originalBets.forEach((bet) => {
    const betType = bet.get('bet_type');

    // Page content are grouped by market type (back or lay)
    if (!page.has(betType)) {
      page = page.set(betType, Immutable.List());
    }
    // Add the bet to the list of bets with the same market type
    let betListByBetType = page.get(betType);
    betListByBetType = betListByBetType.push(bet);
    // Put everything back in their rightful places
    page = page.set(betType, betListByBetType);
  });
  // Other statuses
  const showBetSlipConfirmation = state.getIn(['marketDrawer', 'showBetSlipConfirmation']);
  const showBetSlipWaiting = state.getIn(['marketDrawer', 'showBetSlipWaiting']);
  const showBetSlipError = state.getIn(['marketDrawer', 'showBetSlipError']);
  const showBetSlipSuccess = state.getIn(['marketDrawer', 'showBetSlipSuccess']);
  return {
    originalBets,
    bets: page,
    showBetSlipConfirmation,
    showBetSlipWaiting,
    showBetSlipError,
    showBetSlipSuccess,
    obscureContent: showBetSlipConfirmation || showBetSlipWaiting || showBetSlipError,
  };
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
    deleteUnconfirmedBet: MarketDrawerActions.deleteUnconfirmedBet,
    deleteUnconfirmedBets: MarketDrawerActions.deleteUnconfirmedBets,
    updateUnconfirmedBet: MarketDrawerActions.updateUnconfirmedBet,
    clickPlaceBet: MarketDrawerActions.clickPlaceBet,
    cancelPlaceBet: MarketDrawerActions.cancelPlaceBet,
    makeBets: BetActions.makeBets,
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BetSlip);
