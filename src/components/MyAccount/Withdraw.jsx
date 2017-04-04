import React, {Component} from 'react';
let I18n = require('react-redux-i18n').I18n;
import {
  Card,
  Input
} from 'antd';

class Withdraw extends Component{

  constructor(props) {
    super(props);
    this.state = { value: '' };
  }
  // allow only numbers and decimal
  onAmountChange = (e) => {
    const { value } = e.target;
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      this.setState({ value });
    }
  }
  // '.' at the end or only '-' in the input box.
  onAmountBlur = () => {
    const { onBlur } = this.props;
    if (this.state.value.charAt(this.state.value.length - 1) === '.' || this.state.value === '-') {
      this.onChange({ value: this.state.value.slice(0, -1) });
    }
    if (onBlur) {
      onBlur();
    }
  }

  render(){
    const { currencyFormat } = this.props;
    const prefix = currencyFormat === 'BTC' ? 'B' : ( currencyFormat === 'mBTC' ? 'mB' : '');

    //TEST
    const errors = [];
    //errors[0] = 'You do not have sufficient bitcoin to withdraw, your current account balance is xxxBTC';

    return(
      <Card className={ this.props.cardClass }
            title={ I18n.t('myAccount.withdraw') }>
        <div className='my-account'>
          <p>{ I18n.t('myAccount.withdraw_desc') }</p>
          <div className='registerComponent'>
            <Input
              onChange={ this.onAmountChange }
              onBlur={ this.onAmountBlur }
              maxLength='25'
              className='bookie-input bookie-amount'
              prefix={ prefix }
              value={ this.state.value }
            />
          { errors && errors.length ? errors.map((err) => { return <span className='errorText' key={ err }>{ err }</span>}) : null }
          </div>
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
      </Card>
    )
  }
}

export default Withdraw;
