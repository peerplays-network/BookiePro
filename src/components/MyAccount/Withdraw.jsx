import React, {Component} from 'react';
let I18n = require('react-redux-i18n').I18n;
import {
  Card
} from 'antd';
import { Field, reduxForm } from 'redux-form/immutable';
import { LoadingStatus } from '../../constants';
import './Withdraw.less';
import { CurrencyUtils } from '../../utility';

//Component to render fields
const renderField = ({ className, errors, placeholder,hasWithdrawAmountErr, input, type,
  withdrawAmountErrMsg,
  meta: { touched, error } }) => (
  <div>
      <input className={ className } autoComplete='off'  { ...input }
         type={ type } placeholder={ placeholder }/>
       { (touched) && (error || hasWithdrawAmountErr) &&
          <span className='errorText'>
            { hasWithdrawAmountErr ? withdrawAmountErrMsg : error }
          </span> }
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

  constructor(props){
    super(props);
    this.state = {
      hasWithdrawAmountErr: false
    }
    this.onWithdrawAmountChange = this.onWithdrawAmountChange.bind(this);
  }

  //Check entered amount with user's available balance
  onWithdrawAmountChange(event){
    let withdrawAmount = event.target.value;
    if(!isNaN(withdrawAmount)){
      if((parseFloat(withdrawAmount) > this.props.convertedAvailableBalance)
        || parseFloat(withdrawAmount) === 0 || parseFloat(withdrawAmount) === -1){
        this.setState({ hasWithdrawAmountErr: true })
      } else {
        this.setState({ hasWithdrawAmountErr: false })
      }
    } else {
      this.setState({ hasWithdrawAmountErr: false })
    }
  }

  componentDidMount(){
    this.props.reset();
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.currencyFormat !== this.props.currencyFormat) {
      // Reset withdraw form when currency is changed
      this.props.reset();
    }
  }

  render(){
    const { invalid,asyncValidating,submitting,
            availableBalance,handleSubmit,withdrawLoadingStatus,currencyFormat,withdrawAmount } = this.props,
      isWithdrawLoadingStatusLoading = withdrawLoadingStatus===LoadingStatus.LOADING,
      isWithdrawLoadingStatusDone = withdrawLoadingStatus===LoadingStatus.DONE,
      isDisabled = invalid || submitting || asyncValidating ||
                       this.state.hasWithdrawAmountErr || isWithdrawLoadingStatusLoading,
      prefix = currencyFormat === 'BTC' ? 'icon-bitcoin' : ( currencyFormat === 'mBTC' ? 'icon-mbitcoin' : '');

    let withdrawCardTitle = '';
    if(withdrawLoadingStatus === LoadingStatus.DEFAULT)
      withdrawCardTitle = I18n.t('myAccount.withdraw');
    if(isWithdrawLoadingStatusDone)
      withdrawCardTitle = I18n.t('myAccount.withdraw_completed');

    return(
      <Card className={ this.props.cardClass } title={ withdrawCardTitle }>
        <div className='withdrawComponent'>
          { !isWithdrawLoadingStatusDone ? <p>{ I18n.t('myAccount.withdraw_desc') }</p> : null }
          { isWithdrawLoadingStatusDone ?
            <div className='withdraw-success-msg'>
              <p className='text-center'>
                { I18n.t('myAccount.withdraw_completed_msg_1') }  <span className='withdraw-success-amount'>
                 <i className={ prefix } ></i> { withdrawAmount }</span>   { I18n.t('myAccount.withdraw_completed_msg_2') }
              </p>
            </div> :

              <form onSubmit={ handleSubmit } className='withdrawForm'>
                <div className={ 'form-fields bookie-amount-field ' + prefix }>
                  <Field name='withdrawAmount' id='withdrawAmount' className='bookie-input bookie-amount'
                    onChange={ this.onWithdrawAmountChange }
                    onBlur={ this.onWithdrawAmountChange }
                    hasWithdrawAmountErr={ this.state.hasWithdrawAmountErr }
                    withdrawAmountErrMsg={ availableBalance!==-1 ? (I18n.t('myAccount.insuffBitcoinErr')
                                + this.props.convertedAvailableBalance
                                + ' ' + CurrencyUtils.getCurruencySymbol(currencyFormat))
                                : I18n.t('application.notAvailableErr') }
                    component={ renderField }  type='text' normalize={ normalizeAmount }/>
                </div>
                <div className='form-fields'>
                  <div className='card-footer'>
                    <Field name='walletAddr' id='walletAddr' className='bookie-input walletAddr-input'
                           component={ renderField } placeholder={ I18n.t('myAccount.send_value') } type='text'/>
                    <button
                      className={ 'btn inputWithButton ' + (isDisabled ? 'btn-regular-disabled':' btn-regular')  }
                      type='submit'
                      disabled={ isDisabled }>
                      { I18n.t('myAccount.send') }
                    </button>
                  </div>
                </div>
              </form>
          }
        </div>
      </Card>
    )
  }
}

export default reduxForm({
  form: 'withdrawForm',  // a unique identifier for this form
  fields: ['withdrawAmount', 'walletAddr'],
  destroyOnUnmount:false,
  //Form field validations
  validate: function submit(values) {
    let errors = {};
    if (!values.get('withdrawAmount')) {
      errors.withdrawAmount = I18n.t('myAccount.enter_withdrawAmount');
    }
    if (!values.get('walletAddr')) {
      errors.walletAddr = I18n.t('myAccount.enter_wallet_addr')
    }
    return errors;
  }
})(Withdraw)
