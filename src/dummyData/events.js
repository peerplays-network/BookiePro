const events = [
  {
    id: '1.103.1',
    sport_id: '1.100.1',
    name: 'American Football Team 1 vs American Football Team 2',
    seasons: '2016-2017',
    start_time: 1489479436, // 14 March 2017
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
    name: 'Basketball Team 1 vs Basketball Team 2',
    seasons: '2017-2018',
    start_time: 1521015436, // 14 March 2018
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
  }
];

//TODO: add more in this list, pay attention on the relation with the sports, competitors, event group dummy data

export default events;
