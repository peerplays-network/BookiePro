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
import Translate from 'react-translate-component';
import {connect} from 'react-redux';
import Table from './Table';

@connect((state) => {
  return {feeGroups: state.exploreFeeSchedule.feeGroups};
})
class FeeSchedule extends React.Component {
  render() {
    let {feeGroups} = this.props;
    let tables = [];

    for (let groupName in feeGroups) {
      let fees = feeGroups[groupName];

      if (fees.group.length && fees.group[0]) {
        tables.push(<Table title={ fees.title } rows={ fees.group } key={ groupName }/>);
      }
    }

    return (
      <div
        id='feeSchedule'
        className='tab__deploy'
        style={ {
          display: 'block'
        } }>
        <div className='tab__deployHead'>
          <div className='title col'><Translate content='explore.feeSchedule.title'/></div>
        </div>
        <div className='box-inner box-inner-2'>
          {tables}
        </div>
      </div>
    );
  }
}

export default FeeSchedule;