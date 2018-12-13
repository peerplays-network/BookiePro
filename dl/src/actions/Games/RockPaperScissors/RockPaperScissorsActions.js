import RockPaperScissorsConstants from 'constants/Games/RockPaperScissors/RockPaperScissorsConstants'; // eslint-disable-line
import Repository from 'repositories/chain/repository';
import utils from 'common/utils';
import {clearTransaction} from 'actions/RTransactionConfirmActions';
import WalletApi from 'rpc_api/WalletApi';
import {ChainTypes,ChainStore} from 'peerplaysjs-lib';
import {reset} from 'redux-form';
import Immutable from 'immutable';
import TimeHelper from 'helpers/TimeHelper';
import RWalletUnlockNewActions from 'actions/RWalletUnlockNewActions';
import RPSTransactionService from 'services/RPS/TransactionService';
import TournamentSortService from 'services/Tournament/TournamentSortService';
import TournamentTransactionService from 'services/Tournament/TournamentTransactionService';
import RockPaperScissorsNavigateActions from 'actions/Games/RockPaperScissors/RockPaperScissorsNavigateActions'; // eslint-disable-line
import iDB from 'idb-instance';
import idb_helper from 'idb-helper';

import {
  WD_UPDATE_REVEAL_MOVES_WALLET
} from 'constants/ActionTypes';
let tournament_object_type = parseInt(ChainTypes.object_type.tournament, 10);
let tournament_prefix = '1.' + tournament_object_type + '.';

let wallet_api = new WalletApi(); // eslint-disable-line

/**
 * Private Redux Action Creator (GAME_RPS_CHANGE_TAB_PARAMS)
 * @param data
 * @returns {{type: string, payload: {tab, tournamentsFilter}}}
 */
function changeTabParamsAction(data) {
  return {
    type: RockPaperScissorsConstants.GAME_RPS_CHANGE_TAB_PARAMS,
    payload: {
      tab: data.tab,
      tournamentsFilter: data.tournamentsFilter
    }
  };
}

/**
 * Private Redux Action Creator (GAME_RPS_SET_DASHBOARD_LIST)
 * @param data
 * @returns {{type: string, payload: {dashboardList: (*|List<T>|List<any>)}}}
 */
function setDashboardListAction(data) {
  return {
    type: RockPaperScissorsConstants.GAME_RPS_SET_DASHBOARD_LIST,
    payload: {
      dashboardList: data.dashboardList
    }
  };
}

/**
 * Private Redux Action Creator (GAME_RPS_SET_FIND_LIST)
 * @param data
 * @returns {{type: string, payload: {findList: (*|List<T>|List<any>), findDropDownCurrent, findDropDownItems: (*|List<T>|List<any>)}}}
 */
function setFindListAction(data) {
  return {
    type: RockPaperScissorsConstants.GAME_RPS_SET_FIND_LIST,
    payload: {
      findList: data.findList,
      findDropDownCurrent: data.findDropDownCurrent,
      findDropDownItems: data.findDropDownItems
    }
  };
}

/**
 * Private Redux Action Creator (GAME_RPS_SET_EXPLORE_LIST)
 * @param data
 * @returns {{type: string, payload: {exploreList: *, exploreDropDownCurrent, exploreDropDownItems: (*|List<T>|List<any>)}}}
 */
function setExploreListAction(data) {
  return {
    type: RockPaperScissorsConstants.GAME_RPS_SET_EXPLORE_LIST,
    payload: {
      exploreList: data.exploreList,
      exploreDropDownCurrent: data.exploreDropDownCurrent,
      exploreDropDownItems: data.exploreDropDownItems
    }
  };
}

/**
 * Private Redux Action Creator (GAME_RPS_SET_FIND_DD_CURRENT)
 * @param data
 * @returns {{type: string, payload: {findDropDownCurrent}}}
 */
function setFindDDCurrentAction(data) {
  return {
    type: RockPaperScissorsConstants.GAME_RPS_SET_FIND_DD_CURRENT,
    payload: {
      findDropDownCurrent: data.findDropDownCurrent
    }
  };
}

/**
 * Private Redux Action Creator (GAME_RPS_SET_EXPLORE_DD_CURRENT)
 * @param data
 * @returns {{type: string, payload: {exploreDropDownCurrent}}}
 */
function setExploreDDCurrentAction(data) {
  return {
    type: RockPaperScissorsConstants.GAME_RPS_SET_EXPLORE_DD_CURRENT,
    payload: {
      exploreDropDownCurrent: data.exploreDropDownCurrent
    }
  };
}

/**
 * Private Redux Action Creator (GAME_RPS_SET_EXPLORE_SORT)
 * @param data
 * @returns {{type: string, payload: {exploreSortColumn: (*|string|string), exploreSortDirection: (*|string|string)}}}
 */
function setSortExploreByAction(data) {
  return {
    type: RockPaperScissorsConstants.GAME_RPS_SET_EXPLORE_SORT,
    payload: {
      exploreSortColumn: data.exploreSortColumn,
      exploreSortDirection: data.exploreSortDirection
    }
  };
}

/**
 * Private Redux Action Creator (GAME_RPS_SET_EXPLORE_PAGE)
 * @param data
 * @returns {{type: string, payload: {explorePage: (*|number)}}}
 */
function setExplorePageAction(data) {
  return {
    type: RockPaperScissorsConstants.GAME_RPS_SET_EXPLORE_PAGE,
    payload: {
      explorePage: data.explorePage
    }
  };
}

/**
 * Private Redux Action Creator (GAME_RPS_SET_EXPLORE_COUNT_PAGES)
 * @param data
 * @returns {{type: string, payload: {exploreCountPages: (*|number)}}}
 */
function setExploreCountPagesAction(data) {
  return {
    type: RockPaperScissorsConstants.GAME_RPS_SET_EXPLORE_COUNT_PAGES,
    payload: {
      exploreCountPages: data.exploreCountPages
    }
  };
}

/**
 * Create tab
 */

/**
 * Private Redux Action Creator (GAME_RPS_SET_AVAILABLE_UNITS)
 * @param data
 * @returns {{type: string, payload: {unitList, unit}}}
 */
function setAvailableUnitsAction(data) {

  return {
    type: RockPaperScissorsConstants.GAME_RPS_SET_AVAILABLE_UNITS,
    payload: {
      unitList: data.unitList,
      unit: data.unit
    }
  };
}


/**
 *
 * Game page
 */
/**
 * Private Redux Action Creator (GAME_RPS_SET_ACTIVE_GAME)
 * @param data
 * @returns {{type: string, payload: {activeGameId, match, games, players, start_time, status}}}
 */
function setActiveGameAction(data) {
  return {
    type: RockPaperScissorsConstants.GAME_RPS_SET_ACTIVE_GAME,
    payload: {
      activeGameId: data.activeGameId,
      match: data.match,
      games: data.games,
      players: data.players,
      start_time: data.start_time,
      status: data.status
    }
  };
}

/**
 * Private Redux Action Creator (GAME_RPS_SET_GAME)
 * @param data
 * @returns {{type: string, payload: {match, activeGameId, players, games, status}}}
 */
function setGameAction(data) {
  return {
    type: RockPaperScissorsConstants.GAME_RPS_SET_GAME,
    payload: {
      match: data.match,
      activeGameId: data.activeGameId,
      players: data.players,
      games: data.games,
      status: data.status
    }
  };
}

/**
 * Private Redux Action Creator (GAME_RPS_SET_AWAITING_GAME_START)
 * @param data
 * @returns {{type: string, payload: {activeGameId, start_time, status}}}
 */
function setAwaitingGameStartAction(data) {
  return {
    type: RockPaperScissorsConstants.GAME_RPS_SET_AWAITING_GAME_START,
    payload: {
      activeGameId: data.activeGameId,
      start_time: data.start_time,
      status: data.status
    }
  };
}

/**
 * Private Redux Action Creator (GAME_RPS_SET_CONCLUDED_GAME_START)
 * @param data
 * @returns {{type: string, payload: {activeGameId, start_time, end_time, status, matchList: (*|List<T>|List<any>)}}}
 */
function setConcludedGameStartAction(data) {
  return {
    type: RockPaperScissorsConstants.GAME_RPS_SET_CONCLUDED_GAME_START,
    payload: {
      activeGameId: data.activeGameId,
      start_time: data.start_time,
      end_time: data.end_time,
      status: data.status,
      matchList: data.matchList
    }
  };
}

let subscribers = {
  dashboard: null,
  explore: null,
  find: null,
  rps: null,
  create: null
};

let currentLastTournamentId = null;
let currentLastTournamentPage = null;

class RockPaperScissorsActions {

  /**
   * change tab action
   *
   * @param data Object
   * @returns {Function}
   */
  static changeTabParams(data) {

    return (dispatch) => {

      dispatch(changeTabParamsAction({
        tab: data.tab,
        tournamentsFilter: data.tournamentsFilter
      }));

    };
  }

  /**
   * Subscribe page
   *
   * @param tab String
   * @returns {Function}
   */
  static subscribe(tab) {

    return (dispatch, getState) => {

      let subscriber = function (dispatch, getState) {
        return () => {

          switch (tab) {
            case 'dashboard':

              dispatch(RockPaperScissorsActions.fetchDashboardTournaments());

              break;
            case 'find':

              dispatch(RockPaperScissorsActions.fetchFindTournaments());

              break;
            case 'explore':

              dispatch(RockPaperScissorsActions.fetchExploreTournaments());

              break;
            case 'rps':

              let state = getState();

              if (state.rockPaperScissorsReducer.activeGameId) {
                dispatch(RockPaperScissorsActions
                  .setGame(state.rockPaperScissorsReducer.activeGameId));
              }

              break;
            case 'create':

              dispatch(RockPaperScissorsActions.fetchAvailableUnits());

              break;

          }

        };
      };

      subscribers[tab] = subscriber(dispatch, getState);

      ChainStore.subscribe(subscribers[tab]);
    };
  }

  /**
   * Unsubscribe page
   *
   * @param tab String
   * @returns {Function}
   */

  static unSubscribe(tab) {

    return () => {

      ChainStore.unsubscribe(subscribers[tab]);

      delete subscribers[tab];
    };
  }



  /**
   * Join to game (register)
   *
   * @param tournamentId String
   * @returns {Function}
   */
  static joinToTournament(tournamentId) {

    return (dispatch, getState) => {

      let state = getState(),
        results = {
          account: null,
          tournament: null
        };

      Repository.getAccount(state.app.account).then((account) => {

        results['account'] = account;

        return account;
      }).then(() => {
        return Repository.fetchObject(tournamentId);
      }).then((tournament) => {

        results['tournament'] = tournament;

        if (!tournament) {
          return Promise.reject('Error');
        }

        return Repository.getAsset(tournament.getIn(['options', 'buy_in', 'asset_id']));
      }).then((asset) => {

        let tournament = results['tournament'],
          account = results['account'],
          accountJs = account.toJS(),
          operationJSON = {
            'fee': {
              amount: 0,
              asset_id: asset.get('id')
            },
            'payer_account_id': account.get('id'),
            'player_account_id': account.get('id'),
            'tournament_id': tournament.get('id'),
            'buy_in': tournament.getIn(['options', 'buy_in']).toJS(),
            'extensions': null
          };


        TournamentTransactionService.joinToTournament(
          operationJSON, accountJs, asset.toJS(), () => {}).then((trFnc) => {
          dispatch(trFnc);
        });
      }).catch(() => {
      });
    };
  }

  /**
   * register in last account game
   *
   * @param accountId String
   * @returns {Function}
   */
  static joinToLastTournament(accountId) {

    return (dispatch) => {
      /**
       * Todo: refactor without callback hell
       */
      Repository.getAccount(accountId).then((account) => {
        Repository.getTournamentIdsInStateDirectly(accountId, 'accepting_registrations')
          .then((results) => {
            let maxId = 0,
              maxElement;
            results.forEach((element) => {
              let id = parseFloat(
                element.id.replace('1.' + ChainTypes.object_type.tournament + '.', '')
              );

              if (id > maxId) {
                maxId = id;
                maxElement = element;
              }

            });

            if (maxElement) {
            /**
             * Clear a previous transaction
             */
              dispatch(clearTransaction());

              let operationJSON = {
                'fee': {
                  amount: 0,
                  asset_id: maxElement.options.buy_in.asset_id
                },
                'payer_account_id': account.get('id'),
                'player_account_id': account.get('id'),
                'tournament_id': maxElement.id,
                'buy_in': maxElement.options.buy_in,
                'extensions': null
              };

              Promise.all(
                [Repository.getAccount(account.get('id')),
                  Repository.getAsset(operationJSON.buy_in.asset_id)]
              ).then((data) => {

                if (data[0] && data[1]) {
                  let payer = data[0].toJS(),
                    asset = data[1].toJS(),
                    operationJSON = {
                      'fee': {
                        amount: 0,
                        asset_id: maxElement.options.buy_in.asset_id
                      },
                      'payer_account_id': account.get('id'),
                      'player_account_id': account.get('id'),
                      'tournament_id': maxElement.id,
                      'buy_in': maxElement.options.buy_in,
                      'extensions': null
                    };

                  TournamentTransactionService.joinToTournament(operationJSON, payer, asset, () => {
                    dispatch(RockPaperScissorsNavigateActions.navigateToDashboardTournaments());
                  }).then((trFnc) => {
                    dispatch(trFnc);
                  });
                }
              });
            }
          }).catch((err) => {
            console.log('err', err);
          });
      });
    };
  }

  /**
   * Create game
   *
   * @param data Object
   * @returns {Function}
   */
  static createTournament(data) {
    return (dispatch, getState) => {

      /**
       * Todo: refactor without callback hell
       */
      Repository.getAsset(data.buy_in_asset_symbol).then((asset) => {
        let precision = utils.get_asset_precision(asset.get('precision')),
          buy_in_in_satoshis = parseInt(data.buy_in_amount * precision, 10);
        let state = getState();
        Repository.getAccount(state.app.account).then((account) => {
          let whiteListNames = [];

          if (data.whitelist && data.whitelist.length) {
            data.whitelist.forEach((item) => {
              whiteListNames.push(item.id);
            });
          }

          let operationJSON = {
            'fee': {
              amount: 0,
              asset_id: asset.get('id')
            },
            'creator': account.get('id'),
            'options': {
              'registration_deadline': data.registration_deadline,
              'number_of_players': data.number_of_players,
              'buy_in': {
                amount: buy_in_in_satoshis,
                asset_id: asset.get('id')
              },
              'whitelist': whiteListNames,
              'start_delay': data.start_delay,
              'round_delay': data.round_delay,
              'number_of_wins': data.number_of_wins,
              'meta': undefined,
              'game_options': [0, {
                'insurance_enabled': data.insurance_enabled,
                'time_per_commit_move': data.time_per_commit_move,
                'time_per_reveal_move': data.time_per_reveal_move,
                'number_of_gestures': 3
              }]
            },
            'extensions': null
          };
          Promise.all(
            [Repository.getAccount(operationJSON.creator),
              Repository.getAsset(operationJSON.options.buy_in.asset_id)]
          ).then(([payer, asset]) => {

            if (payer && asset) {
              payer = payer.toJS();
              asset = asset.toJS();

              if (!data.start_delay) {
                operationJSON.options.start_time = data.start_time;
              }

              TournamentTransactionService.createTournament(
                operationJSON, data.whitelist, payer, asset, () => {
                  dispatch(reset('rockPaperScissorsCreateForm'));

                  switch (data.action_type) {
                    case 'create':
                      dispatch(RockPaperScissorsNavigateActions.navigateToOpenTournaments());
                      break;
                    case 'create_and_join':
                      dispatch(RockPaperScissorsActions.joinToLastTournament(state.app.account));
                      break;
                  }
                }).then((trFnc) => {
                dispatch(trFnc);
              });
            }
          });
        });
      });
    };
  }


  /**
   * get data for Explore page
   *
   * @returns {Function}
   */
  static fetchExploreTournaments(page = null) {
    return (dispatch, getState) => {
      let state = getState();
      let currentPage = state.rockPaperScissorsReducer.explorePage,
        exploreCountPerPage = state.rockPaperScissorsReducer.exploreCountPerPage,
        exploreCountPages = state.rockPaperScissorsReducer.exploreCountPages,
        currentExploreList = state.rockPaperScissorsReducer.exploreList;
      let results = {
          account: null,
          last: null,
          first: null
        },
        countPages = 1;

      Repository.getAccount(state.app.accountId).then((account) => {
        results['account'] = account;
        return account;
      }).then(() => {
        return Repository.getLastTournamentId();
      }).then((lastTournamentId) => {

        if (!lastTournamentId) {
          return Promise.reject();
        }

        let shortLastTournamentId = parseFloat(
          lastTournamentId.substring(tournament_prefix.length)
        );
        /**
         *  + 1 for zero (1.16.0)
         */
        countPages = Math.max(Math.ceil((shortLastTournamentId + 1) / exploreCountPerPage), 1);

        if (!page) {
          page = currentPage;
        }

        if (countPages < page) {
          page = countPages;
        }

        if (currentPage !== page) {
          dispatch(setExplorePageAction({
            explorePage: page
          }));
        }

        if (exploreCountPages !== countPages) {
          dispatch(setExploreCountPagesAction({
            exploreCountPages: countPages
          }));
        }

        let last = tournament_prefix + Math.max(
            (shortLastTournamentId - exploreCountPerPage * page) + 1, 0
          ), first = tournament_prefix + (shortLastTournamentId - exploreCountPerPage * (page - 1));

        results['first'] = first;
        results['last'] = last;

        /**
         * Cache
         */
        if (
          currentLastTournamentId === lastTournamentId
          && currentLastTournamentPage === page
          && currentExploreList.size
        ) {
          currentLastTournamentPage = page;
          let promiseTournamentsList = [];
          currentExploreList.forEach((tournament) => {
            promiseTournamentsList.push(Repository.fetchObject(tournament.get('id')));
          });

          return Promise.all(promiseTournamentsList);
        } else {
          currentLastTournamentPage = page;

          return Repository.getTournaments(last, exploreCountPerPage, first).then((results) => {
            currentLastTournamentId = lastTournamentId;
            return results;
          });
        }
      }).then((objects) => {
        /**
         * Temp fix
         * TODO:: rm
         */
        if (results['first'] === results['last']) {
          objects = objects.filter((object) => {
            return object.get('id') === results['first'];
          });
        }

        let promises = [],
          promisesAssets = [],
          promisesCreators = [],
          addedAssets = {},
          account = results['account'],
          creatorsIdsHash = {};

        /**
         * Details, Creators
         */
        objects.forEach((obj) => {
          let item = obj.toJS();
          promises.push(Repository.fetchObject(item.tournament_details_id));

          if (!creatorsIdsHash[item.creator]) {
            creatorsIdsHash[item.creator] = true;
            promisesCreators.push(Repository.getAccount(item.creator));
          }


          if (!addedAssets[item.options.buy_in.asset_id]) {
            addedAssets[item.options.buy_in.asset_id] = item.options.buy_in.asset_id;
            promisesAssets.push(Repository.fetchObject(item.options.buy_in.asset_id));
          }
        });

        account.get('balances').forEach((balanceItem, keyItem) => {

          if (!addedAssets[keyItem]) {
            addedAssets[keyItem] = keyItem;
            promisesAssets.push(Repository.fetchObject(keyItem));
          }
        });

        return Promise.all(
          [
            objects,
            Promise.all(promises),
            Promise.all(promisesAssets),
            Promise.all(promisesCreators)
          ]
        );
      }).then(([tournaments, details, assets, creators]) => {
        let detailsHash = {},
          assetsHash = {},
          exploreList = Immutable.List(),
          account = results['account'],
          exploreDropDownItems = Immutable.List(),
          exploreDropDownCurrent = state.rockPaperScissorsReducer.exploreDropDownCurrent,
          exploreDropDownItemsHash = {},
          creatorHash = {};
        assets.forEach((asset) => {
          assetsHash[asset.get('id')] = asset;
        });
        details.forEach((detail) => {
          detailsHash[detail.get('id')] = detail;
        });
        creators.forEach((creator) => {
          creatorHash[creator.get('id')] = creator;
        });
        account.get('balances').forEach((balanceItem, keyItem) => {
          let asset = assetsHash[keyItem];

          if (asset) {
            let obj = {
              id: asset.get('id'),
              symbol: asset.get('symbol')
            };

            exploreDropDownItems = exploreDropDownItems.push(Immutable.Map(obj));
            exploreDropDownItemsHash[asset.get('id')] = obj;
          }
        });

        if (exploreDropDownCurrent !== 'any' && !exploreDropDownItemsHash[exploreDropDownCurrent]) {
          exploreDropDownCurrent = 'any';
        }

        tournaments.forEach((tournament) => { // eslint-disable-line
          if (assetsHash[tournament.getIn(['options', 'buy_in', 'asset_id'])]) {
            tournament = tournament.setIn(
              ['options', 'buy_in', 'asset'],
              assetsHash[tournament.getIn(['options', 'buy_in', 'asset_id'])]
            );
          }

          if (creatorHash[tournament.getIn(['creator'])]) {
            tournament = tournament.setIn(
              ['creator_account_name'], creatorHash[tournament.getIn(['creator'])].get('name')
            );
          }

          tournament = tournament.setIn(
            ['options', 'registration_deadline'],
            TimeHelper.timeStringToDate(tournament.getIn(['options', 'registration_deadline']))
          );

          let detail = detailsHash[tournament.get('tournament_details_id')];

          if (detail) {
            if (
              exploreDropDownCurrent === 'any'
              || exploreDropDownCurrent === tournament.getIn(['options', 'buy_in', 'asset_id'])
            ) {
              exploreList = exploreList.push(
                tournament.set(
                  'tournament_details',
                  detailsHash[tournament.get('tournament_details_id')]
                )
              );
            }
          }
        });

        exploreList = TournamentSortService.sortTournamentList(
          exploreList,
          state.rockPaperScissorsReducer.exploreSortColumn,
          state.rockPaperScissorsReducer.exploreSortDirection,
          account
        );

        if (!exploreList.equals(state.rockPaperScissorsReducer.exploreList)
          || !exploreDropDownItems.equals(state.rockPaperScissorsReducer.exploreDropDownItems)
        ) {

          dispatch(setExploreListAction({
            exploreList: exploreList,
            exploreDropDownItems: exploreDropDownItems,
            exploreDropDownCurrent: exploreDropDownCurrent
          }));
        }
      });
    };
  }

  /**
   * change DropDown | Find page
   *
   * @param current String
   * @returns {Function}
   */
  static setFindDDCurrent(current) {
    return (dispatch) => {
      dispatch(setFindDDCurrentAction({
        findDropDownCurrent: current
      }));
      dispatch(RockPaperScissorsActions.fetchFindTournaments());
    };
  }

  /**
   * Change DropDown | Explore page
   * @param current String
   * @returns {Function}
   */
  static setExploreDDCurrent(current) {
    return (dispatch) => {
      dispatch(setExploreDDCurrentAction({
        exploreDropDownCurrent: current
      }));
      dispatch(RockPaperScissorsActions.fetchExploreTournaments());
    };
  }

  /**
   * Change sort | Explore page
   * @param field String
   * @returns {Function}
   */
  static setSortExploreBy(field) {
    return (dispatch, getState) => {
      let state = getState(),
        direction;

      if (state.rockPaperScissorsReducer.exploreSortColumn === field) {
        direction = (state.rockPaperScissorsReducer.exploreSortDirection === 'desc')
          ? 'asc'
          : 'desc';
      } else {
        direction = state.rockPaperScissorsReducer.exploreSortDirection;
      }

      dispatch(setSortExploreByAction({
        exploreSortColumn: field,
        exploreSortDirection: direction
      }));

      dispatch(RockPaperScissorsActions.fetchExploreTournaments());
    };
  }

  /**
   * Get data for Find page
   *
   * @returns {Function}
   */
  static fetchFindTournaments() {
    return (dispatch, getState) => {
      let state = getState();
      let results = {};
      Repository.getAccount(state.app.account).then((account) => {
        return account;
      }).then((account) => {
        results['account'] = account;

        return Promise.all([Repository.getTournamentIdsInState(null, 'accepting_registrations')]);
      }).then(([rawUpcomingTournamentIds]) => {
        let allUpcomingTournamentIds = rawUpcomingTournamentIds,
          promises = [];
        allUpcomingTournamentIds.forEach((id) => {
          promises.push(Repository.fetchObject(id));
        });

        return Promise.all(promises);
      }).then((objects) => {
        let promises = [],
          promisesAssets = [],
          addedAssets = {},
          account = results['account'];
        objects.forEach((obj) => {
          let item = obj.toJS();
          promises.push(Repository.fetchObject(item.tournament_details_id));

          if (!addedAssets[item.options.buy_in.asset_id]) {
            addedAssets[item.options.buy_in.asset_id] = item.options.buy_in.asset_id;
            promisesAssets.push(Repository.fetchObject(item.options.buy_in.asset_id));
          }
        });

        account.get('balances').forEach((balanceItem, keyItem) => {
          if (!addedAssets[keyItem]) {
            addedAssets[keyItem] = keyItem;
            promisesAssets.push(Repository.fetchObject(keyItem));
          }
        });

        return Promise.all([objects, Promise.all(promises), Promise.all(promisesAssets)]);
      }).then(([tournaments, details, assets]) => {
        let detailsHash = {},
          assetsHash = {},
          findList = Immutable.List(),
          account = results['account'],
          findDropDownItems = Immutable.List(),
          findDropDownCurrent = state.rockPaperScissorsReducer.findDropDownCurrent,
          findDropDownItemsHash = {};
        assets.forEach((asset) => {
          assetsHash[asset.get('id')] = asset;
        });
        details.forEach((detail) => {
          detailsHash[detail.get('id')] = detail;
        });
        account.get('balances').forEach((balanceItem, keyItem) => {
          let asset = assetsHash[keyItem];

          if (asset) {
            let obj = {
              id: asset.get('id'),
              symbol: asset.get('symbol')
            };
            findDropDownItems = findDropDownItems.push(Immutable.Map(obj));
            findDropDownItemsHash[asset.get('id')] = obj;
          }
        });

        if (findDropDownCurrent !== 'any' && !findDropDownItemsHash[findDropDownCurrent]) {
          findDropDownCurrent = 'any';
        }

        tournaments.forEach((tournament) => {
          if (assetsHash[tournament.getIn(['options', 'buy_in', 'asset_id'])]) {
            tournament = tournament.setIn(
              ['options', 'buy_in', 'asset'],
              assetsHash[tournament.getIn(['options', 'buy_in', 'asset_id'])]
            );
          }

          tournament = tournament.setIn(
            ['options', 'registration_deadline'],
            TimeHelper.timeStringToDate(tournament.getIn(['options', 'registration_deadline']))
          );
          let detail = detailsHash[tournament.get('tournament_details_id')];

          if (detail) {
            let registered_players = detail.get('registered_players');
            let needAdd = false;
            /**
             * From registered players
             */
            let fPlayer = registered_players.find((playerId) => {
              return playerId === results['account'].get('id');
            });

            if (
              !fPlayer
              && (
                findDropDownCurrent === 'any'
                || findDropDownCurrent === tournament.getIn(['options', 'buy_in', 'asset_id'])
              )
            ) {
              /**
               * From whiteList
               */
              let optionsImm = tournament.get('options'),
                options = optionsImm.toJS();

              if (options && options.whitelist.length) {
                let fWhitePlayer = options.whitelist.find((playerId) => {
                  return playerId === results['account'].get('id');
                });

                if (fWhitePlayer) {
                  needAdd = true;
                }
              } else {
                needAdd = true;
              }

              if (needAdd) {
                findList = findList.push(
                  tournament.set('tournament_details', detailsHash[
                    tournament.get('tournament_details_id')
                  ])
                );
              }
            }
          }
        });

        if (!findList.equals(state.rockPaperScissorsReducer.findList) ||
          !findDropDownItems.equals(state.rockPaperScissorsReducer.findDropDownItems)) {
          dispatch(setFindListAction({
            findList: findList,
            findDropDownItems: findDropDownItems,
            findDropDownCurrent: findDropDownCurrent
          }));
        }
      });
    };
  }

  /**
   * Get my games | Dashboard
   *
   * @returns {Function}
   */
  static fetchDashboardTournaments() {
    return (dispatch, getState) => {
      let state = getState(),
        results = {};
      Repository.getAccount(state.app.account).then((account) => {
        return account;
      }).then((account) => {
        results['account'] = account;

        return Promise.all(
          [
            Repository.getTournamentIdsInState(null, 'accepting_registrations'),
            Repository.getTournamentIdsInState(null, 'awaiting_start'),
            Repository.getTournamentIdsInState(null, 'in_progress')
          ]
        );
      }).then(
        ([rawUpcomingTournamentIds, rawTournamentIdsAwaitingStart, rawTournamentIdsInProgress]) => {
          let allUpcomingTournamentIds = rawUpcomingTournamentIds.union(
              rawTournamentIdsAwaitingStart
            ), promises = [];
          allUpcomingTournamentIds = allUpcomingTournamentIds.union(rawTournamentIdsInProgress);
          allUpcomingTournamentIds.forEach((id) => {
            promises.push(Repository.fetchObject(id));
          });

          return Promise.all(promises);
        }).then((objects) => {

        let promises = [],
          promisesAssets = [],
          addedAssets = {};
        objects.forEach((obj) => {
          let item = obj.toJS();
          promises.push(Repository.fetchObject(item.tournament_details_id));

          if (!addedAssets[item.options.buy_in.asset_id]) {
            addedAssets[item.options.buy_in.asset_id] = item.options.buy_in.asset_id;
            promisesAssets.push(Repository.fetchObject(item.options.buy_in.asset_id));
          }
        });

        return Promise.all([objects, Promise.all(promises), Promise.all(promisesAssets)]);
      }).then(([tournaments, details, assets]) => {
        let detailsHash = {},
          assetsHash = {},
          dashboardList = Immutable.List();
        assets.forEach((asset) => {
          assetsHash[asset.get('id')] = asset;
        });
        details.forEach((detail) => {
          detailsHash[detail.get('id')] = detail;
        });
        tournaments.forEach((tournament) => {
          if (assetsHash[tournament.getIn(['options', 'buy_in', 'asset_id'])]) {
            tournament = tournament.setIn(
              ['options', 'buy_in', 'asset'],
              assetsHash[tournament.getIn(['options', 'buy_in', 'asset_id'])]
            );
          }

          tournament = tournament.setIn(
            ['options', 'registration_deadline'],
            TimeHelper.timeStringToDate(tournament.getIn(['options', 'registration_deadline']))
          );

          let detail = detailsHash[tournament.get('tournament_details_id')];

          if (detail) {
            let registered_players = detail.get('registered_players');
            let needAdd = false;

            /**
             * From registered players
             */
            let fPlayer = registered_players.find((playerId) => {
              return playerId === results['account'].get('id');
            });

            if (fPlayer) {
              needAdd = true;
            }

            /**
             * From whiteList
             */
            if (!needAdd) {
              let optionsImm = tournament.get('options'),
                options = optionsImm.toJS();

              if (options && options.whitelist.length) {
                let fWhitePlayer = options.whitelist.find((playerId) => {
                  return playerId === results['account'].get('id');
                });

                if (fWhitePlayer) {
                  needAdd = true;
                }
              }
            }

            if (needAdd) {
              dashboardList = dashboardList.push(
                tournament.set(
                  'tournament_details',
                  detailsHash[tournament.get('tournament_details_id')]
                )
              );
            }
          }
        });

        if (!dashboardList.equals(state.rockPaperScissorsReducer.dashboardList)) {
          dispatch(setDashboardListAction({
            dashboardList: dashboardList
          }));
        }
      });
    };
  }

  /**
   * Get my available assets | Create tab
   *
   * @returns {Function}
   */
  static fetchAvailableUnits() {
    return (dispatch, getState) => {
      let
        promisesAssets = [],
        promisesBalances = [],
        results = {},
        addedAssets = {};
      let state = getState();
      Repository.getAccount(state.app.account).then((account) => {
        results['account'] = account;
        account.get('balances').forEach((balanceItem, keyItem) => {
          if (!addedAssets[keyItem]) {
            addedAssets[keyItem] = keyItem;
            promisesAssets.push(Repository.fetchObject(keyItem));
            promisesBalances.push(Repository.fetchObject(balanceItem));
          }
        });

        return Promise.all([Promise.all(promisesAssets), Promise.all(promisesBalances)]);
      }).then(([assets, balances]) => {
        let assetsHash = {},
          account = results['account'],
          items = Immutable.List(),
          current = state.rockPaperScissorsReducer.unit,
          itemsHash = {},
          balancesHash = {};
        balances.forEach((balance) => {
          balancesHash[balance.get('id')] = balance;
        });
        assets.forEach((asset) => {
          assetsHash[asset.get('id')] = asset;
        });
        account.get('balances').forEach((balanceItem, keyItem) => {
          let asset = assetsHash[keyItem];

          if (asset) {
            let obj = {
              id: asset.get('id'),
              symbol: asset.get('symbol'),
              balance: balancesHash[balanceItem] ? balancesHash[balanceItem].get('balance') : 0,
              precision: asset.get('precision')
            };

            if (obj.balance > 0) {
              items = items.push(Immutable.Map(obj));
              itemsHash[asset.get('id')] = obj;
            }
          }
        });

        if (items.size > 0 && (!current || !itemsHash[current])) {
          current = items.getIn([0, 'symbol']);
        }

        dispatch(setAvailableUnitsAction({
          unitList: items,
          unit: current
        }));
      });
    };
  }

  /**
   * Game
   */

  /**
   * Set current game
   *
   * @param gameId String
   * @returns {Function}
   */
  static setGame(gameId) {
    return (dispatch, getState) => {
      let state = getState();

      if (state.rockPaperScissorsReducer.activeGameId !== gameId) {
        dispatch(setActiveGameAction({
          activeGameId: gameId,
          match: null,
          games: Immutable.List(),
          players: [],
          start_time: null,
          status: null
        }));
      }

      let results = {};
      Repository.getAccount(state.app.account).then((account) => {
        results['account'] = account;

        return account;
      }).then(() => {
        /**
         * Fetch tournament
         */
        return Repository.fetchObject(gameId);
      }).then((tournament) => {
        /**
         * Fetch details
         */
        results['tournament'] = tournament;

        return Repository.fetchObject(tournament.get('tournament_details_id'));
      }).then((details) => {
        let tournament = results['tournament'];
        tournament = tournament.set('tournament_details', details);
        results['tournament'] = tournament;

        return tournament;
      }).then((tournament) => {
        let matches = tournament.getIn(['tournament_details', 'matches']),
          promises = [];
        matches.forEach((matchId) => {
          promises.push(Repository.fetchObject(matchId));
        });

        return Promise.all(promises);
      }).then((matches) => {
        let tournament = results['tournament'],
          account = results['account'];

        switch (tournament.get('state')) {
          case 'in_progress':
            console.log('IN PROGRESS', tournament.get('id'));
            let match = matches.find((match) => {
              return match.get('state') === 'match_in_progress'
                && match.get('players') && match.get('players').find((playerId) => {
                return playerId === account.get('id');
              });
            });

            if (match) {
              let gamesPromises = [];

              match.getIn(['games']).forEach((gameId) => {
                gamesPromises.push(Repository.getObject(gameId));
              });

              return Promise.all([Promise.all(
                [
                  Repository.getAccount(match.getIn(['players', 0])),
                  Repository.getAccount(match.getIn(['players', 1]))
                ]),
              Promise.all(gamesPromises)
              ])
                .then(([players, games]) => {
                  let account = results['account'],
                    immutableGames = Immutable.List(games);
                  let previousGamesHash = {};
                  state.rockPaperScissorsReducer.games.forEach((prevGame) => {
                    previousGamesHash[prevGame.get('id')] = prevGame;
                  });
                  games.forEach((game) => {
                    if (
                      !previousGamesHash[game.get('id')]
                      || (game !== previousGamesHash[game.get('id')]
                      && game.get('state') !== previousGamesHash[game.get('id')].get('state'))
                    ) {
                      if (game.get('state') === 'expecting_reveal_moves') {
                        game.get('players').forEach((playerId, playerIndex) => {
                          if (account.get('id') === playerId &&
                            game.getIn(['game_details', 1, 'commit_moves', playerIndex]) &&
                            !game.getIn(['game_details', 1, 'reveal_moves', playerIndex])) {
                            console.log('Game %o is expecting a reveal move', game.get('id'));
                            dispatch(RWalletUnlockNewActions.getKeyFromState('active')).then(
                              (privateKey) => {
                                RPSTransactionService.broadcastRevealMove(
                                  tournament.get('id'),
                                  game.get('id'),
                                  playerId,
                                  game.getIn(['game_details', 1, 'commit_moves', playerIndex]),
                                  privateKey
                                );
                              }
                            );
                          }
                        });
                      }
                    }
                  });

                  if (!immutableGames.equals(state.rockPaperScissorsReducer.games) ||
                    !match.equals(state.rockPaperScissorsReducer.match) ||
                    !players.equals(state.rockPaperScissorsReducer.players) ||
                    gameId !== state.rockPaperScissorsReducer.activeGameId) {
                    dispatch(setGameAction({
                      match: match,
                      activeGameId: gameId,
                      players: players,
                      games: immutableGames,
                      status: tournament.get('state')
                    }));
                  }
                });
            } else {
              //waiting game...
              dispatch(setActiveGameAction({
                activeGameId: gameId,
                match: null,
                games: Immutable.List(),
                players: [],
                start_time: null,
                status: null
              }));
            }

            break;
          case 'awaiting_start':
            dispatch(setAwaitingGameStartAction({
              activeGameId: gameId,
              start_time: tournament.get('start_time'),
              status: tournament.get('state')
            }));
            break;
          case 'concluded':
            let allGamesPromises = [],
              playersPromises = [],
              playersHashIds = {};
            matches.forEach((match) => {
              match.getIn(['games']).forEach((gameId) => {
                allGamesPromises.push(Repository.getObject(gameId));
              });

              let player1 = match.getIn(['players', 0]),
                player2 = match.getIn(['players', 1]);

              if (player1 && !playersHashIds[player1]) {
                playersHashIds[player1] = true;
                playersPromises.push(Repository.getAccount(player1));
              }

              if (player2 && !playersHashIds[player2]) {
                playersHashIds[player2] = true;
                playersPromises.push(Repository.getAccount(player2));
              }
            });

            return Promise.all([
              Promise.all(playersPromises),
              Promise.all(allGamesPromises)
            ]).then(([players, games]) => {
              let playersHash = {},
                gamesHash = {},
                matchList = [];

              players.forEach((player) => {
                playersHash[player.get('id')] = player;
              });

              games.forEach((game) => {
                gamesHash[game.get('id')] = game;
              });

              matches.forEach((match) => {
                let player1 = playersHash[match.getIn(['players', 0])],
                  player2 = playersHash[match.getIn(['players', 1])];
                let item = Immutable.Map({
                  id: match.get('id'),
                  playerName1: player1 ? player1.get('name') : ' - ',
                  playerName2: player2 ? player2.get('name') : ' - ',
                  start_time: match.get('start_time'),
                  end_time: match.get('end_time'),
                  games: Immutable.List(match.getIn(['games']).map((gameId) => {
                    let game = gamesHash[gameId];

                    if (game) {
                      let winnerId = game.getIn(['winners', 0]),
                        moves = game.getIn(['game_details', 1, 'reveal_moves']),
                        winnerText = null,
                        gesture0 = null,
                        gesture1 = null;

                      if (winnerId && playersHash[winnerId]) {
                        winnerText = playersHash[winnerId].get('name');
                      }

                      if (moves.get(0) != null) {
                        gesture0 = moves.get(0).get('gesture');
                      }

                      if (moves.get(1) != null) {
                        gesture1 = moves.get(1).get('gesture');
                      }

                      if (
                        (moves.get(1) != null) && (moves.get(0) != null) && (gesture0 === gesture1)
                      ) {
                        winnerText = 'tie';
                      }

                      return Immutable.Map({
                        id: game.get('id'),
                        winner: winnerText,
                        gesture0: gesture0,
                        gesture1: gesture1
                      });
                    }

                    return gamesHash[gameId];
                  }))
                });
                matchList.push(item);
              });

              dispatch(setConcludedGameStartAction({
                activeGameId: gameId,
                start_time: tournament.get('start_time'),
                end_time: tournament.get('end_time'),
                status: tournament.get('state'),
                matchList: Immutable.List(matchList)
              }));
            }).catch((err) => {
              console.log('Error ', err);
            });
          default:
            return Promise.reject();
        }

        return Promise.reject();
      }).catch(() => {
      });
    };
  }

  /**
   * Commit move
   *
   * @param tournamentId
   * @param gameId
   * @param playerAccountId
   * @param move
   * @returns {function(*=, *)}
   */
  static commitMove(tournamentId, gameId, playerAccountId, move) {
    return (dispatch, getState) => {
      return dispatch(RWalletUnlockNewActions.getKeyFromState('active')).then((privateKey) => {
        let [commit, reveal] = RPSTransactionService.createCommitAndRevealMoveOperations(move);
        let state = getState();
        let wallet = state.walletData.wallet;
        let reveal_moves;

        if (wallet.reveal_moves) {
          reveal_moves = {
            ...wallet.reveal_moves
          };
        } else {
          reveal_moves = {};
        }

        reveal_moves[gameId] = reveal_moves[gameId] || {};
        reveal_moves[gameId][playerAccountId] = reveal_moves[gameId][playerAccountId] || {};
        reveal_moves[gameId][playerAccountId][commit.nonce1] = reveal;

        dispatch({
          type: WD_UPDATE_REVEAL_MOVES_WALLET,
          payload: reveal_moves
        });

        return iDB.load_data('wallet').then(([wallet]) => {
          if (wallet) {
            wallet.reveal_moves = wallet.reveal_moves || {};
            wallet.reveal_moves[gameId] = wallet.reveal_moves[gameId] || {};
            wallet.reveal_moves[gameId][playerAccountId] = wallet.reveal_moves[gameId][playerAccountId] || {}; // eslint-disable-line
            wallet.reveal_moves[gameId][playerAccountId][commit.nonce1] = reveal;

            let walletTransaction = iDB.instance().db().transaction(['wallet'], 'readwrite');

            return idb_helper.on_request_end(walletTransaction.objectStore('wallet').put(wallet));
          } else {
            return Promise.reject('Wallet update error');
          }
        }).then(() => {
          return RPSTransactionService.commitMove(
            tournamentId,
            gameId,
            playerAccountId,
            commit,
            privateKey,
            dispatch
          );
        });
      }).catch((err) => {
        console.log('CANCEL!!!', err);
      });
    };
  }
}

export default RockPaperScissorsActions;