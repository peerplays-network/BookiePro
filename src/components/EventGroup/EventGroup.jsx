import React, { Component } from 'react';
import { SportBanner } from '../Banners';

class EventGroup extends Component {
  render() {
    return (
      <div className='event-group-wrapper'>
        <SportBanner sport='American Football' />
      </div>
    )
  }
}

export default EventGroup;
