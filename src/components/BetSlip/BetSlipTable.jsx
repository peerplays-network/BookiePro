import React, { Component } from 'react';
import { Button, Table } from 'antd';

const renderBetType = (text, record) => (
  <span>
    <span>{ record.team }</span><br />
    <span className='bet_type'>{ record.bet_type }</span>
  </span>
);

const backColumns = [{
  title: 'BACK',
  dataIndex: 'back',
  key: 'back',
  width: '23%',
  render: renderBetType,
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
  width: '24%',
  className: 'numeric',
}, {
  title: '',
  dataIndex: 'delete',
  key: 'delete',
  className: 'delete-button',
  render: (text, record) => (
    <Button
      onClick={ () => window.console.log('delete', record.key) }
    >X</Button>
  ),
}];

const backData = [{
  key: 1,
  team: 'Clemson',
  bet_type: 'Moneyline',
  odds: '02.78',
  stake: '0000.18',
  profit: '00000.32',
}, {
  key: 2,
  team: 'Alabama',
  bet_type: 'Moneyline',
  odds: '3.1',
  stake: '0.89',
  profit: '1.87',
}];

const layColumns = [{
  title: 'LAY',
  dataIndex: 'lay',
  key: 'lay',
  width: '23%',
  render: renderBetType,
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
  width: '24%',
  className: 'numeric',
}, {
  title: '',
  dataIndex: 'delete',
  key: 'delete',
  className: 'delete-button',
  render: (text, record) => (
    <Button
      onClick={ () => window.console.log('delete', record.key) }
    >X</Button>
  ),
}];

const layData = [{
  key: 1,
  team: 'Clemson',
  bet_type: 'Moneyline',
  odds: '02.78',
  stake: '0000.18',
  liability: '00000.32',
}, {
  key: 2,
  team: 'Alabama',
  bet_type: '+6.5',
  odds: '3.1',
  stake: '0.89',
  liability: '1.87',
}];

class BetSlipTable extends Component {

  render() {
    return (
      <div className='betslip'>
        <div className='back'>
          <Table
            pagination={ false }
            columns={ backColumns }
            dataSource={ backData }
          />
        </div>
        <div className='lay'>
          <Table
            pagination={ false }
            columns={ layColumns }
            dataSource={ layData }
          />
        </div>
      </div>
    );
  }
}

export default BetSlipTable;
