import { Config } from '../constants';
import React from 'react';
import bitFunBlack from '../assets/icons/bitfun_icon_black.svg';
import bitFunWhite from '../assets/icons/bitfun_icon_white.svg';
import mBitFunWhite from '../assets/icons/mbitfun_icon_white.svg';
import mBitFunBlack from '../assets/icons/mbitfun_icon_black.svg';

/**
 * The CurrencyUtils contains all the functions related to currency conversion function
 */
//const currencySymbol = '\u0243';
const currencySymbol = Config.features.currency;
const mCurrencySymbol = 'm' + currencySymbol;

// REVIEW: Some functions here do auto conversion from BTC to mBTC.
//         We need to be careful because sometimes the values we are handling
//         could be in satoshi unit.
//         The functions toFixed and toFixedWithSymbol are not performing this conversion.

var CurrencyUtils = {

  fieldPrecisionMap: {
    //  Odds values have no dependency on currency but it is included in this map for convenience's sake.
    odds: {
      BTC: 2,
      mBTC: 2
    },
    stake: {
      BTC: 5,
      mBTC: 2
    },
    profit : {
      BTC: 5,
      mBTC: 2
    },
    liability : {
      BTC: 5,
      mBTC: 2
    },
    exposure: {
      BTC: 2,
      mBTC: 2
    }
  },

  isZero: function(num) {
    if (parseFloat(num) === 0 || num === 0)
      return '0'
    else
      return num;
  },

  substringPrecision(amount, precision){
    if (amount < 0 || amount === undefined){
      amount = "0.0";
    }
    let split = amount.toString().split('.');
    if (split[1].length > precision){
      let splitSel = split[1].substring(0, precision);
      let newAmount = split[0] + '.' + splitSel;
      return newAmount;
    } else {
      return amount;
    }
  },

  getCurrencySymbol: function( currency = 'BTC', color = 'black'){
    // if ( currency === 'mBTC' || currency === mCurrencySymbol){
    //   return mCurrencySymbol;
    // } else if ( currency === 'BTC' || currency === currencySymbol){
    //   return currencySymbol;
    // } else{
    //   return
    // }
    switch(currency){
      case 'BTC':
        return <img src='../../../assets/icons/bitcoin_icon_hover.svg' alt='BTC'/>;
      case 'mBTC':
        return <img src='../../../assets/icons/mbitcoin_icon_hover.svg' alt='mBTC'/>;
      case 'BTF':
        if (color === 'white')
          return <img src={ bitFunWhite } className='currency-symbol' alt='BTF'/>;
        return <img src={ bitFunBlack } className='currency-symbol' alt='BTF'/>;
      case 'mBTF':
        if (color === 'white')
          return <img src={ mBitFunWhite } className='currency-symbol' alt='mBTF'/>;
        return <img src={ mBitFunBlack } className='currency-symbol' alt='mBTF'/>;
      default:
        break;
    }
  },
  
  /**
   * Get converted amount based on input currency and precision
   *
   * @param {float} amount - amount to be formatted, in terms of 'BTC'
   * @param {string} currency -  display currency, 'BTC' or 'mBTC'
   * @param {integer} precision - ( ***BTC*** base), either BettingModuleUtils.oddsPlaces or BettingModuleUtils.stakePlaces or BettingModuleUtils.exposurePlaces
   * @returns {string} - formatted string to support negative bitcoin curruency values
   */
  getFormattedCurrency: function(amount, currency = 'BTC', precision = 0){
    if (!isNaN(amount)) {
      if (amount === 0){
        return amount;
      }
      
      if (currency === 'mBTC' || currency === mCurrencySymbol) {
        // 1 BTC = 1 * 10^3 mBTC
        const mPrecision = precision < 3 ? 0 : precision - 3;
        return ( 1000 * amount ).toFixed(mPrecision);
      }

      if (currency === 'BTC' || currency === currencySymbol) {
        if(amount % 1 !== 0){
          return this.substringPrecision(amount, precision);
        }
        else{
          // Sometimes amount is a string type which will throw an
          // error unless its cast as a number. Add (1 * amount)
          return (1 * amount).toFixed(precision);
        }
      }
    }

    // Return the original value in string
    return amount.toString();
  },


   /**
    *  Format BTC or mBTC value with the specified currency and prepend the result with currency symbol
    *  Internally, this function calls getFormattedCurrency and use the same parameters except the last optional one.
    *
    * @param {float} amount - amount to be formatted, in terms of 'BTC'
    * @param {string} currency -  display currency, 'BTC' or 'mBTC'
    * @param {integer} precision - ( ***BTC*** base), either BettingModuleUtils.oddsPlaces or BettingModuleUtils.stakePlaces or BettingModuleUtils.exposurePlaces
    * @param {boolean} spaceAfterSymbol -  if space needed to seperate currency symbole and amount.
    * @returns {string} - formatted BTC or mBTC value with currency symbol prepended
    */
  formatByCurrencyAndPrecisionWithSymbol: function(amount, currency, precision = 0, spaceAfterSymbol = false) {
    let formatted = this.getFormattedCurrency(amount, currency, precision);
    if (isNaN(formatted)) return 0

    // Note: Math.abs can take a string of valid number as argument
    if (currency === 'mBTC' || currency === mCurrencySymbol) {
      precision = precision < 3 ? 0 : precision - 3;
    }

    return ( amount >= 0 ? '' : '-') + (spaceAfterSymbol ? ' ' : '') + formatted;
  },

   /**
    * Format Odds, Stake, Profit and Liability based on currency and precision.
    * The precision of each field is defined in requirements.
    *
    * This function is defined so that we don't need to do the field and precision
    * lookup in multiple places in the code.
    *
    * @param {float} amount - amount to be formatted, in terms of 'BTC'
    * @param {string} currency -  display currency, 'BTC' or 'mBTC'
    * @returns {string} - formatted BTC or mBTC value
    */
  formatFieldByCurrencyAndPrecision: function(field, amount, currency) {
    // Odds values have no dependency on currency
    if (field === 'odds') return amount.toFixed(2);
    // DO NOT expect this but just in case...
    if (this.fieldPrecisionMap[field] === undefined || this.fieldPrecisionMap[field][currency] === undefined) return amount;
    return this.getFormattedCurrency(amount, currency, this.fieldPrecisionMap[field][currency]);
  },

  /*
   * Call JavaScript's Number.toFixed with predefined precision value based on field name
   *
   * Parameters:
   *   field - the name of a field (odds, stake, profit, liability)
   *   amount - a JS Number (not a string)
   *   currency - either BTC or mBTC, based on setting
   *
   * Return the field value (amount) as a formatted string
   */
  toFixed: function(field, amount, currency) {
    // DO NOT expect this but just in case...
    if (this.fieldPrecisionMap[field] === undefined || this.fieldPrecisionMap[field][currency] === undefined) return amount;
    let floatAmount = parseFloat(amount)
    if (field === 'stake') {
      if ((floatAmount < 1 && currency === 'mBTC') || (floatAmount < 1 && currency === mCurrencySymbol)) return Config.mbtfTransactionFee.toString()
      if ((floatAmount < .001 && currency === 'BTC') || (floatAmount < .001 && currency === currencySymbol)) return Config.btfTransactionFee.toString()
    }
    if(amount % 1 !== 0 && !isNaN(amount)){
      return this.substringPrecision(amount, this.fieldPrecisionMap[field][currency]);
    } else{
      return floatAmount.toFixed(this.fieldPrecisionMap[field][currency]);
    }
  },
  /*
   * Call JavaScript's Number.toFixed with predefined precision value based on field name
   * A currency symbol with be prepended to the result.
   * There is an option to insert an extra space after the symbol.
   *
   * Parameters:
   *   field - the name of a field (odds, stake, profit, liability)
   *   amount - a JS Number (not a string)
   *   currency - either BTC or mBTC, based on setting
   *   spaceAfterSymbol - true if a space should be added after the currency symbol in the formatted results
   *
   * Return the field value (amount) as a formatted string
   */
  toFixedWithSymbol: function(field, amount, currency, spaceAfterSymbol=false) {
    return (amount >= 0 ? '' : '-') + this.getCurrencySymbol(currency) +
           (spaceAfterSymbol ? ' ' : '') + this.toFixed(field, Math.abs(amount), currency);
  },

  // BOOK-384
  // Author: Keegan Francis : k.francis@pbsa.rowInfo
  // This function will convert lay stake to the correct value
  layBetStakeModifier: function(stake, odds) {
    return stake / (odds - 1)
  }
}

export default CurrencyUtils;
