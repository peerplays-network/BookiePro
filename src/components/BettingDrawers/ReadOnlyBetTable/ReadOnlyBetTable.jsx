import React from 'react';
import { Table } from 'antd';
import Immutable from 'immutable';

const renderTeam = (text, record) => (
  <div>
    <div className='team'>{ record.team }</div>
    <div className='market_type'>{ record.market_type }</div>
  </div>
);

const getBackColumns = () => (
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
      title: 'STAKE(B)',
      dataIndex: 'stake',
      key: 'stake',
      width: '24%',
      className: 'numeric',
    }, {
      title: 'PROFIT(B)',
      dataIndex: 'profit',
      key: 'profit',
      className: 'numeric'
    }
  ]
);

const getLayColumns = () => (
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
      title: "BACKER'S STAKE(B)",
      dataIndex: 'stake',
      key: 'stake',
      width: '24%',
      className: 'numeric',
    }, {
      title: 'LIABILITY(B)',
      dataIndex: 'liability',
      key: 'liability',
      className: 'numeric'
    }
  ]
);

// TODO: REVIEW This function applies to both Back and Lay bets for now.
const buildBetTableData = (bets) => {
  return bets.map((bet, idx) => {
    // TODO: change hard-coded market type
    return bet.set('key', idx).set('market_type', 'Moneyline');
  });
}

const ReadOnlyBetTable = (props) => {
  const { data } = props;
  const backBets = data.get('back') || Immutable.List();
  const layBets = data.get('lay') || Immutable.List();
  return (
    <div className={ `readonly-bet-table-wrapper ${props.dimmed ? 'dimmed' : '' }` }>
      <div className='header'>
        <span className='title'>{ props.title }</span>
      </div>
      <div className='bet-table'>
        {
          !backBets.isEmpty() &&
          <div className='back'>
            <Table
              pagination={ false }
              columns={ getBackColumns() }
              dataSource={ buildBetTableData(backBets).toJS() }
            />
          </div>
        }
        {
          !layBets.isEmpty() &&
          <div className='lay'>
            <Table
              pagination={ false }
              columns={ getLayColumns() }
              dataSource={ buildBetTableData(layBets).toJS() }
            />
          </div>
        }
      </div>
    </div>
  );
}

export default ReadOnlyBetTable;
