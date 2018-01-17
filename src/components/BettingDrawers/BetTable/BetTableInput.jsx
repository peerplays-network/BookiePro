import React, { PureComponent } from 'react';
import { BettingModuleUtils, CurrencyUtils } from '../../../utility'
import Immutable from 'immutable';
import { incrementOdds, decrementOdds, adjustOdds, ODDS_BOUNDS } from './oddsIncrementUtils';

class BetTableInput extends PureComponent {
  constructor(props) {
    super(props)
    if (props.field === 'odds') {
      this.state = {
        value: props.text ? BettingModuleUtils.oddsFormatFilter(props.text, props.oddsFormat) : ''
      }
    } else {
      this.state = {
        value: props.text
      }
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.clickArrowButton = this.clickArrowButton.bind(this)
  }

  handleChange(e) {
    let props = this.props
    let value = e.target.value.replace(/[A-z*&^%$#@!(){};:'"?><,|+=_/~]/g, '').trim()

    if (value.length > 0 && value.charAt(0) === '-' && props.oddsFormat === 'decimal') return ''
    if (value.length > 1) value = deepClean(value)
    if (value.length > 1 && this.props.field === 'odds') value = cleanOdds(value)


    if (e.target.value.length !== 0 && this.props.field === 'stake') {
      const stakePrecision = CurrencyUtils.fieldPrecisionMap[this.props.field][this.props.currencyFormat];
      if ( stakePrecision === 0) {
        // should only accept integers when precision is zero
        if (!/^[-+]?[1-9]\d*$/.test((e.target.value))) return false;
      } else {
        const regex = new RegExp(`^\\d*\\.?\\d{0,${stakePrecision}}$`);
        if (!regex.test(e.target.value)) return false;
      }
    }

    const delta = Immutable.Map()
      .set('id', this.props.record.id)
      .set('field', this.props.field)
      .set('value', value);
    this.props.action(delta);

    this.setState({
      value
    })


    /*
     * deepClean will strip any '.' or '-' that appear further in the string
     *  Anytime the string '.' or '-' is found passed the 1st position in the string, the character will be replaced
     */
    function deepClean(str) {
      let charCount = {}, cleanStr = str.split('')
      for (let i = 0; i < cleanStr.length; i++) {
        charCount[cleanStr[i]] = charCount[cleanStr[i]] ? charCount[cleanStr[i]] + 1 : 1
        if (cleanStr[i] === '.' && charCount['.'] > 1) cleanStr[i] = ''
        if (cleanStr[i] === '-' && i > 0) cleanStr[i] = ''
      }
      return cleanStr.join().replace(/[,]/g, '')
    }

    function cleanOdds(str) {
      if (value.length > 1 && value.charAt(1) === '.' && props.oddsFormat === 'decimal') return str
      let cleanStr = parseFloat(str)
      if (isNaN(cleanStr)) return ''
      if (props.oddsFormat === 'decimal' && cleanStr < ODDS_BOUNDS.decimal.min) return ODDS_BOUNDS.decimal.min
      if (props.oddsFormat === 'decimal' && cleanStr > ODDS_BOUNDS.decimal.max) return ODDS_BOUNDS.decimal.max
      if (props.oddsFormat === 'american' && cleanStr < ODDS_BOUNDS.american.min) return ODDS_BOUNDS.american.min
      if (props.oddsFormat === 'american' && cleanStr > ODDS_BOUNDS.american.max) return ODDS_BOUNDS.american.max
    }
  }

  clickArrowButton(record, action, updateOdds) {
    let odds = record.odds;
    if (!odds) {
      odds = ODDS_BOUNDS.decimal.min;
    } else {
      // REVIEW the odds value is adjusted first because the dummy data may contain
      //        incorrect odds values that could never happen in the real Blockchain
      odds = updateOdds(adjustOdds(odds, record.bet_type));
      this.setState({
        value: BettingModuleUtils.oddsFormatFilter(odds, this.props.oddsFormat)
      })
    }
    const delta = Immutable.Map()
      .set('id', record.id)
      .set('field', 'odds')
      .set('value', odds);
    action(delta);
  }

  componentWillUpdate(nextProps, nextState) {
    if (!nextProps.record.updated) {
      if (nextProps.field === 'stake') {
        this.setState({
          value: nextProps.record.original_stake
        })
      } else if (nextProps.field === 'odds') {
        this.setState({
          value: nextProps.record.original_odds
        })
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
    let value = parseFloat(e.target.value)
    if (this.props.field === 'odds') {
      if (value !== '' && !isNaN(value)) {
        value = adjustOdds(CurrencyUtils.formatFieldByCurrencyAndPrecision(
                  this.props.field, value, this.props.currencyFormat
                ), this.props.record.bet_type, this.props.oddsFormat);
        this.setState({
          value: BettingModuleUtils.oddsFormatFilter(value, this.props.oddsFormat)
        })
      } else {
        value = this.props.record.odds
      }
    }

    if (this.props.field === 'stake') {
      if (isNaN(value)) return false; // fail fast if the value is undefined or bad
      value = CurrencyUtils.toFixed('stake', value, this.props.currencyFormat);
      this.setState({
        value: value
      })
    }

    const delta = Immutable.Map()
      .set('id', this.props.record.id)
      .set('field', this.props.field)
      .set('value', value);
    this.props.action(delta);
  }

  render() {
    return (
      <div>
        <input
          className='betTableInput'
          type='text'
          value={ this.state.value }
          onChange={ e => this.handleChange(e) }
          onBlur={ e => this.handleBlur(e) }
          placeholder={ this.props.field === 'odds' ? 'Odds' : 'Stake' }
          />
        { this.props.field === 'odds' ?
          <div>
            <a className='arrow-icon-main icon-up' onClick={ () => this.clickArrowButton(this.props.record, this.props.action, incrementOdds) }><i className='icon-arrow icon-up-arrow'></i></a>
            <a className='arrow-icon-main icon-down' onClick={ () => this.clickArrowButton(this.props.record, this.props.action, decrementOdds) }><i className='icon-arrow icon-down-arrow'></i></a>
          </div>
          : ''
        }
      </div>
    )
  }
}

export default BetTableInput
