import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {BettingMarketGroupBanner} from '../Banners';
import {BackingWidgetContainer} from '../BettingWidgets';
import {ObjectUtils, DateUtils} from '../../utility';
import PeerPlaysLogo from '../PeerPlaysLogo';
import {MarketDrawerActions, NavigateActions, BettingMarketGroupPageActions} from '../../actions';
import _ from 'lodash';

import {
  BettingMarketGroupPageSelector,
  EventGroupPageSelector,
  MarketDrawerSelector,
  MyAccountPageSelector,
  EventPageSelector,
} from '../../selectors';

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
    this.props.getOpenBetsForEvent(this.props.params.eventId);
  }

  componentWillUpdate(nextProps) {
    if (!nextProps.event || nextProps.event.isEmpty()) {
      // Betting market group doesn't exist,
      // Go back to home page
      this.props.navigateTo('/exchange');
    } else {
      const prevEventId = this.props.params.eventId;
      const nextEventId = nextProps.params.eventId;

      if (
        nextEventId !== prevEventId ||
        !_.isEqual(this.props.marketData.toJS(), nextProps.marketData.toJS()) ||
        !_.isEqual(this.props.event, nextProps.event) ||
        nextProps.eventName !== this.props.eventName ||
        !_.isEqual(nextProps.eventStatus, this.props.eventStatus)
      ) {
        // Get the data
        this.props.getOpenBetsForEvent(this.props.params.eventId);
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

          {this.props.marketData.map((e, index) =>  {
            return (
              <BackingWidgetContainer
                key={ index }
                widgetTitle={ e.get('description') }
                marketData={ e }
                eventStatus={ e.get('status') }
              />
            );
          })}
          <div className='margin-top-18'>
            <PeerPlaysLogo />
          </div>
        </div>
      );
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
    oddsFormat: MyAccountPageSelector.oddsFormatSelector(state),
  };

  // Populate other properties if betting market group exists
  if (event && !event.isEmpty()) {
    _.assign(props, {
      marketData: EventPageSelector.getMarketData(state, {
        eventId: ownProps.params.eventId
      }),
      eventName: event.get('name'),
      eventTime: DateUtils.getLocalDate(new Date(event.get('start_time'))),
      eventStatus: ObjectUtils.eventStatus(event),
      isLiveMarket: ObjectUtils.isActiveEvent(event),
      unconfirmedBets: BettingMarketGroupPageSelector.getUnconfirmedBets(state, ownProps),
      loadingStatus: BettingMarketGroupPageSelector.getLoadingStatus(state, ownProps),
      canCreateBet: MarketDrawerSelector.canAcceptBet(state, ownProps),
      sportName,
    });
  }

  return props;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      createBet: MarketDrawerActions.createBet,
      navigateTo: NavigateActions.navigateTo,
      getData: BettingMarketGroupPageActions.getData,
      resetOpenBets: MarketDrawerActions.resetOpenBets,
      getOpenBetsForEvent: MarketDrawerActions.getOpenBetsForEvent
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SportsBookEvent);
