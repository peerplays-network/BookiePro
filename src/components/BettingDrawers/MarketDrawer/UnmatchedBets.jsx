import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'antd';
import Immutable from 'immutable';
import { I18n } from 'react-redux-i18n';
import { BettingModuleUtils } from '../../../utility';
import { MarketDrawerActions } from '../../../actions';
import EditableBetTable from '../EditableBetTable';
import './UnmatchedBets.less';

class UnmatchedBets extends PureComponent {
  render() {
    return (
      <div className='unmatched-bets'>
        <EditableBetTable
          data={ this.props.bets }
          title={ I18n.t('market_drawer.unmatched_bets.header') }
          deleteOne={ this.props.deleteUnmatchedBet }
          deleteMany={ this.props.deleteUnmatchedBets }
          updateOne={ this.props.updateUnmatcedBet }
          dimmed={ this.props.obscureContent }
        />
        <div className={ `buttons ${this.props.obscureContent ? 'dimmed' : ''}` }>
          <Button onClick={ this.props.clickReset }>
            { I18n.t('market_drawer.unmatched_bets.content.reset_button') }
          </Button>
          <Button onClick={ this.props.clickUpdateBet }>
            { I18n.t('market_drawer.unmatched_bets.content.update_button', { amount : 0.295}) }
          </Button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const bettingMarketGroupId = state.getIn(['marketDrawer', 'bettingMarketGroupId']);
  const unmatchedBets = state.getIn(['marketDrawer', 'unmatchedBets']);

  const bettingMarketGroup = state.getIn(['bettingMarketGroup', 'bettingMarketGroupsById', bettingMarketGroupId]);
  // From the current (dummy) bet data, I only need the Betting Market ID
  const bettingMarketIds= bettingMarketGroup.get('betting_market_ids');
  // Use event object to find the associated competitors
  const event_id = bettingMarketGroup.get('event_id');
  const competitors = state.getIn(['event', 'eventsById', event_id, 'scores'])
                           .map(score => state.getIn(['competitor', 'competitorsById', score.get('competitor_id')]));
  // TODO: REVIEW Assume the first betting market corresponds to the HOME (first) team
  let competitorByBettingMarketId = Immutable.Map();
  bettingMarketIds.forEach((bettingMarketId, i) => {
    competitorByBettingMarketId = competitorByBettingMarketId.set(bettingMarketId, competitors.get(i))
  });
  // Transform the raw bet data into a specific format for the EditableBetTable
  const originalBets = unmatchedBets.map(bet =>
                         bet.set('team', competitorByBettingMarketId.get(bet.get('betting_market_id')).get('name'))
                       );
  // This is essentially the same procedure used in BetSlip
  let page = Immutable.Map();
  originalBets.forEach((bet) => {
    const betType = bet.get('bet_type');

    // Page content are grouped by market type (back or lay)
    if (!page.has(betType)) {
      page = page.set(betType, Immutable.List());
    }
    // Add the bet to the list of bets with the same market type
    let betListByBetType = page.get(betType);
    const profit = BettingModuleUtils.getProfitOrLiability(bet.get('stake'), bet.get('odds'));
    bet = bet.set('profit', profit).set('liability', profit);
    betListByBetType = betListByBetType.push(bet);
    // Put everything back in their rightful places
    page = page.set(betType, betListByBetType);
  });
  // Other statuses
  const showPlacedBetsConfirmation = state.getIn(['marketDrawer', 'showPlacedBetsConfirmation']);
  const showPlacedBetsWaiting = state.getIn(['marketDrawer', 'showPlacedBetsWaiting']);
  const showPlacedBetsError = state.getIn(['marketDrawer', 'showPlacedBetsError']);
  const showPlacedBetsSuccess = state.getIn(['marketDrawer', 'showPlacedBetsSuccess']);
  return {
    bets: page,
    showPlacedBetsConfirmation,
    showPlacedBetsWaiting,
    showPlacedBetsError,
    showPlacedBetsSuccess,
    obscureContent: showPlacedBetsConfirmation || showPlacedBetsWaiting || showPlacedBetsError,
  };
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    updateUnmatcedBet: MarketDrawerActions.updateUnmatchedBet,
    deleteUnmatchedBet: MarketDrawerActions.deleteUnmatchedBet,
    deleteUnmatchedBets: MarketDrawerActions.deleteUnmatchedBets,
    clickUpdateBet: MarketDrawerActions.clickUpdateBet,
    clickReset: MarketDrawerActions.clickReset,
  }, dispatch);
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UnmatchedBets);
