import _ from 'lodash';
import Immutable from 'immutable';

const eventGroups = [
  {
    id: '1.101.1',
    sport_id: '1.100.1',
    name: 'NFL'
  },
  {
    id: '1.101.2',
    sport_id: '1.100.1',
    name: 'NCAA'
  },
  {
    id: '1.101.3',
    sport_id: '1.100.1',
    name: 'American Football Event Group 3'
  },
  {
    id: '1.101.4',
    sport_id: '1.100.2',
    name: 'Basketball Event Group 1'
  },
  {
    id: '1.101.5',
    sport_id: '1.100.2',
    name: 'Basketball Event Group 2'
  },
  {
    id: '1.101.6',
    sport_id: '1.100.2',
    name: 'Basketball Event Group 3'
  }
];

//TODO: complete this list based on sports dummy data

const immutableEventGroups = _.map(eventGroups, eventGroup => Immutable.fromJS(eventGroup));
export default immutableEventGroups;
