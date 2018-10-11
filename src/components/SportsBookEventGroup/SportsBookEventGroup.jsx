import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {EventPageSelector, EventGroupPageSelector} from '../../selectors';
import {BackingWidgetContainer} from '../BettingWidgets';
import {SportBanner} from '../Banners';
import {SportsbookUtils, ObjectUtils} from '../../utility';

const MAX_EVENTS = 25;
class SportsBookEventGroup extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pagination: 0
    };
    this.setPage = this.setPage.bind(this);
  }


  setPage(page) {
    this.setState({
      pagination: page
    });
  }

  renderPagination(numPages) {
    let pageNumbers = [];

    for (let i = 0; i < numPages; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers.map((page) => {
      return (
        <li 
          key={ page } 
          onClick={ () => this.setPage(page) }
          className={ this.state.pagination === page ? 'active' : '' }
        >
          { page }
        </li>
      );
    });
  }

  render() {
    const eventGroup = this.props.eventGroup;

    if (eventGroup) {
      const events = eventGroup.get('events');
      let eventsToDisplay = [];
      let pagination = '';

      if (events) {

        let start = this.state.pagination * MAX_EVENTS;
        let finish = (this.state.pagination + 1) * MAX_EVENTS;
        let numPages = Math.ceil(events.size / MAX_EVENTS);
        pagination = this.renderPagination(numPages);

        events.slice(start, finish).forEach((e) => {
          let bmgs = e.get('bettingMarketGroups');
          let bmg = bmgs.first();

          if (SportsbookUtils.isMatchodds(bmg) || 
              SportsbookUtils.isMoneyline(bmg)) {
            eventsToDisplay.push(
              bmg
                .set('eventName', e.get('name'))
                .set('eventID', e.get('id'))
                .set('eventTime', e.get('start_time'))
                .set('eventStatus', ObjectUtils.eventStatus(e))
            );
          }
        });
      }

      return (
        <div className='event-group-wrapper'>
          <SportBanner sport={ this.props.sportName } />
          <BackingWidgetContainer
            widgetTitle={ eventGroup.get('name') }
            marketData={ eventsToDisplay }
          />
          <ul className='event-group-pagination'>
            { pagination }
          </ul>
        </div>
      );
    }

    return null;
  }
}

const mapStateToProps = (state, ownProps) => {
  const eventGroup = EventPageSelector.getEventGroupData(state, ownProps.params.objectId);
  return {
    eventGroup: eventGroup,
    sportName: EventGroupPageSelector.getSportName(state, ownProps)
  };
};

export default connect(mapStateToProps)(SportsBookEventGroup);
