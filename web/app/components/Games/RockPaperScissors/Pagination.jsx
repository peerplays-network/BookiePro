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

class Pagination extends React.Component {

    renderDots(itemKey) {
        return (
            <li key={itemKey} className="pagination__li">
                <span className="pagination__dots">...</span>
            </li>
        )
    }

    navigateTo (page, e) {

        if (this.props.navigateTo) {
            this.props.navigateTo(page);
        }

        e.preventDefault();

    }
    renderInternalLink(page, isActive = false) {
        return (
            <li key={page} className="pagination__li" onClick={this.navigateTo.bind(this, page)}>
                <a href="#" className={classNames("pagination__item", {active: isActive})}>{page}</a>
            </li>
        );
    }

    render() {
        let {currentPage, countPages, offset} = this.props;


        if (countPages < 2) {
            return null;
        }

        let firstPage = 1,
            lastNumPage = countPages;

        let buttons = [];

        /**
         * First page
         */
        buttons.push(this.renderInternalLink(firstPage, currentPage === firstPage));

        /**
         * Dots
         */

        if (currentPage - 1 - offset > 2) {
            buttons.push(this.renderDots('dots_first'));
        }

        /**
         * Internal pages
         */
        let from,
            to;

        if (currentPage - 1 - offset <= 2) {
            from = 2;
        } else {
            from = currentPage - offset;
        }

        if ((currentPage + offset) >= countPages - 2) {
            to = countPages - 1;
        } else {
            to = currentPage + offset;
        }

        for(let i = from; i <= to; ++i) {
            buttons.push(this.renderInternalLink(i, currentPage === i));
        }

        /**
         * Dots
         */
        if (currentPage + offset < countPages - 2) {
            buttons.push(this.renderDots('dots_last'));
        }

        /**
         * Last page
         */
        buttons.push(this.renderInternalLink(lastNumPage, currentPage === lastNumPage));

        return (
            <div className="pagination">
                <ul className="pagination__list">
                    {buttons}
                </ul>
            </div>
        )
    }
}

export default Pagination;