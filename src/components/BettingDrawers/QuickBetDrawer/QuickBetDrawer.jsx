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

const renderContent = (props) => (
  <div className='content' ref='bettingtable'>
    { props.bets.isEmpty() &&
      <div className='blank'>
        <div className='instructions'>
          {  props.showBetSlipSuccess &&
             'Your bets have been successfully placed.'
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
    const emptyMessage = 'The transaction fee of this bet is 0.0051.<br/>Are you sure you want to place this bet?';
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
        {
          this.props.showBetSlipConfirmation &&
          <div className='confirmation'>
            <div className='instructions'>
              The transaction fee of this bet is 0.0051.<br/>
              Are you sure you want to place this bet?
            </div>
            <div className='confirm-buttons'>
              <Button onClick={ this.props.cancelPlaceBet }>CANCEL</Button>
              <Button onClick={ () => this.props.makeBets(this.props.originalBets) }>CONFIRM BET</Button>
            </div>
          </div>
        }
        {
          this.props.showBetSlipWaiting &&
          <div className='waiting'>
            <div className='instructions'>
              Waiting...
            </div>
          </div>
        }
        {
          this.props.showBetSlipError &&
          <div className='error'>
            <div className='instructions'>
              Sorry, we are unable to proceed<br/>
              with your request. Please try again!
            </div>
            <div className='confirm-buttons'>
              <Button onClick={ this.props.cancelPlaceBet }>CANCEL</Button>
              <Button onClick={ () => this.props.makeBets(this.props.originalBets) }>TRY AGAIN</Button>
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
