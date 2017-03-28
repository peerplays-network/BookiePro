import React from 'react';
import { Button, Icon, Input, Table } from 'antd';

const deleteAllPanels = (event) => {
  event.preventDefault();
  window.console.log('clicked delete all panels', event);
}

const renderTeam = (text, record) => (
  <div>
    <div className='team'>{ record.team }</div>
    <div className='bet_type'>{ record.bet_type }</div>
  </div>
);

const renderInputWithControl = (text, record) => (
  <Input
    value={ text }
  />
)

const renderInput = (text, record) => (
  <Input
    value={ text }
  />
)

const renderDeleteButton = (text, record) => (
  <Button
    onClick={ () => window.console.log('delete', record.key) }
  >X</Button>
);

const backColumns = [{
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
  render: renderInputWithControl,
}, {
  title: 'STAKE(B)',
  dataIndex: 'stake',
  key: 'stake',
  width: '24%',
  className: 'numeric',
  render: renderInput,
}, {
  title: 'PROFIT(B)',
  dataIndex: 'profit',
  key: 'profit',
  width: '24%',
  className: 'numeric',
  render: renderInput,
}, {
  title: '',
  dataIndex: 'delete',
  key: 'delete',
  className: 'delete-button',
  render: renderDeleteButton,
}];

const layColumns = [{
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
  render: renderInputWithControl,
}, {
  title: "BACKER'S STAKE(B)",
  dataIndex: 'stake',
  key: 'stake',
  width: '24%',
  className: 'numeric',
  render: renderInput,
}, {
  title: 'LIABILITY(B)',
  dataIndex: 'liability',
  key: 'liability',
  width: '24%',
  className: 'numeric',
  render: renderInput,
}, {
  title: '',
  dataIndex: 'delete',
  key: 'delete',
  className: 'delete-button',
  render: renderDeleteButton,
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

const EditableBetTable = () => (
  <div className='editable-bet-table-wrapper'>
    <div className='header'>
      <span className='title'>CLEMON VS ALABAMA</span>
      <span className='icon'>
        <Icon
          type='close-circle'
          onClick={ deleteAllPanels }
        />
      </span>
    </div>
    <div className='bet-table'>
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
  </div>
);

export default EditableBetTable;
