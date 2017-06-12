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
import ReactDOM from "react-dom";
import {PropTypes, Component} from "react";
import sha256 from "js-sha256";
import jdenticon from "jdenticon";

var canvas_id_count = 0

class Identicon extends Component {

  constructor(props) {
      super(props);
      this.canvas_id = "identicon_" + (this.props.account||"") + (++canvas_id_count);
  }

  shouldComponentUpdate(nextProps) {
      return nextProps.size.height !== this.props.size.height || nextProps.size.width !== this.props.size.width || nextProps.account !== this.props.account;
  }

  render() {
      let {account} = this.props;
      let {height, width} = this.props.size;
      let hash = account ? sha256(account) : null;
      return (
           <canvas id={this.canvas_id} ref="canvas" style={{height: height, width: width}} width={width * 2} height={height * 2} data-jdenticon-hash={hash} />
      );
  }

  repaint() {
      if(this.props.account) jdenticon.updateById(this.canvas_id);
      else {
          let ctx = ReactDOM.findDOMNode(this.refs.canvas).getContext('2d');
          ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
          let size = ctx.canvas.width;
          ctx.clearRect(0, 0, size, size);
          ctx.fillRect(0, 0, size, size);
          ctx.clearRect(0+1, 0+1, size-2, size-2);
          ctx.font = `${size}px sans-serif`;
          ctx.fillText("?", size/4, size - size/6);
      }
  }

  componentDidMount() {
      this.repaint();
  }

  componentDidUpdate() {
      this.repaint();
  }
}

Identicon.propTypes = {
  size: PropTypes.object.isRequired,
  account: PropTypes.string
};

export default Identicon;
