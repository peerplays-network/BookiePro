import React from 'react';
import { Table } from 'antd';
import Immutable from 'immutable';
import CurrencyUtils from '../../../utility/CurrencyUtils';

const renderTeam = (text, record) => (
  <div>
    <div className='team'>{ record.team }</div>
    <div className='market_type'>{ record.market_type_value }</div>
  </div>
);

const getBackColumns = (currencySymbol) => (
  [
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
    }, {
      title: `STAKE(${currencySymbol})`,
      dataIndex: 'stake',
      key: 'stake',
      width: '24%',
      className: 'numeric',
    }, {
      title: `PROFIT(${currencySymbol})`,
      dataIndex: 'profit',
      key: 'profit',
      className: 'numeric'
    }
  ]
);

const getLayColumns = (currencySymbol) => (
  [
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
    }, {
      title: `BACKER'S STAKE(${currencySymbol})`,
      dataIndex: 'stake',
      key: 'stake',
      width: '24%',
      className: 'numeric',
    }, {
      title: `LIABILITY(${currencySymbol})`,
      dataIndex: 'liability',
      key: 'liability',
      className: 'numeric'
    }
  ]
);

// TODO: REVIEW This function applies to both Back and Lay bets for now.
const buildBetTableData = (bets, currencyFormat) => {
  const formatting = (field, value) => {
    const floatNumber = parseFloat(value);
    return isNaN(floatNumber) ? value :
      CurrencyUtils.getFormattedField(field, floatNumber, currencyFormat);
  }
  return bets.map((bet, idx) => {
    // TODO: change hard-coded market type
    return bet.set('key', idx)
              .set('market_type', 'Moneyline')
              .update('profit', profit => formatting('profit', profit))
              .update('liability', liability => formatting('liability', liability))
  });
}

const ReadOnlyBetTable = (props) => {
  const { data, title, dimmed, currencyFormat } = props;
  const backBets = data.get('back') || Immutable.List();
  const layBets = data.get('lay') || Immutable.List();
  const currencySymbol = CurrencyUtils.getCurruencySymbol(currencyFormat);
  return (
    <div className={ `readonly-bet-table-wrapper ${dimmed ? 'dimmed' : '' }` }>
      <div className='header'>
        <span className='title'>{ title }</span>
      </div>
      <div className='bet-table'>
        {
          !backBets.isEmpty() &&
          <div className='back'>
            <Table
              pagination={ false }
              columns={ getBackColumns(currencySymbol) }
              dataSource={ buildBetTableData(backBets, currencyFormat).toJS() }
            />
          </div>
        }
        {
          !layBets.isEmpty() &&
          <div className='lay'>
            <Table
              pagination={ false }
              columns={ getLayColumns(currencySymbol) }
              dataSource={ buildBetTableData(layBets, currencyFormat).toJS() }
            />
          </div>
        }
      </div>
    </div>
  );
}

export default ReadOnlyBetTable;
