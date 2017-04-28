import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import Immutable from 'immutable';
import EditableBetTable from '../EditableBetTable';
import './MatchedBets.less';

class MatchedBets extends PureComponent {
  render() {
    return (
      <div className='matched-bets'>
        <EditableBetTable
          data={ this.props.bets }
          title='Matched Bets'
          deleteOne={ () => console.log('matched bets delete one') }
          deleteMany={ () => console.log('matched bets delete many') }
          updateOne={ () => console.log('matched bets update one') }
          dimmed={ false }
        />
        <div className='buttons'>
          <Button onClick={ () => console.log('matched bets reset') }>RESET</Button>
          <Button onClick={ () => console.log('matched bets reset') }>UPDATE</Button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  // Extract the current Betting Market Group Id the user is viewing
  // This is required to filter the data from all ongoing bets
  // TODO REVIEW Whoever can come up with a better way, please go ahead and do that
  const bettingMarketGroupId = window.location.href.split('/').pop();
  // From the current (dummy) bet data, I only need the Betting Market ID
  const bettingMarketIds= state.getIn(['bettingMarketGroup', 'bettingMarketGroupsById', bettingMarketGroupId, 'betting_market_ids']);
  // Transform the raw bet data into a specific format for the EditableBetTable
  const originalBets = state.getIn(['bet', 'matchedBetsById'])
                            .filter(bet => bettingMarketIds.includes(bet.get('betting_market_id')))
                            .map(bet => Immutable.fromJS({
                              id: bet.get('id'),
                              bettor_id: bet.get('bettor_id'),
                              // TODO: may not need toLowerCase once we got the real data
                              bet_type: bet.get('back_or_lay').toLowerCase(),
                              odds: bet.get('amount_to_win'),
                              stake: bet.get('amount_to_bet')
                            }));
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
    betListByBetType = betListByBetType.push(bet);
    // Put everything back in their rightful places
    page = page.set(betType, betListByBetType);
  });
  // Other statuses
  const showBetUpdateConfirmation = state.getIn(['marketDrawer', 'showBetUpdateConfirmation']);
  const showBetUpdateWaiting = state.getIn(['marketDrawer', 'showBetUpdateWaiting']);
  const showBetUpdateError = state.getIn(['marketDrawer', 'showBetUpdateError']);
  const showBetUpdateSuccess = state.getIn(['marketDrawer', 'showBetUpdateSuccess']);
  return {
    originalBets,
    bets: page,
    showBetUpdateConfirmation,
    showBetUpdateWaiting,
    showBetUpdateError,
    showBetUpdateSuccess,
    obscureContent: showBetUpdateConfirmation || showBetUpdateWaiting || showBetUpdateError,
  };
}

export default connect(
  mapStateToProps
)(MatchedBets);
