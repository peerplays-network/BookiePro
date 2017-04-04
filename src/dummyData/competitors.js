import _ from 'lodash';
import Immutable from 'immutable';

const competitors = [
  {
    id: '1.102.1',
    sport_id: '1.100.1',
    name: 'NY Giants'
  },
  {
    id: '1.102.2',
    sport_id: '1.100.1',
    name: 'Green Bay'
  },
  {
    id: '1.102.3',
    sport_id: '1.100.1',
    name: 'Seatle Seahawks'
  },
  {
    id: '1.102.4',
    sport_id: '1.100.2',
    name: 'Cleveland Cavaliers'
  },
  {
    id: '1.102.5',
    sport_id: '1.100.2',
    name: 'Golden State Wariors'
  },
  {
    id: '1.102.6',
    sport_id: '1.100.2',
    name: 'Oklahoma City Thunders'
  },
  {
    id: '1.102.7',
    sport_id: '1.100.1',
    name: 'Carolina Panthers'
  },
  {
    id: '1.102.8',
    sport_id: '1.100.1',
    name: 'Denver Broncos'
  },
  {
    id: '1.102.9',
    sport_id: '1.100.1',
    name: 'Tampa Bay Buccaneers'
  },
  {
    id: '1.102.10',
    sport_id: '1.100.1',
    name: 'Atlanta Falcons'
  },
  {
    id: '1.102.11',
    sport_id: '1.100.1',
    name: 'Minnesota Vikings'
  },
  {
    id: '1.102.12',
    sport_id: '1.100.1',
    name: 'Tennessee Titans'
  },
  {
    id: '1.102.13',
    sport_id: '1.100.1',
    name: 'Cleveland Browns'
  },
  {
    id: '1.102.14',
    sport_id: '1.100.1',
    name: 'Philadelphia Eagles'
  },
  {
    id: '1.102.15',
    sport_id: '1.100.1',
    name: 'Cincinnati Bengals'
  },
  {
    id: '1.102.16',
    sport_id: '1.100.1',
    name: 'New York Jets'
  },
  {
    id: '1.102.17',
    sport_id: '1.100.1',
    name: 'Oakland Raiders'
  },
  {
    id: '1.102.18',
    sport_id: '1.100.1',
    name: 'New Orleans Saints'
  },
  {
    id: '1.102.19',
    sport_id: '1.100.1',
    name: 'San Diego Chargers'
  },
  {
    id: '1.102.20',
    sport_id: '1.100.1',
    name: 'Kansas City Chiefs'
  },
  //baseball
  {
    id: '1.102.21',
    sport_id: '1.100.3',
    name: 'Miami Marlins'
  },
  {
    id: '1.102.22',
    sport_id: '1.100.3',
    name: 'Washington Nationals'
  },
  {
    id: '1.102.23',
    sport_id: '1.100.3',
    name: 'Atlanta Braves'
  },
  {
    id: '1.102.24',
    sport_id: '1.100.3',
    name: 'New York Mets'
  },
  {
    id: '1.102.25',
    sport_id: '1.100.3',
    name: 'Pittsburgh Pirates'
  },
  {
    id: '1.102.26',
    sport_id: '1.100.3',
    name: 'Boston Red Sox'
  },
  {
    id: '1.102.27',
    sport_id: '1.100.3',
    name: 'Colorado Rockies'
  },
  {
    id: '1.102.28',
    sport_id: '1.100.3',
    name: 'Milwaukee Brewers'
  },
  {
    id: '1.102.29',
    sport_id: '1.100.3',
    name: 'Toronto Blue Jays'
  },
  {
    id: '1.102.30',
    sport_id: '1.100.3',
    name: 'Baltimore Orioles'
  },
  {
    id: '1.102.31',
    sport_id: '1.100.3',
    name: 'San Diego Padres'
  },
  {
    id: '1.102.32',
    sport_id: '1.100.3',
    name: 'Los Angeles Dodgers'
  },
  {
    id: '1.102.33',
    sport_id: '1.100.3',
    name: 'Kansas City Royals'
  },
  {
    id: '1.102.34',
    sport_id: '1.100.3',
    name: 'Minnesota Twins'
  },
  {
    id: '1.102.35',
    sport_id: '1.100.3',
    name: 'Detroit Tigers'
  },
  {
    id: '1.102.36',
    sport_id: '1.100.3',
    name: 'Chicago White Sox'
  },
  {
    id: '1.102.37',
    sport_id: '1.100.3',
    name: 'Philadelphia Phillies'
  },
  {
    id: '1.102.38',
    sport_id: '1.100.3',
    name: 'Cincinnati Reds'
  },
  {
    id: '1.102.39',
    sport_id: '1.100.3',
    name: 'Cleveland Indians'
  },
  {
    id: '1.102.40',
    sport_id: '1.100.3',
    name: 'Texas Rangers'
  },
  //soccer
  {
    id: '1.102.41',
    sport_id: '1.100.4',
    name: 'Southern District'
  }, 
  {
    id: '1.102.42',
    sport_id: '1.100.4',
    name: 'Hong Kong Rangers'
  }, 
  {
    id: '1.102.43',
    sport_id: '1.100.4',
    name: 'Erchim FC'
  }, 
  {
    id: '1.102.44',
    sport_id: '1.100.4',
    name: 'Kigwancha SC'
  }, 
  {
    id: '1.102.45',
    sport_id: '1.100.4',
    name: 'E Suburbs Brisbane'
  }, 
  {
    id: '1.102.46',
    sport_id: '1.100.4',
    name: 'Ipswich Knights'
  }, 
  {
    id: '1.102.47',
    sport_id: '1.100.4',
    name: 'Felda Utd'
  }, 
  {
    id: '1.102.48',
    sport_id: '1.100.4',
    name: 'Ceres La Salle'
  }, 
  {
    id: '1.102.49',
    sport_id: '1.100.4',
    name: 'Mitchelton FC'
  }, 
  {
    id: '1.102.50',
    sport_id: '1.100.4',
    name: 'Brisbane Knights FC'
  }, 
  {
    id: '1.102.51',
    sport_id: '1.100.4',
    name: 'Logan Lightning FC'
  }, 
  {
    id: '1.102.52',
    sport_id: '1.100.4',
    name: 'Capalaba FC'
  }, 
  {
    id: '1.102.53',
    sport_id: '1.100.4',
    name: 'Uni of Queensland'
  }, 
  {
    id: '1.102.54',
    sport_id: '1.100.4',
    name: 'Ipswich City FC'
  }, 
  {
    id: '1.102.55',
    sport_id: '1.100.4',
    name: 'Southside Eagles SC'
  }, 
  {
    id: '1.102.56',
    sport_id: '1.100.4',
    name: 'Brisbane Force'
  }, 
  {
    id: '1.102.57',
    sport_id: '1.100.4',
    name: 'Moreton Bay Jets FC'
  }, 
  {
    id: '1.102.58',
    sport_id: '1.100.4',
    name: 'Western Pride FC'
  }, 
  {
    id: '1.102.59',
    sport_id: '1.100.4',
    name: 'Brisbane Strikers'
  }, 
  {
    id: '1.102.60',
    sport_id: '1.100.4',
    name: 'Sunshine Coast FC'
  },

];

//TODO: add more of this, please follow sport_id from sports dummy data

const immutableCompetitors = _.map(competitors, competitor => Immutable.fromJS(competitor));
export default immutableCompetitors;
