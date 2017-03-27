import _ from 'lodash';
import Immutable from 'immutable';

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
      score: 8
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
      '1.105.3',
      '1.105.4'
    ]
  },
  {
    id: '1.104.9',
    event_id: '1.103.3',
    market_type_id: 'OverUnder',
    options: {
      margin: 0,
      score: 6
    },
    betting_market_ids: [
      '1.105.5',
      '1.105.6'
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
      margin: 5,
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
      score: 10
    },
    betting_market_ids: [
      '1.105.23',
      '1.105.24'
    ]
  },
  {
    id: '1.104.13',
    event_id: '1.103.5',
    market_type_id: 'Moneyline',
    options: null,
    betting_market_ids: [
      '1.105.25',
      '1.105.26'
    ]
  },
  {
    id: '1.104.14',
    event_id: '1.103.5',
    market_type_id: 'Spread',
    options: {
      margin: 5,
      score: 0
    },
    betting_market_ids: [
      '1.105.27',
      '1.105.28'
    ]
  },
  {
    id: '1.104.15',
    event_id: '1.103.5',
    market_type_id: 'OverUnder',
    options: {
      margin: 0,
      score: 6
    },
    betting_market_ids: [
      '1.105.29',
      '1.105.30'
    ]
  },
  {
    id: '1.104.16',
    event_id: '1.103.6',
    market_type_id: 'Moneyline',
    options: null,
    betting_market_ids: [
      '1.105.31',
      '1.105.32'
    ]
  },
  {
    id: '1.104.17',
    event_id: '1.103.6',
    market_type_id: 'Spread',
    options: {
      margin: 5,
      score: 0
    },
    betting_market_ids: [
      '1.105.33',
      '1.105.34'
    ]
  },
  {
    id: '1.104.18',
    event_id: '1.103.6',
    market_type_id: 'OverUnder',
    options: {
      margin: 0,
      score: 4
    },
    betting_market_ids: [
      '1.105.35',
      '1.105.36'
    ]
  },
  {
    id: '1.104.19',
    event_id: '1.103.7',
    market_type_id: 'Moneyline',
    options: null,
    betting_market_ids: [
      '1.105.37',
      '1.105.38'
    ]
  },
  {
    id: '1.104.20',
    event_id: '1.103.7',
    market_type_id: 'Spread',
    options: {
      margin: 5,
      score: 0
    },
    betting_market_ids: [
      '1.105.39',
      '1.105.40'
    ]
  },
  {
    id: '1.104.21',
    event_id: '1.103.7',
    market_type_id: 'OverUnder',
    options: {
      margin: 0,
      score: 9
    },
    betting_market_ids: [
      '1.105.41',
      '1.105.42'
    ]
  },
  {
    id: '1.104.22',
    event_id: '1.103.8',
    market_type_id: 'Moneyline',
    options: null,
    betting_market_ids: [
      '1.105.43',
      '1.105.44'
    ]
  },
  {
    id: '1.104.23',
    event_id: '1.103.8',
    market_type_id: 'Spread',
    options: {
      margin: 5,
      score: 0
    },
    betting_market_ids: [
      '1.105.45',
      '1.105.46'
    ]
  },
  {
    id: '1.104.24',
    event_id: '1.103.8',
    market_type_id: 'OverUnder',
    options: {
      margin: 0,
      score: 10
    },
    betting_market_ids: [
      '1.105.47',
      '1.105.48'
    ]
  },
  {
    id: '1.104.25',
    event_id: '1.103.9',
    market_type_id: 'Moneyline',
    options: null,
    betting_market_ids: [
      '1.105.49',
      '1.105.50'
    ]
  },
  {
    id: '1.104.26',
    event_id: '1.103.9',
    market_type_id: 'Spread',
    options: {
      margin: 5,
      score: 0
    },
    betting_market_ids: [
      '1.105.51',
      '1.105.52'
    ]
  },
  {
    id: '1.104.27',
    event_id: '1.103.9',
    market_type_id: 'OverUnder',
    options: {
      margin: 0,
      score: 12
    },
    betting_market_ids: [
      '1.105.53',
      '1.105.54'
    ]
  },
  {
    "id": "1.104.28",
    "event_id": "1.103.10",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.55",
      "1.105.56"
    ]
  },
  {
    "id": "1.104.29",
    "event_id": "1.103.10",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.57",
      "1.105.58"
    ]
  },
  {
    "id": "1.104.30",
    "event_id": "1.103.10",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.59",
      "1.105.60"
    ]
  },
  {
    "id": "1.104.31",
    "event_id": "1.103.11",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.61",
      "1.105.62"
    ]
  },
  {
    "id": "1.104.32",
    "event_id": "1.103.11",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.63",
      "1.105.64"
    ]
  },
  {
    "id": "1.104.33",
    "event_id": "1.103.11",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.65",
      "1.105.66"
    ]
  },
  {
    "id": "1.104.34",
    "event_id": "1.103.12",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.67",
      "1.105.68"
    ]
  },
  {
    "id": "1.104.35",
    "event_id": "1.103.12",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.69",
      "1.105.70"
    ]
  },
  {
    "id": "1.104.36",
    "event_id": "1.103.12",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.71",
      "1.105.72"
    ]
  },
  {
    "id": "1.104.37",
    "event_id": "1.103.13",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.73",
      "1.105.74"
    ]
  },
  {
    "id": "1.104.38",
    "event_id": "1.103.13",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.75",
      "1.105.76"
    ]
  },
  {
    "id": "1.104.39",
    "event_id": "1.103.13",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.77",
      "1.105.78"
    ]
  },
  {
    "id": "1.104.40",
    "event_id": "1.103.14",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.79",
      "1.105.80"
    ]
  },
  {
    "id": "1.104.41",
    "event_id": "1.103.14",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.81",
      "1.105.82"
    ]
  },
  {
    "id": "1.104.42",
    "event_id": "1.103.14",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.83",
      "1.105.84"
    ]
  },
  {
    "id": "1.104.43",
    "event_id": "1.103.15",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.85",
      "1.105.86"
    ]
  },
  {
    "id": "1.104.44",
    "event_id": "1.103.15",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.87",
      "1.105.88"
    ]
  },
  {
    "id": "1.104.45",
    "event_id": "1.103.15",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.89",
      "1.105.90"
    ]
  },
  {
    "id": "1.104.46",
    "event_id": "1.103.16",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.91",
      "1.105.92"
    ]
  },
  {
    "id": "1.104.47",
    "event_id": "1.103.16",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.93",
      "1.105.94"
    ]
  },
  {
    "id": "1.104.48",
    "event_id": "1.103.16",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.95",
      "1.105.96"
    ]
  },
  {
    "id": "1.104.49",
    "event_id": "1.103.17",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.97",
      "1.105.98"
    ]
  },
  {
    "id": "1.104.50",
    "event_id": "1.103.17",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.99",
      "1.105.100"
    ]
  },
  {
    "id": "1.104.51",
    "event_id": "1.103.17",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.101",
      "1.105.102"
    ]
  },
];

//TODO: add more in this list, pay attention on the relation with the events, betting_markets dummy data
//TODO: for each event, make one moneyline, spread, overunder

const immutableBettingMarketGroups = _.map(bettingMarketGroups, bettingMarketGroup => Immutable.fromJS(bettingMarketGroup));
export default immutableBettingMarketGroups;
