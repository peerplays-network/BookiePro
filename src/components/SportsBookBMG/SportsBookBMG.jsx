import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BettingMarketGroupBanner } from '../Banners';
import { BackingBettingWidget } from '../BettingWidgets';
import PeerPlaysLogo from '../PeerPlaysLogo';
import { AllSportsActions, MarketDrawerActions, NavigateActions } from '../../actions';

import { BettingMarketGroupPageSelector, EventGroupPageSelector, MarketDrawerSelector, MyAccountPageSelector } from '../../selectors';

import _ from 'lodash';

class SportsBookBMG extends PureComponent {
  componentDidMount() {
    const doc = document.querySelector('body');
    doc.style.minWidth = '1210px';
    doc.style.overflow = 'overlay';
  }

  componentWillUnmount() {
    document.querySelector('body').style.minWidth = '1002px';
  }

  componentWillMount() {
    // Get the data
    this.props.getData(this.props.params.objectId);
  }

  componentWillReceiveProps(nextProps) {
    console.log('----- componentWillReceiveProps (1)');
    console.log(nextProps);
    if (!nextProps.bettingMarketGroup || nextProps.bettingMarketGroup.isEmpty() || nextProps.eventStatus === null) {
      // Betting market group doesn't exist,
      // Go back to home page
      this.props.navigateTo('/betting/exchange');
    } else {
      const prevBettingMarketGroupId = this.props.params.objectId;
      const nextBettingMarketGroupId = nextProps.params.objectId;
      //if (nextBettingMarketGroupId !== prevBettingMarketGroupId){
      if (
        nextBettingMarketGroupId !== prevBettingMarketGroupId ||
        nextProps.bettingMarketGroup !== this.props.bettingMarketGroup ||
        nextProps.marketData !== this.props.marketData ||
        nextProps.eventName !== this.props.eventName ||
        nextProps.eventStatus !== this.props.eventStatus ||
        nextProps.bettingMarketGroupStatus !== this.props.bettingMarketGroupStatus
      ) {
        // Get the data
        this.props.getData(nextBettingMarketGroupId);
      }
    }
  }

  render() {
    const { bettingMarketGroup } = this.props;
    // Return nothing if betting market group doesn't exist
    if (!bettingMarketGroup || bettingMarketGroup.isEmpty() || this.props.eventStatus === null) {
      return null;
    } else {
      return (
        <div className='betting-market-group-wrapper'>
          <BettingMarketGroupBanner
            sportName={ this.props.sportName }
            eventName={ this.props.eventName }
            eventTime={ this.props.eventTime }
            isLiveMarket={ this.props.isLiveMarket }
            eventStatus={ this.props.eventStatus[1] }
            eventStatusClassName={ this.props.eventStatus[0] }
          />
          <BackingBettingWidget
            bettingMarketGroupStatus={ this.props.bettingMarketGroupStatus[0] }
            eventStatus={ this.props.eventStatus[0] }
            bettingMarketGroupStatusClassName={ this.props.bettingMarketGroupStatus[1] }
            isLiveMarket={ this.props.isLiveMarket }
            marketData={ this.props.marketData }
            totalMatchedBetsAmount={ this.props.totalMatchedBetsAmount }
            createBet={ this.props.createBet }
            unconfirmedBets={ this.props.unconfirmedBets }
            currencyFormat={ this.props.currencyFormat }
            oddsFormat={ this.props.oddsFormat }
            loadingStatus={ this.props.loadingStatus }
            widgetTitle={ this.props.widgetTitle }
            rules={ this.props.rules }
            canCreateBet={ this.props.canCreateBet }
          />
          <div className='margin-top-18'>
            <PeerPlaysLogo />
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log('----- mapStateToProps');
  console.log(state);
  console.log(ownProps);
  const bettingMarketGroup = BettingMarketGroupPageSelector.getBettingMarketGroup(state, ownProps);
  console.log(bettingMarketGroup);
  const event = BettingMarketGroupPageSelector.getEvent(state, ownProps);
  let sportName;
  if (event) {
    sportName = EventGroupPageSelector.getSportNameFromEvent(state, event);
  }

  let props = {
    bettingMarketGroup,
    oddsFormat: MyAccountPageSelector.oddsFormatSelector(state),
  };

  // Populate other properties if betting market group exists
  if (bettingMarketGroup && !bettingMarketGroup.isEmpty()) {
    _.assign(props, {
      marketData: BettingMarketGroupPageSelector.getMarketData(state, ownProps),
      eventName: BettingMarketGroupPageSelector.getEventName(state, ownProps),
      eventTime: BettingMarketGroupPageSelector.getEventTime(state, ownProps),
      isLiveMarket: BettingMarketGroupPageSelector.getIsLiveMarket(state, ownProps),
      eventStatus: BettingMarketGroupPageSelector.getEventStatus(state, ownProps),
      bettingMarketGroupStatus: BettingMarketGroupPageSelector.getBettingMarketGroupStatus(state, ownProps),
      totalMatchedBetsAmount: BettingMarketGroupPageSelector.getTotalMatchedBetsAmount(state, ownProps),
      unconfirmedBets: BettingMarketGroupPageSelector.getUnconfirmedBets(state, ownProps),
      loadingStatus: BettingMarketGroupPageSelector.getLoadingStatus(state, ownProps),
      widgetTitle: BettingMarketGroupPageSelector.getWidgetTitle(state, ownProps),
      rules: BettingMarketGroupPageSelector.getRules(state, ownProps),
      canCreateBet: MarketDrawerSelector.canAcceptBet(state, ownProps),
      sportName,
    });
  }
  return props;
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      createBet: MarketDrawerActions.createBet,
      getData: AllSportsActions.getData,
      getPlacedBets: MarketDrawerActions.getPlacedBets,
      navigateTo: NavigateActions.navigateTo,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SportsBookBMG);
