import React, { Component } from 'react'
import PrivacyModal from '../Modal/PrivacyModal'
import { I18n, Translate } from 'react-redux-i18n';
class Landing extends Component{
  render(){
    return(
      <div className='splashComponent'>
        <div className='wrapper'>
          <div className='header padding-15 clearfix'>
            <a href='#login' className='btn btn-trans float-right'> {I18n.t('landing.login')} </a>
          </div>
          <div className='intro-banner pos-rel'>
            <div className='content pos-abs'>
              <p> {I18n.t('landing.slogan')} </p>
              <a href='#signup' className='btn btn-regular'> {I18n.t('landing.signup')} </a>
            </div>
          </div>
        </div>
        <div className='footer clearfix'>
          <a href>{I18n.t('landing.copyright')}</a>
          <span className='padding-lr-5'> | </span>
          <PrivacyModal title={ I18n.t('landing.privacy_policy') } parentClass='privacy' buttonTitle={ I18n.t('landing.privacy_policy') } >
              <Translate value='privacy_dialogue.content' dangerousHTML/>
          </PrivacyModal>
        </div>
      </div>
    )
  }
}

export default Landing;
