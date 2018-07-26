import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {SportBanner} from '../Banners';
import {SimpleBettingWidget} from '../BettingWidgets';
import {SportPageActions, NavigateActions} from '../../actions';
import {SportPageSelector, QuickBetDrawerSelector} from '../../selectors';
import PeerPlaysLogo from '../PeerPlaysLogo';
import {DateUtils} from '../../utility';
import {bindActionCreators} from 'redux';

const MAX_EVENTS_PER_WIDGET = 10;

class Sport extends PureComponent {
  componentWillMount() {
    // Get the data
    this.props.getData(this.props.params.objectId);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.sport || nextProps.sport.isEmpty()) {
      // Sport doesn't exist,
      // Go back to home page
      this.props.navigateTo('/exchange');
    } else {
      const prevSportId = this.props.params.objectId;
      const nextSportId = nextProps.params.objectId;

      if (nextSportId !== prevSportId) {
        // Get the data
        this.props.getData(nextSportId);
      }
    }
  }

  render() {
    const {sport, sportName, sportPageData, currencyFormat} = this.props;

    // Return nothing if sport doesn't exist
    if (!sport || sport.isEmpty()) {
      return null;
    } else {
      return (
        <div className='sport-wrapper'>
          <SportBanner sport={ sportName } />
          {// convert the list of keys into vanilla JS array so that I can grab the index
            sportPageData.map(eventGroupData => {
              const eventGroupId = eventGroupData.get('event_group_id');
              const events = eventGroupData.get('events');
              let sortedEvents = [];
              // Sort by event time
              sortedEvents = DateUtils.sortEventsByDate(events);
              return (
                events.size > 0 && (
                  <SimpleBettingWidget
                    sportName={ sportName }
                    key={ eventGroupId } // required by React to have unique key
                    title={ eventGroupData.get('name') }
                    events={ sortedEvents.slice(0, MAX_EVENTS_PER_WIDGET) }
                    currencyFormat={ currencyFormat }
                    showFooter={ events.size > MAX_EVENTS_PER_WIDGET }
                    footerLink={ `/exchange/eventgroup/${eventGroupId}` }
                    pagination={ false } // No pagination, only show top records
                    canCreateBet={ this.props.canCreateBet }
                  />
                )
              );
            })}
          <div className='margin-top-18 logo-container'>
            <PeerPlaysLogo />
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const sport = SportPageSelector.getSport(state, ownProps);

  let props = {
    sport
  };

  // Populate other properties if sport exists
  if (sport && !sport.isEmpty()) {
    props = Object.assign(props, {
      sportName: SportPageSelector.getSportName(state, ownProps),
      sportPageData: SportPageSelector.getSportPageData(state, ownProps),
      canCreateBet: QuickBetDrawerSelector.canAcceptBet(state, ownProps)
    });
  }

  return props;
};

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    navigateTo: NavigateActions.navigateTo,
    getData: SportPageActions.getData
  },
  dispatch
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sport);
