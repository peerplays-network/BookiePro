import React from 'react';
import {Field, reduxForm, formValueSelector} from 'redux-form';
import counterpart from 'counterpart';
import classNames from 'classnames';
import asset_utils from 'common/asset_utils';
import {connect} from 'react-redux';
import moment from 'moment';
import AccountRepository from 'repositories/AccountRepository';
import AssetHelper from 'helpers/AssetHelper';
import Translate from 'react-translate-component';
import {DateField, DatePicker} from 'react-date-picker';
import 'react-date-picker/index.css';

import {WithContext as ReactTags} from 'react-tag-input';

const renderFieldNumberOfPlayers = (
  {className, placeholder, input, type, meta: {touched, error}}
) => (
  <div className='row2'>
    <Translate component='label' className='label' content='games.rps_game.num_of_players' />
    <input
      { ...input }
      type={ type }
      placeholder={ placeholder }
      className={ (touched && error)
        ? (className + ' error')
        : className }
    />
    {touched && error && <span className='error__hint'>{error}</span>}
  </div>
);

const renderFieldInput = ({className, placeholder, input, type, meta: {touched, error}}) => (
  <div>
    <input
      { ...input }
      type={ type }
      placeholder={ placeholder }
      className={ (touched && error)
        ? (className + ' error')
        : className }
    />
    {touched && error && <span className='error__hint'>{error}</span>}
  </div>
);



const normalizeNumberOfPlayers = (value, previousValue) => {
  if (value === '' || (/^\d*$/.test(value) && value > 0 && value <= 64)) {
    return parseInt(value);
  }

  return previousValue;
};

const _checkMaxPrecision = (value, precision) => {
  let valueString = value.toString(),
    splitString = valueString.split('.');

  return (splitString.length === 2 && splitString[1].length > precision);
};

const normalizeAmount = (value, previousValue, precision) => {

  if (
    (!isNaN(parseFloat(value)) && isFinite(value) && !_checkMaxPrecision(value, precision)) ||
    value === '' ||
    value === 0
  ) {
    if (value === '') {
      return value;
    }

    value = value.replace('-', '').replace(/^0+(?=\d)/, '');

    return value.trim();
  }

  return previousValue;
};


class CreateForm extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      showBuyInMenu : false
    };

    this.INIT_SYMBOL = null;
    this.hideBuyIn = this.hideBuyIn.bind(this);
  }

  componentWillMount() {
    document.addEventListener('click', this.hideBuyIn);
    this.handleInitialize();
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.hideBuyIn);
  }

  componentWillReceiveProps(nextProps) {

    if (this.props.buyInSymbol === null && nextProps.unit) {
      this.props.change('buy_in_asset_symbol', nextProps.unit);
      this.INIT_SYMBOL = nextProps.unit;
    }

    if (this.props.buyInSymbol !== nextProps.buyInSymbol) {
      this.props.change(
        'buy_in_amount', this.getMinAmount(nextProps.unitList, nextProps.buyInSymbol)
      );
    }
  }

  handleInitialize() {
    this.props.initialize({
      suggestions: [],
      suggestionsResults: [],
      whitelist: [],
      number_of_players: 2,
      start_time: moment(new Date().getTime() + 1 * 60 * 60 * 1000)
        .format('MMMM D, YYYY hh:mm A Z'),
      buy_in_amount: 0,
      buy_in_asset_symbol: this.INIT_SYMBOL,
      has_started: false,
      start_delay: 2 * 60,
      round_delay: 10,
      number_of_wins: 3,
      insurance_enabled: false,
      time_per_commit_move: 25,
      time_per_reveal_move: 25,
      registration_deadline: moment(new Date().getTime() + 1 * 60 * 60 * 1000)
        .format('MMMM D, YYYY hh:mm A Z')
    });
  }

  getUnitObject(unitList, buyInSymbol) {
    return unitList.find((unit) => {
      return buyInSymbol === unit.get('symbol');
    });
  }

  getMinAmount(unitList, buyInSymbol) {

    let currentUnitObject = this.getUnitObject(unitList, buyInSymbol),
      minValue = 0;

    if (currentUnitObject) {
      let precision = AssetHelper.getAssetPrecision(currentUnitObject.get('precision'));
      minValue = 1 / precision;
    }

    return minValue;
  }

  getPrecisionAmount(unitList, buyInSymbol) {
    let currentUnitObject = this.getUnitObject(unitList, buyInSymbol);

    if (currentUnitObject) {
      return currentUnitObject.get('precision');
    }

    return 0;
  }

  toggleBuyIn(e) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    if (this.state.showBuyInMenu) {
      this.hideBuyIn();
    } else {
      this.showBuyIn(e);
    }
  }

  hideBuyIn() {
    if (this.state.showBuyInMenu) {
      this.setState({
        showBuyInMenu: false
      });
    }
  }

  showBuyIn() {
    this.setState({
      showBuyInMenu: true
    });
  }

  resetForm() {
    this.props.reset();
    this.props.change('buy_in_asset_symbol', this.INIT_SYMBOL);
    this.props.change(
      'buy_in_amount', this.getMinAmount(this.props.unitList, this.props.buyInSymbol)
    );
  }

  setBuyInAssetSymbol(unit, e) {
    e.preventDefault();
    this.props.change('buy_in_asset_symbol', unit);
  }

  _onUpdateTime(value, newTime) {
    this.props.change(value, newTime);

  }

  toggleTimeDelay() {
    if (this.props.has_started) {
      this.props.change('start_delay', 2 * 60);
    } else {
      this.props.change('start_delay', null);
    }

    this.props.change('has_started', !this.props.has_started);
  }

  handleAddition (tag) {
    let tags = this.props.whitelist;
    let suggestionsResults = this.props.suggestionsResults;
    let fItem = suggestionsResults.find((sugItem) => {
      return sugItem.text.toLowerCase() === tag.toLowerCase();
    });

    if (fItem) {
      this.props.change('whitelist', [...tags, fItem]);
    }

    let childRef = this.refs.whitelist_tags.child;
    childRef.textInput.value = '';
  }

  onClickAddWhiteListButton() {
    let childRef = this.refs.whitelist_tags.child;
    childRef.addTag(childRef.textInput.value);
    childRef.textInput.value = '';
  }

  handleDelete(i) {
    let tags = [
      ...this.props.whitelist
    ];

    tags.splice(i, 1);

    this.props.change('whitelist', tags);
  }

  handleInputChange(value) {
    this.lookupAccounts(value).then((result) => {

      let suggestions = [],
        suggestionsResults = [],
        whiteListHash = Object.create(null);

      this.props.whitelist.forEach((item) => {
        if (item['text']) {
          whiteListHash[item['text'].toLowerCase()] = item;
        }
      });

      result.forEach((r) => {
        if (r[0] && !whiteListHash[r[0].toLowerCase()]) {
          suggestions.push(r[0]);
          suggestionsResults.push({
            id: r[1],
            text: r[0]
          });
        }
      });

      this.props.change('suggestions', suggestions);
      this.props.change('suggestionsResults', suggestionsResults);
    });
  }

  lookupAccounts(accountName) {
    return AccountRepository.lookupAccounts(accountName, 100);
  }

  blurInputField(fieldName) {
    document.querySelector(`[name="${fieldName}"]`).blur();
  }

  render() {
    const {
      handleSubmit,
      unitList,
      onSubmit,
      buyInSymbol,
      has_started,
      whitelist,
      suggestions,
      start_time,
      registration_deadline
    } = this.props;

    let amountPrecision = this.getPrecisionAmount(unitList, buyInSymbol);
    return (
      <form onSubmit={ handleSubmit((values) => { {/* eslint-disable-line */}

        return false;//fix datepicker today button
        //onSubmit(values);
      }) }>
        <div className='col col-6 col-offset-1'>

          <Field
            name='number_of_players'
            className='field field-type3'
            component={ renderFieldNumberOfPlayers }
            placeholder={ counterpart.translate('games.rps_game.number_of_players', {num: 1}) }
            type='number'
            normalize={ normalizeNumberOfPlayers } />

          <div className='row2'>
            <Translate component='label' className='label' content='games.rps_game.buy_in' />
            <div className='fieldWrap'>

              <Field
                name='buy_in_amount'
                className='field field-type3 field-btnFloated150'
                component={ renderFieldInput }
                placeholder={ counterpart.translate('games.rps_game.buy_in', {num: 1}) }
                type='text'
                normalize={ (value, prevValue) => {
                  return normalizeAmount(value, prevValue, amountPrecision);
                } }  />

              {/*<!-- addClass open to show dropDown Menu-->*/}

              <div className={ classNames('dd pGCur__dd', {open: this.state.showBuyInMenu}) }>
                <a href='' className='ddTrigger' onClick={this.toggleBuyIn.bind(this)}> {/* eslint-disable-line */}
                  <span className='ddTrigger__text'>{asset_utils.getSymbol(buyInSymbol)}</span>
                  <span className='ddTrigger__icon icon-str_close'></span>
                </a>
                <div className='ddMenu'>
                  <ul className='ddMenu__list'>
                    {/*<!-- add class .active for selected line-->*/}
                    {unitList.map((unit) => {
                      return (
                        <li key={ unit.get('symbol') } className='ddMenu__item'>
                          <a href='#' className={ classNames('ddMenu__link', {'active': true}) } onClick={ this.setBuyInAssetSymbol.bind(this, unit.get('symbol')) }> {/* eslint-disable-line */}
                            {asset_utils.getSymbol(unit.get('symbol'))}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className='row2'>
            <Translate
              component='label'
              className='label'
              content='games.rps_game.registration_deadline' />
            <div className='fieldWrap'>
              {
                registration_deadline ?
                  <DateField key={ registration_deadline }
                    expandOnFocus={ true }
                    dateFormat='MMMM D, YYYY hh:mm A Z'
                    forceValidDate={ true }
                    minDate={ new Date().getTime() + 1 * 60 * 60 * 1000 }
                    defaultValue={ registration_deadline }
                    onChange={ this._onUpdateTime.bind(this, 'registration_deadline') }
                    disabled={ false }
                    clearIcon={ false }
                    onExpandChange={ (ex) => {
                      if (ex === false) {
                        this.blurInputField('registration_deadline');
                      }
                    } }
                    cleanup={ (flexProps) => {
                      delete flexProps.renderCalendarIcon;
                      delete flexProps.rawInput;
                    } }
                    renderCalendarIcon={ ({onMouseDown}) => {
                      return (
                        <button
                          type='button'
                          className='btn btn-floatedRight btn-calendar'
                          onMouseDown={ onMouseDown }>
                          <span className='icon-calendar calendarIcon'></span>
                        </button>
                      );
                    } }
                  >
                    <input
                      name='registration_deadline'
                      value={ registration_deadline }
                      onChange={ () => {} }
                      type='text'
                      readOnly
                      className='field field-type3 field-btnFloated80' />

                    <DatePicker
                      navigation={ true }
                      locale='en'
                      forceValidDate={ true }
                      highlightWeekends={ true }
                      highlightToday={ true }
                      weekNumbers={ true }
                      weekStartDay={ 0 }
                      disabled={ false }
                    />
                  </DateField>
                  :
                  null
              }
            </div>
          </div>

          <div className='row2'>
            <div className='customCheck__row'>
              {/*<!-- add/remove class checked on change-->*/}
              <label className='customCheck__label '>
                <span className='customCheck__labelRelative'>
                  <input
                    type='checkbox'
                    className='customCheck__check'
                    name='test1'
                    value='1'
                    checked={ !has_started }
                    onChange={ this.toggleTimeDelay.bind(this) } />
                  <span className='customCheck__checkPseudo'></span>
                </span>
                <span className='customCheck__labelPseudo'>
                  {counterpart.translate('games.rps_game.start_after_X_minutes', {numb: 2})}
                </span>
              </label>
            </div>
            <div className='customCheck__row'>
              <label className={ classNames('customCheck__label', {checked: has_started}) }>
                <span className='customCheck__labelRelative'>
                  <input
                    type='checkbox'
                    className='customCheck__check'
                    name='test2'
                    value='1'
                    checked={ !!has_started }
                    onChange={ this.toggleTimeDelay.bind(this) } />
                  <span className='customCheck__checkPseudo'></span>
                </span>
                <Translate
                  component='span'
                  className='customCheck__labelPseudo'
                  content='games.rps_game.tournament_start_time' />
              </label>
            </div>
          </div>
          <div className='row2'>
            <div className='fieldWrap'>
              {
                start_time ?
                  <DateField key={ start_time }
                    expandOnFocus={ true }
                    dateFormat='MMMM D, YYYY hh:mm A Z'
                    forceValidDate={ true }
                    minDate={ new Date().getTime() + 1 * 60 * 60 * 1000 }
                    defaultValue={ start_time }
                    onChange={ this._onUpdateTime.bind(this, 'start_time') }
                    disabled={ !has_started }
                    pickerPosition='top'
                    clearIcon={ false }
                    onExpandChange={ (ex) => {
                      if (ex === false) {
                      //fix
                        this.blurInputField('start_time');
                      }
                    } }
                    cleanup={ (flexProps) => {
                      delete flexProps.renderCalendarIcon;
                      delete flexProps.rawInput;
                      delete flexProps.pickerPosition;
                    } }
                    renderCalendarIcon={ ({onMouseDown}) => {
                      return (
                        <button
                          type='button'
                          className='btn btn-floatedRight btn-calendar'
                          onMouseDown={ onMouseDown }>
                          <span className='icon-calendar calendarIcon'></span>
                        </button>);
                    } }
                  >
                    <input
                      name='start_time'
                      value={ start_time }
                      onChange={ () => {} }
                      readOnly
                      type='text'
                      className='field field-type3 field-btnFloated80' />
                    <DatePicker
                      navigation={ true }
                      locale='en'
                      forceValidDate={ true }
                      highlightWeekends={ true }
                      highlightToday={ true }
                      weekNumbers={ true }
                      weekStartDay={ 0 }
                      disabled={ !has_started }
                    />
                  </DateField>
                  : null
              }

            </div>
          </div>
          <div className='pGBtns'>
            <button className='btn btn-neutral' type='button' onClick={ this.resetForm.bind(this) }>
              {counterpart.translate('games.rps_game.reset_changes')}
            </button>
            <button className='btn btn-success' type='submit' onClick={ handleSubmit((values) => {
              values.action_type = 'create';
              onSubmit(values);
            }) } name='create'>{counterpart.translate('games.rps_game.create')}</button>
            <button className='btn btn-success' type='submit' onClick={ handleSubmit((values) => {
              values.action_type = 'create_and_join';
              onSubmit(values);
            }) } name='create_and_join'>
              {counterpart.translate('games.rps_game.create_and_join')}
            </button>
          </div>
        </div>
        <div className='col col-6 col-offset-1'>
          <div className='whiteList__title'>
            {counterpart.translate('games.rps_game.whitelist_notes_title')}
          </div>
          <div className='whiteList__text'>
            <p>{counterpart.translate('games.rps_game.whitelist_notes_description_1')}</p>
            <p>
              {counterpart.translate('games.rps_game.whitelist_notes_description_2')}
            </p>
          </div>
          <div className='row'>
            <label className='label'>
              {counterpart.translate('games.rps_game.whitelist_your_friends')}
            </label>
            <div className='fieldWrap'>
              <ReactTags
                ref='whitelist_tags'
                autofocus={ false }
                handleInputChange={ this.handleInputChange.bind(this) }
                classNames={ {
                  tagInputField: 'field field-type2 field-btnFloated110'
                } }
                minQueryLength={ 1 }
                suggestions={ suggestions }
                handleDelete={ this.handleDelete.bind(this) }
                handleAddition={ this.handleAddition.bind(this) } />

              <button
                className='btn btn-floatedRight btn-whiteListAdd'
                type='button'
                onClick={ this.onClickAddWhiteListButton.bind(this) }>
                {counterpart.translate('games.rps_game.add_button')}
              </button>
            </div>
          </div>
          <div className='row'>
            <label className='label label__ReactTagsChosen'>
              {counterpart.translate('games.rps_game.whitelist')}
            </label>
            <div className='wrap__ReactTagsChosenItem'>
              {whitelist && whitelist.map((item, idx) => {
                return (
                  <span className='ReactTags__chosen' key={ idx }> {item.text}
                    <span className='ReactTags__chosenDel icon-close2'
                      onClick={ this.handleDelete.bind(this, idx) }>
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </form>
    );
  }
}

// Decorate the form component
CreateForm = reduxForm({
  form: 'rockPaperScissorsCreateForm', // a unique name for this form,
  fields: [],
  validate: function submit(values) {

    const errors = {};

    if (!values.number_of_players) {
      errors.number_of_players = counterpart.translate('errors.field_is_required');
    } else if (values.number_of_players % 2 !== 0){
      errors.number_of_players = counterpart.translate('errors.divisible_by_two');
    }

    if (!values.buy_in_amount || parseFloat(values.buy_in_amount) === 0) {
      errors.buy_in_amount = counterpart.translate('errors.field_is_required');
    }

    return errors;
  }
})(CreateForm);


const selector = formValueSelector('rockPaperScissorsCreateForm'); // <-- same as form name

CreateForm = connect(
  (state) => {
    // can select values individually
    const buyInSymbol = selector(state, 'buy_in_asset_symbol'),
      has_started = selector(state, 'has_started'),
      whitelist = selector(state, 'whitelist'),
      suggestions = selector(state, 'suggestions'),
      suggestionsResults = selector(state, 'suggestionsResults'),
      start_time = selector(state, 'start_time'),
      registration_deadline = selector(state, 'registration_deadline'),
      buy_in_amount = selector(state, 'buy_in_amount');

    return {
      buyInSymbol: buyInSymbol,
      has_started: has_started,
      whitelist: whitelist,
      suggestions: suggestions,
      suggestionsResults: suggestionsResults,
      start_time: start_time,
      registration_deadline: registration_deadline,
      buy_in_amount: buy_in_amount
    };
  }
)(CreateForm);

export default CreateForm;