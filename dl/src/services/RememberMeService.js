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