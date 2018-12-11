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
import {connect} from 'react-redux';
import counterpart from 'counterpart';
import Logo from 'components/Forms/Logo';
import NavigateActions from 'actions/NavigateActions';
import ClaimBtsActions from 'actions/ClaimBtsActions';
import ClaimBtsForm from './ClaimBtsForm';
import Translate from 'react-translate-component';

@connect((state) => {
  return {status: state.claimBtsReducer.status, errors: state.claimBtsReducer.errors};
}, {
  navigateToSignUp: NavigateActions.navigateToSignUp,
  setStatus: ClaimBtsActions.setStatus,
  loginAccountFromBts: ClaimBtsActions.loginAccountFromBts
})
class ClaimBtsContainer extends React.Component {
  navigateToSignUp() {
    this.props.navigateToSignUp();
  }

  handleSubmit(values) {
    this.props.setStatus('loading');

    setTimeout(() => {
      this.props.loginAccountFromBts(values.private_bts_key);
    }, 0);
  }

  render() {
    let {status, errors} = this.props;
    let content = null;

    switch (status) {
      case 'connect':
        content = (
          <div className='dialog dialog-login dialog-loading'>
            <Logo/>
            <div className='loader-splash'>
              <span className='loader loader-s'></span>
            </div>
          </div>
        );
        break;
      default:
        content = (
          <div className='dialog dialog-login'>
            <Logo/>

            <h1 className='h1'>{counterpart.translate('login_bts.login_form_title')}
              <span className='tm'>TM</span>
            </h1>

            <div className='section__text'>
              <Translate
                component='div'
                className='section__textTitle'
                content='login_bts.title'
              />
              <div className='section__textItem'>
                <Translate
                  component='div'
                  className='section__textItemHead'
                  content='login_bts.note_title_1'
                />
                <div className='section__textItemBody'>
                  <Translate component='div' className='' content='login_bts.note_1'/>
                </div>
              </div>

              <div className='section__textItem'>
                <Translate
                  component='div'
                  className='section__textItemHead'
                  content='login_bts.note_title_2'
                />
                <div className='section__textItemBody'>
                  <Translate component='div' className='' content='login_bts.note_2'/>
                </div>
              </div>

              <div className='section__textItem'>
                <Translate
                  component='div'
                  className='section__textItemHead'
                  content='login_bts.note_title_3'
                />
                <div className='section__textItemBody'>
                  <Translate component='div' className='' content='login_bts.note_3'/>
                </div>
              </div>
            </div>

            <div className='form'>
              <ClaimBtsForm
                errors={ errors }
                btnStatus={ status }
                onSubmit={ this.handleSubmit.bind(this) }
              />
            </div>

            <div className='login__footer'>
              <div className='login__footerTitle'>
                {counterpart.translate('login_bts.login_form_sign_up_label')}
              </div>

              <button
                className='btn btn-sign btn-fsz-18 '
                onClick={ this.navigateToSignUp.bind(this) }>
                <span className='btnText'>
                  {counterpart.translate('auth.sign_up_btn')}
                </span>
              </button>
            </div>
          </div>
        );
    }

    return (
      <div className='main'>
        <div className='yHelper active'></div>
        <section className='content'>
          <div className='box box-inPadding'>
            {content}
          </div>
        </section>
      </div>
    );
  }
}

export default ClaimBtsContainer;