import {Config} from '../constants';
import Field from './Field';
import React from 'react'; 
import {CurrencyUtils} from './';

import bitCoinBlack from '../assets/icons/bitcoin_icon_black.png';
import bitCoinWhite from '../assets/icons/bitcoin_icon_white.png';
import mBitCoinWhite from '../assets/icons/mbitcoin_icon_white.png';
import mBitCoinBlack from '../assets/icons/mbitcoin_icon_black.png';

import bitFunBlack from '../assets/icons/bitfun_icon_black.svg';
import bitFunWhite from '../assets/icons/bitfun_icon_white.svg';
import mBitFunWhite from '../assets/icons/mbitfun_icon_white.svg';
import mBitFunBlack from '../assets/icons/mbitfun_icon_black.svg';

const coinDust = Config.dust.coin;
const mCoinDust = Config.dust.miliCoin;
const exchangeCoin = Config.dust.exchangeCoin;
const miliStakeDust = 0;
const {OFFER_PRECISION} = CurrencyUtils;


class Currency {
  /**
   *Creates an instance of Currency.
   * @param {string | number} quantity
   * @param {string} field - profit, liability, stake, exposure, orderbook balance, quantity won
   * @param {string} currencyFormat - the configured currency. (ie: 'BTF', 'mBTF', 'BTC', etc...).
   * @memberof Currency
   */
  constructor(quantity, [field, precisionOverride], currencyFormat) {
    this.quantity = quantity;
    this.currencyFormat = currencyFormat;
    this.field = new Field(field, this.currencyType(), precisionOverride);

    this._display = this.display(); // Image symbol + string quantity
    this._symbol = this.symbol(); // Image symbol
    this._amount = this.amount(); // String quantity
  }

  // GETTER & SETTERS
  get quantity() {
    return this._quantity;
  }
  set quantity(value) {
    if (typeof value !== 'number') {
      this._quantity = this.fromString(value);
    } else {
      this._quantity = value;
    }
  }

  get currencyFormat() {
    return this._currencyFormat;
  }
  set currencyFormat(value) {
    this._currencyFormat = value;
  }

  // HELPER FUNCTIONS
  /**
   * Converts the provided currency quantity number into a string.
   *
   * @returns {string}
   * @memberof Currency
   */
  fromInt(value) {
    return value.toString();
  }
  /**
   * Converts the provided currency quantity string into a number.
   *
   * @returns {float}
   * @memberof Currency
   */
  fromString(value) {
    return parseFloat(value);
  }

  /**
   * Used to determine the string representation of a currency quantity for displaying throughout
   * Bookie.
   * May or may not be combined with other functions for inclusion of currency symbol image(s).
   * 
   * Uses a combination of string split and substringing to get a quantity. 
   * without rounding applied.
   * May still use .toFixed() depending on the situation.
   * 
   * @static
   * @param {boolean} [accuracy = true] - Whether or not to round to precision decimal places.
   *                       - True will round to precision decimal places
   *                       - False will truncate to precision decimal places
   * @param {boolean} [skipDustCheck = false] - In some circumstances, we do not want to check if
   *                                            a value is dust. 
   * @returns {string}
   * @memberof Currency
   */
  amount(accuracy = true, skipDustCheck = false) {
    let displayNum = this._quantity;

    if (!accuracy) {
      displayNum = displayNum * 1000;
    }

    // If true, the return display value is for average data.
    if (this.field.average) {
      // DO WE NEED SPECIAL HANDLING FOR THIS ANYMORE?
      // DO WE NEED SPECIAL HANDLING FOR EXPORT DATA?
    }

    if (!skipDustCheck) {
      //let precision = CurrencyUtils.fieldPrecisionMap[this._field._type][this.currencyType()];
      let precision = this.field.precision;

      switch(this.field.type) {
        case 'selector':
          precision = 0;
          break;
        case 'total':
          precision = OFFER_PRECISION;
          break;
      }

      if (this.field.type === 'selector') {
        precision = 0;
      }

      // Check if the quantity is dust.
      if (!this.isDust()) {
        let split = this._quantity.toString().split('.');

        if (split[1] && split[1].length > precision) {
          // Conditionally take tha value one past the accepted precision.
          let splitSel = split[1].substring(0, precision + (accuracy ? 1 : 0));
          let newQuantity = split[0] + '.' + splitSel;
          // Then, execute toFixed on the resulting quantity. This maintains accuracy.
          displayNum = parseFloat(newQuantity).toFixed(precision);
        } else {
          displayNum = this._quantity.toFixed(precision);
        }

        // Convert the value back into a number.
        displayNum = displayNum * 1;
      } else {
        displayNum = 0 + '*';
        displayNum = (
          <div className='tooltip'>
            {displayNum}
            <span className='tooltipText no-highlight'><a href='link/to/dust/in/faq'>Dust</a></span>
          </div>
        );
      }
    }

    return displayNum;
  }

  /**
   * Retrieves the image file corresponding to the currency.
   * Returns a HTML image tag.
   *
   * @static
   * @param {string} [color='black'] - determine which image file to use to display
   * @returns {HTMLImageElement}
   * @memberof Currency
   */
  symbol(color = 'black') {
    switch (this._currencyFormat) {
      case 'BTC':
        if (color === 'white') {
          return <img src={ bitCoinWhite } className='currency-symbol btc' alt='BTC' />;
        }
      
        return (
          <img src={ bitCoinBlack } className='currency-symbol btc' alt='BTC' />
        );
      case 'mBTC':
        if (color === 'white') {
          return <img src={ mBitCoinWhite } className='currency-symbol mbtc' alt='BTC' />;
        }

        return (
          <img src={ mBitCoinBlack } className='currency-symbol mbtc' alt='mBTC'/>
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
  }

  /**
   * Full Display: image symbol + amount
   * Combines two helper functions and return the result.
   *
   * @static
   * @param {boolean} accuracy - for use in displayCurrencyAmount()
   * @param {boolean} skipDustCheck - for use in displayCurrencyAmount()
   * @param {string} color - for use in displayCurrencySymbol()
   * @returns {HTMLImageElement + string} - Currency symbol image + amount
   * @memberof Currency
   */
  display(color, accuracy, skipDustCheck) {
    return(
      <div>
        {this.symbol(color)} {this.amount(accuracy, skipDustCheck)}
      </div>
    );
  }

  /**
   * Checks if the provided currency format is a base coin or a mili coin type.
   * Defaults to 'coin'.
   *
   * @returns {string} - Either 'coin' or 'mCoin' to represent base or mili format.
   * @memberof Currency
   */
  currencyType() {
    let type = 'coin';

    if (this._currencyFormat.indexOf('m') !== -1) {
      type = 'mCoin';
    }

    return type;
  }

  /**
   * Get the transactionFee.
   *
   * @returns {number} - One of two values from Config.js
   * @memberof Currency
   */
  static transactionFee() {
    let currencyType = this.currencyType();

    if (this._field === 'stake') {
      if (this._quantity < 1 && currencyType === 'mCoin') {
        return Config.mbtfTransactionFee.toString();
      }

      if (this._quantity < 0.001 && currencyType === 'coin') {
        return Config.btfTransactionFee.toString();
      }
    }
  }

  /**
   * Determine what the dust range is based on the currency objects attributes.
   *
   * @returns {number} - What the dust value is.
   * @memberof Currency
   */
  dustRange() {
    let currencyType, dustRange;
    // Check the currency format.
    // mili coin & base coin have different dust rules.
    currencyType = this.currencyType();

    if (currencyType === 'coin') {
      dustRange = coinDust;
    } else { // 'mCoin'
      // Is the field STAKE?
      if (this._field === 'stake') {
        dustRange = miliStakeDust;
      } else {
        dustRange = mCoinDust;
      }
    }

    // If the quantity is of three precision, it is either a STAKE field or a field used in 
    // ComplexBettingWidget or SimpleBettingWidget offer fields.
    // Is quantity from one of the betting widgets?
    const hasDecimal = this._quantity.toString().indexOf('.') !== -1;

    if (this._quantity % 1 !== 0 && hasDecimal) {
      if(this._quantity.toString().split('.')[1].length === 3) {
        dustRange = exchangeCoin;
      }
    }

    return dustRange;
  }

  /**
   * Determine if the value qualifies as dust.
   *
   * @returns {boolean} - True | False to indicate if the quantity is dust.
   * @memberof Currency
   */
  isDust() {
    let dustRange,
      tempQuantity,
      currencyType,
      isDust = false;

    // Handle negative amounts
    tempQuantity = Math.abs(this._quantity);

    // Check the currency format.
    // mili coin & base coin have different dust rules.
    currencyType = this.currencyType();
    // Get the dust range.
    dustRange = this.dustRange();

    // Stake plus miliCoin format has a special dust rule.
    if (this._field === 'stake' && currencyType === 'mCoin') {
      // The quantity must be a whole number to not be considered dust.
      if (tempQuantity % 1 !== dustRange) {
        isDust = true;
      }
    }

    // If the quantity is less thatn the configured dust values (Config.js).
    if (tempQuantity < dustRange && tempQuantity !== 0) {
      isDust = true;
    }

    return isDust;
  }
}

export default Currency;
