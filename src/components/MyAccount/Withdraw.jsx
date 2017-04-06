import React, {Component} from 'react';
let I18n = require('react-redux-i18n').I18n;
import {
  Input,
  Card
} from 'antd';
import { Field, reduxForm } from 'redux-form/immutable'
import { LoadingStatus } from '../../constants'

//Component to render fields
const renderField = ({ tabIndex, errors, placeholder, input, type, hasWithdrawAmtErr,withdrawAmtExceedErrMsg,
    meta: { touched, error } }) => (
  <div>
      <input autoFocus={ tabIndex === '1' } autoComplete='off'  { ...input }
         type={ type } placeholder={ placeholder } tabIndex={ tabIndex }/>
       { (touched) && (error || hasWithdrawAmtErr) && <span className='errorText'>{hasWithdrawAmtErr ? withdrawAmtExceedErrMsg : error}</span> }
      { !error && errors && errors.length ? errors.map((err) => { return <span className='errorText' key={ err }>{ err }</span>}) : null }
  </div>
);

//Allow decimal numbers
const normalizeAmount = (value, previousValue) => {
  if(!value.length) {
    return value;
  }
  const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
  if(!reg.test(value)) {
    return previousValue && previousValue.toLowerCase();
  }
  return value;
};

class Withdraw extends Component{

  //TODO: TESTING THIS
  /*constructor(props){
    super(props);
    this.state = {
      hasWithdrawAmtErr: false
    }
    this.onWithdrawAmtChange = this.onWithdrawAmtChange.bind(this);
  }
  onWithdrawAmtChange(e){
    let withdrawAmt = e.target.value;
    console.log(withdrawAmt);
    if(!isNaN(withdrawAmt)){
      //If the withdraw amount entered is less than the user's available balance, generate error
      if((parseFloat(withdrawAmt) > 10) || parseFloat(withdrawAmt) === 0){
        this.setState({ hasWithdrawAmtErr: true })
      } else {
        this.setState({ hasWithdrawAmtErr: false })
      }
    } else {
      this.setState({ hasWithdrawAmtErr: false })
    }
  }*/

  render(){
    const { invalid,asyncValidating,submitting,
            onWithdrawAmtChange,hasWithdrawAmtErr,prefix,availableBalance,handleSubmit,withdrawLoadingStatus,withdrawCardTitle } = this.props;
    const isDisabled = invalid || submitting || asyncValidating ||
                       hasWithdrawAmtErr || withdrawLoadingStatus===LoadingStatus.LOADING;

    return(
      <Card className={ this.props.cardClass } title={ withdrawCardTitle }>
        <div className='my-account'>
          <p>{ I18n.t('myAccount.withdraw_desc') }</p>
          <div className='registerComponent'>
            <Input
              onChange={ this.onAmountChange }
              onBlur={ this.onAmountBlur }
              maxLength='25'
              className='bookie-input bookie-amount'
              defaultValue='21221'
              prefix={ prefix }
              value={ this.state.value }
            />
              <span className='errorText'>
                { this.state.hasAmtFieldErr }
              </span>
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
          { withdrawLoadingStatus !== 'done' ? <p>{ I18n.t('myAccount.withdraw_desc') }</p> : null }
          { withdrawLoadingStatus === 'done' ?
            <div className='registerComponent'>
              <p>
                You have successfully withdrawn from your account and transferred it to your wallet.
              </p>
            </div> :
            <div className='registerComponent'>
              <form onSubmit={ handleSubmit }>
                <div className='form-fields'>
                    <Field name='withdrawAmt' id='withdrawAmt' className='bookie-input bookie-amount'
                      onChange={ onWithdrawAmtChange }
                      hasWithdrawAmtErr={ hasWithdrawAmtErr }
                      withdrawAmtExceedErrMsg={ I18n.t('myAccount.insuffBitcoinErr') + availableBalance + prefix }
                      component={ renderField }  type='text' normalize={ normalizeAmount } />
                </div>
                <div className='form-fields'>
                    <Field name='walletAddr' id='walletAddr' className='bookie-input'
                      component={ renderField } placeholder={ I18n.t('myAccount.send_value') } type='text'/>
                </div>
                <div className='form-fields'>
                  <button
                    type='submit'
                    disabled={ isDisabled }
                    className={ 'btn ' + (isDisabled ? 'copy-btn-disabled':' copy-btn') + ' btn-primary' }>
                    { withdrawLoadingStatus==='loading'  ? I18n.t('application.loading') : I18n.t('myAccount.send') }
                  </button>
                </div>
              </form>
            </div>
          }
        </div>
      </Card>
    )
  }
}

export default reduxForm({
  form: 'withdrawForm',  // a unique identifier for this form
  fields: ['withdrawAmt', 'walletAddr'],
  //Form field validations
  validate: function submit(values) {
    let errors = {};
    if (!values.get('withdrawAmt')) {
      errors.withdrawAmt = I18n.t('myAccount.enter_withdrawAmt')
    }
    if (!values.get('walletAddr')) {
      errors.walletAddr = I18n.t('myAccount.enter_wallet_addr')
    }
    return errors;
  }
})(Withdraw)
