import Immutable from "immutable";

import RockPaperScissorsConstants from 'constants/Games/RockPaperScissors/RockPaperScissorsConstants';

/**
 * Reducer is used to control a Rock Paper Scissors game
 *
 * Initial State
 *
 * @type {{tab: string, tournamentsFilter: string, unitList: (*), unit: null, dashboardList: (*), findList: (*), findDropDownItems: (*), findDropDownCurrent: string, exploreList: (*), exploreDropDownItems: (*), exploreDropDownCurrent: string, exploreSortColumn: string, exploreSortDirection: string, explorePage: number, exploreCountPages: number, exploreCountPerPage: number, activeGameId: null, status: null, match: null, games: (*), players: Array, start_time: null, end_time: null, matchList: (*)}}
 */
let defaultState = {

    /**
     * mb another reducer???
     */
    tab: 'explore',
    tournamentsFilter: 'open',
    unitList: Immutable.List(),
    unit: null,


    /**
     * Dashboard Tab
     */
    dashboardList: Immutable.List(),

    /**
     * Find Tab
     */
    findList: Immutable.List(),
    findDropDownItems: Immutable.List(),
    findDropDownCurrent: 'any',

    /**
     * Explore Tab
     */
    exploreList: Immutable.List(),
    exploreDropDownItems: Immutable.List(),
    exploreDropDownCurrent: 'any',
    exploreSortColumn: 'id',
    exploreSortDirection: 'desc',
    explorePage: 1,
    exploreCountPages: 1,
    exploreCountPerPage: 10 ,

    /**
     * Game
     */


    activeGameId: null,
    status: null,

    match: null,
    games: Immutable.List(),

    players: [],

    start_time: null,
    end_time: null,

    matchList: Immutable.List()



};

export default function (state = defaultState, action) {
    switch (action.type) {
    /**
     * mb another reducer???
     */
        case RockPaperScissorsConstants.GAME_RPS_CHANGE_TAB_PARAMS:
            return Object.assign({}, state, {
                tab: action.payload.tab,
                tournamentsFilter: action.payload.tournamentsFilter
            });

    /**
     * Create
     */

        case RockPaperScissorsConstants.GAME_RPS_SET_AVAILABLE_UNITS:
            return Object.assign({}, state, {
                unitList: action.payload.unitList,
                unit: action.payload.unit
            });

    /**
     * Dashboard Tab
     */
        case RockPaperScissorsConstants.GAME_RPS_SET_DASHBOARD_LIST:
            return Object.assign({}, state, {
                dashboardList: action.payload.dashboardList
            });

    /**
     * Find Tab
     */
        case RockPaperScissorsConstants.GAME_RPS_SET_FIND_LIST:
            return Object.assign({}, state, {
                findList: action.payload.findList,
                findDropDownCurrent: action.payload.findDropDownCurrent,
                findDropDownItems: action.payload.findDropDownItems
            });

        case RockPaperScissorsConstants.GAME_RPS_SET_FIND_DD_CURRENT:
            return Object.assign({}, state, {
                findDropDownCurrent: action.payload.findDropDownCurrent
            });

    /**
     * Explore Tab
     */

        case RockPaperScissorsConstants.GAME_RPS_SET_EXPLORE_LIST:
            return Object.assign({}, state, {
                exploreList: action.payload.exploreList,
                exploreDropDownCurrent: action.payload.exploreDropDownCurrent,
                exploreDropDownItems: action.payload.exploreDropDownItems
            });
        case RockPaperScissorsConstants.GAME_RPS_SET_EXPLORE_DD_CURRENT:
            return Object.assign({}, state, {
                exploreDropDownCurrent: action.payload.exploreDropDownCurrent
            });
        case RockPaperScissorsConstants.GAME_RPS_SET_EXPLORE_SORT:
            return Object.assign({}, state, {
                exploreSortColumn: action.payload.exploreSortColumn,
                exploreSortDirection: action.payload.exploreSortDirection
            });
        case RockPaperScissorsConstants.GAME_RPS_SET_EXPLORE_PAGE:
            return Object.assign({}, state, {
                explorePage: action.payload.explorePage
            });
        case RockPaperScissorsConstants.GAME_RPS_SET_EXPLORE_COUNT_PAGES:
            return Object.assign({}, state, {
                exploreCountPages: action.payload.exploreCountPages
            });


    /**
     * Game
     */

        case RockPaperScissorsConstants.GAME_RPS_SET_GAME:

            return Object.assign({}, state, {
                match: action.payload.match,
                activeGameId: action.payload.activeGameId,
                players: action.payload.players,
                games: action.payload.games,
                status: action.payload.status
            });

        case RockPaperScissorsConstants.GAME_RPS_SET_AWAITING_GAME_START:

            return Object.assign({}, state, {
                start_time: action.payload.start_time,
                activeGameId: action.payload.activeGameId,
                status: action.payload.status
            });
        case RockPaperScissorsConstants.GAME_RPS_SET_CONCLUDED_GAME_START:

            return Object.assign({}, state, {
                end_time: action.payload.end_time,
                start_time: action.payload.start_time,
                activeGameId: action.payload.activeGameId,
                status: action.payload.status,
                matchList: action.payload.matchList
            });

        case RockPaperScissorsConstants.GAME_RPS_SET_ACTIVE_GAME:

            return Object.assign({}, state, {
                activeGameId: action.payload.activeGameId,
                match: action.payload.match,
                games: action.payload.games,
                players: action.payload.players,
                start_time: action.payload.start_time,
                status: action.payload.status
            });


        default:
            return state
    }





};