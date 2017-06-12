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

import React from "react";

class BaseComponent extends React.Component {
    constructor(props, store) {
        super(props);
        if (store) {
            this.stores = {};
            this.state = {};
            if (store.length === undefined) {
                this.stores[store.StoreModel.name] = store;
                this.state = store.getState();
            } else if (store.length >= 1) {
                for (let i = 0; i < store.length; i++) {
                    let storeName = store[i].StoreModel.name;
                    this.stores[storeName] = store[i];
                    let storeState = store[i].getState();
                    for (let key in storeState) {
                        this.state[key] = storeState[key];
                    }
                }
            }
        }
    }

    _bind(...methods) {
        methods.forEach((method) => this[method] = this[method].bind(this));
    }

    componentWillMount() {
        if (this.stores) {
            for (let storeName in this.stores) {
                this.stores[storeName].listen(this.onChange.bind(this));
            }
        }
    }

    componentWillUnmount() {
        if (this.stores) {
            for (let storeName in this.stores) {
                this.stores[storeName].unlisten(this.onChange.bind(this));
            }
        }
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //console.log("[BaseComponent.jsx:20] ----- shouldComponentUpdate ----->", nextProps, nextState);
    // return this.props !== nextProps || this.state !== nextState;
    // }

    onChange(newState) {
        if (newState) {
            this.setState(newState);
        }
    }
}

export default BaseComponent;
