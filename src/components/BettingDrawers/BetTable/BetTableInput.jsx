import React, { PureComponent } from 'react';
import { BettingModuleUtils, CurrencyUtils } from '../../../utility'
import Immutable from 'immutable';
import { incrementOdds, decrementOdds, adjustOdds, MIN_ODDS } from './oddsIncrementUtils';

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
    let value = e.target.value.replace(/[A-z*&^%$#@!(){};:'"?><,|+=_/~]/g, '').trim()

    this.setState({
      value
    })
  }

  clickArrowButton(record, action, updateOdds) {
    let odds = record.odds;
    if (!odds) {
      odds = MIN_ODDS;
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

  handleBlur(e) {
    if ( e.target.value.length !== 0 && this.props.field === 'stake') {
      const stakePrecision = CurrencyUtils.fieldPrecisionMap[this.props.field][this.props.currencyFormat];
      if ( stakePrecision === 0) {
        // should only accept integers when precision is zero
        if (!/^[-+]?[1-9]\d*$/.test((e.target.value))) return false;
      } else {
        const regex = new RegExp(`^\\d*\\.?\\d{0,${stakePrecision}}$`);
        if (!regex.test(e.target.value)) return false;
      }
    }

    let value

    if (this.props.field === 'odds') {
      value = BettingModuleUtils.oddsFormatFilter(e.target.value, 'decimal', this.props.oddsFormat);
      if (value !== '') {
        value = adjustOdds(CurrencyUtils.formatFieldByCurrencyAndPrecision(
                  this.props.field, value, this.props.currencyFormat
                ), this.props.record.bet_type);
      } else {
        value = this.props.record.odds
      }
    }

    if (this.props.field === 'stake') {
      const floatNumber = parseFloat(e.target.value);
      if (isNaN(floatNumber)) return false; // fail fast if the value is undefined or bad
      value = CurrencyUtils.toFixed('stake', floatNumber, this.props.currencyFormat);
      this.setState({
        value: value
      })
    }

    const delta = Immutable.Map()
      .set('id', this.props.record.id)
      .set('field', this.props.field)
      .set('value', value);
    this.props.action(delta);

    // if (failed === '' && this.props.field === 'odds') e.target.value = BettingModuleUtils.oddsFormatFilter(this.props.record.odds, this.props.oddsFormat)
  }

  render() {
    return (
      <div>
        <input
          type='text'
          value={ this.state.value }
          onChange={ e => this.handleChange(e) }
          onBlur={ e => this.handleBlur(e) }
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
