import React, { Component } from 'react';
import {Icon, Row, Col, Input} from 'antd'
import QRCode from 'qrcode.react';
class Deposit extends Component{
  render() {
  return(
    <div className='sportsbg' id='main-content'>
      <div className='depositComponent' >
        <div className='wrapper'>
          <div className='text-center'>
            <Icon type='edit' />
            <h2 className='login-welcome'> Make a Deposit </h2>
            <div className='center-section deposit-content'>
              <Row type='flex' gutter='100' className='row-divided'>
                <Col className='or' span={ 12 }>
                  <p>
                    To deposit on your desktop computer or laptop, <b>copy and paste our address </b> into your wallet and complete the transaction.
                  </p>

                  <div
                    className='registerComponent pos-relative'>
                    <Input
                      className='bookie-input'
                      defaultValue='163WXbtyK3xrGEFhprM9JgzbZSyCKnc3AC'

                    />
                    <button
                      className='btn btn-regular copy-btn'>
                      Copy
                    </button>
                  </div>

                </Col>
                <div className='vertical-divider'>or</div>
                <Col span={ 12 }>
                  <p>To make a mobile deposit, open your Bitcoin wallet app on your smartphone or tablet and <b>scan the QR code.</b></p>
                  <div className='text-center'>
                    <p className='bookie-qr'><QRCode className='bookie-qr' value='http://facebook.github.io/react/' /></p>
                  </div>

                </Col>
              </Row>
              <div className='text-center registerComponent margin-top-40'>
                <button
                  className='btn btn-regular'>
                  Continue
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