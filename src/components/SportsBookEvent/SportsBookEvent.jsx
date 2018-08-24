import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BettingMarketGroupBanner } from '../Banners';
import { BackingBettingWidget } from '../BettingWidgets';
import { ObjectUtils, DateUtils } from '../../utility';
import PeerPlaysLogo from '../PeerPlaysLogo';
import { 
  AllSportsActions,
  MarketDrawerActions,
  NavigateActions
} from '../../actions';

import {
  BettingMarketGroupPageSelector,
  EventGroupPageSelector,
  MarketDrawerSelector,
  MyAccountPageSelector,
  EventPageSelector
} from '../../selectors';

import _ from 'lodash';

class SportsBookEvent extends PureComponent {

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
    this.props.getData();
  }

  componentWillReceiveProps(nextProps){
    if (!nextProps.event || nextProps.event.isEmpty()) {
      // Betting market group doesn't exist,
      // Go back to home page
      this.props.navigateTo('/betting/exchange');
    } else {
      const prevEventId = this.props.params.objectId;
      const nextEventId = nextProps.params.objectId;
      if (nextEventId !== prevEventId ||
        nextProps.event !== this.props.event||
        nextProps.marketData !== this.props.marketData ||
        nextProps.eventName !== this.props.eventName ||
        nextProps.eventStatus !== this.props.eventStatus){
        // Get the data
        this.props.getData();
      }
    }

  }

  render() {
    // Return nothing if betting market group doesn't exist
    if (!this.props.event || this.props.event.isEmpty() || this.props.eventStatus === null) {
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
            bettingMarketGroupStatus={ '' }
            bettingMarketGroupStatusClassName={ '' }
            isLiveMarket={ false }
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
      )
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const event = EventPageSelector.getEvent(state, ownProps.params.eventId);
  let sportName;
  if (event) {
    sportName = EventGroupPageSelector.getSportNameFromEvent(state, event);
  }

  let props = {
    event,
    oddsFormat: MyAccountPageSelector.oddsFormatSelector(state)
  }

  // Populate other properties if betting market group exists
  if (event && !event.isEmpty()) {
    _.assign(props, {
      marketData: BettingMarketGroupPageSelector.getMarketData(state, ownProps),
      eventName: event.get('name'),
      eventTime: DateUtils.getLocalDate(new Date(event.get('start_time'))),
      eventStatus: ObjectUtils.eventStatus(event),
      isLiveMarket: ObjectUtils.isActiveEvent(event),
      unconfirmedBets: BettingMarketGroupPageSelector.getUnconfirmedBets(state, ownProps),
      loadingStatus: BettingMarketGroupPageSelector.getLoadingStatus(state, ownProps),
      widgetTitle: BettingMarketGroupPageSelector.getWidgetTitle(state, ownProps),
      rules: BettingMarketGroupPageSelector.getRules(state, ownProps),
      canCreateBet: MarketDrawerSelector.canAcceptBet(state, ownProps),
      sportName
    })
  }
  return props;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    createBet: MarketDrawerActions.createBet,
    getData: AllSportsActions.getData,
    getPlacedBets: MarketDrawerActions.getPlacedBets,
    navigateTo: NavigateActions.navigateTo
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SportsBookEvent);
