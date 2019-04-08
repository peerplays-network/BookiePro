import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {BackingWidgetContainer} from '../BettingWidgets';
import {EventPageSelector} from '../../selectors';
import {ObjectUtils, SportsbookUtils} from '../../utility';
import {NavigateActions} from '../../actions';

const MAX_EVENTS = 3;

class SportsBook extends PureComponent {
  render() {

    let content = null;

    return (
      <div id='all-sports-wrapper'>
        <div className='banner-ad-header' />
        {
          this.props.allSports.map((sport) => {

            const events = sport.get('events');

            let eventsToDisplay = [];

            events && events.slice(0, MAX_EVENTS).forEach((e) => {

              let bmgs = e.get('bettingMarketGroups');
              
              if (bmgs) {
                let bmg = bmgs.first();

                if (bmg && SportsbookUtils.hasBettingMarkets(bmg)) {
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

            content = (
              <div key={ sport.get('name') }>
                <BackingWidgetContainer
                  widgetTitle={ sport.get('name') }
                  marketData={ eventsToDisplay }
                />
              </div>
            );

            if (events && events.size > 3) { // Show the More link
              content = (
                <div key={ sport.get('name') }>
                  <BackingWidgetContainer
                    widgetTitle={ sport.get('name') }
                    marketData={ eventsToDisplay }
                  />
                  <div className='more-sport-link'>
                    <a 
                      onClick={ () => this.props.navigateTo(
                        '/sportsbook/sport/' + sport.get('sport_id')
                      ) }
                    >
                    More { sport.get('name') }
                    </a>
                  </div>
                </div>
              );
            }

            if (eventsToDisplay.length > 0) {
              return content;
            } else {
              return null;
            }
          })
        }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const allSports = EventPageSelector.getAllSportsData(state, ownProps);

  return {
    allSports
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    navigateTo: NavigateActions.navigateTo
  },
  dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(SportsBook);
