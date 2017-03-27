import _ from 'lodash';
import Immutable from 'immutable';

const competitors = [
  {
    id: '1.102.1',
    sport_id: '1.100.1',
    name: 'NY Giants'
  },
  {
    id: '1.102.2',
    sport_id: '1.100.1',
    name: 'Green Bay'
  },
  {
    id: '1.102.3',
    sport_id: '1.100.1',
    name: 'Seatle Seahawks'
  },
  {
    id: '1.102.4',
    sport_id: '1.100.2',
    name: 'Cleveland Cavaliers'
  },
  {
    id: '1.102.5',
    sport_id: '1.100.2',
    name: 'Golden State Wariors'
  },
  {
    id: '1.102.6',
    sport_id: '1.100.2',
    name: 'Oklahoma City Thunders'
  },
  {
    id: '1.102.7',
    sport_id: '1.100.1',
    name: 'Carolina Panthers'
  },
  {
    id: '1.102.8',
    sport_id: '1.100.1',
    name: 'Denver Broncos'
  },
  {
    id: '1.102.9',
    sport_id: '1.100.1',
    name: 'Tampa Bay Buccaneers'
  },
  {
    id: '1.102.10',
    sport_id: '1.100.1',
    name: 'Atlanta Falcons'
  },
  {
    id: '1.102.11',
    sport_id: '1.100.1',
    name: 'Minnesota Vikings'
  },
  {
    id: '1.102.12',
    sport_id: '1.100.1',
    name: 'Tennessee Titans'
  },
  {
    id: '1.102.13',
    sport_id: '1.100.1',
    name: 'Cleveland Browns'
  },
  {
    id: '1.102.14',
    sport_id: '1.100.1',
    name: 'Philadelphia Eagles'
  },
  {
    id: '1.102.15',
    sport_id: '1.100.1',
    name: 'Cincinnati Bengals'
  },
  {
    id: '1.102.16',
    sport_id: '1.100.1',
    name: 'New York Jets'
  },
  {
    id: '1.102.17',
    sport_id: '1.100.1',
    name: 'Oakland Raiders'
  },
  {
    id: '1.102.18',
    sport_id: '1.100.1',
    name: 'New Orleans Saints'
  },
  {
    id: '1.102.19',
    sport_id: '1.100.1',
    name: 'San Diego Chargers'
  },
  {
    id: '1.102.20',
    sport_id: '1.100.1',
    name: 'Kansas City Chiefs'
  },
];

//TODO: add more of this, please follow sport_id from sports dummy data

const immutableCompetitors = _.map(competitors, competitor => Immutable.fromJS(competitor));
export default immutableCompetitors;
