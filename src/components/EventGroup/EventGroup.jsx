import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { SportBanner } from '../Banners';
import { SimpleBettingWidget } from '../BettingWidgets';
import { EventGroupPageActions } from '../../actions';
import { EventGroupPageSelector } from '../../selectors';

const MAX_EVENT_PER_PAGE = 15;
const { getData } = EventGroupPageActions;

class EventGroup extends PureComponent {
  constructor(props) {
    super(props);
    this.props.dispatch(getData(props.params.objectId));
  }

  render() {
    const { sportName, eventGroupName, events, currencyFormat } = this.props;
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
        />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    sportName: EventGroupPageSelector.getSportName(state, ownProps),
    eventGroupName: EventGroupPageSelector.getEventGroupName(state, ownProps),
    events: EventGroupPageSelector.getEventGroupPageData(state, ownProps)
  };
};

export default connect(mapStateToProps)(EventGroup);
