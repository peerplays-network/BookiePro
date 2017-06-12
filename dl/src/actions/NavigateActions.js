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


import { push, replace } from 'react-router-redux';
import SendPageActions from './SendPageActions';//TODO::rm

class NavigateActions {

    static navigateTo(path) {
        return (dispatch) => {

            if (path) {
                dispatch(push(path));
            } else {
                console.error('Unimplemented path', path)
            }

        };
    }

    static navigateToDashboard() {
        return (dispatch) => {
            dispatch(push('/'));
        };
    }

    static navigateToDashboardAdvancedOptions() {
        return (dispatch) => {
            dispatch(push('/dashboard/advanced-options'));
        };
    }

    static navigateToDepositWithDraw() {
        return (dispatch) => {
            dispatch(push('/deposit-withdraw'));
        };
    }

    static navigateToVestingBalances() {
        return (dispatch) => {

            dispatch(push('/account/vesting'));
        };
    }

    static navigateToSignUp() {
        return (dispatch) => {
            dispatch(push('/sign-up'));
        };
    }

    static navigateToSignIn(redirectAfterLogin = null, withReplace = true) {
        return (dispatch) => {
            let url = redirectAfterLogin ? `/login?next=${redirectAfterLogin}` : '/login';
            if (withReplace) {
                dispatch(replace(url));
            } else {
                dispatch(push(url));
            }

        };
    }

    static navigateToForgotPassword() {
        return (dispatch) => {
            dispatch(push('/forgot-password'));
        };
    }

    static navigateToForgotPasswordDecrypt() {
        return (dispatch) => {
            dispatch(push('/forgot-password/decrypt'));
        };
    }

    static navigateToForgotPasswordChange() {
        return (dispatch) => {
            dispatch(push('/forgot-password/change'));
        };
    }

    static navigateToExchangeMarket(id) {
        return (dispatch) => {
            dispatch(push('/exchange/' + id));
        };
    }

    static navigateToSend(selectedSymbol = null) {
        return (dispatch) => {
            if(selectedSymbol) dispatch(SendPageActions.setSelectedSymbol(selectedSymbol));//TODO::rm
            dispatch(push('/send'));
        };
    }

    static navigateToClaim(climType) {
        return (dispatch) => {
            dispatch(push(`/claims/${climType}`));
        };
    }

    static navigateToSettingsClaim() {
        return (dispatch) => {
            dispatch(push('/settings/claim'));
        };
    }

}


export default NavigateActions;