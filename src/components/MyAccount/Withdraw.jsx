import React, {Component} from 'react';
let I18n = require('react-redux-i18n').I18n;
import {
  Card,
  Input,
  Icon
} from 'antd';


class Withdraw extends Component{
  render(){
    return(
      <Card className={ this.props.cardClass }
            title={ I18n.t('myAccount.withdraw') }>
        <div className='my-account'>
          <p>{ I18n.t('myAccount.withdraw_desc') }</p>
          <div
            className='registerComponent'>
            <Input
              className='bookie-input bookie-amount'
              defaultValue='21221'
            />
          </div>
          <div className='bottom-div'>
            <div
              className='registerComponent pos-relative'>
              <Input
                className='bookie-input'
                placeholder={ I18n.t('myAccount.send_value') }
              />
              <button
                className='btn copy-btn btn-primary'>
                { I18n.t('myAccount.send') }
              </button>
            </div>
          </div>
        </div>
      </Card>
    )
  }
}

export default Withdraw;