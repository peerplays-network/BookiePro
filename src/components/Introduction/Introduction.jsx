import React, { Component } from 'react'
import { Row, Col } from 'antd'
import PrivacyModal from '../Modal/PrivacyModal'
import { I18n, Translate } from 'react-redux-i18n';
import logo from '../../assets/images/bookie_logo_login.png';

class Landing extends Component{
  render(){
    return(
      <div className='introductionComponent'>
        <div className='middleContent'>
          <div className='header padding-15 clearfix'>
            <a href='#login' className='btn btn-trans float-right'> {I18n.t('landing.login')} </a>
          </div>
          <img src={ logo } height='148' width='132' alt=''/>
          <h2 className='title'> Bet From Anywhere in The World  </h2>
          <p> Sign-up and start betting in 2 <br/> minutes! </p>
          <a href='#signup' className='btn btn-regular'> Join Bookie Pro Now </a>
        </div>
        <div className='linksContent'>
          <div className='wrapper'>
            <Row className='align-center' type='flex' justify='space-between'>
              <Col>
                <a className='clearfix' href='#signup'>
                  <i className='account-icon'></i>
                  <div className='content'>
                    <h2> Register </h2>
                    <p> Create an account </p>
                  </div>

                </a>
              </Col>
              <Col>
                <div className='vertical-border'>

                </div>
              </Col>
              <Col>
                <a className='clearfix' href='#deposit'>
                  <i className='deposit-icon'></i>
                  <div className='content'>
                    <h2> Deposit </h2>
                    <p>Add wallet </p>
                  </div>
                </a>
              </Col>
              <Col>
                <div className='vertical-border'>

                </div>
              </Col>
              <Col>
                <a className='clearfix' href=''>
                  <i className='stack-icon'></i>
                  <div className='content'>
                    <h2> Balance </h2>
                    <p> Easy betting </p>
                  </div>
                </a>
              </Col>
            </Row>
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
