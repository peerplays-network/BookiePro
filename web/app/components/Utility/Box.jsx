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
import {PropTypes} from "react";
import {Link} from "react-router";
import Immutable from "immutable";
import Translate from "react-translate-component";
import LoadingIndicator from "../LoadingIndicator";
import Accordion from 'react-foundation-apps/src/accordion';

require("./Box.scss");

class Box extends React.Component {

/*
    static propTypes = {
    };

    static defaultProps = {
    };

    constructor(props) {
        super(props);
    }
*/

    renderOriginal() {
        var className = "Box" + this.props.className ? " " + this.props.className : "";
        return (
            <div className={className}>

                {(this.props.header) ? (
                    <div className="BoxHeader">
                        <h4>{this.props.header}</h4>
                    </div>
                ) : ''}

                <div className="BoxBody">
                    {this.props.children}
                </div>

                {(this.props.footer) ? (
                    <div className="BoxFooter">
                        <h4>{this.props.footer}</h4>
                    </div>
                ) : ''}

            </div>
        );
    }

    renderAccordian() {
        var title = this.props.header ? this.props.header : '';
        var className = "Box" + this.props.className ? " " + this.props.className : "";
        return (
            <div className={className}>

                <Accordion multiOpen="true">
                    <Accordion.Item title={title}>
                        <div className="BoxBody">
                            {this.props.children}
                        </div>
                    </Accordion.Item>
                </Accordion>

            </div>
        );
    }

    render() {
        return (
            this.props.accordian ? this.renderAccordian() : this.renderOriginal()
        );
    }


}

export default Box;
