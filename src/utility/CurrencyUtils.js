import {Config} from '../constants';
import React from 'react';
import UserIssuedAssets from '../constants/UserIssuedAssets';

/**
 * The CurrencyUtils contains all the functions related to currency conversion function
 */
const bitcoinSymbol = '\u0243';
const coinSymbol = Config.features.currency;
const mCoinSymbol = 'm' + coinSymbol;
const coinDust = Config.dust.coin;
const miliCoinDust = Config.dust.miliCoin;
const exchangeCoin = Config.dust.exchangeCoin;
const stakeDust = exchangeCoin; // Three

const btc = UserIssuedAssets.btc;
const btf = UserIssuedAssets.btf;


// REVIEW: Some functions here do auto conversion from BTF to mBTF.
//         We need to be careful because sometimes the values we are handling
//         could be in satoshi unit.
//         The functions toFixed and toFixedWithSymbol are not performing this conversion.

var CurrencyUtils = {
  fieldPrecisionMap: {
    // Odds values have no dependency on currency but it is included in this map for
    // convenience's sake.
    odds: {
      coin: 2,
      mCoin: 2
    },
    stake: {
      coin: 3,
      mCoin: 0
    },
    profit: {
      coin: 5,
      mCoin: 5
    },
    liability: {
      coin: 5,
      mCoin: 5
    },
    exposure: {
      coin: 2,
      mCoin: 2
    },
    transaction: {
      coin: 5,
      mCoin: 2
    },
    avgStake: {
      coin: 3,
      mCoin: 0
    },
    avgProfitLiability: {
      coin: 5,
      mCoin: 2
    }
  },

  minBetAmount: {
    BTF: .001,
    mBTF: 1
  },

  OFFER_PRECISION: 3,

  /**
   * Will format a numbers passed into it and correct rounding issues due to floating point numbers.
   *
   * @param {array} numArr - [@param {number} amount, @param {string} field].
   * @param {string} currencyType - 'coin' or 'mCoin'
   * @returns @param {number} numArr[0] - The amount that was passed in, corrected.
   */
  correctFloatingPointPrecision(numArr, currencyType) {
    let precision;

    precision = this.fieldPrecisionMap[numArr[1]][currencyType];
    numArr[0] = numArr[0].toFixed(precision);

    return parseFloat(numArr[0]);
  },

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
    currencyFormat=mCoinSymbol,
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

  getCurrencyType (currency = coinSymbol) {
    let type = 'coin';

    if (currency.indexOf('m') !== -1) {
      type = 'mCoin';
    }

    return type;
  },

  getCurrencySymbol (currency = mCoinSymbol, color='black') {
    switch (currency) {
      case 'BTC':
        if (color === 'white') {
          return (
            <img src={ btc.white } className='currency-symbol btc' alt={ bitcoinSymbol }/>
          );
        }

        return (
          <img src={ btc.black } className='currency-symbol btc' alt={ bitcoinSymbol }/>
        );
      case 'mBTC':
        if (color === 'white') {
          return (
            <img src={ btc.mWhite } className='currency-symbol mbtc' alt={ bitcoinSymbol } />
          );
        }

        return (
          <img src={ btc.mBlack } className='currency-symbol mbtc' alt={ mCoinSymbol }
          />
        );
      case 'BTF':
        if (color === 'white') {
          return <img src={ btf.white } className='currency-symbol btf' alt='BTF' />;
        }

        return <img src={ btf.black } className='currency-symbol btf' alt='BTF' />;
      case 'mBTF':
        if (color === 'white') {
          return <img src={ btf.mWhite } className='currency-symbol mbtf' alt='mBTF' />;
        }

        return <img src={ btf.mBlack } className='currency-symbol mbtf' alt='mBTF' />;
      default:
        break;
    }
  },

  /**
   * Get converted amount based on input currency and precision
   *
   * @param {float} amount - amount to be formatted, in terms of base coin
   * @param {string} currency -  display currency, base coin or mili base coin
   * @param {integer} precision - ( ***BTF*** base), either BettingModuleUtils.oddsPlaces or 
   *        BettingModuleUtils.stakePlaces or BettingModuleUtils.exposurePlaces
   * @param {boolan} accuracy - This value defaults to true as accuracy is typically preferred. 
   *        This parameter if set to false, will truncate to the number of decimal places equal to 
   *        precision (thus, less accuracy)
   * @param {boolan} avg - If true, the output is for the purpose of the averaging of bets in the 
   *        open bets tab of the betslip.
   * @param {boolan} forExport - If true, the output is for the purposes of the bet history exports.
   * @param {string} field - Which field is being acted on currently
   * @param {boolan} skipDustCheck - If true, dust checking will be skipped.
   * @returns {string} - formatted string to support negative bitcoin curruency values
   */
  getFormattedCurrency (
    amount,
    currencyFormat=mCoinSymbol,
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

      if (currencyFormat === mCoinSymbol) {
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
            true, 
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

      if (currencyFormat === coinSymbol) {
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
    return parseFloat(amount).toFixed(precision).toString();
  },

  /**
   * Format BTF or mBTF value with the specified currency and prepend the result
   * with currency symbol. Internally, this function calls getFormattedCurrency and use the same
   * parameters except the last optional one.
   *
   * @param {float} amount - amount to be formatted, in terms of base coin
   * @param {string} currency -  display currency, base coin or mili base coin
   * @param {integer} precision - ( ***BTF*** base), either BettingModuleUtils.oddsPlaces or
   * BettingModuleUtils.stakePlaces or BettingModuleUtils.exposurePlaces
   * @param {boolean} spaceAfterSymbol -  if space needed to seperate currency symbole and amount.
   * @returns {string} - formatted BTF or mBTF value with currency symbol prepended
   */
  formatByCurrencyAndPrecisionWithSymbol (
    amount,
    currency=mCoinSymbol,
    precision=0,
    spaceAfterSymbol=false
  ) {
    let formatted = this.getFormattedCurrency(amount, currency, precision, true);

    if (isNaN(formatted)) {
      return 0;
    }

    // Note: Math.abs can take a string of valid number as argument
    if (currency === mCoinSymbol) {
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
    * @param {float} amount - amount to be formatted, in terms of base coin
    * @param {string} currency -  display currency, base coin or mili base coin
    * @param {boolan} skipDustCheck - if true, do not check if value is dust. Used for placing bets.
    * @returns {string} - formatted BTF or mBTF value
    */
  formatFieldByCurrencyAndPrecision (
    field, 
    amount, 
    currency=mCoinSymbol, 
    skipDustCheck) {
    const currencyType = this.getCurrencyType(currency);

    // Odds values have no dependency on currency
    if (field === 'odds') {
      return amount.toFixed(2);
    }

    // DO NOT expect this but just in case...
    if (
      this.fieldPrecisionMap[field] === undefined ||
      this.fieldPrecisionMap[field][currencyType] === undefined
    ) {
      return amount;
    }

    return this.getFormattedCurrency(
      amount,
      currency,
      this.fieldPrecisionMap[field][currencyType],
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
  toFixed (field, amount, currency=mCoinSymbol) {
    const currencyType = this.getCurrencyType(currency);

    if (
      this.fieldPrecisionMap[field] === undefined ||
      this.fieldPrecisionMap[field][currencyType] === undefined
    ) {
      return amount;
    }

    let floatAmount = parseFloat(amount);

    if (field === 'stake') {
      if (floatAmount < 1 && currency === mCoinSymbol) {
        return this.minBetAmount.mBTF.toString();
      }

      if (floatAmount < 0.001 && currency === coinSymbol) {
        return this.minBetAmount.BTF.toString();
      }
    }

    if (amount % 1 !== 0 && !isNaN(amount)) {
      return this.substringPrecision(
        amount,
        this.fieldPrecisionMap[field][currencyType],
        true,
        currency,
        field
      );
    } else {
      return floatAmount.toFixed(this.fieldPrecisionMap[field][currencyType]);
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
  toFixedWithSymbol (field, amount, currency=mCoinSymbol, spaceAfterSymbol=false) {
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
  layBetStakeModifier (stake, odds) {
    return stake / (odds - 1);
  },


  // Check if the currency is dust. If it is, append an asterik.
  isDust (currencyFormat, amount, field) {
    let dustRange, 
      isDust = false;

    if (amount) {
      // Handle negative amounts
      amount = Math.abs(amount);

      // For edge cases where users have ended up with amounts in their transaction histories
      // reaching this function. 
      if (amount.toString().indexOf('e') !== -1) {
        isDust = true;
      } else {
        if (this.getCurrencyType(currencyFormat) === 'mCoin') {
          dustRange = miliCoinDust;
        } else {
          dustRange = coinDust;
        }

        // If the value coming is of 3 precision, its dust is different.
        if (amount % 1 !== 0 && 
            amount.toString().split('.')[1] &&
            amount.toString().split('.')[1].length === 3) {
          dustRange = exchangeCoin;
        }

        // Check the fields for overriding the general dust values.
        if (field === 'stake') {
          // Is the currency a mili coin? [ mBTF ]
          if (this.getCurrencyType(currencyFormat) === 'mCoin') {
            if (amount < 1) {
              isDust = true;
            }
          } else {
            dustRange = stakeDust;
          }
        }

        // If the amount is less than the configured dust values (Config.js), then 
        // change the display of that amount to indicate as such.
        if (amount < dustRange && amount !== 0) {
          isDust = true;
        }
      }
    }

    isDust=false;
    return isDust;
  }
};

export default CurrencyUtils;
