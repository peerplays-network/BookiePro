import _ from 'lodash';
import Immutable from 'immutable';

import moment from 'moment';

/**
 * Instructions
 *
 * You can use the moment.js library to create a timestamp in the future.
 * Please follow the examples already defined in this file. Thanks. 
 */

const events = [
  {
    id: '1.103.1',
    sport_id: '1.100.1',
    name: 'NY Giants vs Green Bay',
    seasons: '2016-2017',
    start_time: moment().add(1, 'days').unix() * 1000,
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
    start_time: moment().add(1, 'days').unix() * 1000,
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
    start_time: moment().add(9, 'days').unix() * 1000,
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
    start_time: moment().add(9, 'days').unix() * 1000,
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
  //baseball
  {
    "id": "1.103.18",
    "sport_id": "1.100.3",
    "name": "Miami Marlins vs Washington Nationals",
    "seasons": "2017-2018",
    "start_time": moment().add(2, 'days').unix() * 1000,
    "event_group_id": "1.101.7",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.21",
        "score": 0
      },
      {
        "competitor_id": "1.102.22",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.52",
      "1.104.53",
      "1.104.54"
    ]
  },
  {
    "id": "1.103.19",
    "sport_id": "1.100.3",
    "name": "Atlanta Braves vs New York Mets",
    "seasons": "2017-2018",
    "start_time": moment().add(4, 'days').unix() * 1000,
    "event_group_id": "1.101.7",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.23",
        "score": 0
      },
      {
        "competitor_id": "1.102.24",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.55",
      "1.104.56",
      "1.104.57"
    ]
  },
  {
    "id": "1.103.20",
    "sport_id": "1.100.3",
    "name": "Pittsburgh Pirates vs Boston Red Sox",
    "seasons": "2017-2018",
    "start_time": moment().add(5, 'days').unix() * 1000,
    "event_group_id": "1.101.7",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.25",
        "score": 0
      },
      {
        "competitor_id": "1.102.26",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.58",
      "1.104.59",
      "1.104.60"
    ]
  },
  {
    "id": "1.103.21",
    "sport_id": "1.100.3",
    "name": "Colorado Rockies vs Milwaukee Brewers",
    "seasons": "2017-2018",
    "start_time": moment().add(6, 'days').unix() * 1000,
    "event_group_id": "1.101.7",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.27",
        "score": 0
      },
      {
        "competitor_id": "1.102.28",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.61",
      "1.104.62",
      "1.104.63"
    ]
  },
  {
    "id": "1.103.22",
    "sport_id": "1.100.3",
    "name": "Toronto Blue Jays vs Baltimore Orioles",
    "seasons": "2017-2018",
    "start_time": moment().add(7, 'days').unix() * 1000,
    "event_group_id": "1.101.7",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.29",
        "score": 0
      },
      {
        "competitor_id": "1.102.30",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.64",
      "1.104.65",
      "1.104.66"
    ]
  },
  {
    "id": "1.103.23",
    "sport_id": "1.100.3",
    "name": "San Diego Padres vs Los Angeles Dodgers",
    "seasons": "2017-2018",
    "start_time": moment().add(7, 'days').unix() * 1000,
    "event_group_id": "1.101.7",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.31",
        "score": 0
      },
      {
        "competitor_id": "1.102.32",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.67",
      "1.104.68",
      "1.104.69"
    ]
  },
  {
    "id": "1.103.24",
    "sport_id": "1.100.3",
    "name": "Kansas City Royals vs Minnesota Twins",
    "seasons": "2017-2018",
    "start_time": moment().add(8, 'days').unix() * 1000,
    "event_group_id": "1.101.7",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.33",
        "score": 0
      },
      {
        "competitor_id": "1.102.34",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.70",
      "1.104.71",
      "1.104.72"
    ]
  },
  {
    "id": "1.103.25",
    "sport_id": "1.100.3",
    "name": "Detroit Tigers vs Chicago White Sox",
    "seasons": "2017-2018",
    "start_time": moment().add(8, 'days').unix() * 1000,
    "event_group_id": "1.101.7",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.35",
        "score": 0
      },
      {
        "competitor_id": "1.102.36",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.73",
      "1.104.74",
      "1.104.75"
    ]
  },
  {
    "id": "1.103.26",
    "sport_id": "1.100.3",
    "name": "Philadelphia Phillies vs Cincinnati Reds",
    "seasons": "2017-2018",
    "start_time": moment().add(10, 'days').unix() * 1000,
    "event_group_id": "1.101.7",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.37",
        "score": 0
      },
      {
        "competitor_id": "1.102.38",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.76",
      "1.104.77",
      "1.104.78"
    ]
  },
  {
    "id": "1.103.27",
    "sport_id": "1.100.3",
    "name": "Cleveland Indians vs Texas Rangers",
    "seasons": "2017-2018",
    "start_time": moment().add(12, 'days').unix() * 1000,
    "event_group_id": "1.101.7",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.39",
        "score": 0
      },
      {
        "competitor_id": "1.102.40",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.79",
      "1.104.80",
      "1.104.81"
    ]
  },
  //soccer
  {
    "id": "1.103.28",
    "sport_id": "1.100.4",
    "name": "Southern District vs Hong Kong Rangers",
    "seasons": "2017-2018",
    "start_time": moment().add(2, 'days').unix() * 1000,
    "event_group_id": "1.101.10",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.41",
        "score": 0
      },
      {
        "competitor_id": "1.102.42",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.82",
      "1.104.83",
      "1.104.84"
    ]
  },
  {
    "id": "1.103.29",
    "sport_id": "1.100.4",
    "name": "Erchim FC vs Kigwancha SC",
    "seasons": "2017-2018",
    "start_time": moment().add(3, 'days').unix() * 1000,
    "event_group_id": "1.101.10",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.43",
        "score": 0
      },
      {
        "competitor_id": "1.102.44",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.85",
      "1.104.86",
      "1.104.87"
    ]
  },
  {
    "id": "1.103.30",
    "sport_id": "1.100.4",
    "name": "E Suburbs Brisbane vs Ipswich Knights",
    "seasons": "2017-2018",
    "start_time": moment().add(4, 'days').unix() * 1000,
    "event_group_id": "1.101.10",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.45",
        "score": 0
      },
      {
        "competitor_id": "1.102.46",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.88",
      "1.104.89",
      "1.104.90"
    ]
  },
  {
    "id": "1.103.31",
    "sport_id": "1.100.4",
    "name": "Felda Utd vs Ceres La Salle",
    "seasons": "2017-2018",
    "start_time": moment().add(5, 'days').unix() * 1000,
    "event_group_id": "1.101.10",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.47",
        "score": 0
      },
      {
        "competitor_id": "1.102.48",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.91",
      "1.104.92",
      "1.104.93"
    ]
  },
  {
    "id": "1.103.32",
    "sport_id": "1.100.4",
    "name": "Mitchelton FC vs Brisbane Knights FC",
    "seasons": "2017-2018",
    "start_time": moment().add(6, 'days').unix() * 1000,
    "event_group_id": "1.101.10",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.49",
        "score": 0
      },
      {
        "competitor_id": "1.102.50",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.94",
      "1.104.95",
      "1.104.96"
    ]
  },
  {
    "id": "1.103.33",
    "sport_id": "1.100.4",
    "name": "Logan Lightning FC vs Capalaba FC",
    "seasons": "2017-2018",
    "start_time": moment().add(7, 'days').unix() * 1000,
    "event_group_id": "1.101.10",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.51",
        "score": 0
      },
      {
        "competitor_id": "1.102.52",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.97",
      "1.104.98",
      "1.104.99"
    ]
  },
  {
    "id": "1.103.34",
    "sport_id": "1.100.4",
    "name": "Uni of Queensland vs Ipswich City FC",
    "seasons": "2017-2018",
    "start_time": moment().add(8, 'days').unix() * 1000,
    "event_group_id": "1.101.10",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.53",
        "score": 0
      },
      {
        "competitor_id": "1.102.54",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.100",
      "1.104.101",
      "1.104.102"
    ]
  },
  {
    "id": "1.103.35",
    "sport_id": "1.100.4",
    "name": "Southside Eagles SC vs Brisbane Force",
    "seasons": "2017-2018",
    "start_time": moment().add(8, 'days').unix() * 1000,
    "event_group_id": "1.101.10",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.55",
        "score": 0
      },
      {
        "competitor_id": "1.102.56",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.103",
      "1.104.104",
      "1.104.105"
    ]
  },
  {
    "id": "1.103.36",
    "sport_id": "1.100.4",
    "name": "Moreton Bay Jets FC vs Western Pride FC",
    "seasons": "2017-2018",
    "start_time": moment().add(9, 'days').unix() * 1000,
    "event_group_id": "1.101.10",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.57",
        "score": 0
      },
      {
        "competitor_id": "1.102.58",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.106",
      "1.104.107",
      "1.104.108"
    ]
  },
  {
    "id": "1.103.37",
    "sport_id": "1.100.4",
    "name": "Brisbane Strikers vs Sunshine Coast FC",
    "seasons": "2017-2018",
    "start_time": moment().add(12, 'days').unix() * 1000,
    "event_group_id": "1.101.10",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.59",
        "score": 0
      },
      {
        "competitor_id": "1.102.60",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.109",
      "1.104.110",
      "1.104.111"
    ]
  }
];

//TODO: add more in this list, pay attention on the relation with the sports, competitors, event group dummy data

const immutableEvents = _.map(events, event => Immutable.fromJS(event));
export default immutableEvents;
