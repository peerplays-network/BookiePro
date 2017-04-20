import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import Ps from 'perfect-scrollbar';
import { I18n, Translate } from 'react-redux-i18n';
import { MarketDrawerActions, NavigateActions } from '../../../actions';
import { Button, Tabs } from 'antd';
import { bindActionCreators } from 'redux';
import EditableBetTable from '../EditableBetTable';

const TabPane = Tabs.TabPane;

const renderPlacedBets = (props) => (
  <div className='content' ref='placedBets'>
    <div className='blank'>
      <div className='instructions'>
        <Translate value='market_drawer.unmatched_bets.empty.instructions' dangerousHTML/>
      </div>
    </div>
  </div>
);

const renderUnconfirmedBets = (props) => (
  <div className='content' ref='unconfirmedBets'>
    { props.unconfirmedBets.isEmpty() &&
      <div className='blank'>
        <div className='instructions'>
          <Translate value='market_drawer.unconfirmed_bets.empty.instructions' dangerousHTML/>
        </div>
        <div className='my-bet-button'>
          <Button onClick={ () => props.navigateTo('/my-wager/') }>
            { I18n.t('quick_bet_drawer.unconfirmed_bets.empty.my_bet_button') }
          </Button>
        </div>
      </div>
    }
    { !props.unconfirmedBets.isEmpty() &&
      <EditableBetTable
        data={ Immutable.fromJS({ unconfirmedBets: props.unconfirmedBets }) }
        deleteOne={ props.deleteUnconfirmedBet }
        deleteMany={ props.deleteUnconfirmedBets }
        updateOne={ props.updateUnconfirmedBet }
      />
    }
  </div>
);

class MarketDrawer extends Component {
  componentDidMount() {
    Ps.initialize(ReactDOM.findDOMNode(this.refs.unconfirmedBets));
  }

  componentDidUpdate() {
    Ps.update(ReactDOM.findDOMNode(this.refs.unconfirmedBets));
  }

  render() {
    return (
      <div id='market-drawer'>
        <Tabs defaultActiveKey='1' type='card'>
          <TabPane tab='BETSLIP' key='1'>
            { renderUnconfirmedBets(this.props) }
          </TabPane>
          <TabPane tab='PLACED BETS' key='2'>
            { renderPlacedBets(this.props) }
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const unconfirmedBets = state.getIn(['marketDrawer', 'unconfirmedBets']);
  let betslips = Immutable.Map();
  unconfirmedBets.forEach((bet) => {
    const betType = bet.get('bet_type');

    // The betslips are grouped by market type (back or lay)
    if (!betslips.has(betType)) {
      betslips = betslips.set(betType, Immutable.List());
    }
    // Add the bet to the list of bets with the same market type
    let betListByBetType = betslips.get(betType);
    let betObj = Immutable.Map()
                  .set('id', bet.get('id'))
                  .set('odds', bet.getIn(['offer', 'odds'], ''))
                  .set('price', bet.getIn(['offer', 'price'], ''))
                  //NOTE  to be removed once calculation of profit/liability is done
                  //being
                  .set('stake', bet.get('stake'))
                  .set('profit', bet.get('profit'))
                  .set('liability', bet.get('liability'))
                  //end
                  .set('team', bet.get('team_name'));
    betListByBetType = betListByBetType.push(betObj);
    // Put everything back in their rightful places
    betslips = betslips.set(betType, betListByBetType);
  });
  return {
    unconfirmedBets: betslips
  };
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
    deleteUnconfirmedBet: MarketDrawerActions.deleteUnconfirmedBet,
    deleteUnconfirmedBets: MarketDrawerActions.deleteUnconfirmedBets,
    updateUnconfirmedBet: MarketDrawerActions.updateUnconfirmedBet,
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MarketDrawer);
