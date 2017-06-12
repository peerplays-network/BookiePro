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

export default  class LoadingIndicator extends React.Component {

    constructor(props) {
        super(props);
        this.state = {progress: 0};
    }

    render() {
        switch (this.props.type) {
            case "three-bounce":
                return (
                    <div className="three-bounce">
                        <div className="bounce1"></div>
                        <div className="bounce2"></div>
                        <div className="bounce3"></div>
                    </div>
                );
                break;
            case "circle":
                return  (
                    <div className="circle-wrapper">
                        <div className="circle1 circle"></div>
                        <div className="circle2 circle"></div>
                        <div className="circle3 circle"></div>
                        <div className="circle4 circle"></div>
                        <div className="circle5 circle"></div>
                        <div className="circle6 circle"></div>
                        <div className="circle7 circle"></div>
                        <div className="circle8 circle"></div>
                        <div className="circle9 circle"></div>
                        <div className="circle10 circle"></div>
                        <div className="circle11 circle"></div>
                        <div className="circle12 circle"></div>
                    </div>
                );
                break;
            default:
                var classes = "loading-overlay";
                if(this.progress > 0) { classes += " with-progress"; }
                return (
                    <div className={classes}>
                        <div className="loading-panel">
                            <div className="spinner">
                                <div className="bounce1"></div>
                                <div className="bounce2"></div>
                                <div className="bounce3"></div>
                            </div>
                            <div className="progress-indicator"><span>{this.state.progress}</span></div>
                        </div>
                    </div>
                );
        }
    }

}