import React from 'react';
import { Button, Icon, Table } from 'antd';
import Immutable from 'immutable';
import CurrencyUtils from '../../../utility/CurrencyUtils';
import { incrementOdds, decrementOdds, adjustOdds } from './oddsIncrementUtils';

const renderTeam = (text, record) => (
  <div>
    <div className='team'>{ record.team }</div>
    <div className='market_type'>{ record.market_type }</div>
  </div>
);

const renderInput = (field, action, currencyFormat) => {
  return (text, record) => {
    // antd table records are vanilla JS objects
    // we cannot use antd Input component here because we have problem
    // changing the value if user clicks on an offer from the same market
    return (
      <input
        type='text'
        value={ text === undefined? '' : text }
        className='ant-input'
        onChange={
          (event) => {
            // REVIEW: One line Regular Expression error check
            //         Reject any input that leads to invalid number
            if (!/^\d*\.?\d*$/.test(event.target.value)) return false;
            const delta = Immutable.Map()
              .set('id', record.id)
              .set('field', field)
              .set('value', event.target.value);
            action(delta);
          }
        }
        onBlur={
          (event) => {
            // Assume values have been vented already in onChange
            const floatNumber = parseFloat(event.target.value);
            if (isNaN(floatNumber)) return false; // fail fast if the value is undefined or bad

            let value = CurrencyUtils.formatByCurrencyAndPrecision(field, floatNumber, currencyFormat);
            if (field === 'odds') value = adjustOdds(value, record.bet_type);
            const delta = Immutable.Map()
              .set('id', record.id)
              .set('field', field)
              .set('value', value);
            action(delta);
          }
        }
      />
    );
  }
}

const clickArrowButton = (record, action, updateOdds) => {
  const odds = record.odds;
  if (!odds) return;
  // REVIEW the odds value is adjusted first because the dummy data may contain
  //        incorrect odds values that could never happen in the real Blockchain
  const newOdds = updateOdds(adjustOdds(odds, record.bet_type));
  const delta = Immutable.Map()
    .set('id', record.id)
    .set('field', 'odds')
    .set('value', newOdds);
  action(delta);
}

const renderOdds = (action, currencyFormat) => {
  return (text, record) => {
    return (
      <div className='pos-rel'>
        { renderInput('odds', action, currencyFormat)(text, record) }
        <a className='arrow-icon-main icon-up' onClick={ () => clickArrowButton(record, action, incrementOdds) }><i className='icon-arrow icon-up-arrow'></i></a>
        <a className='arrow-icon-main icon-down' onClick={ () => clickArrowButton(record, action, decrementOdds) }><i className='icon-arrow icon-down-arrow'></i></a>
      </div>
    );
  }
}

const renderDeleteButton = (deleteOne) => {
  return (text, record) => (
    <Button className='btn'
      onClick={ () => deleteOne(Immutable.fromJS(record)) }
    ><Icon type='close'/></Button>
  );
}

const getBackColumns = (deleteOne, updateOne, currencyFormat) => {
  const currencySymbol = CurrencyUtils.getCurruencySymbol(currencyFormat);
  return [
    {
      title: 'BACK',
      dataIndex: 'back',
      key: 'back',
      width: '23%',
      className: 'team',
      render: renderTeam,
    }, {
      title: 'ODDS',
      dataIndex: 'odds',
      key: 'odds',
      width: '23%',
      className: 'numeric',
      render: renderOdds(updateOne, currencyFormat),
    }, {
      title: `STAKE(${currencySymbol})`,
      dataIndex: 'stake',
      key: 'stake',
      width: '24%',
      className: 'numeric',
      render: renderInput('stake', updateOne, currencyFormat), // price is the original name
    }, {
      title: `PROFIT(${currencySymbol})`,
      dataIndex: 'profit',
      key: 'profit',
      width: '24%',
      className: 'numeric readonly'
    }, {
      title: '',
      dataIndex: 'delete',
      key: 'delete',
      className: 'delete-button',
      render: renderDeleteButton(deleteOne),
    }
  ];
};

const getLayColumns = (deleteOne, updateOne, currencyFormat) => {
  const currencySymbol = CurrencyUtils.getCurruencySymbol(currencyFormat);
  return [
    {
      title: 'LAY',
      dataIndex: 'lay',
      key: 'lay',
      width: '23%',
      className: 'team',
      render: renderTeam,
    }, {
      title: 'ODDS',
      dataIndex: 'odds',
      key: 'odds',
      width: '23%',
      className: 'numeric',
      render: renderOdds(updateOne, currencyFormat),
    }, {
      title: `BACKER'S STAKE(${currencySymbol})`,
      dataIndex: 'stake',
      key: 'stake',
      width: '24%',
      className: 'numeric',
      render: renderInput('stake', updateOne, currencyFormat),
    }, {
      title: `LIABILITY(${currencySymbol})`,
      dataIndex: 'liability',
      key: 'liability',
      width: '24%',
      className: 'numeric readonly'
    }, {
      title: '',
      dataIndex: 'delete',
      key: 'delete',
      className: 'delete-button',
      render: renderDeleteButton(deleteOne),
    }
  ]

};

// TODO: REVIEW This function applies to both Back and Lay bets for now.
const buildBetTableData = (bets, currencyFormat) => {
  const formatting = (field, value) => {
    const floatNumber = parseFloat(value);
    return isNaN(floatNumber) ? value :
      CurrencyUtils.formatByCurrencyAndPrecision(field, floatNumber, currencyFormat);
  }
  return bets.map((bet, idx) => {
    // TODO: change hard-coded market type
    return bet.set('key', idx)
              .set('market_type', 'Moneyline')
              .update('profit', profit => formatting('profit', profit))
              .update('liability', liability => formatting('liability', liability))
  });
}

const getRowClassName = (record, index) => (
  record.updated ? 'updated' : ''
)

const EditableBetTable = (props) => {
  const { data, title, deleteOne, deleteMany, updateOne, dimmed, currencyFormat } = props;
  const backBets = data.get('back') || Immutable.List();
  const layBets = data.get('lay') || Immutable.List();
  return (
    <div className={ `editable-bet-table-wrapper ${dimmed ? 'dimmed' : '' }` }>
      <div className='header'>
        <span className='title'>{ title }</span>
        <span className='icon'>
          <i className='trash-icon' onClick={ () => deleteMany(backBets.concat(layBets)) }></i>
        </span>
      </div>
      <div className='bet-table'>
        {
          !backBets.isEmpty() &&
          <div className='back'>
            <Table
              pagination={ false }
              columns={ getBackColumns(deleteOne, updateOne, currencyFormat) }
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
              columns={ getLayColumns(deleteOne, updateOne, currencyFormat) }
              dataSource={ buildBetTableData(layBets, currencyFormat).toJS() }
              rowClassName={ getRowClassName }
            />
          </div>
        }
      </div>
    </div>
  );
}

export default EditableBetTable;
