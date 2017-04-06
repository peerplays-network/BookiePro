import _ from 'lodash';
import Immutable from 'immutable';

const bettingMarkets = [
  {
    "id": "1.105.1",
    "betting_market_group_id": "1.104.1",
    "payout_condition_string": "NY Giants",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.2",
    "betting_market_group_id": "1.104.1",
    "payout_condition_string": "Green Bay",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.3",
    "betting_market_group_id": "1.104.2",
    "payout_condition_string": null,
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.4",
    "betting_market_group_id": "1.104.2",
    "payout_condition_string": null,
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.5",
    "betting_market_group_id": "1.104.3",
    "payout_condition_string": null,
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.6",
    "betting_market_group_id": "1.104.2",
    "payout_condition_string": null,
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.7",
    "betting_market_group_id": "1.104.4",
    "payout_condition_string": null,
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.8",
    "betting_market_group_id": "1.104.4",
    "payout_condition_string": null,
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.9",
    "betting_market_group_id": "1.104.5",
    "payout_condition_string": null,
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.10",
    "betting_market_group_id": "1.104.5",
    "payout_condition_string": null,
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.11",
    "betting_market_group_id": "1.104.6",
    "payout_condition_string": null,
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.12",
    "betting_market_group_id": "1.104.6",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.13",
    "betting_market_group_id": "1.104.7",
    "payout_condition_string": "CAarolina Panthers",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.14",
    "betting_market_group_id": "1.104.7",
    "payout_condition_string": "Denver Bancos",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.15",
    "betting_market_group_id": "1.104.8",
    "payout_condition_string": "CAarolina Panthers",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.16",
    "betting_market_group_id": "1.104.8",
    "payout_condition_string": "Denver Bancos",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.17",
    "betting_market_group_id": "1.104.9",
    "payout_condition_string": "Under",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.18",
    "betting_market_group_id": "1.104.9",
    "payout_condition_string": "Under",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.19",
    "betting_market_group_id": "1.104.10",
    "payout_condition_string": "Tampa Bay Buccaneers",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.20",
    "betting_market_group_id": "1.104.10",
    "payout_condition_string": "Atlanta Falcons",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.21",
    "betting_market_group_id": "1.104.11",
    "payout_condition_string": "Tampa Bay Buccaneers",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.22",
    "betting_market_group_id": "1.104.11",
    "payout_condition_string": "Atlanta Falcons",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.23",
    "betting_market_group_id": "1.104.12",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.24",
    "betting_market_group_id": "1.104.12",
    "payout_condition_string": "Under",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.25",
    "betting_market_group_id": "1.104.13",
    "payout_condition_string": "Minnesota Vikings",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.26",
    "betting_market_group_id": "1.104.13",
    "payout_condition_string": "Tennessee Titans",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.27",
    "betting_market_group_id": "1.104.14",
    "payout_condition_string": "Minnesota Vikings",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.28",
    "betting_market_group_id": "1.104.14",
    "payout_condition_string": "Tennessee Titans",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.29",
    "betting_market_group_id": "1.104.15",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.30",
    "betting_market_group_id": "1.104.15",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.31",
    "betting_market_group_id": "1.104.16",
    "payout_condition_string": "Cleveland Browns",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.32",
    "betting_market_group_id": "1.104.16",
    "payout_condition_string": "Philandelphia Eagles",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.33",
    "betting_market_group_id": "1.104.17",
    "payout_condition_string": "Cleveland Browns",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.34",
    "betting_market_group_id": "1.104.17",
    "payout_condition_string": "Philandelphia Eagles",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.35",
    "betting_market_group_id": "1.104.18",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.36",
    "betting_market_group_id": "1.104.18",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.37",
    "betting_market_group_id": "1.104.19",
    "payout_condition_string": "Cincinnati Bengals",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.38",
    "betting_market_group_id": "1.104.19",
    "payout_condition_string": "New York Jets",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.39",
    "betting_market_group_id": "1.104.20",
    "payout_condition_string": "Cincinnati Bengals",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.40",
    "betting_market_group_id": "1.104.20",
    "payout_condition_string": "New York Jets",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.41",
    "betting_market_group_id": "1.104.21",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.42",
    "betting_market_group_id": "1.104.21",
    "payout_condition_string": "Under",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.43",
    "betting_market_group_id": "1.104.22",
    "payout_condition_string": "Oakland Raiders",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.44",
    "betting_market_group_id": "1.104.22",
    "payout_condition_string": "New Orleans Saints",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.45",
    "betting_market_group_id": "1.104.23",
    "payout_condition_string": "Oakland Raiders",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.46",
    "betting_market_group_id": "1.104.23",
    "payout_condition_string": "New Orleans Saints",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.47",
    "betting_market_group_id": "1.104.24",
    "payout_condition_string": "Under",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.48",
    "betting_market_group_id": "1.104.24",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.49",
    "betting_market_group_id": "1.104.25",
    "payout_condition_string": "San Diego Chargers",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.50",
    "betting_market_group_id": "1.104.25",
    "payout_condition_string": "Kansas City Chiefs",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.51",
    "betting_market_group_id": "1.104.26",
    "payout_condition_string": "San Diego Chargers",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.52",
    "betting_market_group_id": "1.104.26",
    "payout_condition_string": "Kansas City Chiefs",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.53",
    "betting_market_group_id": "1.104.27",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.54",
    "betting_market_group_id": "1.104.27",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
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
  {
    "id": "1.105.103",
    "betting_market_group_id": "1.104.52",
    "payout_condition_string": "Miami Marlins",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.104",
    "betting_market_group_id": "1.104.52",
    "payout_condition_string": "Washington Nationals",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.105",
    "betting_market_group_id": "1.104.53",
    "payout_condition_string": "Miami Marlins",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.106",
    "betting_market_group_id": "1.104.53",
    "payout_condition_string": "Washington Nationals",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.107",
    "betting_market_group_id": "1.104.54",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.108",
    "betting_market_group_id": "1.104.54",
    "payout_condition_string": "Under",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.109",
    "betting_market_group_id": "1.104.55",
    "payout_condition_string": "Atlanta Braves",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.110",
    "betting_market_group_id": "1.104.55",
    "payout_condition_string": "New York Mets",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.111",
    "betting_market_group_id": "1.104.56",
    "payout_condition_string": "Atlanta Braves",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.112",
    "betting_market_group_id": "1.104.56",
    "payout_condition_string": "New York Mets",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.113",
    "betting_market_group_id": "1.104.57",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.114",
    "betting_market_group_id": "1.104.57",
    "payout_condition_string": "Under",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.115",
    "betting_market_group_id": "1.104.58",
    "payout_condition_string": "Pittsburgh Pirates",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.116",
    "betting_market_group_id": "1.104.58",
    "payout_condition_string": "Boston Red Sox",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.117",
    "betting_market_group_id": "1.104.59",
    "payout_condition_string": "Pittsburgh Pirates",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.118",
    "betting_market_group_id": "1.104.59",
    "payout_condition_string": "Boston Red Sox",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.119",
    "betting_market_group_id": "1.104.60",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.120",
    "betting_market_group_id": "1.104.60",
    "payout_condition_string": "Under",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.121",
    "betting_market_group_id": "1.104.61",
    "payout_condition_string": "Colorado Rockies",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.122",
    "betting_market_group_id": "1.104.61",
    "payout_condition_string": "Milwaukee Brewers",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.123",
    "betting_market_group_id": "1.104.62",
    "payout_condition_string": "Colorado Rockies",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.124",
    "betting_market_group_id": "1.104.62",
    "payout_condition_string": "Milwaukee Brewers",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.125",
    "betting_market_group_id": "1.104.63",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.126",
    "betting_market_group_id": "1.104.63",
    "payout_condition_string": "Under",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.127",
    "betting_market_group_id": "1.104.64",
    "payout_condition_string": "Toronto Blue Jays",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.128",
    "betting_market_group_id": "1.104.64",
    "payout_condition_string": "Baltimore Orioles",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.129",
    "betting_market_group_id": "1.104.65",
    "payout_condition_string": "Toronto Blue Jays",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.130",
    "betting_market_group_id": "1.104.65",
    "payout_condition_string": "Baltimore Orioles",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.131",
    "betting_market_group_id": "1.104.66",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.132",
    "betting_market_group_id": "1.104.66",
    "payout_condition_string": "Under",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.133",
    "betting_market_group_id": "1.104.67",
    "payout_condition_string": "San Diego Padres",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.134",
    "betting_market_group_id": "1.104.67",
    "payout_condition_string": "Los Angeles Dodgers",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.135",
    "betting_market_group_id": "1.104.68",
    "payout_condition_string": "San Diego Padres",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.136",
    "betting_market_group_id": "1.104.68",
    "payout_condition_string": "Los Angeles Dodgers",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.137",
    "betting_market_group_id": "1.104.69",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.138",
    "betting_market_group_id": "1.104.69",
    "payout_condition_string": "Under",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.139",
    "betting_market_group_id": "1.104.70",
    "payout_condition_string": "Kansas City Royals",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.140",
    "betting_market_group_id": "1.104.70",
    "payout_condition_string": "Minnesota Twins",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.141",
    "betting_market_group_id": "1.104.71",
    "payout_condition_string": "Kansas City Royals",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.142",
    "betting_market_group_id": "1.104.71",
    "payout_condition_string": "Minnesota Twins",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.143",
    "betting_market_group_id": "1.104.72",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.144",
    "betting_market_group_id": "1.104.72",
    "payout_condition_string": "Under",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.145",
    "betting_market_group_id": "1.104.73",
    "payout_condition_string": "Detroit Tigers",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.146",
    "betting_market_group_id": "1.104.73",
    "payout_condition_string": "Chicago White Sox",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.147",
    "betting_market_group_id": "1.104.74",
    "payout_condition_string": "Detroit Tigers",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.148",
    "betting_market_group_id": "1.104.74",
    "payout_condition_string": "Chicago White Sox",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.149",
    "betting_market_group_id": "1.104.75",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.150",
    "betting_market_group_id": "1.104.75",
    "payout_condition_string": "Under",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.151",
    "betting_market_group_id": "1.104.76",
    "payout_condition_string": "Philadelphia Phillies",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.152",
    "betting_market_group_id": "1.104.76",
    "payout_condition_string": "Cincinnati Reds",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.153",
    "betting_market_group_id": "1.104.77",
    "payout_condition_string": "Philadelphia Phillies",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.154",
    "betting_market_group_id": "1.104.77",
    "payout_condition_string": "Cincinnati Reds",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.155",
    "betting_market_group_id": "1.104.78",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.156",
    "betting_market_group_id": "1.104.78",
    "payout_condition_string": "Under",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.157",
    "betting_market_group_id": "1.104.79",
    "payout_condition_string": "Cleveland Indians",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.158",
    "betting_market_group_id": "1.104.79",
    "payout_condition_string": "Texas Rangers",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.159",
    "betting_market_group_id": "1.104.80",
    "payout_condition_string": "Cleveland Indians",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.160",
    "betting_market_group_id": "1.104.80",
    "payout_condition_string": "Texas Rangers",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.161",
    "betting_market_group_id": "1.104.81",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.162",
    "betting_market_group_id": "1.104.81",
    "payout_condition_string": "Under",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.163",
    "betting_market_group_id": "1.104.82",
    "payout_condition_string": "Southern District",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.164",
    "betting_market_group_id": "1.104.82",
    "payout_condition_string": "Hong Kong Rangers",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.165",
    "betting_market_group_id": "1.104.83",
    "payout_condition_string": "Southern District",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.166",
    "betting_market_group_id": "1.104.83",
    "payout_condition_string": "Hong Kong Rangers",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.167",
    "betting_market_group_id": "1.104.84",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.168",
    "betting_market_group_id": "1.104.84",
    "payout_condition_string": "Under",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.169",
    "betting_market_group_id": "1.104.85",
    "payout_condition_string": "Erchim FC",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.170",
    "betting_market_group_id": "1.104.85",
    "payout_condition_string": "Kigwancha SC",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.171",
    "betting_market_group_id": "1.104.86",
    "payout_condition_string": "Erchim FC",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.172",
    "betting_market_group_id": "1.104.86",
    "payout_condition_string": "Kigwancha SC",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.173",
    "betting_market_group_id": "1.104.87",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.174",
    "betting_market_group_id": "1.104.87",
    "payout_condition_string": "Under",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.175",
    "betting_market_group_id": "1.104.88",
    "payout_condition_string": "E Suburbs Brisbane",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.176",
    "betting_market_group_id": "1.104.88",
    "payout_condition_string": "Ipswich Knights",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.177",
    "betting_market_group_id": "1.104.89",
    "payout_condition_string": "E Suburbs Brisbane",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.178",
    "betting_market_group_id": "1.104.89",
    "payout_condition_string": "Ipswich Knights",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.179",
    "betting_market_group_id": "1.104.90",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.180",
    "betting_market_group_id": "1.104.90",
    "payout_condition_string": "Under",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.181",
    "betting_market_group_id": "1.104.91",
    "payout_condition_string": "Felda Utd",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.182",
    "betting_market_group_id": "1.104.91",
    "payout_condition_string": "Ceres La Salle",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.183",
    "betting_market_group_id": "1.104.92",
    "payout_condition_string": "Felda Utd",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.184",
    "betting_market_group_id": "1.104.92",
    "payout_condition_string": "Ceres La Salle",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.185",
    "betting_market_group_id": "1.104.93",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.186",
    "betting_market_group_id": "1.104.93",
    "payout_condition_string": "Under",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.187",
    "betting_market_group_id": "1.104.94",
    "payout_condition_string": "Mitchelton FC",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.188",
    "betting_market_group_id": "1.104.94",
    "payout_condition_string": "Brisbane Knights FC",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.189",
    "betting_market_group_id": "1.104.95",
    "payout_condition_string": "Mitchelton FC",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.190",
    "betting_market_group_id": "1.104.95",
    "payout_condition_string": "Brisbane Knights FC",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.191",
    "betting_market_group_id": "1.104.96",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.192",
    "betting_market_group_id": "1.104.96",
    "payout_condition_string": "Under",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.193",
    "betting_market_group_id": "1.104.97",
    "payout_condition_string": "Logan Lightning FC",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.194",
    "betting_market_group_id": "1.104.97",
    "payout_condition_string": "Capalaba FC",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.195",
    "betting_market_group_id": "1.104.98",
    "payout_condition_string": "Logan Lightning FC",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.196",
    "betting_market_group_id": "1.104.98",
    "payout_condition_string": "Capalaba FC",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.197",
    "betting_market_group_id": "1.104.99",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.198",
    "betting_market_group_id": "1.104.99",
    "payout_condition_string": "Under",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.199",
    "betting_market_group_id": "1.104.100",
    "payout_condition_string": "Uni of Queensland",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.200",
    "betting_market_group_id": "1.104.100",
    "payout_condition_string": "Ipswich City FC",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.201",
    "betting_market_group_id": "1.104.101",
    "payout_condition_string": "Uni of Queensland",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.202",
    "betting_market_group_id": "1.104.101",
    "payout_condition_string": "Ipswich City FC",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.203",
    "betting_market_group_id": "1.104.102",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.204",
    "betting_market_group_id": "1.104.102",
    "payout_condition_string": "Under",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.205",
    "betting_market_group_id": "1.104.103",
    "payout_condition_string": "Southside Eagles SC",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.206",
    "betting_market_group_id": "1.104.103",
    "payout_condition_string": "Brisbane Force",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.207",
    "betting_market_group_id": "1.104.104",
    "payout_condition_string": "Southside Eagles SC",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.208",
    "betting_market_group_id": "1.104.104",
    "payout_condition_string": "Brisbane Force",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.209",
    "betting_market_group_id": "1.104.105",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.210",
    "betting_market_group_id": "1.104.105",
    "payout_condition_string": "Under",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.211",
    "betting_market_group_id": "1.104.106",
    "payout_condition_string": "Moreton Bay Jets FC",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.212",
    "betting_market_group_id": "1.104.106",
    "payout_condition_string": "Western Pride FC",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.213",
    "betting_market_group_id": "1.104.107",
    "payout_condition_string": "Moreton Bay Jets FC",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.214",
    "betting_market_group_id": "1.104.107",
    "payout_condition_string": "Western Pride FC",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.215",
    "betting_market_group_id": "1.104.108",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.216",
    "betting_market_group_id": "1.104.108",
    "payout_condition_string": "Under",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.217",
    "betting_market_group_id": "1.104.109",
    "payout_condition_string": "Brisbane Strikers",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.218",
    "betting_market_group_id": "1.104.109",
    "payout_condition_string": "Sunshine Coast FC",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.219",
    "betting_market_group_id": "1.104.110",
    "payout_condition_string": "Brisbane Strikers",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.220",
    "betting_market_group_id": "1.104.110",
    "payout_condition_string": "Sunshine Coast FC",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.221",
    "betting_market_group_id": "1.104.111",
    "payout_condition_string": "Over",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.222",
    "betting_market_group_id": "1.104.111",
    "payout_condition_string": "Under",
    "bet_asset_type": "1.3.0"
  },
  {
    "id": "1.105.223",
    "betting_market_group_id": "1.104.43",
    "payout_condition_string": "The Draw",
    "bet_asset_type": "1.3.0"
  },

];

//TODO: add more in this list, pay attention on the relation with the betting_market_groups dummy data

const immutableBettingMarkets = _.map(bettingMarkets, bettingMarket => Immutable.fromJS(bettingMarket));
export default immutableBettingMarkets;
