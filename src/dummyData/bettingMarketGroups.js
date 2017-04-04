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
  //baseball
  {
    "id": "1.104.52",
    "event_id": "1.103.18",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.103",
      "1.105.104"
    ]
  },
  {
    "id": "1.104.53",
    "event_id": "1.103.18",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.105",
      "1.105.106"
    ]
  },
  {
    "id": "1.104.54",
    "event_id": "1.103.18",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.107",
      "1.105.108"
    ]
  },
  {
    "id": "1.104.55",
    "event_id": "1.103.19",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.109",
      "1.105.110"
    ]
  },
  {
    "id": "1.104.56",
    "event_id": "1.103.19",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.111",
      "1.105.112"
    ]
  },
  {
    "id": "1.104.57",
    "event_id": "1.103.19",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.113",
      "1.105.114"
    ]
  },
  {
    "id": "1.104.58",
    "event_id": "1.103.20",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.115",
      "1.105.116"
    ]
  },
  {
    "id": "1.104.59",
    "event_id": "1.103.20",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.117",
      "1.105.118"
    ]
  },
  {
    "id": "1.104.60",
    "event_id": "1.103.20",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.119",
      "1.105.120"
    ]
  },
  {
    "id": "1.104.61",
    "event_id": "1.103.21",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.121",
      "1.105.122"
    ]
  },
  {
    "id": "1.104.62",
    "event_id": "1.103.21",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.123",
      "1.105.124"
    ]
  },
  {
    "id": "1.104.63",
    "event_id": "1.103.21",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.125",
      "1.105.126"
    ]
  },
  {
    "id": "1.104.64",
    "event_id": "1.103.22",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.127",
      "1.105.128"
    ]
  },
  {
    "id": "1.104.65",
    "event_id": "1.103.22",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.129",
      "1.105.130"
    ]
  },
  {
    "id": "1.104.66",
    "event_id": "1.103.22",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.131",
      "1.105.132"
    ]
  },
  {
    "id": "1.104.67",
    "event_id": "1.103.23",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.133",
      "1.105.134"
    ]
  },
  {
    "id": "1.104.68",
    "event_id": "1.103.23",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.135",
      "1.105.136"
    ]
  },
  {
    "id": "1.104.69",
    "event_id": "1.103.23",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.137",
      "1.105.138"
    ]
  },
  {
    "id": "1.104.70",
    "event_id": "1.103.24",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.139",
      "1.105.140"
    ]
  },
  {
    "id": "1.104.71",
    "event_id": "1.103.24",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.141",
      "1.105.142"
    ]
  },
  {
    "id": "1.104.72",
    "event_id": "1.103.24",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.143",
      "1.105.144"
    ]
  },
  {
    "id": "1.104.73",
    "event_id": "1.103.25",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.145",
      "1.105.146"
    ]
  },
  {
    "id": "1.104.74",
    "event_id": "1.103.25",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.147",
      "1.105.148"
    ]
  },
  {
    "id": "1.104.75",
    "event_id": "1.103.25",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.149",
      "1.105.150"
    ]
  },
  {
    "id": "1.104.76",
    "event_id": "1.103.26",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.151",
      "1.105.152"
    ]
  },
  {
    "id": "1.104.77",
    "event_id": "1.103.26",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.153",
      "1.105.154"
    ]
  },
  {
    "id": "1.104.78",
    "event_id": "1.103.26",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.155",
      "1.105.156"
    ]
  },
  {
    "id": "1.104.79",
    "event_id": "1.103.27",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.157",
      "1.105.158"
    ]
  },
  {
    "id": "1.104.80",
    "event_id": "1.103.27",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.159",
      "1.105.160"
    ]
  },
  {
    "id": "1.104.81",
    "event_id": "1.103.27",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.161",
      "1.105.162"
    ]
  },
  //soccer
  {
    "id": "1.104.82",
    "event_id": "1.103.28",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.163",
      "1.105.164"
    ]
  },
  {
    "id": "1.104.83",
    "event_id": "1.103.28",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.165",
      "1.105.166"
    ]
  },
  {
    "id": "1.104.84",
    "event_id": "1.103.28",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.167",
      "1.105.168"
    ]
  },
  {
    "id": "1.104.85",
    "event_id": "1.103.29",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.169",
      "1.105.170"
    ]
  },
  {
    "id": "1.104.86",
    "event_id": "1.103.29",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.171",
      "1.105.172"
    ]
  },
  {
    "id": "1.104.87",
    "event_id": "1.103.29",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.173",
      "1.105.174"
    ]
  },
  {
    "id": "1.104.88",
    "event_id": "1.103.30",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.175",
      "1.105.176"
    ]
  },
  {
    "id": "1.104.89",
    "event_id": "1.103.30",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.177",
      "1.105.178"
    ]
  },
  {
    "id": "1.104.90",
    "event_id": "1.103.30",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.179",
      "1.105.180"
    ]
  },
  {
    "id": "1.104.91",
    "event_id": "1.103.31",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.181",
      "1.105.182"
    ]
  },
  {
    "id": "1.104.92",
    "event_id": "1.103.31",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.183",
      "1.105.184"
    ]
  },
  {
    "id": "1.104.93",
    "event_id": "1.103.31",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.185",
      "1.105.186"
    ]
  },
  {
    "id": "1.104.94",
    "event_id": "1.103.32",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.187",
      "1.105.188"
    ]
  },
  {
    "id": "1.104.95",
    "event_id": "1.103.32",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.189",
      "1.105.190"
    ]
  },
  {
    "id": "1.104.96",
    "event_id": "1.103.32",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.191",
      "1.105.192"
    ]
  },
  {
    "id": "1.104.97",
    "event_id": "1.103.33",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.193",
      "1.105.194"
    ]
  },
  {
    "id": "1.104.98",
    "event_id": "1.103.33",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.195",
      "1.105.196"
    ]
  },
  {
    "id": "1.104.99",
    "event_id": "1.103.33",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.197",
      "1.105.198"
    ]
  },
  {
    "id": "1.104.100",
    "event_id": "1.103.34",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.199",
      "1.105.200"
    ]
  },
  {
    "id": "1.104.101",
    "event_id": "1.103.34",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.201",
      "1.105.202"
    ]
  },
  {
    "id": "1.104.102",
    "event_id": "1.103.34",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.203",
      "1.105.204"
    ]
  },
  {
    "id": "1.104.103",
    "event_id": "1.103.35",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.205",
      "1.105.206"
    ]
  },
  {
    "id": "1.104.104",
    "event_id": "1.103.35",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.207",
      "1.105.208"
    ]
  },
  {
    "id": "1.104.105",
    "event_id": "1.103.35",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.209",
      "1.105.210"
    ]
  },
  {
    "id": "1.104.106",
    "event_id": "1.103.36",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.211",
      "1.105.212"
    ]
  },
  {
    "id": "1.104.107",
    "event_id": "1.103.36",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.213",
      "1.105.214"
    ]
  },
  {
    "id": "1.104.108",
    "event_id": "1.103.36",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.215",
      "1.105.216"
    ]
  },
  {
    "id": "1.104.109",
    "event_id": "1.103.37",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.217",
      "1.105.218"
    ]
  },
  {
    "id": "1.104.110",
    "event_id": "1.103.37",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.219",
      "1.105.220"
    ]
  },
  {
    "id": "1.104.111",
    "event_id": "1.103.37",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.221",
      "1.105.222"
    ]
  }
];

//TODO: add more in this list, pay attention on the relation with the events, betting_markets dummy data
//TODO: for each event, make one moneyline, spread, overunder

const immutableBettingMarketGroups = _.map(bettingMarketGroups, bettingMarketGroup => Immutable.fromJS(bettingMarketGroup));
export default immutableBettingMarketGroups;
