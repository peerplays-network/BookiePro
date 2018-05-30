import {Config} from '../constants';
/**
 * The CurrencyUtils contains all the functions related to currency conversion function
 */
const bitcoinSymbol = '\u0243';
const mBitcoinSymbol = 'm' + bitcoinSymbol;

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
      BTC: 3,
      mBTC: 0
    },
    profit : {
      BTC: 5,
      mBTC: 2
    },
    liability : {
      BTC: 5,
      mBTC: 5
    },
    exposure: {
      BTC: 2,
      mBTC: 2
    }
  },

  OFFER_PRECISION: 3,

  isZero: function(num) {
    if (parseFloat(num) === 0 || num === 0)
      return '0'
    else
      return num;
  },

  
  /**
   * substringPrecision()
   * This function uses string manipulation to manipulate the value of amount depending on the precision value 
   *  and whether or not accuracy is preferred
   * @param {any} amount - The amount to round/truncate
   * @param {any} precision - The amount of decimal places to keep
   * @param {boolean} [accuracy=true] - Whether or not to round to precision decimal places. 
   *        True will round to precision decimal places
   *        False will truncate to precision decimal places
   * @returns - amount rounded/truncated to precision decimal places
   */
  substringPrecision(amount, precision, accuracy=true){
    let split = amount.toString().split('.');
    if (split[1].length > precision){
      let splitSel = split[1].substring(0, precision + (accuracy ? 1 : 0)); // Conditionally take the value one past the accpeted precision ,,.
      let newAmount = split[0] + '.' + splitSel;
      return parseFloat(newAmount).toFixed(precision); // Then execute toFixed on the resulting amount. This keeps more accuracy. 
    } else {
      return amount.toFixed(precision);
    }
  },

  getCurrencySymbol: function( currency = 'BTC' ){
    if ( currency === 'mBTC'){
      return mBitcoinSymbol;
    } else if ( currency === 'BTC'){
      return bitcoinSymbol;
    } else{
      return
    }
  },
  
  /**
   * Get converted amount based on input currency and precision
   *
   * @param {float} amount - amount to be formatted, in terms of 'BTC'
   * @param {string} currency -  display currency, 'BTC' or 'mBTC'
   * @param {integer} precision - ( ***BTC*** base), either BettingModuleUtils.oddsPlaces or BettingModuleUtils.stakePlaces or BettingModuleUtils.exposurePlaces
   * @param {boolan} accuracy - This value defaults to true as accuracy is typically preferred. This parameter if set to false, 
   *                              will truncate to the number of decimal places equal to precision (thus, less accuracy)
   * @returns {string} - formatted string to support negative bitcoin curruency values
   */
  getFormattedCurrency: function(amount, currencyFormat = 'BTC', precision = 0, accuracy=true){
    if (!isNaN(amount)) {
      if (amount === 0){
        return amount;
      }
      
      if (currencyFormat === 'mBTC') {
        // 1 BTC = 1 * 10^3 mBTC
        const mPrecision = precision < 3 ? 0 : precision - 3;
        return ( 1000 * amount ).toFixed(mPrecision);
      }

      if (currencyFormat === 'BTC') {
        if(amount % 1 !== 0){
          return this.substringPrecision(amount, precision, accuracy);
        }
        else{
          // Sometimes amount is a string type which will throw an
          // error unless its cast as a number. Add (1 * amount)
          return (1 * amount).toFixed(precision);
        }
      }
    }

    // Return the original value in string
    return amount.toFixed(precision).toString();
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
    let formatted = this.getFormattedCurrency(amount, currency, precision, true);
    if (isNaN(formatted)) return 0
    const currencySymbol = this.getCurrencySymbol(currency);

    // Note: Math.abs can take a string of valid number as argument
    if (currency === 'mBTC') {
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
      if (floatAmount < 1 && currency === 'mBTC') return Config.mbtfTransactionFee.toString()
      if (floatAmount < .001 && currency === 'BTC') return Config.btfTransactionFee.toString()
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
