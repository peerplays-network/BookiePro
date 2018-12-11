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
import {Link} from 'react-router';

class AdvancedOptions extends React.Component {
  render() {
    return (
      <div className='main'>
        <section className='content'>
          <div className='box'>
            <div className='content__head'>
              <h1 className='content__headTitle'>Advanced Options</h1>
            </div>
            <div className='db__optionsWrap'>
              <ul className='db__optionsList'>
                <li className='db__optionsItem'>
                  <Link to='explore/voting' className='db__optionsLink'>
                    <img src='images/option/option_voting.png' alt='' className='db__optionsPic'/>
                    <span className='db__optionsTitle'>
                      Shareholder
                      <br/>Voting
                    </span>
                  </Link>
                </li>
                <li className='db__optionsItem'>
                  <Link to='/explore/blockchain' className='db__optionsLink'>
                    <img
                      src='images/option/option_blockchain.png'
                      alt=''
                      className='db__optionsPic'
                    />
                    <span className='db__optionsTitle'>
                      The Blockchain
                    </span>
                  </Link>
                </li>
                <li className='db__optionsItem'>
                  <Link to='/explore' className='db__optionsLink'>
                    <img src='images/option/option_asset.png' alt='' className='db__optionsPic'/>
                    <span className='db__optionsTitle'>
                      Advanced
                      <br/>Asset Options
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
export default AdvancedOptions;
