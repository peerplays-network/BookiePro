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
import classNames from "classnames";
import asset_utils from "common/asset_utils";


class DropDownTrigger extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            showBuyInMenu : false
        };

        this.hideBuyIn = this.hideBuyIn.bind(this);
    }

    componentWillMount() {

        document.addEventListener('click', this.hideBuyIn, false);

    }

    componentWillUnmount() {

        document.removeEventListener('click', this.hideBuyIn, false);

    }

    toggleBuyIn(e) {

        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        if (this.state.showBuyInMenu) {
            this.hideBuyIn();
        } else {
            this.showBuyIn(e);
        }
    }

    hideBuyIn() {
        this.setState({
            showBuyInMenu: false
        });
    }

    showBuyIn() {
        this.setState({
            showBuyInMenu: true
        });
    }

    setAssetSymbol(unitId, e) {
        e.preventDefault();

        if (this.props.setAssetSymbol) {
            this.props.setAssetSymbol(unitId);
        }


    }

    render() {

        let {triggerClass, items} = this.props;

        return (
            <div className={classNames(triggerClass, {open: this.state.showBuyInMenu})}>
                <a href="" className="ddTrigger" onClick={this.toggleBuyIn.bind(this)}>
                    <span className="ddTrigger__text"></span>
                    <span className="ddTrigger__icon icon-str_close"></span>
                </a>
                <div className="ddMenu">
                    <ul className="ddMenu__list">

                                    {items.map((item) => {
                                        return (
                                            <li key={item.get('id')} className="ddMenu__item">
                                                <a href="#" className="ddMenu__link active" onClick={this.setAssetSymbol.bind(this, item.get('id'))}>
                                                    {asset_utils.getSymbol(item.get('symbol'))}
                                                </a>
                                            </li>
                                        )
                                    })}

                        <li className="ddMenu__item">
                            <a href="#" className="ddMenu__link active" onClick={this.setAssetSymbol.bind(this, 'any')}>
                                ANY
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default DropDownTrigger;