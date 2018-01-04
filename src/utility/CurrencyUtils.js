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
      mBTC: 2
    },
    exposure: {
      BTC: 2,
      mBTC: 2
    }
  },

  getCurruencySymbol: function( currency = 'BTC' ){
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
   * @returns {string} - formatted string to support negative bitcoin curruency values
   */
  getFormattedCurrency: function(amount, currency = 'BTC', precision = 0){
    if (!isNaN(amount)) {
      if (currency === 'mBTC') {
        // 1 BTC = 1 * 10^3 mBTC
        const mPrecision = precision < 3 ? 0 : precision - 3;
        return ( 1000 * amount ).toFixed(mPrecision);
      }

      if (currency === 'BTC') {
        // Sometimes amount is a string type which will throw an
        // error unless its cast as a number. Add (1 * amount)
        return (1 * amount).toFixed(precision);
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
    const currencySymbol = this.getCurruencySymbol(currency);

    // Note: Math.abs can take a string of valid number as argument
    if (currency === 'mBTC') {
      precision = precision < 3 ? 0 : precision - 3;
    }

    return ( amount >= 0 ? '' : '-') + currencySymbol + (spaceAfterSymbol ? ' ' : '') + this.adjustCurrencyString(formatted);
  },

  adjustCurrencyString: function(string) {
    const LOWER_BOUND = 0
    const MID_BOUND = 1
    const UPPER_BOUND = 99999
    const NUM_ALLOWED_CHARS = 4;
    const stringValue = parseFloat(string)

    if (string.length >= NUM_ALLOWED_CHARS) {
      if (stringValue > LOWER_BOUND &&
          stringValue < MID_BOUND) {
        return stringValue.toFixed(NUM_ALLOWED_CHARS - 1) // If between 0 and 1, keep the 0. and 4 additional digits
      } else if (stringValue > LOWER_BOUND &&
          stringValue < UPPER_BOUND) {
        return stringValue.toPrecision(NUM_ALLOWED_CHARS) // If between 0 and 99999 keep 5 characters of the string
      } else if (stringValue > UPPER_BOUND) {
        return (stringValue / 1000) + ' k' // If larger than 100k, divide by 1000 and add a 'k'
      } else {
        return stringValue.toPrecision(NUM_ALLOWED_CHARS) // All else fails, return 5 most significant digits
      }
    }
    return string // Return the string as it is if it is not larger than 5 characters
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
    return parseFloat(amount).toFixed(this.fieldPrecisionMap[field][currency]);
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
    return (amount >= 0 ? '' : '-') + this.getCurruencySymbol(currency) +
           (spaceAfterSymbol ? ' ' : '') + this.toFixed(field, Math.abs(amount), currency);
  }
}

export default CurrencyUtils;
