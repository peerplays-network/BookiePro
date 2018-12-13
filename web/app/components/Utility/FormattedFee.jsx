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

import React, {PropTypes} from 'react';
import FormattedAsset from './FormattedAsset';
import ChainTypes from './ChainTypes';
import BindToChainState from './BindToChainState';
import utils from 'common/utils';

/**
 *
 *  Given an operation type, displays the CORE fee for that operation
 *
 */
@BindToChainState({keep_updating: true})
class FormattedFee extends React.Component {
    static propTypes = {
      globalObject: ChainTypes.ChainObject.isRequired,
      opType: PropTypes.string,
      options: PropTypes.array
    };

    static defaultProps = {
      globalObject: '2.0.0',
      options: []
    };

    getFee() { // Return fee via refs
      return utils.estimateFee(this.props.opType, this.props.options, this.props.globalObject);
    }

    render() {
      let {opType, options, globalObject} = this.props;

      if (!opType || !options || !globalObject) {
        return null;
      }

      let amount = utils.estimateFee(opType, options, globalObject);

      return (
        <FormattedAsset amount={ amount } asset='1.3.0'/>
      );
    }
}

export default FormattedFee;
