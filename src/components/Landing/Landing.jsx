import React, { Component } from 'react'
var I18n = require('react-redux-i18n').I18n;

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
          <a href>{I18n.t('landing.terms')}</a>
        </div>
      </div>
    )
  }
}

export default Landing;