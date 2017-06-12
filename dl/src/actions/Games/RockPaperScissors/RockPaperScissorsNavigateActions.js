/*
 * Copyright (c) 2015 Cryptonomex, Inc., and contributors.
 *
 * The MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import { push } from 'react-router-redux';

class RockPaperScissorsNavigateActions {

    /**
     * Explore Tab
     *
     * @returns {Function}
     */
    static navigateToAllTournaments(page) {

        return (dispatch) => {

            if (page && page !== 1) {
                dispatch(push(`/games/rock-paper-scissors/explore/all?page=${page}`));
            } else {
                dispatch(push('/games/rock-paper-scissors/explore/all'));
            }


        }
    }

    /**
     * Find Tab
     *
     * @returns {Function}
     */
    static navigateToOpenTournaments() {

        return (dispatch) => {

            dispatch(push('/games/rock-paper-scissors/explore/find'));
 
        }
    }

    /**
     * Create Tab
     *
     * @returns {Function}
     */
    static navigateToCreateTournament() {

        return (dispatch) => {

            dispatch(push('/games/rock-paper-scissors/create'));

        }
    }

    /**
     * Dashboard Tab
     *
     * @returns {Function}
     */

    static navigateToDashboardTournaments() {

        return (dispatch) => {

            dispatch(push('/games/rock-paper-scissors/dashboard'));

        }
    }

    /**
     * Game page
     *
     * @param id
     * @returns {Function}
     */
    static navigateToGame(id) {

        return (dispatch) => {

            dispatch(push('/games/rock-paper-scissors/game/' + id));

        }
    }

}


export default RockPaperScissorsNavigateActions;