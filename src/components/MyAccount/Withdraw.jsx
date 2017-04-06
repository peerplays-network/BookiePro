import React, {Component} from 'react';
let I18n = require('react-redux-i18n').I18n;
import {
  Card,
  Input
} from 'antd';
import { Field, Fields, reduxForm } from 'redux-form/immutable'


//Component to render the plain fields
const renderField = ({ tabIndex, errors, placeholder, input, type, meta: { touched, error } }) => (
  <div>
      <input autoFocus={ tabIndex === '1' } autoComplete='off'  { ...input }
         type={ type } placeholder={ placeholder } tabIndex={ tabIndex }/>
       { (touched) && error && <span className='errorText'>{error}</span> }
      { !error && errors && errors.length ? errors.map((err) => { return <span className='errorText' key={ err }>{ err }</span>}) : null }
  </div>
);

class Withdraw extends Component{

  constructor(props) {
    super(props);
    this.state = { value: '', hasAmtFieldErr: false, amtFieldErrMsg: '' };
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
    console.log('Available Balance: ' + this.props.availableBalance);
    if(this.state.value !==''){
      let amt = parseFloat(this.state.value);
      if(amt > this.props.availableBalance)
        this.setState({ hasAmtFieldErr: true });
      else
        this.setState({ hasAmtFieldErr: false });
    } else {
      this.setState({ hasAmtFieldErr: false });
    }


  }



  render(){
    const { prefix } = this.props;
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
              <span className='errorText'>
                { this.state.hasAmtFieldErr }
              </span>
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
