import moment from 'moment';

const events = [
  {
    id: '1.103.1',
    sport_id: '1.100.1',
    name: 'NY Giants vs Green Bay',
    seasons: '2016-2017',
    start_time: 1489462211000, // 14 March 2017
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
    name: 'Green Bay vs Seatle Seahawks',
    seasons: '2016-2017',
    start_time: 1490020212, // 20 March 2017
    event_group_id: '1.101.1',
    event_status_id: 'Completed',
    scores: [
      {
        competitor_id: '1.102.2',
        score: 36
      },
      {
        competitor_id: '1.102.3',
        score: 17
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
    sport_id: '1.100.2',
    name: 'Golden State Wariors vs Oklahoma City Thunders',
    seasons: '2017-2018',
    start_time: moment().add(2, 'days').unix() * 1000, // Always day after tomorrow
    event_group_id: '1.101.6',
    event_status_id: 'Upcoming',
    scores: [
      {
        competitor_id: '1.102.5',
        score: 0
      },
      {
        competitor_id: '1.102.6',
        score: 0
      },
    ],
    betting_market_group_ids: [
      '1.104.10',
      '1.104.11',
      '1.104.12'
    ]
  }
];

//TODO: add more in this list, pay attention on the relation with the sports, competitors, event group dummy data

export default events;
