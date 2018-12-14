import {ChainTypes} from 'peerplaysjs-lib';
import moment from 'moment-timezone';

class TournamentSortService {
  /**
   * Sort tournament list
   *
   * @param {Immutable.List} list
   * @param {string} sortColumn
   * @param {string} sortDirection
   * @param {Immutable.Map} account
   * @returns {*}
   */
  static sortTournamentList(list, sortColumn, sortDirection, account) {
    switch (sortColumn) {
      case 'id':
        list = list.sortBy((tournament) => {
          let id = parseFloat(tournament.get('id')
            .replace('1.' + ChainTypes.object_type.tournament + '.', ''));

          if (sortDirection === 'desc') {
            return -id;
          } else {
            return +id;
          }
        });
        break;
      case 'buy_in':
        list = list.sortBy((tournament) => {
          let buy_in = tournament.getIn(['options', 'buy_in', 'amount']);

          if (sortDirection === 'desc') {
            return -buy_in;
          } else {
            return +buy_in;
          }
        });
        break;
      case 'registered_players':
        list = list.sortBy((tournament) => {
          let registered_players = tournament.get('registered_players');

          if (sortDirection === 'desc') {
            return -registered_players;
          } else {
            return +registered_players;
          }
        });
        break;
      case 'open':
        function getStartTime(tournament) {
          let start_delay = tournament.getIn(['options', 'start_delay']),
            start_time = tournament.getIn(['options', 'start_time']);

          if (tournament.getIn(['start_time'])) {
            start_time = tournament.getIn(['start_time']);
          }

          let checkFiled = start_time ? moment(start_time).format('x') : start_delay;

          return checkFiled;
        }

        list = list.sort((tournamentA, tournamentB) => {
          let tournamentStateA = tournamentA.get('state'),
            tournamentStateB = tournamentB.get('state'),
            iAmIsRegA = !!tournamentA.getIn(['tournament_details', 'registered_players'])
              .find((player) => {
                return player === account.get('id');
              }),
            iAmIsRegB = !!tournamentB.getIn(['tournament_details', 'registered_players'])
              .find((player) => {
                return player === account.get('id');
              });

          let startTimeA = getStartTime(tournamentA),
            startTimeB = getStartTime(tournamentB);
          /**
           * From whiteList
           */
          let whitelistA = tournamentA.getIn(['options', 'whitelist']);
          let whitelistB = tournamentB.getIn(['options', 'whitelist']);
          let canPlayA = true;

          if (whitelistA.size > 0) {
            let fWhitePlayerA = !!whitelistA.find((player) => {
              return player === account.get('id');
            });

            if (!fWhitePlayerA) {
              canPlayA = false;
            }
          }

          let canPlayB = true;

          if (whitelistB.size > 0) {
            let fWhitePlayerB = !!whitelistB.find((player) => {
              return player === account.get('id');
            });

            if (!fWhitePlayerB) {
              canPlayB = false;
            }
          }

          if (sortDirection === 'desc') {
            return ((tournamentStateA === 'concluded') - (tournamentStateB === 'concluded'))
              || (iAmIsRegA - iAmIsRegB)
              || (canPlayB - canPlayA)
              || ((startTimeA > startTimeB) - (startTimeB > startTimeA));
          } else {

            return ((tournamentStateB === 'concluded') - (tournamentStateA === 'concluded'))
            || (iAmIsRegB - iAmIsRegA)
            || (canPlayA - canPlayB)
            || (startTimeA < startTimeB) - (startTimeB < startTimeA);
          }
        });
        break;
      case 'prize':
        list = list.sortBy((tournament) => {
          let prize_pool = tournament.getIn(['prize_pool']);

          if (sortDirection === 'desc') {
            return -prize_pool;
          } else {
            return +prize_pool;
          }
        });
        break;
      case 'creator_account_name':
        list = list.sort((a, b) => {
          let creator_account_nameA = a.get('creator_account_name'),
            creator_account_nameB = b.get('creator_account_name');

          if (sortDirection === 'desc') {
            if (creator_account_nameA > creator_account_nameB) {
              return -1;
            }

            if (creator_account_nameB > creator_account_nameA) {
              return 1;
            }
          } else {
            if (creator_account_nameA < creator_account_nameB) {
              return -1;
            }

            if (creator_account_nameB < creator_account_nameA) {
              return 1;
            }
          }

          return 0;
        });
        break;
      case 'registration_deadline':
        list = list.sortBy((tournament) => {
          let timeX = moment(tournament.getIn(['options', 'registration_deadline'])).format('x');

          if (sortDirection === 'desc') {
            return -timeX;
          } else {
            return +timeX;
          }
        });
        break;
      case 'start_time':
        list = list.sortBy((tournament) => {
          let start_delay = tournament.getIn(['options', 'start_delay']),
            start_time = tournament.getIn(['options', 'start_time']);

          if (tournament.getIn(['start_time'])) {
            start_time = tournament.getIn(['start_time']);
          }

          let checkFiled = start_time ? moment(start_time).format('x') : start_delay;

          if (sortDirection === 'desc') {
            return -checkFiled;
          } else {
            return +checkFiled;
          }
        });
        break;
    }

    return list;
  }
}

export default TournamentSortService;