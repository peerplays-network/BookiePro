import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { SportBanner } from '../Banners';
import { SimpleBettingWidget } from '../BettingWidgets';
import { EventGroupPageActions, NavigateActions } from '../../actions';
import { EventGroupPageSelector, QuickBetDrawerSelector } from '../../selectors';
import PeerPlaysLogo from '../PeerPlaysLogo';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

const MAX_EVENT_PER_PAGE = 15;

class EventGroup extends PureComponent {
  componentWillMount() {
    // Get the data
    this.props.getData(this.props.params.objectId);
  }

  componentWillReceiveProps(nextProps){
    if (!nextProps.eventGroup || nextProps.eventGroup.isEmpty()) {
      // Sport doesn't exist,
      // Go back to home page
      this.props.navigateTo('/exchange');
    } else {
      const prevEventGroupId = this.props.params.objectId;
      const nextEventGroupId = nextProps.params.objectId;
      if (nextEventGroupId !== prevEventGroupId){
        // Get the data
        this.props.getData(nextEventGroupId);
      }
    }
  }


  render() {
    const { eventGroup, sportName, eventGroupName, events, currencyFormat } = this.props;
    // If event group doesn't exist return null
    if (!eventGroup || eventGroup.isEmpty()) {
      return null;
    } else {
      return (
       <div className='event-group-wrapper'>
         <SportBanner sport={ sportName }/>
         <SimpleBettingWidget
           sportName={ sportName }
           title={ eventGroupName }
           events={ events }
           currencyFormat={ currencyFormat }
           showFooter={ false }
           showPagination={ events.size > MAX_EVENT_PER_PAGE }
           pageSize={ MAX_EVENT_PER_PAGE }
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
  const eventGroup = EventGroupPageSelector.getEventGroup(state, ownProps);

  let props = {
    eventGroup
  }

  // Populate other properties if sport exists
  if (eventGroup && !eventGroup.isEmpty()) {
    _.assign(props, {
      sportName: EventGroupPageSelector.getSportName(state, ownProps),
      eventGroupName: EventGroupPageSelector.getEventGroupName(state, ownProps),
      events: EventGroupPageSelector.getEventGroupPageData(state, ownProps),
      canCreateBet: QuickBetDrawerSelector.canAcceptBet(state, ownProps),
    });
  }
  return props;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
    getData: EventGroupPageActions.getData,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EventGroup);
