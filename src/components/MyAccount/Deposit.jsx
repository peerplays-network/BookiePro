/**
 * This is the component used for fetching deposit information of the user in order to 
 * make a deposit
 * The user can make a deposit by
 *    Scanning the QR code version of the deposit address
 *    Entering the deposit address and copying it to the clipboard
 * It uses the
 *   'qrcode.react' library to generate the QR code from the deposit address
 *   'copy-to-clipboard' module to copy text to clipboard
 * It is used in the MyAccount and TopMenu components
 */
import React, {PureComponent} from 'react';
let I18n = require('react-redux-i18n').I18n;
import {Card, Input} from 'antd';
import QRCode from 'qrcode.react';
import copy from 'copy-to-clipboard';

export class Deposit extends PureComponent {
  /**
   * Copy the Deposit Address to clipboard
   * @param {string} depAddr - The deposit address that is to be copied to clipboard
   * @param {object} e - the 'Copy' button click event
   */
  onClickCopy(depAddr, e) {
    e.preventDefault();
    copy(depAddr);
  }
  render() {
    return (
      <Card className={ this.props.cardClass } title={ I18n.t('myAccount.deposit') }>
        <p>
          {I18n.t('myAccount.deposit_desc_1') +
            this.props.currency +
            I18n.t('myAccount.deposit_desc_2')}
        </p>
        <p className='text-center margin-tb-25'>
          <span className='bookie-qr'>
            <QRCode value={ JSON.stringify(this.props.depositAddress) } />
          </span>
        </p>
        <div className='card-footer'>
          <div className='pos-rel'>
            <Input readOnly className='bookie-input' value={ this.props.depositAddress } />
            <button
              onClick={ this.onClickCopy.bind(this, this.props.depositAddress) }
              className='btn btn-regular inputWithButton'
            >
              {I18n.t('myAccount.copy')}
            </button>
          </div>
        </div>
      </Card>
    );
  }
}

export default Deposit;
