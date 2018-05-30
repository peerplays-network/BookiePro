/**
 * BetTable is a compoent used exclusively in QuickBetDrawer and MarketDrawer. As
 * its name implies, it is table showing bets data. It is a pure presentational
 * component that does not have any internal state at all. All behaviors are
 * driven by props passed from the parent component.
 *
 * BetTable displays the bets using 2 Ant-Design tables stacking on top of one
 * another. The top table shows the Back bets and the bottom table shows the Lay
 * bets.
 *
 * BetTable operates in 2 modes: READONLY and READWRITE (default). In READONLY mode,
 * all values are displayed as text.
 */
import React from 'react';
import { Button, Icon, Table } from 'antd';
import Immutable from 'immutable';
import { I18n } from 'react-redux-i18n';
import { CurrencyUtils } from '../../../utility'
import BetTableInput from './BetTableInput'


/**
 * Render the team name and the market group of the associated bet. This is used
 * to render the content for the first column of the BetTable (BACK / LAY).
 *
 * This function reads the #betting_market_description (team name) and
 * #betting_market_description (market type) from the bet object.
 *
 * @param {string} text - ignore, this value is always undefined or null
 * @param {object} record - the bet object
 */
const renderTeam = (text, record) => (
  <div>
    <div className='team'>{ record.betting_market_description }</div>
    <div className='market_type'>{ record.betting_market_group_description }</div>
  </div>
);

const renderTitle = (text, currencySymbol) => {
  
  let split = false;

  if (text.toLowerCase().indexOf('liability') !== -1) {
    split = true;
  }
  
  return (
    <div>
      <p>{ text } {split ? <br/> : null} ({ currencySymbol })</p>
    </div>
  )     
}

/**
 * Returns a function that renders an Input field.
 *
 * Any changes made in the input field will trigger an event (defined by the
 * `action` param) to be fired and the value will be updated in the Redux store.
 * The details about which Redux state to be updated and which action/reducer pair
 * to be invoked are all hidden from BetTable.
 *
 * @param {string} field - the name of the field the returned function should render
 * @param {Function} action - a callback function which handles value change in
 * the Input field
 * @param {string} currencyFormat - a string representing the currency format to
 * be used to format the Odds or Stake values on screen
 * @returns {Function} - the actual cell rendering function used by antd Table
 */

const renderInput = (field, action, currencyFormat, oddsFormat) => {
  return (text, record) => {
    return (
      <BetTableInput
        field={ field }
        action={ action }
        currencyFormat={ currencyFormat }
        oddsFormat={ oddsFormat }
        text={ text }
        record={ record }
        key={ record.id }
      >
      </BetTableInput>
    );
  }
}

/**
 * Returns a function that renders the Odds cells in the BetTable.
 *
 * This function executes #renderInput to render the Input field and then renders
 * the up and down arrow buttons for adjusting Odds value. Each of the buttons
 * will invoke the #clickArrowButton with the appropriate update functions defined
 * in the {@link oddsIncrementUtils} module.
 *
 * @param {Function} action - a callback function which handles value change in
 * the Input field.
 * @param {string} currencyFormat - a string representing the currency format to
 * be used to format the Odds or Stake values on screen
* @returns {Function} - the actual cell rendering function used by antd Table
 */
const renderOdds = (action, currencyFormat, oddsFormat) => {
  return (text, record) => {
    return (
      <div className='pos-rel'>
        { renderInput('odds', action, currencyFormat, oddsFormat)(text, record) }
      </div>
    );
  }
}

/**
 * Returns a function that renders the delete button for each row in the BetTable.
 *
 * The callback function in the paremeters will trigger an action to delete the
 * bet (represented as the #record argument) in the actual rendering function.
 * This function encapulates the actual details of the operation: it could be
 * deleting a bet slip from the Redux store or requesting the Blockchain to
 * cancel a bet.
 *
 * @param {Function} deleteOne - a callback function that triggers event to delete
 * the bet. This callback accepts an ImmutableJS object as its sole argument.
 * @returns {Function} - the actual cell rendering function used by antd Table
 */
const renderDeleteButton = (deleteOne) => {
  return (text, record) => (
    <Button className='btn' tabIndex='-1' onClick={
      () => deleteOne(Immutable.fromJS(record)) }
    >
      <Icon type='close'/>
    </Button>
  );
}

/**
 * Returns an array of column definition objects of the Back Bet Table.
 *
 * In READONLY mode:
 * - the column that contains the Delete Button is NOT available
 * - all field value are rendered as text in READONLY mode
 *
 * @param {Function} deleteOne - the callback function used to delete/cancel a bet
 * @param {Function} updateOne - the callback function triggered after a bet has
 * been udpated
 * @param {string} currencyFormat - a string representing the currency format to
 * be used to format the Odds or Stake values on screen
 * @param {boolean} [readonly=false] - set to true if the BetTable is in READONLY
 * mode, and false otherwise
 * @returns {Array.object} - an array of column definition objects
 */
const getBackColumns = (deleteOne, updateOne, currencyFormat, readonly=false, oddsFormat) => {
  
  const currencySymbol = CurrencyUtils.getCurrencySymbol(currencyFormat, 'white');
  
  const teamColumn = {
    title: 'BACK',
    dataIndex: 'back',
    key: 'back',
    width: '25%',
    className: 'team',
    render: renderTeam,
  };

  const oddsColumn = {
    title: `ODDS (${oddsFormat ? oddsFormat.substring(0,3).toUpperCase() : '' })`,
    dataIndex: 'odds',
    key: 'odds',
    width: '25%',
    className: 'numeric readonly',
  };
  if (!readonly) {
    oddsColumn['render'] = renderOdds(updateOne, currencyFormat, oddsFormat);
    oddsColumn['className'] = 'numeric';
  }  

  const stakeColumn = {
    title: renderTitle('Stake', currencySymbol),
    dataIndex: 'stake',
    key: 'stake',
    width: '25%',
    className: 'numeric readonly',
  }
  if (!readonly) {
    stakeColumn['render'] = renderInput('stake', updateOne, currencyFormat, oddsFormat);
    stakeColumn['className'] = 'numeric';
  }

  const profitColumn = {
    title: renderTitle('Profit', currencySymbol),
    dataIndex: 'profit',
    key: 'profit',
    className: 'numeric readonly' // this field is always readonly
  }
  if (!readonly) {
    profitColumn['width'] = '25%';
  }

  const columns = [teamColumn, oddsColumn, stakeColumn, profitColumn];
  if (!readonly) {
    // delete button
    columns.push({
      title: '',
      dataIndex: 'delete',
      key: 'delete',
      className: 'delete-button',
      render: renderDeleteButton(deleteOne),
    })
  }

  return columns;
};

/**
 * Returns an array of column definition objects of the Lay Bet Table.
 *
 * In READONLY mode:
 * - the column that contains the Delete Button is NOT available
 * - all field value are rendered as text in READONLY mode
 *
 * @param {Function} deleteOne - the callback function used to delete/cancel a bet
 * @param {Function} updateOne - the callback function triggered after a bet has
 * been udpated
 * @param {string} currencyFormat - a string representing the currency format to
 * be used to format the Odds or Stake values on screen
 * @param {boolean} [readonly=false] - set to true if the BetTable is in READONLY
 * mode, and false otherwise
 * @returns {Array.object} - an array of column definition objects
 */
const getLayColumns = (deleteOne, updateOne, currencyFormat, readonly=false, oddsFormat) => {

  const currencySymbol = CurrencyUtils.getCurrencySymbol(currencyFormat, 'white');
  
  const teamColumn = {
    title: 'LAY',
    dataIndex: 'lay',
    key: 'lay',
    width: '25%',
    className: 'team',
    render: renderTeam,
  };

  const oddsColumn = {
    title: `ODDS (${oddsFormat ? oddsFormat.substring(0,3).toUpperCase() : '' })`,
    dataIndex: 'odds',
    key: 'odds',
    width: '25%',
    className: 'numeric readonly',
  }
  if (!readonly) {
    oddsColumn['render'] = renderOdds(updateOne, currencyFormat, oddsFormat);
    oddsColumn['className'] = 'numeric';
  }

  const stakeColumn = {
    title: renderTitle('Backers Stake', currencySymbol),
    dataIndex: 'stake',
    key: 'stake',
    width: '25%',
    className: 'numeric readonly',
  }
  if (!readonly) {
    stakeColumn['render'] = renderInput('stake', updateOne, currencyFormat, oddsFormat);
    stakeColumn['className'] = 'numeric tableSymbol';
  }

  const liabilityColumn =  {
    title: renderTitle('Liability', currencySymbol),
    dataIndex: 'liability',
    key: 'liability',
    className: 'numeric readonly' // this field is always readonly
  }
  if (!readonly) {
    liabilityColumn['width'] = '25%';
  }

  const columns = [teamColumn, oddsColumn, stakeColumn, liabilityColumn];
  if (!readonly) {
    // delete button
    columns.push({
      title: '',
      dataIndex: 'delete',
      key: 'delete',
      className: 'delete-button',
      render: renderDeleteButton(deleteOne),
    })
  }

  return columns;
};

/**
 * Preprocess the bets data before passing them to the antd Table. This is written
 * as a function because the same procedures need to be applied to both Back
 * and Lay bets.
 *
 * Two key operations are performed:
 * - initialize empty `profit` and `liability` field
 * - set a unique key to every record so that React will not complain
 *
 * @param {object} bets - a ImmutableJS List of ImmutableJS Map objects
 * @param {string} currencyFormat - a string representing the currency format to
 * be used to format the Odds or Stake values on screen
 * @returns {object} - a ImmutableJS List of ImmutableJS Map objects representing
 * the bets data
 */
const buildBetTableData = (bets, currencyFormat) => {
  return bets.map((bet, idx) => {
    return bet.set('key', idx)
  });
}

/**
 * Return the css class of a row. The css class `updated` will cause the entire
 * row to be highlighted in a different color which indicated there is an updated
 * field in this row.
 *
 * The function signature is defined by Ant-Design.
 *
 * @param {object} record - the bet data represented as a vanilla JS object
 * @param {number} index - unclear this is not clearly explained in the antd API
 * @returns {string} - either `updated` or empty string
 */
const getRowClassName = (record, index) => (
  record.updated ? 'updated' : ''
)

const BetTable = (props) => {
  const { readonly, data, title, deleteOne, deleteMany, updateOne, dimmed, currencyFormat, oddsFormat } = props;
  const backBets = data.get('back') || Immutable.List();
  const layBets = data.get('lay') || Immutable.List();
  return (
    <div className={ `bet-table-wrapper ${dimmed ? 'dimmed' : '' }` }>
      <div className='header'>
        <span className='title'>{ title }</span>
        { !readonly && !(backBets.isEmpty() && layBets.isEmpty()) &&
          <span className='icon' onClick={ () => deleteMany(backBets.concat(layBets), title) }>
            <i className='trash-icon'></i>
          </span>
        }
      </div>
      <div className='bet-table'>
        {
          backBets.isEmpty() && layBets.isEmpty() &&
          <div className='no-bets'>
            <div className='message'>
              { I18n.t('market_drawer.unmatched_bets.no_data') }
            </div>
          </div>
        }
        {
          !backBets.isEmpty() &&
          <div className='back'>
            <Table
              pagination={ false }
              columns={ getBackColumns(deleteOne, updateOne, currencyFormat, readonly, oddsFormat) }
              dataSource={ buildBetTableData(backBets, currencyFormat).toJS() }
              rowClassName={ getRowClassName }
            />
          </div>
        }
        {
          !layBets.isEmpty() &&
          <div className='lay'>
            <Table
              pagination={ false }
              columns={ getLayColumns(deleteOne, updateOne, currencyFormat, readonly, oddsFormat) }
              dataSource={ buildBetTableData(layBets, currencyFormat).toJS() }
              rowClassName={ getRowClassName }
            />
          </div>
        }
      </div>
    </div>
  );
}

export default BetTable;
