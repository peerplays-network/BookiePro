const bettingMarketGroups = [
  {
    id: '1.104.1',
    event_id: '1.103.1',
    market_type_id: 'Moneyline',
    options: null,
    betting_market_ids: [
      '1.105.1',
      '1.105.2'
    ]
  },
  {
    id: '1.104.2',
    event_id: '1.103.1',
    market_type_id: 'Spread',
    options: {
      margin: 5,
      score: 0
    },
    betting_market_ids: [
      '1.105.3',
      '1.105.4'
    ]
  },
  {
    id: '1.104.3',
    event_id: '1.103.1',
    market_type_id: 'OverUnder',
    options: {
      margin: 0,
      score: 5
    },
    betting_market_ids: [
      '1.105.5',
      '1.105.6'
    ]
  },
  {
    id: '1.104.4',
    event_id: '1.103.2',
    market_type_id: 'Moneyline',
    options: null,
    betting_market_ids: [
      '1.105.7',
      '1.105.8'
    ]
  },
  {
    id: '1.104.5',
    event_id: '1.103.2',
    market_type_id: 'Spread',
    options: {
      margin: 15,
      score: 0
    },
    betting_market_ids: [
      '1.105.9',
      '1.105.10'
    ]
  },
  {
    id: '1.104.6',
    event_id: '1.103.2',
    market_type_id: 'OverUnder',
    options: {
      margin: 0,
      score: 15
    },
    betting_market_ids: [
      '1.105.11',
      '1.105.12'
    ]
  },
  {
    id: '1.104.7',
    event_id: '1.103.3',
    market_type_id: 'Moneyline',
    options: null,
    betting_market_ids: [
      '1.105.13',
      '1.105.14'
    ]
  },
  {
    id: '1.104.8',
    event_id: '1.103.3',
    market_type_id: 'Spread',
    options: {
      margin: 5,
      score: 0
    },
    betting_market_ids: [
      '1.105.15',
      '1.105.16'
    ]
  },
  {
    id: '1.104.9',
    event_id: '1.103.3',
    market_type_id: 'OverUnder',
    options: {
      margin: 0,
      score: 5
    },
    betting_market_ids: [
      '1.105.17',
      '1.105.18'
    ]
  },
  {
    id: '1.104.10',
    event_id: '1.103.4',
    market_type_id: 'Moneyline',
    options: null,
    betting_market_ids: [
      '1.105.19',
      '1.105.20'
    ]
  },
  {
    id: '1.104.11',
    event_id: '1.103.4',
    market_type_id: 'Spread',
    options: {
      margin: 15,
      score: 0
    },
    betting_market_ids: [
      '1.105.21',
      '1.105.22'
    ]
  },
  {
    id: '1.104.12',
    event_id: '1.103.4',
    market_type_id: 'OverUnder',
    options: {
      margin: 0,
      score: 15
    },
    betting_market_ids: [
      '1.105.23',
      '1.105.24'
    ]
  }
];

//TODO: add more in this list, pay attention on the relation with the events, betting_markets dummy data
//TODO: for each event, make one moneyline, spread, overunder

export default bettingMarketGroups;
