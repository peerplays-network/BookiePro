import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {BettingMarketGroupBanner} from '../Banners';
import {BackingWidgetContainer} from '../BettingWidgets';
import {ObjectUtils, DateUtils} from '../../utility';
import PeerPlaysLogo from '../PeerPlaysLogo';
import {MarketDrawerActions} from '../../actions';

import {
  BettingMarketGroupPageSelector,
  EventGroupPageSelector,
  MarketDrawerSelector,
  MyAccountPageSelector,
  EventPageSelector,
} from '../../selectors';

import _ from 'lodash';

class SportsBookEvent extends PureComponent {
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
          {this.props.marketData.map((item, index) => {
            return (
              <BackingWidgetContainer
                key={ index }
                widgetTitle={ item.get('description') }
                marketData={ item }
                eventStatus={ this.props.eventStatus }
                eventStatusClassName={ this.props.eventStatus[0] }
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
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SportsBookEvent);
