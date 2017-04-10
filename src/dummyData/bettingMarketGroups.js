import _ from 'lodash';
import Immutable from 'immutable';

const bettingMarketGroups = [
  {
    "id": "1.104.1",
    "event_id": "1.103.1",
    "market_type_id": "Moneyline",
    "options": null,
    "betting_market_ids": [
      "1.105.1",
      "1.105.2"
    ]
  },
  {
    "id": "1.104.2",
    "event_id": "1.103.1",
    "market_type_id": "Spread",
    "options": {
      "margin": 5,
      "score": 0
    },
    "betting_market_ids": [
      "1.105.3",
      "1.105.4"
    ]
  },
  {
    "id": "1.104.3",
    "event_id": "1.103.1",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 8
    },
    "betting_market_ids": [
      "1.105.5",
      "1.105.6"
    ]
  },
  {
    "id": "1.104.4",
    "event_id": "1.103.2",
    "market_type_id": "Moneyline",
    "options": null,
    "betting_market_ids": [
      "1.105.7",
      "1.105.8"
    ]
  },
  {
    "id": "1.104.5",
    "event_id": "1.103.2",
    "market_type_id": "Spread",
    "options": {
      "margin": 15,
      "score": 0
    },
    "betting_market_ids": [
      "1.105.9",
      "1.105.10"
    ]
  },
  {
    "id": "1.104.6",
    "event_id": "1.103.2",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 15
    },
    "betting_market_ids": [
      "1.105.11",
      "1.105.12"
    ]
  },
  {
    "id": "1.104.7",
    "event_id": "1.103.3",
    "market_type_id": "Moneyline",
    "options": null,
    "betting_market_ids": [
      "1.105.13",
      "1.105.14"
    ]
  },
  {
    "id": "1.104.8",
    "event_id": "1.103.3",
    "market_type_id": "Spread",
    "options": {
      "margin": 5,
      "score": 0
    },
    "betting_market_ids": [
      "1.105.3",
      "1.105.4"
    ]
  },
  {
    "id": "1.104.9",
    "event_id": "1.103.3",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 6
    },
    "betting_market_ids": [
      "1.105.5",
      "1.105.6"
    ]
  },
  {
    "id": "1.104.10",
    "event_id": "1.103.4",
    "market_type_id": "Moneyline",
    "options": null,
    "betting_market_ids": [
      "1.105.19",
      "1.105.20"
    ]
  },
  {
    "id": "1.104.11",
    "event_id": "1.103.4",
    "market_type_id": "Spread",
    "options": {
      "margin": 5,
      "score": 0
    },
    "betting_market_ids": [
      "1.105.21",
      "1.105.22"
    ]
  },
  {
    "id": "1.104.12",
    "event_id": "1.103.4",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 10
    },
    "betting_market_ids": [
      "1.105.23",
      "1.105.24"
    ]
  },
  {
    "id": "1.104.13",
    "event_id": "1.103.5",
    "market_type_id": "Moneyline",
    "options": null,
    "betting_market_ids": [
      "1.105.25",
      "1.105.26"
    ]
  },
  {
    "id": "1.104.14",
    "event_id": "1.103.5",
    "market_type_id": "Spread",
    "options": {
      "margin": 5,
      "score": 0
    },
    "betting_market_ids": [
      "1.105.27",
      "1.105.28"
    ]
  },
  {
    "id": "1.104.15",
    "event_id": "1.103.5",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 6
    },
    "betting_market_ids": [
      "1.105.29",
      "1.105.30"
    ]
  },
  {
    "id": "1.104.16",
    "event_id": "1.103.6",
    "market_type_id": "Moneyline",
    "options": null,
    "betting_market_ids": [
      "1.105.31",
      "1.105.32"
    ]
  },
  {
    "id": "1.104.17",
    "event_id": "1.103.6",
    "market_type_id": "Spread",
    "options": {
      "margin": 5,
      "score": 0
    },
    "betting_market_ids": [
      "1.105.33",
      "1.105.34"
    ]
  },
  {
    "id": "1.104.18",
    "event_id": "1.103.6",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 4
    },
    "betting_market_ids": [
      "1.105.35",
      "1.105.36"
    ]
  },
  {
    "id": "1.104.19",
    "event_id": "1.103.7",
    "market_type_id": "Moneyline",
    "options": null,
    "betting_market_ids": [
      "1.105.37",
      "1.105.38"
    ]
  },
  {
    "id": "1.104.20",
    "event_id": "1.103.7",
    "market_type_id": "Spread",
    "options": {
      "margin": 5,
      "score": 0
    },
    "betting_market_ids": [
      "1.105.39",
      "1.105.40"
    ]
  },
  {
    "id": "1.104.21",
    "event_id": "1.103.7",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 9
    },
    "betting_market_ids": [
      "1.105.41",
      "1.105.42"
    ]
  },
  {
    "id": "1.104.22",
    "event_id": "1.103.8",
    "market_type_id": "Moneyline",
    "options": null,
    "betting_market_ids": [
      "1.105.43",
      "1.105.44"
    ]
  },
  {
    "id": "1.104.23",
    "event_id": "1.103.8",
    "market_type_id": "Spread",
    "options": {
      "margin": 5,
      "score": 0
    },
    "betting_market_ids": [
      "1.105.45",
      "1.105.46"
    ]
  },
  {
    "id": "1.104.24",
    "event_id": "1.103.8",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 10
    },
    "betting_market_ids": [
      "1.105.47",
      "1.105.48"
    ]
  },
  {
    "id": "1.104.25",
    "event_id": "1.103.9",
    "market_type_id": "Moneyline",
    "options": null,
    "betting_market_ids": [
      "1.105.49",
      "1.105.50"
    ]
  },
  {
    "id": "1.104.26",
    "event_id": "1.103.9",
    "market_type_id": "Spread",
    "options": {
      "margin": 5,
      "score": 0
    },
    "betting_market_ids": [
      "1.105.51",
      "1.105.52"
    ]
  },
  {
    "id": "1.104.27",
    "event_id": "1.103.9",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 12
    },
    "betting_market_ids": [
      "1.105.53",
      "1.105.54"
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
      "1.105.86",
      "1.105.223"
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
  },
  //Basketball Event group 2
  {
    "id": "1.104.112",
    "event_id": "1.103.38",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.223",
      "1.105.224"
    ]
  },
  {
    "id": "1.104.113",
    "event_id": "1.103.38",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.225",
      "1.105.226"
    ]
  },
  {
    "id": "1.104.114",
    "event_id": "1.103.38",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.227",
      "1.105.228"
    ]
  },
  {
    "id": "1.104.115",
    "event_id": "1.103.39",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.229",
      "1.105.230"
    ]
  },
  {
    "id": "1.104.116",
    "event_id": "1.103.39",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.231",
      "1.105.232"
    ]
  },
  {
    "id": "1.104.117",
    "event_id": "1.103.39",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.233",
      "1.105.234"
    ]
  },
  {
    "id": "1.104.118",
    "event_id": "1.103.40",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.235",
      "1.105.236"
    ]
  },
  {
    "id": "1.104.119",
    "event_id": "1.103.40",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.237",
      "1.105.238"
    ]
  },
  {
    "id": "1.104.120",
    "event_id": "1.103.40",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.239",
      "1.105.240"
    ]
  },
  {
    "id": "1.104.121",
    "event_id": "1.103.41",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.241",
      "1.105.242"
    ]
  },
  {
    "id": "1.104.122",
    "event_id": "1.103.41",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.243",
      "1.105.244"
    ]
  },
  {
    "id": "1.104.123",
    "event_id": "1.103.41",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.245",
      "1.105.246"
    ]
  },
  {
    "id": "1.104.124",
    "event_id": "1.103.42",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.247",
      "1.105.248"
    ]
  },
  {
    "id": "1.104.125",
    "event_id": "1.103.42",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.249",
      "1.105.250"
    ]
  },
  {
    "id": "1.104.126",
    "event_id": "1.103.42",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.251",
      "1.105.252"
    ]
  },
  //Basketball Event group 3
  {
    "id": "1.104.127",
    "event_id": "1.103.43",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.253",
      "1.105.254"
    ]
  },
  {
    "id": "1.104.128",
    "event_id": "1.103.43",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.255",
      "1.105.256"
    ]
  },
  {
    "id": "1.104.129",
    "event_id": "1.103.43",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.257",
      "1.105.258"
    ]
  },
  {
    "id": "1.104.130",
    "event_id": "1.103.44",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.259",
      "1.105.260"
    ]
  },
  {
    "id": "1.104.131",
    "event_id": "1.103.44",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.261",
      "1.105.262"
    ]
  },
  {
    "id": "1.104.132",
    "event_id": "1.103.44",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.263",
      "1.105.264"
    ]
  },
  {
    "id": "1.104.133",
    "event_id": "1.103.45",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.265",
      "1.105.266"
    ]
  },
  {
    "id": "1.104.134",
    "event_id": "1.103.45",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.267",
      "1.105.268"
    ]
  },
  {
    "id": "1.104.135",
    "event_id": "1.103.45",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.269",
      "1.105.270"
    ]
  },
  {
    "id": "1.104.136",
    "event_id": "1.103.46",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.271",
      "1.105.272"
    ]
  },
  {
    "id": "1.104.137",
    "event_id": "1.103.46",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.273",
      "1.105.274"
    ]
  },
  {
    "id": "1.104.138",
    "event_id": "1.103.46",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.275",
      "1.105.276"
    ]
  },
  {
    "id": "1.104.139",
    "event_id": "1.103.47",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.277",
      "1.105.278"
    ]
  },
  {
    "id": "1.104.140",
    "event_id": "1.103.47",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.279",
      "1.105.280"
    ]
  },
  {
    "id": "1.104.141",
    "event_id": "1.103.47",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.281",
      "1.105.282"
    ]
  },
  //Soccer Event Group 2
  {
    "id": "1.104.142",
    "event_id": "1.103.48",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.283",
      "1.105.284"
    ]
  },
  {
    "id": "1.104.143",
    "event_id": "1.103.48",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.285",
      "1.105.286"
    ]
  },
  {
    "id": "1.104.144",
    "event_id": "1.103.48",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.287",
      "1.105.288"
    ]
  },
  {
    "id": "1.104.145",
    "event_id": "1.103.49",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.289",
      "1.105.290"
    ]
  },
  {
    "id": "1.104.146",
    "event_id": "1.103.49",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.291",
      "1.105.292"
    ]
  },
  {
    "id": "1.104.147",
    "event_id": "1.103.49",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.293",
      "1.105.294"
    ]
  },
  {
    "id": "1.104.148",
    "event_id": "1.103.50",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.295",
      "1.105.296"
    ]
  },
  {
    "id": "1.104.149",
    "event_id": "1.103.50",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.297",
      "1.105.298"
    ]
  },
  {
    "id": "1.104.150",
    "event_id": "1.103.50",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.299",
      "1.105.300"
    ]
  },
  {
    "id": "1.104.151",
    "event_id": "1.103.51",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.301",
      "1.105.302"
    ]
  },
  {
    "id": "1.104.152",
    "event_id": "1.103.51",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.303",
      "1.105.304"
    ]
  },
  {
    "id": "1.104.153",
    "event_id": "1.103.51",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.305",
      "1.105.306"
    ]
  },
  {
    "id": "1.104.154",
    "event_id": "1.103.52",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.307",
      "1.105.308"
    ]
  },
  {
    "id": "1.104.155",
    "event_id": "1.103.52",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.309",
      "1.105.310"
    ]
  },
  {
    "id": "1.104.156",
    "event_id": "1.103.52",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.311",
      "1.105.312"
    ]
  },
  //Soccer Event group 3
  {
    "id": "1.104.157",
    "event_id": "1.103.53",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.313",
      "1.105.314"
    ]
  },
  {
    "id": "1.104.158",
    "event_id": "1.103.53",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.315",
      "1.105.316"
    ]
  },
  {
    "id": "1.104.159",
    "event_id": "1.103.53",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.317",
      "1.105.318"
    ]
  },
  {
    "id": "1.104.160",
    "event_id": "1.103.54",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.319",
      "1.105.320"
    ]
  },
  {
    "id": "1.104.161",
    "event_id": "1.103.54",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.321",
      "1.105.322"
    ]
  },
  {
    "id": "1.104.162",
    "event_id": "1.103.54",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.323",
      "1.105.324"
    ]
  },
  {
    "id": "1.104.163",
    "event_id": "1.103.55",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.325",
      "1.105.326"
    ]
  },
  {
    "id": "1.104.164",
    "event_id": "1.103.55",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.327",
      "1.105.328"
    ]
  },
  {
    "id": "1.104.165",
    "event_id": "1.103.55",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.329",
      "1.105.330"
    ]
  },
  {
    "id": "1.104.166",
    "event_id": "1.103.56",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.331",
      "1.105.332"
    ]
  },
  {
    "id": "1.104.167",
    "event_id": "1.103.56",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.333",
      "1.105.334"
    ]
  },
  {
    "id": "1.104.168",
    "event_id": "1.103.56",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.335",
      "1.105.336"
    ]
  },
  {
    "id": "1.104.169",
    "event_id": "1.103.57",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.337",
      "1.105.338"
    ]
  },
  {
    "id": "1.104.170",
    "event_id": "1.103.57",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.339",
      "1.105.340"
    ]
  },
  {
    "id": "1.104.171",
    "event_id": "1.103.57",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.341",
      "1.105.342"
    ]
  },
  //Baseball Event group 2
  {
    "id": "1.104.172",
    "event_id": "1.103.58",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.343",
      "1.105.344"
    ]
  },
  {
    "id": "1.104.173",
    "event_id": "1.103.58",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.345",
      "1.105.346"
    ]
  },
  {
    "id": "1.104.174",
    "event_id": "1.103.58",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.347",
      "1.105.348"
    ]
  },
  {
    "id": "1.104.175",
    "event_id": "1.103.59",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.349",
      "1.105.350"
    ]
  },
  {
    "id": "1.104.176",
    "event_id": "1.103.59",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.351",
      "1.105.352"
    ]
  },
  {
    "id": "1.104.177",
    "event_id": "1.103.59",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.353",
      "1.105.354"
    ]
  },
  {
    "id": "1.104.178",
    "event_id": "1.103.60",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.355",
      "1.105.356"
    ]
  },
  {
    "id": "1.104.179",
    "event_id": "1.103.60",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.357",
      "1.105.358"
    ]
  },
  {
    "id": "1.104.180",
    "event_id": "1.103.60",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.359",
      "1.105.360"
    ]
  },
  {
    "id": "1.104.181",
    "event_id": "1.103.61",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.361",
      "1.105.362"
    ]
  },
  {
    "id": "1.104.182",
    "event_id": "1.103.61",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.363",
      "1.105.364"
    ]
  },
  {
    "id": "1.104.183",
    "event_id": "1.103.61",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.365",
      "1.105.366"
    ]
  },
  {
    "id": "1.104.184",
    "event_id": "1.103.62",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.367",
      "1.105.368"
    ]
  },
  {
    "id": "1.104.185",
    "event_id": "1.103.62",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.369",
      "1.105.370"
    ]
  },
  {
    "id": "1.104.186",
    "event_id": "1.103.62",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.371",
      "1.105.372"
    ]
  },
  //Baseball Event group 3
  {
    "id": "1.104.187",
    "event_id": "1.103.63",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.373",
      "1.105.374"
    ]
  },
  {
    "id": "1.104.188",
    "event_id": "1.103.63",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.375",
      "1.105.376"
    ]
  },
  {
    "id": "1.104.189",
    "event_id": "1.103.63",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.377",
      "1.105.378"
    ]
  },
  {
    "id": "1.104.190",
    "event_id": "1.103.64",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.379",
      "1.105.380"
    ]
  },
  {
    "id": "1.104.191",
    "event_id": "1.103.64",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.381",
      "1.105.382"
    ]
  },
  {
    "id": "1.104.192",
    "event_id": "1.103.64",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.383",
      "1.105.384"
    ]
  },
  {
    "id": "1.104.193",
    "event_id": "1.103.65",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.385",
      "1.105.386"
    ]
  },
  {
    "id": "1.104.194",
    "event_id": "1.103.65",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.387",
      "1.105.388"
    ]
  },
  {
    "id": "1.104.195",
    "event_id": "1.103.65",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.389",
      "1.105.390"
    ]
  },
  {
    "id": "1.104.196",
    "event_id": "1.103.66",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.391",
      "1.105.392"
    ]
  },
  {
    "id": "1.104.197",
    "event_id": "1.103.66",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.393",
      "1.105.394"
    ]
  },
  {
    "id": "1.104.198",
    "event_id": "1.103.66",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.395",
      "1.105.396"
    ]
  },
  {
    "id": "1.104.199",
    "event_id": "1.103.67",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.397",
      "1.105.398"
    ]
  },
  {
    "id": "1.104.200",
    "event_id": "1.103.67",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.399",
      "1.105.400"
    ]
  },
  {
    "id": "1.104.201",
    "event_id": "1.103.67",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.401",
      "1.105.402"
    ]
  },
  //For Resolved Bets
  //American Football
  {
    "id": "1.104.202",
    "event_id": "1.103.68",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.403",
      "1.105.404"
    ]
  },
  {
    "id": "1.104.203",
    "event_id": "1.103.68",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.405",
      "1.105.406"
    ]
  },
  {
    "id": "1.104.204",
    "event_id": "1.103.68",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.407",
      "1.105.408"
    ]
  },
  {
    "id": "1.104.205",
    "event_id": "1.103.69",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.409",
      "1.105.410"
    ]
  },
  {
    "id": "1.104.206",
    "event_id": "1.103.69",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.411",
      "1.105.412"
    ]
  },
  {
    "id": "1.104.207",
    "event_id": "1.103.69",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.413",
      "1.105.414"
    ]
  },
  {
    "id": "1.104.208",
    "event_id": "1.103.70",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.415",
      "1.105.416"
    ]
  },
  {
    "id": "1.104.209",
    "event_id": "1.103.70",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.417",
      "1.105.418"
    ]
  },
  {
    "id": "1.104.210",
    "event_id": "1.103.70",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.419",
      "1.105.420"
    ]
  },
  {
    "id": "1.104.211",
    "event_id": "1.103.71",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.421",
      "1.105.422"
    ]
  },
  {
    "id": "1.104.212",
    "event_id": "1.103.71",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.423",
      "1.105.424"
    ]
  },
  {
    "id": "1.104.213",
    "event_id": "1.103.71",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.425",
      "1.105.426"
    ]
  },
  {
    "id": "1.104.214",
    "event_id": "1.103.72",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.427",
      "1.105.428"
    ]
  },
  {
    "id": "1.104.215",
    "event_id": "1.103.72",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.429",
      "1.105.430"
    ]
  },
  {
    "id": "1.104.216",
    "event_id": "1.103.72",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.431",
      "1.105.432"
    ]
  },
  //Basketball
  {
    "id": "1.104.217",
    "event_id": "1.103.73",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.433",
      "1.105.434"
    ]
  },
  {
    "id": "1.104.218",
    "event_id": "1.103.73",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.435",
      "1.105.436"
    ]
  },
  {
    "id": "1.104.219",
    "event_id": "1.103.73",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.437",
      "1.105.438"
    ]
  },
  {
    "id": "1.104.220",
    "event_id": "1.103.74",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.439",
      "1.105.440"
    ]
  },
  {
    "id": "1.104.221",
    "event_id": "1.103.74",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.441",
      "1.105.442"
    ]
  },
  {
    "id": "1.104.222",
    "event_id": "1.103.74",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.443",
      "1.105.444"
    ]
  },
  //Baseball
  {
    "id": "1.104.223",
    "event_id": "1.103.75",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.445",
      "1.105.446"
    ]
  },
  {
    "id": "1.104.224",
    "event_id": "1.103.75",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.447",
      "1.105.448"
    ]
  },
  {
    "id": "1.104.225",
    "event_id": "1.103.75",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.449",
      "1.105.450"
    ]
  },
  {
    "id": "1.104.226",
    "event_id": "1.103.76",
    "market_type_id": "Moneyline",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.451",
      "1.105.452"
    ]
  },
  {
    "id": "1.104.227",
    "event_id": "1.103.76",
    "market_type_id": "Spread",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.453",
      "1.105.454"
    ]
  },
  {
    "id": "1.104.228",
    "event_id": "1.103.76",
    "market_type_id": "OverUnder",
    "options": {
      "margin": 0,
      "score": 5
    },
    "betting_market_ids": [
      "1.105.455",
      "1.105.456"
    ]
  },
  //Resolved Bets Ends
];

//TODO: add more in this list, pay attention on the relation with the events, betting_markets dummy data
//TODO: for each event, make one moneyline, spread, overunder

const immutableBettingMarketGroups = _.map(bettingMarketGroups, bettingMarketGroup => Immutable.fromJS(bettingMarketGroup));
export default immutableBettingMarketGroups;
