import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import Ps from 'perfect-scrollbar';
import SplitPane from 'react-split-pane';
import { I18n, Translate } from 'react-redux-i18n';
import { BetActions, NavigateActions, QuickBetDrawerActions } from '../../../actions';
import { Button } from 'antd';
import { bindActionCreators } from 'redux';
import EditableBetTable from '../EditableBetTable';

const renderOverlay = (props, className, transactionFee=0) => (
  <div className='overlay'>
    <div className='instructions'>
      <Translate value={ `quick_bet_drawer.unconfirmed_bets.${ className }.instructions` } amount={ transactionFee } dangerousHTML/>
    </div>
    <div className='buttons'>
      <Button onClick={ props.cancelPlaceBet }>
        { I18n.t(`quick_bet_drawer.unconfirmed_bets.${ className }.cancel_button`) }
      </Button>
      <Button onClick={ () => props.makeBets(props.originalBets) }>
        { I18n.t(`quick_bet_drawer.unconfirmed_bets.${ className }.confirm_button`) }
      </Button>
    </div>
  </div>
)

const renderContent = (props) => (
  <div className='content' ref='bettingtable'>
    { props.bets.isEmpty() &&
      <div className='empty'>
        <div className='instructions'>
          {  props.showBetSlipSuccess &&
             I18n.t('quick_bet_drawer.unconfirmed_bets.success.instructions')
          }
          { !props.showBetSlipSuccess &&
            <Translate value='quick_bet_drawer.unconfirmed_bets.empty.instructions' dangerousHTML/>
          }
        </div>
        <div className='my-bet-button'>
          <Button onClick={ () => props.navigateTo('/my-wager/') }>
            { I18n.t('quick_bet_drawer.unconfirmed_bets.empty.my_bet_button') }
          </Button>
        </div>
      </div>
    }
    { !props.bets.isEmpty() &&
      // convert the list of keys into vanilla JS array for iterating
      props.bets.keySeq().toArray().map((eventId) => (
        <EditableBetTable
          key={ eventId }
          data={ props.bets.get(eventId) }
          deleteOne={ props.deleteBet }
          deleteMany={ props.deleteBets }
          updateOne={ props.updateBet }
          dimmed={ props.obscureContent }
        />
      ))
    }
  </div>
)

class QuickBetDrawer extends Component {

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
                <Button className='place-bet' onClick={ this.props.clickPlaceBet }>
                  { I18n.t('quick_bet_drawer.unconfirmed_bets.content.place_bet_button', { amount : 0.295}) }
                </Button>
              </div>
            }
          </SplitPane>
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
    );
  }
}

const mapStateToProps = (state) => {
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
  // Other statuses
  const showBetSlipConfirmation = state.getIn(['quickBetDrawer', 'showBetSlipConfirmation']);
  const showBetSlipWaiting = state.getIn(['quickBetDrawer', 'showBetSlipWaiting']);
  const showBetSlipError = state.getIn(['quickBetDrawer', 'showBetSlipError']);
  const showBetSlipSuccess = state.getIn(['quickBetDrawer', 'showBetSlipSuccess']);
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
    deleteBet: QuickBetDrawerActions.deleteBet,
    deleteBets: QuickBetDrawerActions.deleteBets,
    updateBet: QuickBetDrawerActions.updateBet,
    clickPlaceBet: QuickBetDrawerActions.clickPlaceBet,
    cancelPlaceBet: QuickBetDrawerActions.cancelPlaceBet,
    makeBets: BetActions.makeBets,
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuickBetDrawer);
