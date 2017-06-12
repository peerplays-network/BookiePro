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

class BalanceHeader extends React.Component {

    static propTypes = {
        unit: React.PropTypes.string
    };

    render(){
        let {unit} = this.props;
        return (

                <tr className="tr tr-head">
                    <th className="th th__marker"><div className="th__in">Show/Hide</div></th>
                    <th className="th th__assetsSym"><div className="th__in">Asset Symbol</div></th>
                    <th className="th th__assetsName"><div className="th__in">Asset Name</div></th>
                    <th className="th"><div className="th__in">Available Balance</div></th>
                    <th className="th"><div className="th__in">Open Orders</div></th>
                    <th className="th"><div className="th__in">Collateral</div></th>
                    <th className="th"><div className="th__in">Total Balance</div></th>
                    <th className="th"><div className="th__in">Total Value ({unit})</div></th>
            {/*<th className="th">
             <div className="th__in">
             <div className="tableValue__dd dd">
             <a href="" className="tableValue__trigger ddTrigger js_dropDown">
             <span className="ddTrigger__text">Total Value ({unit})</span>
             </a>
             <div className="tableValue__ddMenu ddMenu">
             <ul className="ddMenu__list">
             <li className="ddMenu__item"><a href="" className="ddMenu__link js-sel_dropDown">Total Value (STEEM)</a></li>
             <li className="ddMenu__item"><a href="" className="ddMenu__link js-sel_dropDown">Test2</a></li>
             </ul>
             </div>
             </div>
             </div>
             </th>*/}
                    <th className="th th__action"><div className="th__in">Actions</div></th>
                </tr>

        );
    }
}

export default BalanceHeader;