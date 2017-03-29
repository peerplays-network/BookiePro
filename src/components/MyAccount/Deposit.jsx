import React, {Component} from 'react';
let I18n = require('react-redux-i18n').I18n;
import {
  Card,
  Input,
} from 'antd';
import QRCode from 'qrcode.react';


class Deposit extends Component{
  render(){
    return(
      <Card className={ this.props.cardClass }
            title={ I18n.t('myAccount.deposit') }>
        <p>{ I18n.t('myAccount.deposit_desc') }</p>
        <p className='text-center margin-tb-30'>
          <QRCode
            value='http://facebook.github.io/react/'/>
        </p>
        <div
          className='registerComponent pos-relative'>
          <Input
            className='bookie-input'
            defaultValue='163WXbtyK3xrGEFhprM9JgzbZSyCKnc3AC'
          />
          <button
            className='btn btn-primary copy-btn'>
            { I18n.t('myAccount.copy') }
          </button>
        </div>
      </Card>
    )
  }
}

export default Deposit;