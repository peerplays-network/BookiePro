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

import React from 'react';
import Identicon from './Identicon';
import {PropTypes, Component} from 'react';

class AccountImage extends Component {
  render() {
    let {account, image} = this.props;
    let {height, width} = this.props.size;
    let custom_image = image
      ? <img alt='indenticon' src={ image } height={ height + 'px' } width={ width + 'px' }/>
      : <Identicon id={ account } account={ account } size={ this.props.size }/>;
    return (
      <div className='account-image'>
        {custom_image}
      </div>
    );
  }
}

AccountImage.defaultProps = {
  src: '',
  account: '',
  size: {
    height: 120,
    width: 120
  }
};

AccountImage.propTypes = {
  src: PropTypes.string,
  account: PropTypes.string,
  size: PropTypes.object.isRequired
};

export default AccountImage;
