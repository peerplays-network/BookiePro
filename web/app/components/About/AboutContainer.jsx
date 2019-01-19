import React from 'react';
import Translate from 'react-translate-component';
import {NavigateActions} from '../../actions';
import {Link} from 'react-router';
import Logo from '../Forms/Logo';
import { bindActionCreators } from 'redux';
import { connect } from 'http2';

class AboutContainer extends React.Component {

  navigateToLogin() {
    this.props.navigateToDashboard();
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
                  onClick={ this.navigateToLogin.bind(this) }>
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
const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    navigateToSignIn: NavigateActions.navigateToSignIn,
    navigateToDashboard: NavigateActions.navigateToDashboard
  },
  dispatch
)

export default connect(null, mapDispatchToProps)(AboutContainer);