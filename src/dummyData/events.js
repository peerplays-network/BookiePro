import moment from 'moment';

/**
 * Instructions
 *
 * You can use the moment.js library to create a timestamp in the future.
 * Please follow the examples already defined in this file. Thanks.
 */

const events = [
  {
    "id": "1.103.1",
    "sport_id": "1.100.1",
    "name": "NY Giants vs Green Bay",
    "seasons": "2016-2017",
    "start_time": moment().add(1, 'days').unix() * 1000,
    "event_group_id": "1.101.1",
    "event_status_id": "Completed",
    "scores": [
      {
        "competitor_id": "1.102.1",
        "score": 36
      },
      {
        "competitor_id": "1.102.2",
        "score": 17
      }
    ],
    "betting_market_group_ids": [
      "1.104.1",
      "1.104.2",
      "1.104.3"
    ]
  },
  {
    "id": "1.103.2",
    "sport_id": "1.100.2",
    "name": "Cleveland Cavaliers vs Golden State Wariors",
    "seasons": "2017-2018",
    "start_time": moment().add(1, 'days').unix() * 1000,
    "event_group_id": "1.101.4",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.4",
        "score": 0
      },
      {
        "competitor_id": "1.102.4",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.4",
      "1.104.5",
      "1.104.6"
    ]
  },
  {
    "id": "1.103.3",
    "sport_id": "1.100.1",
    "name": "Carolina Panthers vs Denver Broncos",
    "seasons": "2017-2018",
    "start_time": moment().add(2, 'days').unix() * 1000,
    "event_group_id": "1.101.1",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.7",
        "score": 0
      },
      {
        "competitor_id": "1.102.8",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.7",
      "1.104.8",
      "1.104.9"
    ]
  },
  {
    "id": "1.103.4",
    "sport_id": "1.100.1",
    "name": "Tampa Bay Buccaneers vs Atlanta Falcons",
    "seasons": "2017-2018",
    "start_time": moment().add(3, 'days').unix() * 1000,
    "event_group_id": "1.101.1",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.9",
        "score": 0
      },
      {
        "competitor_id": "1.102.10",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.10",
      "1.104.11",
      "1.104.12"
    ]
  },
  {
    "id": "1.103.5",
    "sport_id": "1.100.1",
    "name": "Minnesota Vikings vs Tennessee Titans",
    "seasons": "2017-2018",
    "start_time": moment().add(4, 'days').unix() * 1000,
    "event_group_id": "1.101.1",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.11",
        "score": 0
      },
      {
        "competitor_id": "1.102.12",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.13",
      "1.104.14",
      "1.104.15"
    ]
  },
  {
    "id": "1.103.6",
    "sport_id": "1.100.1",
    "name": "Cleveland Browns vs Philandelphia Eagles",
    "seasons": "2017-2018",
    "start_time": moment().add(5, 'days').unix() * 1000,
    "event_group_id": "1.101.1",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.13",
        "score": 0
      },
      {
        "competitor_id": "1.102.14",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.16",
      "1.104.17",
      "1.104.18"
    ]
  },
  {
    "id": "1.103.7",
    "sport_id": "1.100.1",
    "name": "Cincinnati Bengals vs New York Jets",
    "seasons": "2017-2018",
    "start_time": moment().add(5, 'hours').unix() * 1000,
    "event_group_id": "1.101.1",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.15",
        "score": 0
      },
      {
        "competitor_id": "1.102.16",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.19",
      "1.104.20",
      "1.104.21"
    ]
  },
  {
    "id": "1.103.8",
    "sport_id": "1.100.1",
    "name": "Oakland Raiders vs New Orleans Saints",
    "seasons": "2017-2018",
    "start_time": moment().add(7, 'days').unix() * 1000,
    "event_group_id": "1.101.1",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.17",
        "score": 0
      },
      {
        "competitor_id": "1.102.18",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.22",
      "1.104.23",
      "1.104.24"
    ]
  },
  {
    "id": "1.103.9",
    "sport_id": "1.100.1",
    "name": "San Diego Chargers vs Kansas City Chiefs",
    "seasons": "2017-2018",
    "start_time": moment().add(8, 'days').unix() * 1000,
    "event_group_id": "1.101.1",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.19",
        "score": 0
      },
      {
        "competitor_id": "1.102.20",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.25",
      "1.104.26",
      "1.104.27"
    ]
  },
  {
    "id": "1.103.10",
    "sport_id": "1.100.2",
    "name": "Tanduay Light vs San Beda",
    "seasons": "2016-2017",
    "start_time": moment().add(9, 'days').unix() * 1000,
    "event_group_id": "1.101.4",
    "event_status_id": "Completed",
    "scores": [
      {
        "competitor_id": "1.102.21",
        "score": 36
      },
      {
        "competitor_id": "1.102.22",
        "score": 17
      }
    ],
    "betting_market_group_ids": [
      "1.104.28",
      "1.104.29",
      "1.104.30"
    ]
  },
  {
    "id": "1.103.11",
    "sport_id": "1.100.2",
    "name": "Racal Ceramica vs Cafe France Bakers",
    "seasons": "2017-2018",
    "start_time": moment().add(9, 'days').unix() * 1000,
    "event_group_id": "1.101.4",
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
      "1.104.31",
      "1.104.32",
      "1.104.33"
    ]
  },
  {
    "id": "1.103.12",
    "sport_id": "1.100.2",
    "name": "LG Sakers vs Dongbu Promy",
    "seasons": "2017-2018",
    "start_time": moment().add(10, 'days').unix() * 1000,
    "event_group_id": "1.101.4",
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
      "1.104.34",
      "1.104.35",
      "1.104.36"
    ]
  },
  {
    "id": "1.103.13",
    "sport_id": "1.100.2",
    "name": "BK Novosibirsk vs Kupol Rodniki",
    "seasons": "2017-2018",
    "start_time": moment().add(11, 'days').unix() * 1000,
    "event_group_id": "1.101.4",
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
      "1.104.37",
      "1.104.38",
      "1.104.39"
    ]
  },
  {
    "id": "1.103.14",
    "sport_id": "1.100.2",
    "name": "Pieno zvaigzdes vs Tartu Rocks",
    "seasons": "2017-2018",
    "start_time": moment().add(12, 'days').unix() * 1000,
    "event_group_id": "1.101.4",
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
      "1.104.40",
      "1.104.41",
      "1.104.42"
    ]
  },
  {
    "id": "1.103.15",
    "sport_id": "1.100.2",
    "name": "Levski Sofia vs Academic Plovdiv",
    "seasons": "2017-2018",
    "start_time": moment().add(13, 'days').unix() * 1000,
    "event_group_id": "1.101.4",
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
      "1.104.43",
      "1.104.44",
      "1.104.45"
    ]
  },
  {
    "id": "1.103.16",
    "sport_id": "1.100.2",
    "name": "Sisu Basket vs Horsholm 79ers",
    "seasons": "2017-2018",
    "start_time": moment().add(14, 'days').unix() * 1000,
    "event_group_id": "1.101.4",
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
      "1.104.46",
      "1.104.47",
      "1.104.48"
    ]
  },
  {
    "id": "1.103.17",
    "sport_id": "1.100.2",
    "name": "Randers Cimbria vs Horsens IC",
    "seasons": "2017-2018",
    "start_time": moment().add(15, 'days').unix() * 1000,
    "event_group_id": "1.101.4",
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
      "1.104.49",
      "1.104.50",
      "1.104.51"
    ]
  },
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
  },
  //basketball Group 1
  {
    "id": "1.103.38",
    "sport_id": "1.100.2",
    "name": "Le Havre vs Boulazac",
    "seasons": "2017-2018",
    "start_time": moment().add(2, 'days').unix() * 1000,
    "event_group_id": "1.101.5",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.61",
        "score": 0
      },
      {
        "competitor_id": "1.102.62",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.112",
      "1.104.113",
      "1.104.114"
    ]
  },
  {
    "id": "1.103.39",
    "sport_id": "1.100.4",
    "name": "Charleville-Mezieres vs Bourg-en-Bresse",
    "seasons": "2017-2018",
    "start_time": moment().add(2, 'days').unix() * 1000,
    "event_group_id": "1.101.5",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.63",
        "score": 0
      },
      {
        "competitor_id": "1.102.64",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.115",
      "1.104.116",
      "1.104.117"
    ]
  },
  {
    "id": "1.103.40",
    "sport_id": "1.100.2",
    "name": "Boulogne-sur-Mer vs Vichy",
    "seasons": "2017-2018",
    "start_time": moment().add(2, 'days').unix() * 1000,
    "event_group_id": "1.101.5",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.65",
        "score": 0
      },
      {
        "competitor_id": "1.102.66",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.118",
      "1.104.119",
      "1.104.120"
    ]
  },
  {
    "id": "1.103.41",
    "sport_id": "1.100.2",
    "name": "Saint-Quentin vs Poitiers",
    "seasons": "2017-2018",
    "start_time": moment().add(2, 'days').unix() * 1000,
    "event_group_id": "1.101.5",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.67",
        "score": 0
      },
      {
        "competitor_id": "1.102.68",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.121",
      "1.104.122",
      "1.104.123"
    ]
  },
  {
    "id": "1.103.42",
    "sport_id": "1.100.2",
    "name": "Fos Sur Mer Basket vs ADA Blois Basket",
    "seasons": "2017-2018",
    "start_time": moment().add(2, 'days').unix() * 1000,
    "event_group_id": "1.101.5",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.69",
        "score": 0
      },
      {
        "competitor_id": "1.102.70",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.124",
      "1.104.125",
      "1.104.126"
    ]
  },
  //Basketball event 3
  {
    "id": "1.103.43",
    "sport_id": "1.100.2",
    "name": "Evreux vs Nantes",
    "seasons": "2017-2018",
    "start_time": moment().add(2, 'days').unix() * 1000,
    "event_group_id": "1.101.6",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.71",
        "score": 0
      },
      {
        "competitor_id": "1.102.72",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.127",
      "1.104.128",
      "1.104.129"
    ]
  },
  {
    "id": "1.103.44",
    "sport_id": "1.100.4",
    "name": "Denain vs Aix-Maurienne",
    "seasons": "2017-2018",
    "start_time": moment().add(2, 'days').unix() * 1000,
    "event_group_id": "1.101.6",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.73",
        "score": 0
      },
      {
        "competitor_id": "1.102.74",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.130",
      "1.104.131",
      "1.104.132"
    ]
  },
  {
    "id": "1.103.45",
    "sport_id": "1.100.2",
    "name": "BS Weert vs Groningen Donar",
    "seasons": "2017-2018",
    "start_time": moment().add(2, 'days').unix() * 1000,
    "event_group_id": "1.101.6",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.75",
        "score": 0
      },
      {
        "competitor_id": "1.102.76",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.133",
      "1.104.134",
      "1.104.135"
    ]
  },
  {
    "id": "1.103.46",
    "sport_id": "1.100.2",
    "name": "Lille vs Saint Chamond Basket",
    "seasons": "2017-2018",
    "start_time": moment().add(2, 'days').unix() * 1000,
    "event_group_id": "1.101.6",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.77",
        "score": 0
      },
      {
        "competitor_id": "1.102.78",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.136",
      "1.104.137",
      "1.104.138"
    ]
  },
  {
    "id": "1.103.47",
    "sport_id": "1.100.2",
    "name": "Grindavík vs Stjarnan",
    "seasons": "2017-2018",
    "start_time": moment().add(2, 'days').unix() * 1000,
    "event_group_id": "1.101.6",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.79",
        "score": 0
      },
      {
        "competitor_id": "1.102.80",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.139",
      "1.104.140",
      "1.104.141"
    ]
  },
  //Soccer Event Group 2
  {
    "id": "1.103.48",
    "sport_id": "1.100.4",
    "name": "Saham vs Al Wehdat",
    "seasons": "2017-2018",
    "start_time": moment().add(7, 'days').unix() * 1000,
    "event_group_id": "1.101.11",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.81",
        "score": 0
      },
      {
        "competitor_id": "1.102.82",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.142",
      "1.104.143",
      "1.104.144"
    ]
  },
  {
    "id": "1.103.49",
    "sport_id": "1.100.4",
    "name": "Targu Mures vs Pandurii",
    "seasons": "2017-2018",
    "start_time": moment().add(11, 'days').unix() * 1000,
    "event_group_id": "1.101.11",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.83",
        "score": 0
      },
      {
        "competitor_id": "1.102.84",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.145",
      "1.104.146",
      "1.104.147"
    ]
  },
  {
    "id": "1.103.50",
    "sport_id": "1.100.4",
    "name": "Arminia Bielefeld vs Fortuna Dusseldorf",
    "seasons": "2017-2018",
    "start_time": moment().add(14, 'days').unix() * 1000,
    "event_group_id": "1.101.11",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.85",
        "score": 0
      },
      {
        "competitor_id": "1.102.86",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.148",
      "1.104.149",
      "1.104.150"
    ]
  },
  {
    "id": "1.103.51",
    "sport_id": "1.100.4",
    "name": "Hannover vs Nurnberg",
    "seasons": "2017-2018",
    "start_time": moment().add(5, 'days').unix() * 1000,
    "event_group_id": "1.101.11",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.87",
        "score": 0
      },
      {
        "competitor_id": "1.102.88",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.151",
      "1.104.152",
      "1.104.153"
    ]
  },
  {
    "id": "1.103.52",
    "sport_id": "1.100.4",
    "name": "Karlsruhe vs Wurzburger Kickers",
    "seasons": "2017-2018",
    "start_time": moment().add(8, 'days').unix() * 1000,
    "event_group_id": "1.101.11",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.89",
        "score": 0
      },
      {
        "competitor_id": "1.102.90",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.154",
      "1.104.155",
      "1.104.156"
    ]
  },
  //Soccer Event group 3
  {
    "id": "1.103.53",
    "sport_id": "1.100.4",
    "name": "St Pauli II vs Hamburg II",
    "seasons": "2017-2018",
    "start_time": moment().add(15, 'days').unix() * 1000,
    "event_group_id": "1.101.12",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.91",
        "score": 0
      },
      {
        "competitor_id": "1.102.92",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.157",
      "1.104.158",
      "1.104.159"
    ]
  },
  {
    "id": "1.103.54",
    "sport_id": "1.100.4",
    "name": "Al Muharraq vs Nejmeh",
    "seasons": "2017-2018",
    "start_time": moment().add(11, 'days').unix() * 1000,
    "event_group_id": "1.101.12",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.93",
        "score": 0
      },
      {
        "competitor_id": "1.102.94",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.160",
      "1.104.161",
      "1.104.162"
    ]
  },
  {
    "id": "1.103.55",
    "sport_id": "1.100.4",
    "name": "Arka Gdynia vs Wigry Suwalki",
    "seasons": "2017-2018",
    "start_time": moment().add(6, 'days').unix() * 1000,
    "event_group_id": "1.101.12",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.95",
        "score": 0
      },
      {
        "competitor_id": "1.102.96",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.163",
      "1.104.164",
      "1.104.165"
    ]
  },
  {
    "id": "1.103.56",
    "sport_id": "1.100.4",
    "name": "Frejus St-Raphael vs Guingamp",
    "seasons": "2017-2018",
    "start_time": moment().add(14, 'days').unix() * 1000,
    "event_group_id": "1.101.12",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.97",
        "score": 0
      },
      {
        "competitor_id": "1.102.98",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.166",
      "1.104.167",
      "1.104.168"
    ]
  },
  {
    "id": "1.103.57",
    "sport_id": "1.100.4",
    "name": "Schalding-Heining vs Seligenporten",
    "seasons": "2017-2018",
    "start_time": moment().add(3, 'days').unix() * 1000,
    "event_group_id": "1.101.12",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.99",
        "score": 0
      },
      {
        "competitor_id": "1.102.100",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.169",
      "1.104.170",
      "1.104.171"
    ]
  },
  //Baseball Group 2
  {
    "id": "1.103.58",
    "sport_id": "1.100.3",
    "name": "Hiroshima Toyo Carp vs Chunichi Dragons",
    "seasons": "2017-2018",
    "start_time": moment().add(10, 'days').unix() * 1000,
    "event_group_id": "1.101.8",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.101",
        "score": 0
      },
      {
        "competitor_id": "1.102.102",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.172",
      "1.104.173",
      "1.104.174"
    ]
  },
  {
    "id": "1.103.59",
    "sport_id": "1.100.3",
    "name": "G Garcia-Lopez vs L Rosol",
    "seasons": "2017-2018",
    "start_time": moment().add(11, 'days').unix() * 1000,
    "event_group_id": "1.101.8",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.103",
        "score": 0
      },
      {
        "competitor_id": "1.102.104",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.175",
      "1.104.176",
      "1.104.177"
    ]
  },
  {
    "id": "1.103.60",
    "sport_id": "1.100.3",
    "name": "D Lee vs J Kovalik",
    "seasons": "2017-2018",
    "start_time": moment().add(4, 'days').unix() * 1000,
    "event_group_id": "1.101.8",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.105",
        "score": 0
      },
      {
        "competitor_id": "1.102.106",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.178",
      "1.104.179",
      "1.104.180"
    ]
  },
  {
    "id": "1.103.61",
    "sport_id": "1.100.3",
    "name": "M Puig vs D Kasatkina",
    "seasons": "2017-2018",
    "start_time": moment().add(10, 'days').unix() * 1000,
    "event_group_id": "1.101.8",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.107",
        "score": 0
      },
      {
        "competitor_id": "1.102.108",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.181",
      "1.104.182",
      "1.104.183"
    ]
  },
  {
    "id": "1.103.62",
    "sport_id": "1.100.3",
    "name": "A Sevastova vs A Petkovic",
    "seasons": "2017-2018",
    "start_time": moment().add(13, 'days').unix() * 1000,
    "event_group_id": "1.101.8",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.109",
        "score": 0
      },
      {
        "competitor_id": "1.102.110",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.184",
      "1.104.185",
      "1.104.186"
    ]
  },
  //Baseball Group 3
  {
    "id": "1.103.63",
    "sport_id": "1.100.3",
    "name": "E Vesnina vs F Stollar",
    "seasons": "2017-2018",
    "start_time": moment().add(9, 'days').unix() * 1000,
    "event_group_id": "1.101.9",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.111",
        "score": 0
      },
      {
        "competitor_id": "1.102.112",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.187",
      "1.104.188",
      "1.104.189"
    ]
  },
  {
    "id": "1.103.64",
    "sport_id": "1.100.3",
    "name": "A Riske vs D Gavrilova",
    "seasons": "2017-2018",
    "start_time": moment().add(12, 'days').unix() * 1000,
    "event_group_id": "1.101.9",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.113",
        "score": 0
      },
      {
        "competitor_id": "1.102.114",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.190",
      "1.104.191",
      "1.104.192"
    ]
  },
  {
    "id": "1.103.65",
    "sport_id": "1.100.3",
    "name": "M Lucic-Baroni vs M Barthel",
    "seasons": "2017-2018",
    "start_time": moment().add(12, 'days').unix() * 1000,
    "event_group_id": "1.101.9",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.115",
        "score": 0
      },
      {
        "competitor_id": "1.102.116",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.193",
      "1.104.194",
      "1.104.195"
    ]
  },
  {
    "id": "1.103.66",
    "sport_id": "1.100.3",
    "name": "K Bondarenko vs K Bertens",
    "seasons": "2017-2018",
    "start_time": moment().add(5, 'days').unix() * 1000,
    "event_group_id": "1.101.9",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.117",
        "score": 0
      },
      {
        "competitor_id": "1.102.118",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.196",
      "1.104.197",
      "1.104.198"
    ]
  },
  {
    "id": "1.103.67",
    "sport_id": "1.100.3",
    "name": "O Jabeur vs M Linette",
    "seasons": "2017-2018",
    "start_time": moment().add(7, 'days').unix() * 1000,
    "event_group_id": "1.101.9",
    "event_status_id": "Upcoming",
    "scores": [
      {
        "competitor_id": "1.102.119",
        "score": 0
      },
      {
        "competitor_id": "1.102.120",
        "score": 0
      }
    ],
    "betting_market_group_ids": [
      "1.104.199",
      "1.104.200",
      "1.104.201"
    ]
  },
  //For Resolved Bets
  //American Football
  {
    "id": "1.103.68",
    "sport_id": "1.100.1",
    "name": "Carolina Panthers vs Denver Broncos",
    "seasons": "2017-2018",
    "start_time": moment().subtract(1, 'days').unix() * 1000,
    "event_group_id": "1.101.1",
    "event_status_id": "Completed",
    "scores": [
      {
        "competitor_id": "1.102.7",
        "score": 202
      },
      {
        "competitor_id": "1.102.8",
        "score": 189
      }
    ],
    "betting_market_group_ids": [
      "1.104.202",
      "1.104.203",
      "1.104.204"
    ]
  },
  {
    "id": "1.103.69",
    "sport_id": "1.100.1",
    "name": "Tampa Bay Buccaneers vs Atlanta Falcons",
    "seasons": "2017-2018",
    "start_time": moment().subtract(2, 'days').unix() * 1000,
    "event_group_id": "1.101.1",
    "event_status_id": "Completed",
    "scores": [
      {
        "competitor_id": "1.102.9",
        "score": 249
      },
      {
        "competitor_id": "1.102.10",
        "score": 111
      }
    ],
    "betting_market_group_ids": [
      "1.104.205",
      "1.104.206",
      "1.104.207"
    ]
  },
  {
    "id": "1.103.70",
    "sport_id": "1.100.1",
    "name": "Minnesota Vikings vs Tennessee Titans",
    "seasons": "2017-2018",
    "start_time": moment().subtract(3, 'days').unix() * 1000,
    "event_group_id": "1.101.1",
    "event_status_id": "Completed",
    "scores": [
      {
        "competitor_id": "1.102.11",
        "score": 242
      },
      {
        "competitor_id": "1.102.12",
        "score": 275
      }
    ],
    "betting_market_group_ids": [
      "1.104.208",
      "1.104.209",
      "1.104.210"
    ]
  },
  {
    "id": "1.103.71",
    "sport_id": "1.100.1",
    "name": "Cleveland Browns vs Philadelphia Eagles",
    "seasons": "2017-2018",
    "start_time": moment().subtract(3, 'days').unix() * 1000,
    "event_group_id": "1.101.1",
    "event_status_id": "Completed",
    "scores": [
      {
        "competitor_id": "1.102.13",
        "score": 195
      },
      {
        "competitor_id": "1.102.14",
        "score": 180
      }
    ],
    "betting_market_group_ids": [
      "1.104.211",
      "1.104.212",
      "1.104.213"
    ]
  },
  {
    "id": "1.103.72",
    "sport_id": "1.100.1",
    "name": "Cincinnati Bengals vs New York Jets",
    "seasons": "2017-2018",
    "start_time": moment().subtract(2, 'days').unix() * 1000,
    "event_group_id": "1.101.1",
    "event_status_id": "Completed",
    "scores": [
      {
        "competitor_id": "1.102.15",
        "score": 158
      },
      {
        "competitor_id": "1.102.16",
        "score": 269
      }
    ],
    "betting_market_group_ids": [
      "1.104.214",
      "1.104.215",
      "1.104.216"
    ]
  },
  //Basketball
  {
    "id": "1.103.73",
    "sport_id": "1.100.2",
    "name": "Bourg-en-Bresse vs Boulogne-sur-Mer",
    "seasons": "2017-2018",
    "start_time": moment().subtract(1, 'days').unix() * 1000,
    "event_group_id": "1.101.4",
    "event_status_id": "Completed",
    "scores": [
      {
        "competitor_id": "1.102.64",
        "score": 132
      },
      {
        "competitor_id": "1.102.65",
        "score": 162
      }
    ],
    "betting_market_group_ids": [
      "1.104.217",
      "1.104.218",
      "1.104.219"
    ]
  },
  {
    "id": "1.103.74",
    "sport_id": "1.100.2",
    "name": "Vichy vs Saint-Quentin",
    "seasons": "2017-2018",
    "start_time": moment().subtract(2, 'days').unix() * 1000,
    "event_group_id": "1.101.4",
    "event_status_id": "Completed",
    "scores": [
      {
        "competitor_id": "1.102.66",
        "score": 144
      },
      {
        "competitor_id": "1.102.67",
        "score": 122
      }
    ],
    "betting_market_group_ids": [
      "1.104.220",
      "1.104.221",
      "1.104.222"
    ]
  },
  //Baseball
  {
    "id": "1.103.75",
    "sport_id": "1.100.3",
    "name": "Washington Nationals vs Atlanta Braves",
    "seasons": "2017-2018",
    "start_time": moment().subtract(2, 'days').unix() * 1000,
    "event_group_id": "1.101.7",
    "event_status_id": "Completed",
    "scores": [
      {
        "competitor_id": "1.102.22",
        "score": 208
      },
      {
        "competitor_id": "1.102.23",
        "score": 244
      }
    ],
    "betting_market_group_ids": [
      "1.104.223",
      "1.104.224",
      "1.104.225"
    ]
  },
  {
    "id": "1.103.76",
    "sport_id": "1.100.3",
    "name": "New York Mets vs Pittsburgh Pirates",
    "seasons": "2017-2018",
    "start_time": moment().subtract(1, 'days').unix() * 1000,
    "event_group_id": "1.101.7",
    "event_status_id": "Completed",
    "scores": [
      {
        "competitor_id": "1.102.24",
        "score": 101
      },
      {
        "competitor_id": "1.102.25",
        "score": 140
      }
    ],
    "betting_market_group_ids": [
      "1.104.226",
      "1.104.227",
      "1.104.228"
    ]
  },
  //Resolved Bets Ends
];

//TODO: add more in this list, pay attention on the relation with the sports, competitors, event group dummy data

export default events;
