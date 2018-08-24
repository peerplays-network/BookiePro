const getEvent = (state, id) => state.getIn(['event', 'eventsById', id]);

const EventPageSelector = {
  getEvent
};

export default EventPageSelector;
