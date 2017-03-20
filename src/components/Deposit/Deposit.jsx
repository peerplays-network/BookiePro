import React, {Component} from 'react';
import {Icon, Row, Col, Input} from 'antd'
import QRCode from 'qrcode.react';
var I18n = require('react-redux-i18n').I18n;

class Deposit extends Component {
  render() {
    return (
      <div className='sportsbg' id='main-content'>
        <div className='depositComponent'>
          <div className='wrapper'>
            <div className='text-center'>
              <Icon type='edit'/>
              <h2 className='login-welcome'>  {I18n.t('deposit.title')} </h2>
              <div
                className='center-section deposit-content'>
                <Row type='flex' gutter='100'
                     className='row-divided'>
                  <Col className='or' span={ 12 }>
                    <p>
                      {I18n.t('deposit.left_description')}
                    </p>

                    <div
                      className='registerComponent pos-relative'>
                      <Input
                        className='bookie-input'
                        defaultValue='163WXbtyK3xrGEFhprM9JgzbZSyCKnc3AC'

                      />
                      <button
                        className='btn btn-regular copy-btn'>
                        {I18n.t('deposit.copy')}
                      </button>
                    </div>

                  </Col>
                  <div className='vertical-divider'>{I18n.t('deposit.or')}</div>
                  <Col span={ 12 }>
                    <p>{I18n.t('deposit.right_description')}
                    </p>
                    <div className='text-center'>
                      <p className='bookie-qr'><QRCode
                        className='bookie-qr'
                        value='http://facebook.github.io/react/'/>
                      </p>
                    </div>

                  </Col>
                </Row>
                <div
                  className='text-center registerComponent margin-top-40'>
                  <button
                    className='btn btn-regular'>
                    {I18n.t('deposit.continue')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Deposit;