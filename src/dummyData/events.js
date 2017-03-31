import _ from 'lodash';
import Immutable from 'immutable';

import moment from 'moment';

const events = [
  {
    id: '1.103.1',
    sport_id: '1.100.1',
    name: 'NY Giants vs Green Bay',
    seasons: '2016-2017',
    start_time: moment().add(1, 'days').unix() * 1000, // Always tomorrow
    event_group_id: '1.101.1',
    event_status_id: 'Completed',
    scores: [
      {
        competitor_id: '1.102.1',
        score: 36
      },
      {
        competitor_id: '1.102.2',
        score: 17
      },
    ],
    betting_market_group_ids: [
      '1.104.1',
      '1.104.2',
      '1.104.3'
    ]
  },
  {
    id: '1.103.2',
    sport_id: '1.100.2',
    name: 'Cleveland Cavaliers vs Golden State Wariors',
    seasons: '2017-2018',
    start_time: moment().add(1, 'days').unix() * 1000, // Always tomorrow
    event_group_id: '1.101.4',
    event_status_id: 'Upcoming',
    scores: [
      {
        competitor_id: '1.102.4',
        score: 0
      },
      {
        competitor_id: '1.102.4',
        score: 0
      },
    ],
    betting_market_group_ids: [
      '1.104.4',
      '1.104.5',
      '1.104.6'
    ]
  },
  {
    id: '1.103.3',
    sport_id: '1.100.1',
    name: 'Carolina Panthers vs Denver Broncos',
    seasons: '2017-2018',
    start_time: moment().add(2, 'days').unix() * 1000,
    event_group_id: '1.101.1',
    event_status_id: 'Upcoming',
    scores: [
      {
        competitor_id: '1.102.7',
        score: 0
      },
      {
        competitor_id: '1.102.8',
        score: 0
      },
    ],
    betting_market_group_ids: [
      '1.104.7',
      '1.104.8',
      '1.104.9'
    ]
  },
  {
    id: '1.103.4',
    sport_id: '1.100.1',
    name: 'Tampa Bay Buccaneers vs Atlanta Falcons',
    seasons: '2017-2018',
    start_time: moment().add(3, 'days').unix() * 1000,
    event_group_id: '1.101.1',
    event_status_id: 'Upcoming',
    scores: [
      {
        competitor_id: '1.102.9',
        score: 0
      },
      {
        competitor_id: '1.102.10',
        score: 0
      },
    ],
    betting_market_group_ids: [
      '1.104.10',
      '1.104.11',
      '1.104.12'
    ]
  },
  {
    id: '1.103.5',
    sport_id: '1.100.1',
    name: 'Minnesota Vikings vs Tennessee Titans',
    seasons: '2017-2018',
    start_time: moment().add(4, 'days').unix() * 1000,
    event_group_id: '1.101.1',
    event_status_id: 'Upcoming',
    scores: [
      {
        competitor_id: '1.102.11',
        score: 0
      },
      {
        competitor_id: '1.102.12',
        score: 0
      },
    ],
    betting_market_group_ids: [
      '1.104.13',
      '1.104.14',
      '1.104.15'
    ]
  },
  {
    id: '1.103.6',
    sport_id: '1.100.1',
    name: 'Cleveland Browns vs Philandelphia Eagles',
    seasons: '2017-2018',
    start_time: moment().add(5, 'days').unix() * 1000,
    event_group_id: '1.101.1',
    event_status_id: 'Upcoming',
    scores: [
      {
        competitor_id: '1.102.13',
        score: 0
      },
      {
        competitor_id: '1.102.14',
        score: 0
      },
    ],
    betting_market_group_ids: [
      '1.104.16',
      '1.104.17',
      '1.104.18'
    ]
  },
  {
    id: '1.103.7',
    sport_id: '1.100.1',
    name: 'Cincinnati Bengals vs New York Jets',
    seasons: '2017-2018',
    start_time: moment().add(6, 'days').unix() * 1000,
    event_group_id: '1.101.1',
    event_status_id: 'Upcoming',
    scores: [
      {
        competitor_id: '1.102.15',
        score: 0
      },
      {
        competitor_id: '1.102.16',
        score: 0
      },
    ],
    betting_market_group_ids: [
      '1.104.19',
      '1.104.20',
      '1.104.21'
    ]
  },
  {
    id: '1.103.8',
    sport_id: '1.100.1',
    name: 'Oakland Raiders vs New Orleans Saints',
    seasons: '2017-2018',
    start_time: moment().add(7, 'days').unix() * 1000,
    event_group_id: '1.101.1',
    event_status_id: 'Upcoming',
    scores: [
      {
        competitor_id: '1.102.17',
        score: 0
      },
      {
        competitor_id: '1.102.18',
        score: 0
      },
    ],
    betting_market_group_ids: [
      '1.104.22',
      '1.104.23',
      '1.104.24'
    ]
  },
  {
    id: '1.103.9',
    sport_id: '1.100.1',
    name: 'San Diego Chargers vs Kansas City Chiefs',
    seasons: '2017-2018',
    start_time: moment().add(8, 'days').unix() * 1000,
    event_group_id: '1.101.1',
    event_status_id: 'Upcoming',
    scores: [
      {
        competitor_id: '1.102.19',
        score: 0
      },
      {
        competitor_id: '1.102.20',
        score: 0
      },
    ],
    betting_market_group_ids: [
      '1.104.25',
      '1.104.26',
      '1.104.27'
    ]
  },
  {
    id: '1.103.10',
    sport_id: '1.100.2',
    name: 'Tanduay Light vs San Beda',
    seasons: '2016-2017',
    start_time: 1489462211000,
    event_group_id: '1.101.4',
    event_status_id: 'Completed',
    scores: [
      {
        competitor_id: '1.102.21',
        score: 36
      },
      {
        competitor_id: '1.102.22',
        score: 17
      },
    ],
    "betting_market_group_ids": [
      "1.104.28",
      "1.104.29",
      "1.104.30"
    ]
  },
  {
    id: '1.103.11',
    sport_id: '1.100.2',
    name: 'Racal Ceramica vs Cafe France Bakers',
    seasons: '2017-2018',
    start_time: moment().add(9, 'days').unix() * 1000, // Always tomorrow
    event_group_id: '1.101.4',
    event_status_id: 'Upcoming',
    scores: [
      {
        competitor_id: '1.102.23',
        score: 0
      },
      {
        competitor_id: '1.102.24',
        score: 0
      },
    ],
    "betting_market_group_ids": [
      "1.104.31",
      "1.104.32",
      "1.104.33"
    ]
  },
  {
    id: '1.103.12',
    sport_id: '1.100.2',
    name: 'LG Sakers vs Dongbu Promy',
    seasons: '2017-2018',
    start_time: moment().add(10, 'days').unix() * 1000,
    event_group_id: '1.101.4',
    event_status_id: 'Upcoming',
    scores: [
      {
        competitor_id: '1.102.25',
        score: 0
      },
      {
        competitor_id: '1.102.26',
        score: 0
      },
    ],
    "betting_market_group_ids": [
      "1.104.34",
      "1.104.35",
      "1.104.36"
    ]
  },
  {
    id: '1.103.13',
    sport_id: '1.100.2',
    name: 'BK Novosibirsk vs Kupol Rodniki',
    seasons: '2017-2018',
    start_time: moment().add(11, 'days').unix() * 1000,
    event_group_id: '1.101.4',
    event_status_id: 'Upcoming',
    scores: [
      {
        competitor_id: '1.102.27',
        score: 0
      },
      {
        competitor_id: '1.102.28',
        score: 0
      },
    ],
    "betting_market_group_ids": [
      "1.104.37",
      "1.104.38",
      "1.104.39"
    ]
  },
  {
    id: '1.103.14',
    sport_id: '1.100.2',
    name: 'Pieno zvaigzdes vs Tartu Rocks',
    seasons: '2017-2018',
    start_time: moment().add(12, 'days').unix() * 1000,
    event_group_id: '1.101.4',
    event_status_id: 'Upcoming',
    scores: [
      {
        competitor_id: '1.102.29',
        score: 0
      },
      {
        competitor_id: '1.102.30',
        score: 0
      },
    ],
    "betting_market_group_ids": [
      "1.104.40",
      "1.104.41",
      "1.104.42"
    ]
  },
  {
    id: '1.103.15',
    sport_id: '1.100.2',
    name: 'Levski Sofia vs Academic Plovdiv',
    seasons: '2017-2018',
    start_time: moment().add(13, 'days').unix() * 1000,
    event_group_id: '1.101.4',
    event_status_id: 'Upcoming',
    scores: [
      {
        competitor_id: '1.102.31',
        score: 0
      },
      {
        competitor_id: '1.102.32',
        score: 0
      },
    ],
    "betting_market_group_ids": [
      "1.104.43",
      "1.104.44",
      "1.104.45"
    ]
  },
  {
    id: '1.103.16',
    sport_id: '1.100.2',
    name: 'Sisu Basket vs Horsholm 79ers',
    seasons: '2017-2018',
    start_time: moment().add(14, 'days').unix() * 1000,
    event_group_id: '1.101.4',
    event_status_id: 'Upcoming',
    scores: [
      {
        competitor_id: '1.102.33',
        score: 0
      },
      {
        competitor_id: '1.102.34',
        score: 0
      },
    ],
    "betting_market_group_ids": [
      "1.104.46",
      "1.104.47",
      "1.104.48"
    ]
  },
  {
    id: '1.103.17',
    sport_id: '1.100.2',
    name: 'Randers Cimbria vs Horsens IC',
    seasons: '2017-2018',
    start_time: moment().add(15, 'days').unix() * 1000,
    event_group_id: '1.101.4',
    event_status_id: 'Upcoming',
    scores: [
      {
        competitor_id: '1.102.35',
        score: 0
      },
      {
        competitor_id: '1.102.36',
        score: 0
      },
    ],
    "betting_market_group_ids": [
      "1.104.49",
      "1.104.50",
      "1.104.51"
    ]
  },
];

//TODO: add more in this list, pay attention on the relation with the sports, competitors, event group dummy data

const immutableEvents = _.map(events, event => Immutable.fromJS(event));
export default immutableEvents;
