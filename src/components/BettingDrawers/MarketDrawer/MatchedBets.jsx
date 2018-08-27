/**
 * The MatchedBets component contains only the bets that have been completely
 * matched. All the bets displayed here are READONLY. This is also the only
 * occasion where the {@link BetTable} is used in its READONLY mode.
 *
 * User can group all matched bets by the average odds.
 *
 * The matched bets are stored in the Redux store under `marketDrawer`->`matchedBets`.
 */
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Checkbox} from 'antd';
import Immutable from 'immutable';
import {I18n} from 'react-redux-i18n';
import {BettingModuleUtils} from '../../../utility';
import {MarketDrawerActions} from '../../../actions';
import BetTable from '../BetTable';
import './MatchedBets.less';
import {BettingDrawerStates, BetTypes} from '../../../constants';
import {MyAccountPageSelector} from '../../../selectors';

class MatchedBets extends PureComponent {
  render() {
    return (
      <div className='matched-bets'>
        <BetTable
          readonly={ true }
          data={ this.props.bets }
          title={ I18n.t('market_drawer.matched_bets.header') }
          dimmed={ this.props.obscureContent }
          currencyFormat={ this.props.currencyFormat }
          oddsFormat={ this.props.oddsFormat }
        />
        {!this.props.bets.isEmpty() && (
          <div className={ `controls ${this.props.obscureContent ? 'dimmed' : ''}` }>
            <Checkbox
              onChange={ (e) => this.props.clickAverageOdds(e.target.checked) }
              checked={ this.props.averageOdds }
              disabled={ this.props.disabled }
            >
              {I18n.t('market_drawer.matched_bets.average_odds')}
            </Checkbox>
          </div>
        )}
      </div>
    );
  }
}

const groupBetsByAverageOdds = (matchedBets, oddsFormat, currencyFormat) => {
  // Group bets by betting market id
  let betsByBettingMarketId = Immutable.Map();
  matchedBets.forEach((bet) => {
    const betting_market_id = bet.get('betting_market_id');

    if (!betsByBettingMarketId.has(betting_market_id)) {
      betsByBettingMarketId = betsByBettingMarketId.set(betting_market_id, Immutable.List());
    }

    betsByBettingMarketId = betsByBettingMarketId
      .update(betting_market_id, (list) => list.push(bet));
  });
  return betsByBettingMarketId
    .map((bets) => {
      const result = BettingModuleUtils.calculateAverageOddsFromMatchedBets(bets, currencyFormat);
      const first = bets.get(0);
      return Immutable.fromJS({
        bet_type: first.get('bet_type'),
        betting_market_description: first.get('betting_market_description'),
        betting_market_group_description: first.get('betting_market_group_description'),
        betting_market_id: first.get('betting_market_id'),
        bettor_id: first.get('bettor_id'),
        id: first.get('id'),
        liability: result.get('groupedProfitOrLiability'),
        odds: BettingModuleUtils.oddsFormatFilter(result.get('averageOdds'), oddsFormat, 'decimal'),
        profit: result.get('groupedProfitOrLiability'),
        stake: result.get('groupedStake')
      });
    })
    .toList();
};

const mapStateToProps = (state) => {
  const matchedBets = state.getIn(['marketDrawer', 'matchedBets']);
  const groupByAverageOdds = state.getIn(['marketDrawer', 'groupByAverageOdds']);
  const oddsFormat = MyAccountPageSelector.oddsFormatSelector(state);
  const currencyFormat = MyAccountPageSelector.currencyFormatSelector(state);
  // Transform the raw bet data into a specific format for the EditableBetTable
  const originalBets = matchedBets;
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

    let profit = BettingModuleUtils.getProfitOrLiability(
      bet.get('stake'),
      bet.get('odds'),
      currencyFormat,
      betType === BetTypes.BACK ? 'profit' : 'liability'
    );
    let odds = BettingModuleUtils.oddsFormatFilter(bet.get('odds'), oddsFormat, 'decimal');

    bet = bet
      .set('profit', profit)
      .set('liability', profit)
      .set('odds', odds);

    betListByBetType = betListByBetType.push(bet);
    // Put everything back in their rightful places
    page = page.set(betType, betListByBetType);
  });

  if (groupByAverageOdds) {
    if (page.has('back')) {
      page = page
        .update('back', (bets) => groupBetsByAverageOdds(bets, oddsFormat, currencyFormat));
    }

    if (page.has('lay')) {
      page = page
        .update('lay', (bets) => groupBetsByAverageOdds(bets, oddsFormat, currencyFormat));
    }
  }

  // Overlay
  const overlay = state.getIn(['marketDrawer', 'overlay']);
  const obscureContent =
    overlay !== BettingDrawerStates.NO_OVERLAY &&
    overlay !== BettingDrawerStates.SUBMIT_BETS_SUCCESS;
  return {
    originalBets,
    bets: page,
    obscureContent,
    oddsFormat
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    clickAverageOdds: MarketDrawerActions.clickAverageOdds
  },
  dispatch
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MatchedBets);
