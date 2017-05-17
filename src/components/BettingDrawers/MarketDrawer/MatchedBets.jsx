import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Checkbox } from 'antd';
import Immutable from 'immutable';
import { I18n } from 'react-redux-i18n';
import { BettingModuleUtils } from '../../../utility';
import { MarketDrawerActions } from '../../../actions';
import ReadOnlyBetTable from '../ReadOnlyBetTable';
import './MatchedBets.less';

class MatchedBets extends PureComponent {
  render() {
    return (
      <div className='matched-bets'>
        <ReadOnlyBetTable
          data={ this.props.bets }
          title={ I18n.t('market_drawer.matched_bets.header') }
          dimmed={ this.props.obscureContent }
          currencyFormat={ this.props.currencyFormat }
        />
        <div className={ `controls ${this.props.obscureContent ? 'dimmed' : ''}` }>
          <Checkbox onChange={ e => this.props.clickAverageOdds(e.target.checked) }>
            { I18n.t('market_drawer.matched_bets.average_odds') }
          </Checkbox>
        </div>
      </div>
    )
  }
}

const groupBetsByAverageOdds = (matchedBets) => {
  // Group bets by betting market id
  let betsByBettingMarketId = Immutable.Map();
  matchedBets.forEach(bet => {
    const betting_market_id = bet.get('betting_market_id');
    if (!betsByBettingMarketId.has(betting_market_id)) {
      betsByBettingMarketId = betsByBettingMarketId.set(betting_market_id, Immutable.List());
    }
    betsByBettingMarketId = betsByBettingMarketId.update(betting_market_id, list => list.push(bet));
  })
  return betsByBettingMarketId.map(bets => {
    const result = BettingModuleUtils.calculateAverageOddsFromMatchedBets(bets);
    const first = bets.get(0);
    return Immutable.fromJS({
      bet_type: first.get('bet_type'),
      betting_market_id: first.get('betting_market_id'),
      bettor_id: first.get('bettor_id'),
      id: first.get('id'),
      liability: result.get('groupedProfitOrLiability'),
      odds: result.get('averageOdds'),
      profit: result.get('groupedProfitOrLiability'),
      stake: result.get('groupedStake'),
      team: first.get('team'),
    });
  }).toList();
}

const mapStateToProps = (state, ownProps) => {
  const bettingMarketGroupId = state.getIn(['marketDrawer', 'bettingMarketGroupId']);
  const matchedBets = state.getIn(['marketDrawer', 'matchedBets']);
  const groupByAverageOdds = state.getIn(['marketDrawer', 'groupByAverageOdds']);

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
  const originalBets = matchedBets.map(bet =>
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
  if (groupByAverageOdds) {
    if (page.has('back')) {
      page = page.update('back', bets => groupBetsByAverageOdds(bets));
    }
    if (page.has('lay')) {
      page = page.update('lay', bets => groupBetsByAverageOdds(bets));
    }
  }
  // Other statuses
  const showPlacedBetsConfirmation = state.getIn(['marketDrawer', 'showPlacedBetsConfirmation']);
  const showPlacedBetsWaiting = state.getIn(['marketDrawer', 'showPlacedBetsWaiting']);
  const showPlacedBetsError = state.getIn(['marketDrawer', 'showPlacedBetsError']);
  return {
    originalBets,
    bets: page,
    obscureContent: showPlacedBetsConfirmation || showPlacedBetsWaiting || showPlacedBetsError,
  };
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    clickAverageOdds: MarketDrawerActions.clickAverageOdds,
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MatchedBets);
