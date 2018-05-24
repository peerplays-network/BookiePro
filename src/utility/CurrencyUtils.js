import { Config } from '../constants';
import React from 'react';

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

  getCurrencySymbol: function( currency = 'BTC' ){
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
        //return <span dangerouslySetInnerHTML={{__html: "<svg>...</svg>"}} />;
        //return <img src='../../../assets/icons/bitfun_icon_hover.svg' alt='BTF'/>;
        /*const btf_svg = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" '
        +'xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"viewBox="0 0 27.7 27.7" '
        +'style="enable-background:new 0 0 27.7 27.7;" xml:space="preserve"><style type="text/css">'
        +'.st0{display:none;}</style><rect className="st0" width="27.7" height="27.7"/><polygon '
        +'points="25.1,6.5 25.1,1.6 15.5,1.6 8.5,1.6 8.5,6.5 8.5,10.8 2.6,10.8 2.6,14.2 8.5,14.2 '
        +'8.5,16 2.6,16 2.6,19.4 8.5,19.4 8.5,26.2 15.5,26.2 15.5,19.4 21.5,19.4 21.5,16 15.5,16 '
        +'15.5,14.2 21.5,14.2 21.5,10.8 15.5,10.8 15.5,6.5 "/></svg>'*/
        //return <div>{btf_svg}</div>
        return <span dangerouslySetInnerHTML={ { _html: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" '
        +'xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"viewBox="0 0 27.7 27.7" '
        +'style="enable-background:new 0 0 27.7 27.7;" xml:space="preserve"><style type="text/css">'
        +'.st0{display:none;}</style><rect className="st0" width="27.7" height="27.7"/><polygon '
        +'points="25.1,6.5 25.1,1.6 15.5,1.6 8.5,1.6 8.5,6.5 8.5,10.8 2.6,10.8 2.6,14.2 8.5,14.2 '
        +'8.5,16 2.6,16 2.6,19.4 8.5,19.4 8.5,26.2 15.5,26.2 15.5,19.4 21.5,19.4 21.5,16 15.5,16 '
        +'15.5,14.2 21.5,14.2 21.5,10.8 15.5,10.8 15.5,6.5 "/></svg>' } } />
      case 'mBTF':
        /*const mbtf_svg = '<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 30">'
        +'<title>Artboard 1</title><path d="M3.25,9.92l.09,2.23a7.42,7.42,0,0,1,6-2.6q4.2,0,5.73,3.23a7.47'
        +',7.47,0,0,1,6.4-3.23q6.6,0,6.72,7V30H24.72V16.75a4.6,4.6,0,0,0-1-3.22,4.33,4.33,0,0,0-3.3-1.06,'
        +'4.54,4.54,0,0,0-3.17,1.14,4.6,4.6,0,0,0-1.47,3.07V30H12.34V16.84q0-4.36-4.29-4.37a4.59,4.59,0,0'
        +',0-4.62,2.87V30H0V9.92Z"/><polygon points="52.4 10.25 52.4 5.31 42.8 5.31 35.8 5.31 35.8 10.25 '
        +'35.8 14.5 29.86 14.5 29.86 17.99 35.8 17.99 35.8 19.7 29.86 19.7 29.86 23.19 35.8 23.19 35.8 '
        +'29.93 42.8 29.93 42.8 23.19 48.74 23.19 48.74 19.7 42.8 19.7 42.8 17.99 48.74 17.99 48.74 14.5'
        +' 42.8 14.5 42.8 10.25 52.4 10.25"/></svg>';*/
        //return <div>{mbtf_svg}</div>
        return "<span dangerouslySetInnerHTML={ { _html: '<svg id=\"Layer_2\" data-name=\"Layer 2\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 56 30\">'
        +'<title>Artboard 1</title><path d=\"M3.25,9.92l.09,2.23a7.42,7.42,0,0,1,6-2.6q4.2,0,5.73,3.23a7.47'
        +',7.47,0,0,1,6.4-3.23q6.6,0,6.72,7V30H24.72V16.75a4.6,4.6,0,0,0-1-3.22,4.33,4.33,0,0,0-3.3-1.06,'
        +'4.54,4.54,0,0,0-3.17,1.14,4.6,4.6,0,0,0-1.47,3.07V30H12.34V16.84q0-4.36-4.29-4.37a4.59,4.59,0,0'
        +',0-4.62,2.87V30H0V9.92Z\"/><polygon points=\"52.4 10.25 52.4 5.31 42.8 5.31 35.8 5.31 35.8 10.25 '
        +'35.8 14.5 29.86 14.5 29.86 17.99 35.8 17.99 35.8 19.7 29.86 19.7 29.86 23.19 35.8 23.19 35.8 '
        +'29.93 42.8 29.93 42.8 23.19 48.74 23.19 48.74 19.7 42.8 19.7 42.8 17.99 48.74 17.99 48.74 14.5'
        +' 42.8 14.5 42.8 10.25 52.4 10.25\"/></svg>' } } />""
        //return <img src='../../../assets/icons/mbitfun_icon_hover.svg' alt='mBTF'/>;      
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
    const currencySymbol = this.getCurrencySymbol(currency);

    // Note: Math.abs can take a string of valid number as argument
    if (currency === 'mBTC' || currency === mCurrencySymbol) {
      precision = precision < 3 ? 0 : precision - 3;
    }

    return ( amount >= 0 ? '' : '-') + currencySymbol + (spaceAfterSymbol ? ' ' : '') + formatted;
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
      if ((floatAmount < 1 && currency === 'mBTC') || (floatAmount < 1 && currency === mCurrencySymbol)) return '1.00'
      if ((floatAmount < .001 && currency === 'BTC') || (floatAmount < .001 && currency === currencySymbol)) return '0.00100'
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
