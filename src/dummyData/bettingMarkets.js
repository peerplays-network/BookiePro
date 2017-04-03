import _ from 'lodash';
import Immutable from 'immutable';

const bettingMarkets = [
  {
    id: '1.105.1',
    betting_market_group_id: '1.104.1',
    payout_condition_string: "NY Giants",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.2',
    betting_market_group_id: '1.104.1',
    payout_condition_string: "Green Bay",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.3',
    betting_market_group_id: '1.104.2',
    payout_condition_string: null,
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.4',
    betting_market_group_id: '1.104.2',
    payout_condition_string: null,
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.5',
    betting_market_group_id: '1.104.3',
    payout_condition_string: null,
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.6',
    betting_market_group_id: '1.104.2',
    payout_condition_string: null,
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.7',
    betting_market_group_id: '1.104.4',
    payout_condition_string: null,
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.8',
    betting_market_group_id: '1.104.4',
    payout_condition_string: null,
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.9',
    betting_market_group_id: '1.104.5',
    payout_condition_string: null,
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.10',
    betting_market_group_id: '1.104.5',
    payout_condition_string: null,
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.11',
    betting_market_group_id: '1.104.6',
    payout_condition_string: null,
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.12',
    betting_market_group_id: '1.104.6',
    payout_condition_string: 'Over',
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.13',
    betting_market_group_id: '1.104.7',
    payout_condition_string: "CAarolina Panthers",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.14',
    betting_market_group_id: '1.104.7',
    payout_condition_string: "Denver Bancos",
    bet_asset_type: '1.3.0' // core asset
  },

  {
    id: '1.105.15',
    betting_market_group_id: '1.104.8',
    payout_condition_string: "CAarolina Panthers",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.16',
    betting_market_group_id: '1.104.8',
    payout_condition_string: "Denver Bancos",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.17',
    betting_market_group_id: '1.104.9',
    payout_condition_string: "Under",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.18',
    betting_market_group_id: '1.104.9',
    payout_condition_string: "Under",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.19',
    betting_market_group_id: '1.104.10',
    payout_condition_string: "Tampa Bay Buccaneers",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.20',
    betting_market_group_id: '1.104.10',
    payout_condition_string: "Atlanta Falcons",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.21',
    betting_market_group_id: '1.104.11',
    payout_condition_string: "Tampa Bay Buccaneers",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.22',
    betting_market_group_id: '1.104.11',
    payout_condition_string: "Atlanta Falcons",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.23',
    betting_market_group_id: '1.104.12',
    payout_condition_string: "Over",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.24',
    betting_market_group_id: '1.104.12',
    payout_condition_string: "Under",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.25',
    betting_market_group_id: '1.104.13',
    payout_condition_string: "Minnesota Vikings",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.26',
    betting_market_group_id: '1.104.13',
    payout_condition_string: "Tennessee Titans",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.27',
    betting_market_group_id: '1.104.14',
    payout_condition_string: "Minnesota Vikings",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.28',
    betting_market_group_id: '1.104.14',
    payout_condition_string: "Tennessee Titans",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.29',
    betting_market_group_id: '1.104.15',
    payout_condition_string: "Over",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.30',
    betting_market_group_id: '1.104.15',
    payout_condition_string: "Over",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.31',
    betting_market_group_id: '1.104.16',
    payout_condition_string: "Cleveland Browns",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.32',
    betting_market_group_id: '1.104.16',
    payout_condition_string: "Philandelphia Eagles",
    bet_asset_type: '1.3.0' // core asset
  },

  {
    id: '1.105.33',
    betting_market_group_id: '1.104.17',
    payout_condition_string: "Cleveland Browns",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.34',
    betting_market_group_id: '1.104.17',
    payout_condition_string: "Philandelphia Eagles",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.35',
    betting_market_group_id: '1.104.18',
    payout_condition_string: "Over",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.36',
    betting_market_group_id: '1.104.18',
    payout_condition_string: "Over",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.37',
    betting_market_group_id: '1.104.19',
    payout_condition_string: "Cincinnati Bengals",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.38',
    betting_market_group_id: '1.104.19',
    payout_condition_string: "New York Jets",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.39',
    betting_market_group_id: '1.104.20',
    payout_condition_string: "Cincinnati Bengals",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.40',
    betting_market_group_id: '1.104.20',
    payout_condition_string: "New York Jets",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.41',
    betting_market_group_id: '1.104.21',
    payout_condition_string: "Over",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.42',
    betting_market_group_id: '1.104.21',
    payout_condition_string: "Under",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.43',
    betting_market_group_id: '1.104.22',
    payout_condition_string: "Oakland Raiders",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.44',
    betting_market_group_id: '1.104.22',
    payout_condition_string: "New Orleans Saints",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.45',
    betting_market_group_id: '1.104.23',
    payout_condition_string: "Oakland Raiders",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.46',
    betting_market_group_id: '1.104.23',
    payout_condition_string: "New Orleans Saints",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.47',
    betting_market_group_id: '1.104.24',
    payout_condition_string: "Under",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.48',
    betting_market_group_id: '1.104.24',
    payout_condition_string: "Over",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.49',
    betting_market_group_id: '1.104.25',
    payout_condition_string: "San Diego Chargers",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.50',
    betting_market_group_id: '1.104.25',
    payout_condition_string: "Kansas City Chiefs",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.51',
    betting_market_group_id: '1.104.26',
    payout_condition_string: "San Diego Chargers",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.52',
    betting_market_group_id: '1.104.26',
    payout_condition_string: "Kansas City Chiefs",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.53',
    betting_market_group_id: '1.104.27',
    payout_condition_string: "Over",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    id: '1.105.54',
    betting_market_group_id: '1.104.27',
    payout_condition_string: "Over",
    bet_asset_type: '1.3.0' // core asset
  },
  {
    "id": "1.105.55",
    "betting_market_group_id": "1.104.28",
    "payout_condition_string": "Tanduay Light",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.56",
    "betting_market_group_id": "1.104.28",
    "payout_condition_string": "San Beda",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.57",
    "betting_market_group_id": "1.104.29",
    "payout_condition_string": "Tanduay Light",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.58",
    "betting_market_group_id": "1.104.29",
    "payout_condition_string": "San Beda",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.59",
    "betting_market_group_id": "1.104.30",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.60",
    "betting_market_group_id": "1.104.30",
    "payout_condition_string": "Under",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.61",
    "betting_market_group_id": "1.104.31",
    "payout_condition_string": "Racal Ceramica",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.62",
    "betting_market_group_id": "1.104.31",
    "payout_condition_string": "Cafe France Bakers",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.63",
    "betting_market_group_id": "1.104.32",
    "payout_condition_string": "Racal Ceramica",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.64",
    "betting_market_group_id": "1.104.32",
    "payout_condition_string": "Cafe France Bakers",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.65",
    "betting_market_group_id": "1.104.33",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.66",
    "betting_market_group_id": "1.104.33",
    "payout_condition_string": "Under",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.67",
    "betting_market_group_id": "1.104.34",
    "payout_condition_string": "LG Sakers",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.68",
    "betting_market_group_id": "1.104.34",
    "payout_condition_string": "Dongbu Promy",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.69",
    "betting_market_group_id": "1.104.35",
    "payout_condition_string": "LG Sakers",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.70",
    "betting_market_group_id": "1.104.35",
    "payout_condition_string": "Dongbu Promy",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.71",
    "betting_market_group_id": "1.104.36",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.72",
    "betting_market_group_id": "1.104.36",
    "payout_condition_string": "Under",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.73",
    "betting_market_group_id": "1.104.37",
    "payout_condition_string": "BK Novosibirsk",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.74",
    "betting_market_group_id": "1.104.37",
    "payout_condition_string": "Kupol Rodniki",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.75",
    "betting_market_group_id": "1.104.38",
    "payout_condition_string": "BK Novosibirsk",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.76",
    "betting_market_group_id": "1.104.38",
    "payout_condition_string": "Kupol Rodniki",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.77",
    "betting_market_group_id": "1.104.39",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.78",
    "betting_market_group_id": "1.104.39",
    "payout_condition_string": "Under",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.79",
    "betting_market_group_id": "1.104.40",
    "payout_condition_string": "Pieno zvaigzdes",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.80",
    "betting_market_group_id": "1.104.40",
    "payout_condition_string": "Tartu Rocks",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.81",
    "betting_market_group_id": "1.104.41",
    "payout_condition_string": "Pieno zvaigzdes",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.82",
    "betting_market_group_id": "1.104.41",
    "payout_condition_string": "Tartu Rocks",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.83",
    "betting_market_group_id": "1.104.42",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.84",
    "betting_market_group_id": "1.104.42",
    "payout_condition_string": "Under",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.85",
    "betting_market_group_id": "1.104.43",
    "payout_condition_string": "Levski Sofia",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.86",
    "betting_market_group_id": "1.104.43",
    "payout_condition_string": "Academic Plovdiv",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.87",
    "betting_market_group_id": "1.104.44",
    "payout_condition_string": "Levski Sofia",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.88",
    "betting_market_group_id": "1.104.44",
    "payout_condition_string": "Academic Plovdiv",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.89",
    "betting_market_group_id": "1.104.45",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.90",
    "betting_market_group_id": "1.104.45",
    "payout_condition_string": "Under",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.91",
    "betting_market_group_id": "1.104.46",
    "payout_condition_string": "Sisu Basket",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.92",
    "betting_market_group_id": "1.104.46",
    "payout_condition_string": "Horsholm 79ers",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.93",
    "betting_market_group_id": "1.104.47",
    "payout_condition_string": "Sisu Basket",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.94",
    "betting_market_group_id": "1.104.47",
    "payout_condition_string": "Horsholm 79ers",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.95",
    "betting_market_group_id": "1.104.48",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.96",
    "betting_market_group_id": "1.104.48",
    "payout_condition_string": "Under",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.97",
    "betting_market_group_id": "1.104.49",
    "payout_condition_string": "Randers Cimbria",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.98",
    "betting_market_group_id": "1.104.49",
    "payout_condition_string": "Horsens IC",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.99",
    "betting_market_group_id": "1.104.50",
    "payout_condition_string": "Randers Cimbria",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.100",
    "betting_market_group_id": "1.104.50",
    "payout_condition_string": "Horsens IC",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.101",
    "betting_market_group_id": "1.104.51",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.102",
    "betting_market_group_id": "1.104.51",
    "payout_condition_string": "Under",
    "bet_asset_type": "1.3.0"
  },
];

//TODO: add more in this list, pay attention on the relation with the betting_market_groups dummy data

const immutableBettingMarkets = _.map(bettingMarkets, bettingMarket => Immutable.fromJS(bettingMarket));
export default immutableBettingMarkets;
