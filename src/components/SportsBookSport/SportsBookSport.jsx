import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {EventPageSelector} from '../../selectors';
import {BackingWidgetContainer} from '../BettingWidgets';
import {SportBanner} from '../Banners';
import {ObjectUtils} from '../../utility';
import {NavigateActions} from '../../actions';

const MAX_EVENTS = 10;
class SportsBookSport extends PureComponent {
  render() {
    const sport = this.props.sport;
    return (
      <div className='sport-wrapper'>
        { sport && <SportBanner sport={ sport.get('sportName') || '' } /> }
        
        { 
          sport && this.props.sport.get('eventGroups').map((eg) => {

            const events = eg.get('events');

            let eventsToDisplay = [];

            events && events.slice(0, MAX_EVENTS).forEach((e) => {
              let bmgs = e.get('bettingMarketGroups');

              if (bmgs) {
                let bmg = bmgs.first();

                if (bmg) {
                  eventsToDisplay.push(
                    bmg
                      .set('eventName', e.get('name'))
                      .set('eventID', e.get('id'))
                      .set('eventTime', e.get('start_time'))
                      .set('eventStatus', ObjectUtils.eventStatus(e))
                  );
                }
              }
            });

            if (events && events.size > MAX_EVENTS) {
              return eventsToDisplay.length > 0 && 
              (
                <div key={ eg.get('name') }>
                  <BackingWidgetContainer
                    widgetTitle={ eg.get('name') }
                    marketData={ eventsToDisplay }
                    eventStatus={ [''] }
                  />
                  <div className='more-sport-link'>
                    <a 
                      onClick={ () => this.props.navigateTo(
                        '/sportsbook/eventgroup/' + eg.get('id')
                      ) }
                    >
                      More { eg.get('name') }
                    </a>
                  </div>
                </div>
              );
            }

            return eventsToDisplay.length > 0 && 
              (
                <div key={ eg.get('name') }>
                  <BackingWidgetContainer
                    widgetTitle={ eg.get('name') }
                    marketData={ eventsToDisplay }
                    eventStatus={ [''] }
                  />
                </div>
              );
          })
        }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {  
  return {
    sport: EventPageSelector.getSportData(state, ownProps.params.objectId)
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    navigateTo: NavigateActions.navigateTo
  },
  dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(SportsBookSport);
