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

import ls from "common/localStorage";
import Immutable from "immutable";
const STORAGE_KEY = "__peerplays__";


const VIEW_SETTINGS_KEY = "viewSettings_v3";

let ss = new ls(STORAGE_KEY);
let viewSettings = Immutable.Map(ss.get(VIEW_SETTINGS_KEY));

initViewSettings();

function initViewSettings() {
    let defaultViewSettings = {
        activeSetting: 'general',
        connection: [BLOCKCHAIN_URL]
    };
    let reset = false;

    for (let key in defaultViewSettings) {
        if (!viewSettings.get(key)) {
            viewSettings = viewSettings.set(key, defaultViewSettings[key]);
            reset = true;
        }
    }

    if (reset) {
        let vSettings = viewSettings.toJS();

        ss.set(VIEW_SETTINGS_KEY, vSettings);
    }

}

/**
 *
 * @param item
 * @returns {null}
 */
export function getViewSettings(item) {

    let data = ss.get(VIEW_SETTINGS_KEY);

    return (data && (item in data)) ? data[item] : null;
}

/**
 *
 * @param data
 * @returns {any}
 */
export function setViewSettings(data) {

    for (let key in data) {
        viewSettings = viewSettings.set(key, data[key]);
    }

    let vSettings = viewSettings.toJS();

    ss.set(VIEW_SETTINGS_KEY, vSettings);

    return vSettings;

}
