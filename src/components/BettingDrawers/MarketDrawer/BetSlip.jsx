import React, { PureComponent } from 'react';
import SplitPane from 'react-split-pane';
import { I18n } from 'react-redux-i18n';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BetActions, MarketDrawerActions, NavigateActions } from '../../../actions';
import Immutable from 'immutable';
import Ps from 'perfect-scrollbar';
import { Button } from 'antd';
import BetTable from '../BetTable';
import './BetSlip.less';
import Overlay from '../Overlay';
import { Empty } from '../Common';

const renderContent = (props) => (
  <div className='content' ref='unconfirmedBets'>
    { props.bets.isEmpty() &&
      <Empty
        showSuccess={ props.showBetSlipSuccess }
        className='market_drawer.unconfirmed_bets'
      />
    }
    { !props.bets.isEmpty() &&
      <BetTable
        data={ props.bets }
        title={ I18n.t('market_drawer.unconfirmed_bets.header') }
        deleteOne={ props.deleteUnconfirmedBet }
        deleteMany={ props.clickDeleteUnconfirmedBets }
        updateOne={ props.updateUnconfirmedBet }
        dimmed={ props.obscureContent }
        currencyFormat={ props.currencyFormat }
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
              <Button className='btn btn-regular place-bet' onClick={ this.props.clickPlaceBet }>
                { I18n.t('market_drawer.unconfirmed_bets.content.place_bet_button', { amount : 0.295}) }
              </Button>
            </div>
          }
        </SplitPane>
        { this.props.showBetSlipConfirmation &&
          <Overlay
            className='market_drawer.unconfirmed_bets.confirmation'
            cancelAction={ this.props.cancelPlaceBet }
            confirmAction={ () => this.props.makeBets(this.props.originalBets)  }
            replacements={ { amount: 0.051 } }
          />
        }
        { this.props.showBetSlipError &&
          <Overlay
            className='market_drawer.unconfirmed_bets.error'
            cancelAction={ this.props.cancelPlaceBet }
            confirmAction={ () => this.props.makeBets(this.props.originalBets) }
          />
        }
        { this.props.showDeleteUnconfirmedBetsConfirmation &&
          <Overlay
            className='market_drawer.unconfirmed_bets.delete_bets'
            cancelAction={ this.props.cancelDeleteUnconfirmedBets }
            confirmAction={ () => this.props.deleteUnconfirmedBets(this.props.unconfirmedbetsToBeDeleted) }
          />
        }
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
  const showDeleteUnconfirmedBetsConfirmation = state.getIn(['marketDrawer', 'showDeleteUnconfirmedBetsConfirmation']);
  return {
    originalBets,
    bets: page,
    showBetSlipConfirmation,
    showBetSlipWaiting,
    showBetSlipError,
    showBetSlipSuccess,
    showDeleteUnconfirmedBetsConfirmation,
    obscureContent: showBetSlipConfirmation || showBetSlipWaiting || showBetSlipError || showDeleteUnconfirmedBetsConfirmation,
    unconfirmedbetsToBeDeleted: state.getIn(['marketDrawer', 'unconfirmedbetsToBeDeleted']),
  };
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
    deleteUnconfirmedBet: MarketDrawerActions.deleteUnconfirmedBet,
    clickDeleteUnconfirmedBets: MarketDrawerActions.clickDeleteUnconfirmedBets,
    cancelDeleteUnconfirmedBets: MarketDrawerActions.cancelDeleteUnconfirmedBets,
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
