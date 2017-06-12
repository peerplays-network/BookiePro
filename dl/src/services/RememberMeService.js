/*
 *  Copyright (c) 2015 Cryptonomex, Inc., and contributors.
 *
 *  The MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

import Cookies from "cookies-js";

/**
 * Login form: remember me checkbox functionality
 */
class RememberMeService {

    /**
     *
     * @returns {boolean}
     */
    static checkRememberMeIsEnable() {

        return sessionStorage ? true : false;
    }

    /**
     *
     * @returns {boolean}
     */
    static checkNeedResetWallet() {
        return (Cookies.get('not_remember_me') && (!Cookies.get('remember_me_check_expire') || (sessionStorage && !sessionStorage['remember_me_check_expire'])));
    }

    /**
     *
     * @param public_name
     */
    static setRememberMe(public_name) {

        sessionStorage.setItem('remember_me_check_expire', public_name);

        Cookies.set('remember_me_check_expire', public_name).set('not_remember_me', public_name, { expires: Infinity });
    }

    /**
     *
     * @returns {boolean}
     */
    static resetRememberMe() {

        Cookies.expire('not_remember_me').expire('remember_me_check_expire');

        if (sessionStorage && sessionStorage['remember_me_check_expire']) {
            sessionStorage.removeItem('remember_me_check_expire');
        }

        return true;
    }
}


export default RememberMeService;