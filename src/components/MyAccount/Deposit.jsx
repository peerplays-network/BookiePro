import React, {Component} from 'react';
let I18n = require('react-redux-i18n').I18n;
import {
  Card,
  Input,
} from 'antd';
import QRCode from 'qrcode.react';
import copy from 'copy-to-clipboard'

class Deposit extends Component{
  //Copy the Deposit Address to clipboard
  onClickCopy(depAddr,e) {
    e.preventDefault();
    copy(depAddr);
  }
  render(){
    return(
      <Card className={ this.props.cardClass }
            title={ I18n.t('myAccount.deposit') }>
        <p>{ I18n.t('myAccount.deposit_desc') }</p>
        <p className='text-center margin-tb-25'>
          <span className='bookie-qr'>
            <QRCode value={ JSON.stringify(this.props.depositAddress) }/>
          </span>
        </p>
        <div className='card-footer'>
          <div
            className='pos-rel'>
            <Input readOnly
                   className='bookie-input'
                   value={ this.props.depositAddress }
            />
            <button
              onClick={ this.onClickCopy.bind(this,this.props.depositAddress) }
              className='btn btn-regular inputWithButton'>
              { I18n.t('myAccount.copy') }
            </button>
          </div>
        </div>
      </Card>
    )
  }
}

export default Deposit;
