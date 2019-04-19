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
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Button} from 'antd';
import Immutable from 'immutable';
import {I18n} from 'react-redux-i18n';
import {CurrencyUtils} from '../../../utility';
import {MarketDrawerActions} from '../../../actions';
import BetTable from '../BetTable';
import './UnmatchedBets.less';
import {BettingDrawerStates} from '../../../constants';
import {MyAccountPageSelector} from '../../../selectors';
import BookieModes from './../../../constants/BookieModes';

class UnmatchedBets extends PureComponent {
  render() {
    return (
      <div className='unmatched-bets'>
        <BetTable
          data={ this.props.bets }
          title={ I18n.t('market_drawer.unmatched_bets.header') }
          deleteOne={ this.props.clickDeleteUnmatchedBet }
          deleteMany={ this.props.clickDeleteUnmatchedBets }
          updateOne={ this.props.updateUnmatchedBet }
          dimmed={ this.props.obscureContent }
          currencyFormat={ this.props.currencyFormat }
          oddsFormat={ this.props.oddsFormat }
          activeTab={ this.props.activeTab }
          disabled={ this.props.disabled }
          bookMode={ this.props.bookMode }
        />
        {!this.props.bets.isEmpty() && (
          <div className={ `buttons ${this.props.obscureContent ? 'dimmed' : ''}` }>
            <Button
              className='btn btn-cancel'
              onClick={ this.props.clickReset }
              disabled={ this.props.disabled }
            >
              {I18n.t('market_drawer.unmatched_bets.content.reset_button')}
            </Button>
            <button
              className={ `btn btn${this.props.hasUpdatedBets ? '-regular' : '-disabled'}` }
              onClick={ () => this.props.clickUpdateBet(this.props.totalBetAmountFloat, this.props.currencyFormat, true) } // eslint-disable-line
              disabled={ this.props.disabled }
            >
              {I18n.t('market_drawer.unmatched_bets.content.update_button')}
              {this.props.currencySymbol}
              {this.props.totalBetAmountString}
            </button>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const bookMode = state.getIn(['app', 'bookMode']);
  const unmatchedBets = state.getIn(['marketDrawer', 'unmatchedBets']);
  // Transform the raw bet data into a specific format for the EditableBetTable
  const originalBets = unmatchedBets;
  // This is essentially the same procedure used in BetSlip
  let page = Immutable.Map();
  originalBets.forEach((bet) => {
    const betType = bet.get('bet_type');

    if (bookMode === BookieModes.SPORTSBOOK && betType === 'lay') {
      return;
    }
 
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
  // Overlay
  const overlay = state.getIn(['marketDrawer', 'overlay']);
  const obscureContent =
    overlay !== BettingDrawerStates.NO_OVERLAY &&
    overlay !== BettingDrawerStates.SUBMIT_BETS_SUCCESS;
  const hasUpdatedBets = originalBets.some((bet) => bet.get('updated'));
  const currencySymbol = CurrencyUtils.getCurrencySymbol(
    props.currencyFormat,
    hasUpdatedBets ? 'black' : 'white'
  );

  return {
    bookMode,
    bets: page,
    obscureContent,
    currencySymbol,
    hasUpdatedBets,
    oddsFormat: MyAccountPageSelector.oddsFormatSelector(state)
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    updateUnmatchedBet: MarketDrawerActions.updateUnmatchedBet,
    deleteUnmatchedBet: MarketDrawerActions.deleteUnmatchedBet,
    clickDeleteUnmatchedBets: MarketDrawerActions.clickDeleteUnmatchedBets,
    clickDeleteUnmatchedBet: MarketDrawerActions.clickDeleteUnmatchedBet,
    clickUpdateBet: MarketDrawerActions.clickUpdateBet,
    clickReset: MarketDrawerActions.clickReset
  },
  dispatch
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UnmatchedBets);
