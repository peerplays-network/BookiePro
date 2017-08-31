/**
 * This component represents the Withdraw form in My Account screen.
 * It uses 'redux-form' library to generate form fields and perform field validations
 * It is used in the MyAccount component
 */

import React, { PureComponent } from 'react';
let I18n = require('react-redux-i18n').I18n;
import {
  Card
} from 'antd';
import { Field, reduxForm } from 'redux-form/immutable';
import { LoadingStatus } from '../../../constants';
import './MyAccountWithdraw.less';
import { CurrencyUtils } from '../../../utility';

/**
 * Following is the stateless function that is passed as the 'component' prop to
 * redux-form's 'Field' components. It is used for generating all the field input controls.
 *
 * @param {object} - other custom props passed to the 'Field' component.
 *
 * The above object contains the following:
 *   className            : the css class name to apply to the control
 *   errors               : an object containing errors obtained after performing validations
 *                          It is used to display the error text below the input field generated
 *   placeholder          : the placeholder text for the input control
 *   hasWithdrawAmountErr : boolean to track if there are any custom errors in the withdraw amount field
 *                          They include insufficant balance or balance not available error
 *   input                : interally used by 'redux-form' to connect the input component to Redux
 *   type                 : the type of input control
 *   withdrawAmountErrMsg : the error text to display if there is any custom validation error on withdraw amount
 *   meta                 : contains metadata about the state of this field that redux-form is tracking.
 *     Some of the props that are used under meta prop are:
 *       touched          : true if the field has been touched. By default this will be set when the field is blurred.
 *       error            : The error for this field if its value is not passing validation.
 *                          Both synchronous, asynchronous, and submit validation errors will be reported here.
 */
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

/**
 * This is a 'redux-form' normalizer function.
 * It is executed every time the field on which the normalizer is placed, is changed.
 * It is used here to check the format of the withdraw amount field.
 * The function allows the user to type only numbers and a dot symbol (for decimal numbers)
 *
 * @param {string} value - the value of the field on which the normalizer is placed
 * @param {string} previousValue - the value of the field on which the normalizer is placed
 *                                 before the most recent change
 */
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

class MyAccountWithdraw extends PureComponent{

  constructor(props){
    super(props);
    this.state = {
      hasWithdrawAmountErr: false
    }
    this.onWithdrawAmountChange = this.onWithdrawAmountChange.bind(this);
  }

  /**
   * This function checks if the amount to withdraw entered by the user is less than
   * the user's wallet balance. It also checks if the user's balance is available
   *
   * @param {object} event - the onChange or onBlur event of the withdraw amount field
   */
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
    this.props.resetWithdrawLoadingStatus();
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.currencyFormat !== this.props.currencyFormat) {
      this.props.reset();
      this.props.resetWithdrawLoadingStatus();
    }
  }

  render(){

    const { invalid,asyncValidating,submitting,pristine,
            availableBalance,handleSubmit,withdrawLoadingStatus,currencyFormat,withdrawAmount } = this.props,
      isWithdrawLoadingStatusLoading = withdrawLoadingStatus===LoadingStatus.LOADING,
      isWithdrawLoadingStatusDone = withdrawLoadingStatus===LoadingStatus.DONE,
      isDisabled = invalid || submitting || asyncValidating || pristine ||
                       this.state.hasWithdrawAmountErr || isWithdrawLoadingStatusLoading,
      prefix = currencyFormat === 'BTC' ? 'icon-bitcoin' : ( currencyFormat === 'mBTC' ? 'icon-mbitcoin' : '');

    let withdrawCardTitle = I18n.t('myAccount.withdraw');
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
  //destroyOnUnmount:false,
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
})(MyAccountWithdraw)
