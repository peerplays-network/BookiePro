/**
 * The UnmatchedBets component contains bets that are NOT 100% matched. In the other
 * words, it contains a mixture of 0% matched bets or partially matched bets.
 *
 * The UnmatchedBets component has a similar appearance as the Betslip and in fact
 * they both use the {@link BetTable} to display the bets. The unmatched bets can
 * be edited and cancelled at any time. An updated bet will be highlighted with a
 * special background color.
 *
 * The unmatched bets are stored in the Redux store under `marketDrawer`->`unmatchedBets`.
 */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'antd';
import Immutable from 'immutable';
import { I18n } from 'react-redux-i18n';
import { BettingModuleUtils } from '../../../utility';
import { MarketDrawerActions } from '../../../actions';
import BetTable from '../BetTable';
import './UnmatchedBets.less';
import { BettingDrawerStates } from '../../../constants'

class UnmatchedBets extends PureComponent {
  render() {
    return (
      <div className='unmatched-bets'>
        <BetTable
          data={ this.props.bets }
          title={ I18n.t('market_drawer.unmatched_bets.header') }
          deleteOne={ this.props.deleteUnmatchedBet }
          deleteMany={ this.props.clickDeleteUnmatchedBets }
          updateOne={ this.props.updateUnmatcedBet }
          dimmed={ this.props.obscureContent }
          currencyFormat={ this.props.currencyFormat }
        />
        { !this.props.bets.isEmpty() &&
          <div className={ `buttons ${this.props.obscureContent ? 'dimmed' : ''}` }>
            <Button className='btn btn-regular' onClick={ this.props.clickReset }>
              { I18n.t('market_drawer.unmatched_bets.content.reset_button') }
            </Button>
            <button
              className={ `btn btn-regular${this.props.hasUpdatedBets ? '' : '-disabled'}` }
              onClick={ () => this.props.clickUpdateBet(this.props.totalBetAmountFloat, this.props.currencyFormat) }
              disabled={ !this.props.hasUpdatedBets }
            >
              { I18n.t('market_drawer.unmatched_bets.content.update_button', { amount : this.props.totalBetAmountString }) }
            </button>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const unmatchedBets = state.getIn(['marketDrawer', 'unmatchedBets']);
  // Transform the raw bet data into a specific format for the EditableBetTable
  const originalBets = unmatchedBets;
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
  // Overlay
  const overlay = state.getIn(['marketDrawer', 'overlay']);
  const obscureContent = overlay !== BettingDrawerStates.NO_OVERLAY && overlay !== BettingDrawerStates.SUBMIT_BETS_SUCCESS;
  return {
    bets: page,
    obscureContent,
    hasUpdatedBets: originalBets.count(bet => bet.get('updated')) > 0,
  };
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    updateUnmatcedBet: MarketDrawerActions.updateUnmatchedBet,
    deleteUnmatchedBet: MarketDrawerActions.deleteUnmatchedBet,
    clickDeleteUnmatchedBets: MarketDrawerActions.clickDeleteUnmatchedBets,
    clickUpdateBet: MarketDrawerActions.clickUpdateBet,
    clickReset: MarketDrawerActions.clickReset,
  }, dispatch);
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UnmatchedBets);
