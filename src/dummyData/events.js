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
    "name": "NY Giants vs Green Bay",
    "seasons": "2016-2017",
    "start_time": moment().add(1, 'days').unix() * 1000,
    "event_group_id": "1.101.1",
    "status": "Completed",
    "scores": ["36", "19"],
    "is_live_market": true
  },
  {
    "id": "1.103.2",
    "name": "Cleveland Cavaliers vs Golden State Wariors",
    "seasons": "2017-2018",
    "start_time": moment().add(1, 'days').unix() * 1000,
    "event_group_id": "1.101.4",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": true
  },
  {
    "id": "1.103.3",
    "name": "Carolina Panthers vs Denver Broncos",
    "seasons": "2017-2018",
    "start_time": moment().add(2, 'days').unix() * 1000,
    "event_group_id": "1.101.1",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.4",
    "name": "Tampa Bay Buccaneers vs Atlanta Falcons",
    "seasons": "2017-2018",
    "start_time": moment().add(3, 'days').unix() * 1000,
    "event_group_id": "1.101.1",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.5",
    "name": "Minnesota Vikings vs Tennessee Titans",
    "seasons": "2017-2018",
    "start_time": moment().add(4, 'days').unix() * 1000,
    "event_group_id": "1.101.1",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.6",
    "name": "Cleveland Browns vs Philandelphia Eagles",
    "seasons": "2017-2018",
    "start_time": moment().add(5, 'days').unix() * 1000,
    "event_group_id": "1.101.1",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": true
  },
  {
    "id": "1.103.7",
    "name": "Cincinnati Bengals vs New York Jets",
    "seasons": "2017-2018",
    "start_time": moment().add(5, 'hours').unix() * 1000,
    "event_group_id": "1.101.1",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.8",
    "name": "Oakland Raiders vs New Orleans Saints",
    "seasons": "2017-2018",
    "start_time": moment().add(7, 'days').unix() * 1000,
    "event_group_id": "1.101.1",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.9",
    "name": "San Diego Chargers vs Kansas City Chiefs",
    "seasons": "2017-2018",
    "start_time": moment().add(8, 'days').unix() * 1000,
    "event_group_id": "1.101.1",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.10",
    "name": "Tanduay Light vs San Beda",
    "seasons": "2016-2017",
    "start_time": moment().add(9, 'days').unix() * 1000,
    "event_group_id": "1.101.4",
    "status": "Completed",
    "scores": ["36", "19"],
    "is_live_market": true
  },
  {
    "id": "1.103.11",
    "name": "Racal Ceramica vs Cafe France Bakers",
    "seasons": "2017-2018",
    "start_time": moment().add(9, 'days').unix() * 1000,
    "event_group_id": "1.101.4",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": true
  },
  {
    "id": "1.103.12",
    "name": "LG Sakers vs Dongbu Promy",
    "seasons": "2017-2018",
    "start_time": moment().add(10, 'days').unix() * 1000,
    "event_group_id": "1.101.4",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.13",
    "name": "BK Novosibirsk vs Kupol Rodniki",
    "seasons": "2017-2018",
    "start_time": moment().add(11, 'days').unix() * 1000,
    "event_group_id": "1.101.4",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.14",
    "name": "Pieno zvaigzdes vs Tartu Rocks",
    "seasons": "2017-2018",
    "start_time": moment().add(12, 'days').unix() * 1000,
    "event_group_id": "1.101.4",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.15",
    "name": "Levski Sofia vs Academic Plovdiv",
    "seasons": "2017-2018",
    "start_time": moment().add(13, 'days').unix() * 1000,
    "event_group_id": "1.101.4",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.16",
    "name": "Sisu Basket vs Horsholm 79ers",
    "seasons": "2017-2018",
    "start_time": moment().add(14, 'days').unix() * 1000,
    "event_group_id": "1.101.4",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.17",
    "name": "Randers Cimbria vs Horsens IC",
    "seasons": "2017-2018",
    "start_time": moment().add(15, 'days').unix() * 1000,
    "event_group_id": "1.101.4",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.18",
    "name": "Miami Marlins vs Washington Nationals",
    "seasons": "2017-2018",
    "start_time": moment().add(2, 'days').unix() * 1000,
    "event_group_id": "1.101.7",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": true
  },
  {
    "id": "1.103.19",
    "name": "Atlanta Braves vs New York Mets",
    "seasons": "2017-2018",
    "start_time": moment().add(4, 'days').unix() * 1000,
    "event_group_id": "1.101.7",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": true
  },
  {
    "id": "1.103.20",
    "name": "Pittsburgh Pirates vs Boston Red Sox",
    "seasons": "2017-2018",
    "start_time": moment().add(5, 'days').unix() * 1000,
    "event_group_id": "1.101.7",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.21",
    "name": "Colorado Rockies vs Milwaukee Brewers",
    "seasons": "2017-2018",
    "start_time": moment().add(6, 'days').unix() * 1000,
    "event_group_id": "1.101.7",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.22",
    "name": "Toronto Blue Jays vs Baltimore Orioles",
    "seasons": "2017-2018",
    "start_time": moment().add(7, 'days').unix() * 1000,
    "event_group_id": "1.101.7",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.23",
    "name": "San Diego Padres vs Los Angeles Dodgers",
    "seasons": "2017-2018",
    "start_time": moment().add(7, 'days').unix() * 1000,
    "event_group_id": "1.101.7",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.24",
    "name": "Kansas City Royals vs Minnesota Twins",
    "seasons": "2017-2018",
    "start_time": moment().add(8, 'days').unix() * 1000,
    "event_group_id": "1.101.7",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.25",
    "name": "Detroit Tigers vs Chicago White Sox",
    "seasons": "2017-2018",
    "start_time": moment().add(8, 'days').unix() * 1000,
    "event_group_id": "1.101.7",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.26",
    "name": "Philadelphia Phillies vs Cincinnati Reds",
    "seasons": "2017-2018",
    "start_time": moment().add(10, 'days').unix() * 1000,
    "event_group_id": "1.101.7",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.27",
    "name": "Cleveland Indians vs Texas Rangers",
    "seasons": "2017-2018",
    "start_time": moment().add(12, 'days').unix() * 1000,
    "event_group_id": "1.101.7",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.28",
    "name": "Southern District vs Hong Kong Rangers",
    "seasons": "2017-2018",
    "start_time": moment().add(2, 'days').unix() * 1000,
    "event_group_id": "1.101.10",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": true
  },
  {
    "id": "1.103.29",
    "name": "Erchim FC vs Kigwancha SC",
    "seasons": "2017-2018",
    "start_time": moment().add(3, 'days').unix() * 1000,
    "event_group_id": "1.101.10",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": true
  },
  {
    "id": "1.103.30",
    "name": "E Suburbs Brisbane vs Ipswich Knights",
    "seasons": "2017-2018",
    "start_time": moment().add(4, 'days').unix() * 1000,
    "event_group_id": "1.101.10",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.31",
    "name": "Felda Utd vs Ceres La Salle",
    "seasons": "2017-2018",
    "start_time": moment().add(5, 'days').unix() * 1000,
    "event_group_id": "1.101.10",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.32",
    "name": "Mitchelton FC vs Brisbane Knights FC",
    "seasons": "2017-2018",
    "start_time": moment().add(6, 'days').unix() * 1000,
    "event_group_id": "1.101.10",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.33",
    "name": "Logan Lightning FC vs Capalaba FC",
    "seasons": "2017-2018",
    "start_time": moment().add(7, 'days').unix() * 1000,
    "event_group_id": "1.101.10",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.34",
    "name": "Uni of Queensland vs Ipswich City FC",
    "seasons": "2017-2018",
    "start_time": moment().add(8, 'days').unix() * 1000,
    "event_group_id": "1.101.10",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.35",
    "name": "Southside Eagles SC vs Brisbane Force",
    "seasons": "2017-2018",
    "start_time": moment().add(8, 'days').unix() * 1000,
    "event_group_id": "1.101.10",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.36",
    "name": "Moreton Bay Jets FC vs Western Pride FC",
    "seasons": "2017-2018",
    "start_time": moment().add(9, 'days').unix() * 1000,
    "event_group_id": "1.101.10",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.37",
    "name": "Brisbane Strikers vs Sunshine Coast FC",
    "seasons": "2017-2018",
    "start_time": moment().add(12, 'days').unix() * 1000,
    "event_group_id": "1.101.10",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  //basketball Group 1
  {
    "id": "1.103.38",
    "name": "Le Havre vs Boulazac",
    "seasons": "2017-2018",
    "start_time": moment().add(2, 'days').unix() * 1000,
    "event_group_id": "1.101.5",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.39",
    "name": "Charleville-Mezieres vs Bourg-en-Bresse",
    "seasons": "2017-2018",
    "start_time": moment().add(2, 'days').unix() * 1000,
    "event_group_id": "1.101.5",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.40",
    "name": "Boulogne-sur-Mer vs Vichy",
    "seasons": "2017-2018",
    "start_time": moment().add(2, 'days').unix() * 1000,
    "event_group_id": "1.101.5",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.41",
    "name": "Saint-Quentin vs Poitiers",
    "seasons": "2017-2018",
    "start_time": moment().add(2, 'days').unix() * 1000,
    "event_group_id": "1.101.5",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.42",
    "name": "Fos Sur Mer Basket vs ADA Blois Basket",
    "seasons": "2017-2018",
    "start_time": moment().add(2, 'days').unix() * 1000,
    "event_group_id": "1.101.5",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  //Basketball event 3
  {
    "id": "1.103.43",
    "name": "Evreux vs Nantes",
    "seasons": "2017-2018",
    "start_time": moment().add(2, 'days').unix() * 1000,
    "event_group_id": "1.101.6",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.44",
    "name": "Denain vs Aix-Maurienne",
    "seasons": "2017-2018",
    "start_time": moment().add(2, 'days').unix() * 1000,
    "event_group_id": "1.101.6",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.45",
    "name": "BS Weert vs Groningen Donar",
    "seasons": "2017-2018",
    "start_time": moment().add(2, 'days').unix() * 1000,
    "event_group_id": "1.101.6",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.46",
    "name": "Lille vs Saint Chamond Basket",
    "seasons": "2017-2018",
    "start_time": moment().add(2, 'days').unix() * 1000,
    "event_group_id": "1.101.6",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.47",
    "name": "Grindavík vs Stjarnan",
    "seasons": "2017-2018",
    "start_time": moment().add(2, 'days').unix() * 1000,
    "event_group_id": "1.101.6",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  //Soccer Event Group 2
  {
    "id": "1.103.48",
    "name": "Saham vs Al Wehdat",
    "seasons": "2017-2018",
    "start_time": moment().add(7, 'days').unix() * 1000,
    "event_group_id": "1.101.11",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.49",
    "name": "Targu Mures vs Pandurii",
    "seasons": "2017-2018",
    "start_time": moment().add(11, 'days').unix() * 1000,
    "event_group_id": "1.101.11",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.50",
    "name": "Arminia Bielefeld vs Fortuna Dusseldorf",
    "seasons": "2017-2018",
    "start_time": moment().add(14, 'days').unix() * 1000,
    "event_group_id": "1.101.11",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.51",
    "name": "Hannover vs Nurnberg",
    "seasons": "2017-2018",
    "start_time": moment().add(5, 'days').unix() * 1000,
    "event_group_id": "1.101.11",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.52",
    "name": "Karlsruhe vs Wurzburger Kickers",
    "seasons": "2017-2018",
    "start_time": moment().add(8, 'days').unix() * 1000,
    "event_group_id": "1.101.11",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  //Soccer Event group 3
  {
    "id": "1.103.53",
    "name": "St Pauli II vs Hamburg II",
    "seasons": "2017-2018",
    "start_time": moment().add(15, 'days').unix() * 1000,
    "event_group_id": "1.101.12",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.54",
    "name": "Al Muharraq vs Nejmeh",
    "seasons": "2017-2018",
    "start_time": moment().add(11, 'days').unix() * 1000,
    "event_group_id": "1.101.12",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.55",
    "name": "Arka Gdynia vs Wigry Suwalki",
    "seasons": "2017-2018",
    "start_time": moment().add(6, 'days').unix() * 1000,
    "event_group_id": "1.101.12",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.56",
    "name": "Frejus St-Raphael vs Guingamp",
    "seasons": "2017-2018",
    "start_time": moment().add(14, 'days').unix() * 1000,
    "event_group_id": "1.101.12",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.57",
    "name": "Schalding-Heining vs Seligenporten",
    "seasons": "2017-2018",
    "start_time": moment().add(3, 'days').unix() * 1000,
    "event_group_id": "1.101.12",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  //Baseball Group 2
  {
    "id": "1.103.58",
    "name": "Hiroshima Toyo Carp vs Chunichi Dragons",
    "seasons": "2017-2018",
    "start_time": moment().add(10, 'days').unix() * 1000,
    "event_group_id": "1.101.8",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.59",
    "name": "G Garcia-Lopez vs L Rosol",
    "seasons": "2017-2018",
    "start_time": moment().add(11, 'days').unix() * 1000,
    "event_group_id": "1.101.8",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.60",
    "name": "D Lee vs J Kovalik",
    "seasons": "2017-2018",
    "start_time": moment().add(4, 'days').unix() * 1000,
    "event_group_id": "1.101.8",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.61",
    "name": "M Puig vs D Kasatkina",
    "seasons": "2017-2018",
    "start_time": moment().add(10, 'days').unix() * 1000,
    "event_group_id": "1.101.8",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.62",
    "name": "A Sevastova vs A Petkovic",
    "seasons": "2017-2018",
    "start_time": moment().add(13, 'days').unix() * 1000,
    "event_group_id": "1.101.8",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  //Baseball Group 3
  {
    "id": "1.103.63",
    "name": "E Vesnina vs F Stollar",
    "seasons": "2017-2018",
    "start_time": moment().add(9, 'days').unix() * 1000,
    "event_group_id": "1.101.9",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.64",
    "name": "A Riske vs D Gavrilova",
    "seasons": "2017-2018",
    "start_time": moment().add(12, 'days').unix() * 1000,
    "event_group_id": "1.101.9",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.65",
    "name": "M Lucic-Baroni vs M Barthel",
    "seasons": "2017-2018",
    "start_time": moment().add(12, 'days').unix() * 1000,
    "event_group_id": "1.101.9",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.66",
    "name": "K Bondarenko vs K Bertens",
    "seasons": "2017-2018",
    "start_time": moment().add(5, 'days').unix() * 1000,
    "event_group_id": "1.101.9",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  {
    "id": "1.103.67",
    "name": "O Jabeur vs M Linette",
    "seasons": "2017-2018",
    "start_time": moment().add(7, 'days').unix() * 1000,
    "event_group_id": "1.101.9",
    "status": "Upcoming",
    "scores": ["0", "0"],
    "is_live_market": false
  },
  //For Resolved Bets
  //American Football
  {
    "id": "1.103.68",
    "name": "Carolina Panthers vs Denver Broncos",
    "seasons": "2017-2018",
    "start_time": moment().subtract(1, 'days').unix() * 1000,
    "event_group_id": "1.101.1",
    "status": "Completed",
    "scores": ["36", "19"],
    "is_live_market": false
  },
  {
    "id": "1.103.69",
    "name": "Tampa Bay Buccaneers vs Atlanta Falcons",
    "seasons": "2017-2018",
    "start_time": moment().subtract(2, 'days').unix() * 1000,
    "event_group_id": "1.101.1",
    "status": "Completed",
    "scores": ["36", "19"],
    "is_live_market": false
  },
  {
    "id": "1.103.70",
    "name": "Minnesota Vikings vs Tennessee Titans",
    "seasons": "2017-2018",
    "start_time": moment().subtract(3, 'days').unix() * 1000,
    "event_group_id": "1.101.1",
    "status": "Completed",
    "scores": ["36", "19"],
    "is_live_market": false
  },
  {
    "id": "1.103.71",
    "name": "Cleveland Browns vs Philadelphia Eagles",
    "seasons": "2017-2018",
    "start_time": moment().subtract(3, 'days').unix() * 1000,
    "event_group_id": "1.101.1",
    "status": "Completed",
    "scores": ["36", "19"],
    "is_live_market": false
  },
  {
    "id": "1.103.72",
    "name": "Cincinnati Bengals vs New York Jets",
    "seasons": "2017-2018",
    "start_time": moment().subtract(2, 'days').unix() * 1000,
    "event_group_id": "1.101.1",
    "status": "Completed",
    "scores": ["36", "19"],
    "is_live_market": false
  },
  //Basketball
  {
    "id": "1.103.73",
    "name": "Bourg-en-Bresse vs Boulogne-sur-Mer",
    "seasons": "2017-2018",
    "start_time": moment().subtract(1, 'days').unix() * 1000,
    "event_group_id": "1.101.4",
    "status": "Completed",
    "scores": ["36", "19"],
    "is_live_market": false
  },
  {
    "id": "1.103.74",
    "name": "Vichy vs Saint-Quentin",
    "seasons": "2017-2018",
    "start_time": moment().subtract(2, 'days').unix() * 1000,
    "event_group_id": "1.101.4",
    "status": "Completed",
    "scores": ["36", "19"],
    "is_live_market": false
  },
  //Baseball
  {
    "id": "1.103.75",
    "name": "Washington Nationals vs Atlanta Braves",
    "seasons": "2017-2018",
    "start_time": moment().subtract(2, 'days').unix() * 1000,
    "event_group_id": "1.101.7",
    "status": "Completed",
    "scores": ["36", "19"],
    "is_live_market": false
  },
  {
    "id": "1.103.76",
    "name": "New York Mets vs Pittsburgh Pirates",
    "seasons": "2017-2018",
    "start_time": moment().subtract(1, 'days').unix() * 1000,
    "event_group_id": "1.101.7",
    "status": "Completed",
    "scores": ["36", "19"],
    "is_live_market": false
  },
  //Resolved Bets Ends
];

//TODO: add more in this list, pay attention on the relation with the sports, competitors, event group dummy data

export default events;
