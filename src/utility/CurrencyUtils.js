import {Config} from '../constants';
import React from 'react';
import bitFunBlack from '../assets/icons/bitfun_icon_black.svg';
import bitFunWhite from '../assets/icons/bitfun_icon_white.svg';
import mBitFunWhite from '../assets/icons/mbitfun_icon_white.svg';
import mBitFunBlack from '../assets/icons/mbitfun_icon_black.svg';

/**
 * The CurrencyUtils contains all the functions related to currency conversion function
 */
//const configCurrency = '\u0243';
const configCurrency = Config.features.currency;
const mCurrencySymbol = 'm' + configCurrency;
const coinDust = Config.dust.coin;
const miliCoinDust = Config.dust.miliCoin;
const exchangeCoin = Config.dust.exchangeCoin;
const stakeDust = exchangeCoin; // Three

// REVIEW: Some functions here do auto conversion from BTF to mBTF.
//         We need to be careful because sometimes the values we are handling
//         could be in satoshi unit.
//         The functions toFixed and toFixedWithSymbol are not performing this conversion.

var CurrencyUtils = {
  fieldPrecisionMap: {
    // Odds values have no dependency on currency but it is included in this map for
    // convenience's sake.
    odds: {
      BTF: 2,
      mBTF: 2
    },
    stake: {
      BTF: 3,
      mBTF: 0
    },
    profit: {
      BTF: 5,
      mBTF: 5
    },
    liability: {
      BTF: 5,
      mBTF: 5
    },
    exposure: {
      BTF: 2,
      mBTF: 2
    },
    transaction: {
      BTF: 5,
      mBTF: 2
    },
    avgStake: {
      BTF: 3,
      mBTF: 0
    },
    avgProfitLiability: {
      BTF: 5,
      mBTF: 2
    }
  },

  OFFER_PRECISION: 3,

  /**
   * substringPrecision()
   * This function uses string manipulation to manipulate the value of amount depending
   * on the precision value and whether or not accuracy is preferred
   * @param {any} amount - The amount to round/truncate
   * @param {any} precision - The amount of decimal places to keep
   * @param {boolean} [accuracy=true] - Whether or not to round to precision decimal places.
   *        True will round to precision decimal places
   *        False will truncate to precision decimal places
   * @param {string} currencyFormat -  the current currency format. Mili-coin or coin. 
   *        [ mBTF | BTF ]
   * @param {string} field -  The current field being acted on.
   * @param {boolean} skipDustCheck - Whether or not to skip checking dust and simply return 
   *        the input unmodified.
   * @returns - amount rounded/truncated to precision decimal places
   */
  substringPrecision(
    amount,
    precision,
    accuracy=true,
    currencyFormat='mBTF',
    field,
    skipDustCheck=false
  ) {
    if (!skipDustCheck){
      if (amount === undefined){
        amount = 0.0;
      }
      
      // Check if the value is dust.
      let isDust = this.isDust(currencyFormat, amount, field);
      
      if (!isDust) {
        let split = amount.toString().split('.');

        if (split[1] && split[1].length > precision){
          // Conditionally take the value one past the accpeted precision 
          let splitSel = split[1].substring(0, precision + (accuracy ? 1 : 0)); 
          let newAmount = split[0] + '.' + splitSel;
          // Then execute toFixed on the resulting amount. This keeps more accuracy.
          amount = parseFloat(newAmount).toFixed(precision); 
        } else {
          if (typeof(amount) === 'number'){
            amount = amount.toFixed(precision);
          }
        }
      } else {
        amount = 0 + '*';
      }
    }

    return amount;
  },

  getCurrencySymbol: function(currency='mBTF', color='black') {
    switch (currency) {
      case 'BTC':
        return (
          <img
            src='../../../assets/icons/bitcoin_icon_hover.svg'
            className='currency-symbol btf'
            alt='BTF'
          />
        );
      case 'mBTC':
        return (
          <img
            src='../../../assets/icons/mbitcoin_icon_hover.svg'
            className='currency-symbol mbtf'
            alt='mBTF'
          />
        );
      case 'BTF':
        if (color === 'white') {
          return <img src={ bitFunWhite } className='currency-symbol btf' alt='BTF' />;
        }

        return <img src={ bitFunBlack } className='currency-symbol btf' alt='BTF' />;
      case 'mBTF':
        if (color === 'white') {
          return <img src={ mBitFunWhite } className='currency-symbol mbtf' alt='mBTF' />;
        }

        return <img src={ mBitFunBlack } className='currency-symbol mbtf' alt='mBTF' />;
      default:
        break;
    }
  },

  /**
   * Get converted amount based on input currency and precision
   *
   * @param {float} amount - amount to be formatted, in terms of 'BTF'
   * @param {string} currency -  display currency, 'BTF' or 'mBTF'
   * @param {integer} precision - ( ***BTF*** base), either BettingModuleUtils.oddsPlaces or 
   *        BettingModuleUtils.stakePlaces or BettingModuleUtils.exposurePlaces
   * @param {boolan} accuracy - This value defaults to true as accuracy is typically preferred. 
   *        This parameter if set to false, will truncate to the number of decimal places equal to 
   *        precision (thus, less accuracy)
   * @param {boolan} avg - If true, the output is for the purpose of the averaging of bets in the 
   *        placed bets tab of the betslip.
   * @param {boolan} forExport - If true, the output is for the purposes of the bet history exports.
   * @param {string} field - Which field is being acted on currently
   * @param {boolan} skipDustCheck - If true, dust checking will be skipped.
   * @returns {string} - formatted string to support negative bitcoin curruency values
   */
  getFormattedCurrency: function(
    amount,
    currencyFormat='mBTF',
    precision=0,
    accuracy=true,
    avg=false,
    forExport=false,
    field,
    skipDustCheck
  ) {
    if (!isNaN(amount)) {
      if (amount === 0) {
        return amount;
      }

      if (currencyFormat === 'mBTF' || currencyFormat === mCurrencySymbol) {
        // 1 BTF = 1 * 10^3 mBTF
        const mPrecision = precision < 3 ? 0 : precision - 3;

        if (!accuracy) {
          return this.substringPrecision(
            1000 * amount,
            mPrecision,
            accuracy,
            currencyFormat,
            field
          );
        }

        if (forExport) {
          return this.substringPrecision(
            amount, 
            mPrecision, 
            false, 
            currencyFormat, 
            field, 
            skipDustCheck
          );
        }

        return avg
          ? this.substringPrecision(amount, precision, false, currencyFormat, field, skipDustCheck)
          : this.substringPrecision(
            1000 * amount, 
            mPrecision, 
            true,
            currencyFormat, 
            field, 
            skipDustCheck
          );
      }

      if (currencyFormat === 'BTF' || currencyFormat === configCurrency) {
        if (amount % 1 !== 0) {
          return this.substringPrecision(
            amount, 
            precision, 
            accuracy, 
            currencyFormat, 
            field, 
            skipDustCheck
          );
        } else {
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
   * Format BTF or mBTF value with the specified currency and prepend the result
   * with currency symbol. Internally, this function calls getFormattedCurrency and use the same
   * parameters except the last optional one.
   *
   * @param {float} amount - amount to be formatted, in terms of 'BTF'
   * @param {string} currency -  display currency, 'BTF' or 'mBTF'
   * @param {integer} precision - ( ***BTF*** base), either BettingModuleUtils.oddsPlaces or
   * BettingModuleUtils.stakePlaces or BettingModuleUtils.exposurePlaces
   * @param {boolean} spaceAfterSymbol -  if space needed to seperate currency symbole and amount.
   * @returns {string} - formatted BTF or mBTF value with currency symbol prepended
   */
  formatByCurrencyAndPrecisionWithSymbol: function(
    amount,
    currency='mBTF',
    precision=0,
    spaceAfterSymbol=false
  ) {
    let formatted = this.getFormattedCurrency(amount, currency, precision, true);

    if (isNaN(formatted)) {
      return 0;
    }

    // Note: Math.abs can take a string of valid number as argument
    if (currency === 'mBTF' || currency === mCurrencySymbol) {
      precision = precision < 3 ? 0 : precision - 3;
    }

    return (amount >= 0 ? '' : '-') + (spaceAfterSymbol ? ' ' : '') + formatted;
  },

  /**
    * Format Odds, Stake, Profit and Liability based on currency and precision.
    * The precision of each field is defined in requirements.
    *
    * This function is defined so that we don't need to do the field and precision
    * lookup in multiple places in the code.
    *
    * @param {float} amount - amount to be formatted, in terms of 'BTF'
    * @param {string} currency -  display currency, 'BTF' or 'mBTF'
    * @param {boolan} skipDustCheck - if true, do not check if value is dust. Used for placing bets.
    * @returns {string} - formatted BTF or mBTF value
    */
  formatFieldByCurrencyAndPrecision: function(field, amount, currency='mBTF', skipDustCheck) {
    // Odds values have no dependency on currency
    if (field === 'odds') {
      return amount.toFixed(2);
    }

    // DO NOT expect this but just in case...
    if (
      this.fieldPrecisionMap[field] === undefined ||
      this.fieldPrecisionMap[field][currency] === undefined
    ) {
      return amount;
    }

    return this.getFormattedCurrency(
      amount,
      currency,
      this.fieldPrecisionMap[field][currency],
      true,
      false,
      false,
      field,
      skipDustCheck
    );
  },

  /*
   * Call JavaScript's Number.toFixed with predefined precision value based on field name
   *
   * Parameters:
   *   field - the name of a field (odds, stake, profit, liability)
   *   amount - a JS Number (not a string)
   *   currency - either BTF or mBTF, based on setting
   *
   * Return the field value (amount) as a formatted string
   */
  toFixed: function(field, amount, currency='mBTF') {
    // DO NOT expect this but just in case...
    if (
      this.fieldPrecisionMap[field] === undefined ||
      this.fieldPrecisionMap[field][currency] === undefined
    ) {
      return amount;
    }

    let floatAmount = parseFloat(amount);

    if (field === 'stake') {
      if (
        (floatAmount < 1 && currency === 'mBTF') ||
        (floatAmount < 1 && currency === mCurrencySymbol)
      ) {
        return Config.mbtfTransactionFee.toString();
      }

      if (
        (floatAmount < 0.001 && currency === 'BTF') ||
        (floatAmount < 0.001 && currency === configCurrency)
      ) {
        return Config.btfTransactionFee.toString();
      }
    }

    if (amount % 1 !== 0 && !isNaN(amount)) {
      return this.substringPrecision(
        amount,
        this.fieldPrecisionMap[field][currency],
        true,
        currency,
        field
      );
    } else {
      return floatAmount.toFixed(this.fieldPrecisionMap[field][currency]);
    }
  },
  /*
   * Call JavaScript's Number.toFixed with predefined precision value based on field name
   * A currency symbol with be prepended to the result.
   * There is an option to insert an extra space after the symbol.
   *
   * Parameters:
   * field - the name of a field (odds, stake, profit, liability)
   * amount - a JS Number (not a string)
   * currency - either BTF or mBTF, based on setting
   * spaceAfterSymbol - true if a space should be added after the currency symbol in 
   * the formatted results
   *
   * Return the field value (amount) as a formatted string
   */
  toFixedWithSymbol: function(field, amount, currency='mBTF', spaceAfterSymbol=false) {
    return (
      (amount >= 0 ? '' : '-') +
      this.getCurrencySymbol(currency) +
      (spaceAfterSymbol ? ' ' : '') +
      this.toFixed(field, Math.abs(amount), currency)
    );
  },

  // BOOK-384
  // Author: Keegan Francis : k.francis@pbsa.rowInfo
  // This function will convert lay stake to the correct value
  layBetStakeModifier: function(stake, odds) {
    return stake / (odds - 1);
  },


  // Check if the currency is dust. If it is, append an asterik.
  isDust: (currencyFormat, amount, field) => {
    let dustRange, 
      isDust = false;

    if (amount) {
      // Handle negative amounts
      amount = Math.abs(amount);

      if (currencyFormat.toLowerCase().indexOf('m') === -1) {
        dustRange = coinDust;
      } else {
        dustRange = miliCoinDust;
      }

      // If the value coming is of 3 precision, its dust is different.
      if (amount % 1 !== 0 && amount.toString().split('.')[1].length === 3) {
        dustRange = exchangeCoin;
      }

      // Check the fields for overriding the general dust values.
      if (field === 'stake') {
        // Is the currency a mili coin? [ mBTF ]
        dustRange = stakeDust;
      }

      // If the amount is less than the configured dust values (Config.js), then 
      // change the display of that amount to indicate as such.
      if (amount < dustRange && amount !== 0) {
        isDust = true;
      }
    }

    return isDust;
  }
};

export default CurrencyUtils;
