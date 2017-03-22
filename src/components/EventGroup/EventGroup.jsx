import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SportBanner } from '../Banners';
import SimpleBettingWidget from '../SimpleBettingWidget';
import { EventGroupPageActions } from '../../actions';

const { getData } = EventGroupPageActions;

class EventGroup extends Component {
  constructor(props) {
    super(props);
    this.props.dispatch(getData(props.params.objectId));
  }

  render() {
    return (
      <div className='event-group-wrapper'>
        <SportBanner sport={ this.props.sport }/>
        <SimpleBettingWidget
          title={ this.props.eventGroup }
          event={ [] }
        />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { eventGroupPage } = state;

  console.log('EventGroupPage', eventGroupPage);
  return {
    sport: eventGroupPage.sportName,
    eventGroup: eventGroupPage.eventGroupName
  };
};

export default connect(mapStateToProps)(EventGroup);
