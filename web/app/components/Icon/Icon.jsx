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

// look for more icons here https://linearicons.com/free or here http://hawcons.com/preview/

import React from 'react';

let icons = ['user', 'trash', 'chevron-down', 'menu', 'database', 'search',
  'plus-circle', 'question-circle', 'cross-circle', 'cog', 'layers', 'users', 'wand', 'b-logo',
  'accounts', 'witnesses', 'assets', 'proposals', 'blocks', 'committee_members', 'workers', 'key',
  'checkmark-circle', 'checkmark', 'piggy', 'locked', 'unlocked' , 'markets', 'fi-star' ,'fees',
  'thumb-tack', 'clock'];

let icons_map = {};

for (let i of icons) {
  icons_map[i] = require(`./${i}.svg`);
}

require('./icon.scss');

class Icon extends React.Component {
  render() {
    let classes = 'icon ' + this.props.name;

    if(this.props.size) {
      classes += ' icon-' + this.props.size;
    }

    if(this.props.className) {
      classes += ' ' + this.props.className;
    }

    return (
      <span className={ classes } dangerouslySetInnerHTML={ {__html: icons_map[this.props.name]} }/>
    );
  }
}

Icon.propTypes = {
  name: React.PropTypes.string.isRequired,
  size: React.PropTypes.oneOf(['1x', '2x', '3x', '4x', '5x', '10x']),
  inverse: React.PropTypes.bool,
  className: React.PropTypes.string
};

export default Icon;
