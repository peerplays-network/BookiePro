import React, {PureComponent} from 'react';
import {BettingModuleUtils, CurrencyUtils} from '../../../utility';
import Immutable from 'immutable';
import {incrementOdds, decrementOdds, adjustOdds, ODDS_BOUNDS} from './oddsIncrementUtils';

class BetTableInput extends PureComponent {
  constructor(props) {
    super(props);

    if (props.field === 'odds') {
      this.state = {
        value: props.text
          ? BettingModuleUtils.oddsFormatFilter(props.text, props.oddsFormat).toFixed(2)
          : ''
      };
    } else {
      this.state = {
        value: props.text
      };
    }

    this.delayAccelerator = 8;

    this.baseDelay = 250;
    this.modCounter = 0;
    this.delay = this.baseDelay;

    this.minDelay = 50;

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.clickArrowButton = this.clickArrowButton.bind(this);

    this.clickAndHoldIncrement = this.clickAndHoldIncrement.bind(this);
    this.clickAndHoldDecrement = this.clickAndHoldDecrement.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
  }

  handleChange(e) {
    let props = this.props;
    let value = e.target.value.replace(/[A-z*&^%$#@!(){};:'"?><,|+=_/~]/g, '').trim();
    let currencyType = CurrencyUtils.getCurrencyType(this.props.currencyFormat);
    // If the last character is a decimal in the odds, assume the user is still
    // entering a value.
    let allowDecimal = value.substr(value.length - 1) === '.';

    if (value.length > 0 && value.charAt(0) === '-' && props.oddsFormat === 'decimal') {
      return '';
    }

    if (value.charAt(0) === '.' && this.props.field === 'odds') {
      return '';
    }

    if (value.length > 1) {
      value = deepClean(value);
    }
    
    // We do not clean the odds if the user is still typing. ie: allow decimal while the input
    // field is active.
    if (value.length > 1 && this.props.field === 'odds' && !allowDecimal) {
      value = cleanOdds(value);
    }

    if (this.props.field === 'stake') {
      const stakePrecision =
        CurrencyUtils.fieldPrecisionMap[this.props.field][currencyType];

      if (stakePrecision === 0) {
        // should only accept integers greater than zero when precision is zero
        if (!/^[-+]?[1-9]\d*$/.test(e.target.value)) {
          // If the input data is invalid, reset the input to empty
          // It appears to the user like their input never happens.
          // Invalid = less than one or non-numeric characters
          this.setState({
            value: ''
          });

          // Allow us to set it back to an empty input
          if (e.target.value !== '') {
            return false;
          }
        }
      } else {
        const regex = new RegExp(`^\\d*\\.?\\d{0,${stakePrecision}}$`);

        if (!regex.test(e.target.value)) {
          return false;
        }
      }
    }

    const delta = Immutable.Map()
      .set('id', this.props.record.id)
      .set('field', this.props.field)
      .set('value', value);
    this.props.action(delta, this.props.currencyFormat);

    this.setState({
      value
    });

    /*
     * deepClean will strip any '.' or '-' that appear further in the string
     * Anytime the string '.' or '-' is found passed the 1st position in the string, 
     * the character will be replaced
     */
    function deepClean(str) {
      let charCount = {},
        cleanStr = str.split('');

      for (let i = 0; i < cleanStr.length; i++) {
        charCount[cleanStr[i]] = charCount[cleanStr[i]] ? charCount[cleanStr[i]] + 1 : 1;

        if (cleanStr[i] === '.' && charCount['.'] > 1) {
          cleanStr[i] = '';
        }

        if (cleanStr[i] === '-' && i > 0) {
          cleanStr[i] = '';
        }
      }

      return cleanStr.join().replace(/[,]/g, '');
    }

    function cleanOdds(str) {
      if (value.length > 1 && value.charAt(1) === '.' && props.oddsFormat === 'decimal') {
        return str;
      }

      let cleanStr = parseFloat(str);

      if (isNaN(cleanStr)) {
        return '';
      }

      let result = cleanStr;

      if (props.oddFormat === 'decimal') {
        if (cleanStr < ODDS_BOUNDS.decimal.min) {
          result = ODDS_BOUNDS.decimal.min;
        } else {
          result = ODDS_BOUNDS.decimal.max;
        }
      }

      if (props.oddFormat === 'american') {
        if (cleanStr < ODDS_BOUNDS.american.min) {
          result = ODDS_BOUNDS.american.min;
        } else {
          result = ODDS_BOUNDS.amertican.max;
        }
      }

      return result;
    }
  }

  clickArrowButton(record, action, updateOdds) {
    let odds = record.odds;

    if (!odds) {
      odds = ODDS_BOUNDS.decimal.min;
    } else {
      odds = updateOdds(adjustOdds(odds, record.bet_type));
      this.setState({
        value: BettingModuleUtils.oddsFormatFilter(odds, this.props.oddsFormat).toFixed(2)
      });
    }

    const delta = Immutable.Map()
      .set('id', record.id)
      .set('field', 'odds')
      .set('value', odds);
    action(delta, this.props.currencyFormat);
  }

  componentWillUpdate(nextProps) {
    if (!nextProps.record.updated) {
      if (nextProps.field === 'stake') {
        this.setState({
          value: nextProps.record.stake
        });
      } else if (nextProps.field === 'odds') {
        this.setState({
          value: nextProps.record.odds
        });
      }
    }
  }

  /*
   * Function :   handleBlur()
   * Author   :   Keegan Francis - k.francis@pbsa.info
   * Tickets  :   BOOK-246, BOOK-256, BOOK-262, BOOK-264,
   * Summary  :   It is useful to understand the flow of how ODDS is processed
   *              1. Odds Adjustment
   *                - Increment is applied
   *                - Odds is adjusted if not within the valid range
   *                - After this process, 'value' contains valid odds in decimal format
   *              2. Input field is upated to display the odds in the currently selected format
   *              3. Odds are sent to Redux for storage in decimal odds
   */
  handleBlur(e) {
    let value = e.target.value;

    if (e.target.value !== '0*') {
      value = parseFloat(value);

      if (this.props.field === 'odds') {
        if (value !== '' && !isNaN(value)) {
          value = adjustOdds(
            CurrencyUtils.formatFieldByCurrencyAndPrecision(
              this.props.field,
              value,
              this.props.currencyFormat
            ),
            this.props.record.bet_type,
            this.props.oddsFormat
          );
          this.setState({
            value: BettingModuleUtils.oddsFormatFilter(value, this.props.oddsFormat).toFixed(2)
          });
        } else {
          value = this.props.record.odds;
        }
      }

      if (this.props.field === 'stake') {
        if (isNaN(value)) {
          return false; // fail fast if the value is undefined or bad
        }

        value = CurrencyUtils.toFixed('stake', value, this.props.currencyFormat);

        // Final clean of the string
        if (value.toString().slice(-1) === '.') {
          value = value.toString().slice(0, -1);
        }

        this.setState({
          value
        });
      }
    }

    const delta = Immutable.Map()
      .set('id', this.props.record.id)
      .set('field', this.props.field)
      .set('value', value);
    this.props.action(delta, this.props.currencyFormat);
  }

  clickAndHoldIncrement() {
    if (++this.modCounter % this.delayAccelerator === 0) {
      this.delay = this.delay / 2;
    }

    if (this.delay <= this.minDelay) {
      this.delay = this.minDelay;
    }

    this.clickArrowButton(this.props.record, this.props.action, incrementOdds);
    this.t = setTimeout(this.clickAndHoldIncrement, this.delay);
  }

  clickAndHoldDecrement() {
    if (++this.modCounter % this.delayAccelerator === 0) {
      this.delay = this.delay / 2;
    }

    if (this.delay <= this.minDelay) {
      this.delay = this.minDelay;
    }

    this.clickArrowButton(this.props.record, this.props.action, decrementOdds);
    this.t = setTimeout(this.clickAndHoldDecrement, this.delay);
  }

  mouseUp() {
    this.modCounter = 0;
    this.delay = this.baseDelay;
    clearTimeout(this.t);
  }

  render() {
    const record = this.props.record;
    const isValidBetTotal = this.props.isValidBetTotal;
    const isEmpty = this.state.value === '' || this.state.value === undefined;
    var isValid = false;
    const profit_liability = record.profit && record.liability;
    const oddsPopulated = 
      record.odds !== undefined &&
      record.stake === undefined &&
      profit_liability === undefined;

    // Override the disabled state of the input fields if the default state of stake,
    // undefined, is present.
    if(isEmpty || oddsPopulated || this.props.autoOddsPopulated > 0){
      isValid = true;
    } else {
      isValid = isValidBetTotal;
    }

    return (
      <div>
        <input
          className={ isValid ? 'betTableInput' : 'betTableInput disabled' } 
          type='text'
          value={ this.state.value ? this.state.value : '' }
          onChange={ (e) => this.handleChange(e) }
          onBlur={ (e) => this.handleBlur(e) }
          placeholder={ this.props.field === 'odds' ? 'Odds' : 'Stake' }
          disabled={ this.props.disabled }
        />
        {this.props.field === 'odds' ? (
          <div>
            <a
              className='arrow-icon-main icon-up'
              onMouseDown={ this.clickAndHoldIncrement }
              onMouseUp={ this.mouseUp }
              onMouseLeave={ this.mouseUp }
            >
              <i className='icon-arrow icon-up-arrow' />
            </a>
            <a
              className='arrow-icon-main icon-down'
              onMouseDown={ this.clickAndHoldDecrement }
              onMouseUp={ this.mouseUp }
              onMouseLeave={ this.mouseUp }
            >
              <i className='icon-arrow icon-down-arrow' />
            </a>
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default BetTableInput;
