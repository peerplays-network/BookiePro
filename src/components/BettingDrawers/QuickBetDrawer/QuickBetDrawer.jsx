import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import Ps from 'perfect-scrollbar';
import SplitPane from 'react-split-pane';
import { I18n, Translate } from 'react-redux-i18n';
import { NavigateActions, QuickBetDrawerActions } from '../../../actions';
import { Button } from 'antd';
import { bindActionCreators } from 'redux';
import EditableBetTable from '../EditableBetTable';

const renderContent = (props) => (
  <div className='content' ref='bettingtable'>
    { props.bets.isEmpty() &&
      <div className='blank'>
        <div className='instructions'>
          <Translate value='quick_bet_drawer.unconfirmed_bets.empty.instructions' dangerousHTML/>
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
        />
      ))
    }
  </div>
)

class QuickBetDrawer extends Component {

  constructor(props) {
    super(props);
    this.setUnplacedBetButton = this.setUnplacedBetButton.bind(this);
    this.clearUnplacedBetButton = this.clearUnplacedBetButton.bind(this);
    this.goToMyBets = this.goToMyBets.bind(this);
  }

  componentDidMount() {
    Ps.initialize(ReactDOM.findDOMNode(this.refs.bettingtable));
  }

  componentDidUpdate() {
    Ps.update(ReactDOM.findDOMNode(this.refs.bettingtable));
  }

  goToMyBets(){
    this.props.navigateTo('/my-wager/');
  }

  //////// dummy buttons for routing hooking BEGINS //////////
  setUnplacedBetButton() {
    this.props.updateUnplacedBetStatus(true);
  }

  clearUnplacedBetButton() {
    this.props.updateUnplacedBetStatus(false);
  }
  //////// dummy buttons for routing hooking ENDS //////////

  render() {
    return (
      <div id='quick-bet-drawer' ref='drawer'>
        <SplitPane split='horizontal' defaultSize='40px'>
          <div className='title'>
            <div className='label'>{ I18n.t('quick_bet_drawer.header') }</div>
            {/* dummy buttons for routing hooking BEGINS  */}
            <Button title='set' onClick={ this.setUnplacedBetButton } >update bet </Button>
            <Button title='clear' onClick={ this.clearUnplacedBetButton } > clear bet</Button>
            {/* dummy buttons for routing hooking ENDS */}
          </div>
          <SplitPane
            split='horizontal'
            minSize={ 40 }
            defaultSize={ 40 }
            primary='second'
            pane1Style={ { 'overflowY': 'hidden' } }
          >
            { renderContent(this.props) }
            {
              !this.props.bets.isEmpty() &&
              <div className='footer'>
                <Button className='place-bet'>
                  { I18n.t('quick_bet_drawer.unconfirmed_bets.content.place_bet_button', { amount : 0.295}) }
                </Button>
              </div>
            }
          </SplitPane>
        </SplitPane>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const bets = state.getIn(['quickBetDrawer', 'bets']);
  let page = Immutable.Map();
  bets.forEach((bet) => {
    const eventId = bet.get('event_id');
    const betType = bet.get('bet_type');
    // Page content are first grouped by event_id
    if (!page.has(eventId)) {
      const eventObj = Immutable.Map()
                          .set('id', eventId)
                          .set('name', bet.get('event_name'))
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
    let betObj = Immutable.Map()
                  .set('id', bet.get('id'))
                  .set('odds', bet.getIn(['offer', 'odds']))
                  .set('price', bet.getIn(['offer', 'price']))
                  .set('team', bet.get('team_name'));
    betListBybetType = betListBybetType.push(betObj);
    // Put everything back in their rightful places
    unconfirmedBets = unconfirmedBets.set(betType, betListBybetType);
    page = page.setIn([eventId, 'unconfirmedBets'], unconfirmedBets);
  });
  return {
    bets: page
  };
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
    deleteBet: QuickBetDrawerActions.deleteBet,
    deleteBets: QuickBetDrawerActions.deleteBets,
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuickBetDrawer);
