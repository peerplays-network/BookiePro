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
import NavigateActions from 'actions/NavigateActions';
import {Link} from 'react-router';
import Logo from '../Forms/Logo';

class AboutContainer extends React.Component {

  navigateToLogin() {
    this
      .props
      .navigateToDashboard();
  }

  render() {

    return (
      <div className='main'>
        <div className='yHelper'></div>
        <section className='content'>
          <div className='box box-inPadding'>
            <div className='dialog dialog-descr'>

              <Logo/>

              <Translate component='h1' className='h1' content='about.title'/>
              <Translate component='p' className='text' content='about.note1'/>
              <Translate component='p' className='text' content='about.note2'/>
              <Translate component='p' className='text' content='about.note3'/>

              <div className='descr__listWrap'>
                <ul className='descr__list'>
                  <li className='descr__li'>
                    <Link to='/games' className='descr__item'>
                      <Translate component='span' className='' content='about.library_link'/>
                    </Link>
                  </li>
                  {/*<li className="descr__li">
                      <Link to="/exchange/PIXEL.BITCOIN_TESTPLAYS" className="descr__item">
                          <Translate component="span" className="" content="about.exchange_link" />
                      </Link>
                  </li>*/}
                  <li className='descr__li'>
                    <Link to='/dashboard' className='descr__item'>
                      <Translate component='span' className='' content='about.balance_link'/>
                    </Link>
                  </li>
                  <li className='descr__li'>
                    <Link to='/send' className='descr__item'>
                      <Translate component='span' className='' content='about.transfers_link'/>
                    </Link>
                  </li>
                  <li className='descr__li'>
                    <Link to='/deposit-withdraw' className='descr__item'>
                      <Translate component='span' className='' content='about.deposit_link'/>
                    </Link>
                  </li>
                </ul>
                <ul className='descr__list'>
                  <li className='descr__li'>
                    <Link to='/explore/voting' className='descr__item'>
                      <Translate component='span' className='' content='about.voting_link'/>
                    </Link>
                  </li>
                  <li className='descr__li'>
                    <Link to='/explore/blockchain' className='descr__item'>
                      <Translate component='span' className='' content='about.explorer_link'/>
                    </Link>
                  </li>
                  <li className='descr__li'>
                    <Link to='/account/vesting' className='descr__item'>
                      <Translate component='span' className='' content='about.claims_link'/>
                    </Link>
                  </li>
                  <li className='descr__li'>
                    <Link to='/settings' className='descr__item'>
                      <Translate component='span' className='' content='about.settings_link'/>
                    </Link>
                  </li>
                  <li className='descr__li'>
                    <Link to='/dashboard' className='descr__item'>
                      <Translate component='span' className='' content='about.more_link'/>
                    </Link>
                  </li>
                </ul>
              </div>

              <div className='text_c'>
                <button
                  className='btn btn-sbm btn-fsz-18'
                  onClick={ this
                    .navigateToLogin
                    .bind(this) }>
                  <Translate component='span' className='btnText' content='about.continue_btn'/>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

AboutContainer = connect(null, {
  navigateToSignIn: NavigateActions.navigateToSignIn,
  navigateToDashboard: NavigateActions.navigateToDashboard
})(AboutContainer);

export default AboutContainer;