import React from 'react';
import { Button, Icon, Input, Table } from 'antd';
import Immutable from 'immutable';

const deleteAllPanels = (event) => {
  event.preventDefault();
  window.console.log('clicked delete all panels', event);
}

const renderTeam = (text, record) => (
  <div>
    <div className='team'>{ record.team }</div>
    <div className='market_type'>{ record.market_type }</div>
  </div>
);

// TODO: Need styling work on the special buttons in the input box
const renderInputWithControl = (text, record) => (
  <Input
    defaultValue={ text }
  />
)

const renderInput = (text, record) => (
  <Input
    defaultValue={ text }
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

// TODO: REVIEW This function applies to both Back and Lay bets for now.
const buildBetTableData = (bets) => {
  return bets.map((bet, idx) => {
    return Immutable.Map()
            .set('key', idx)
            .set('team', bet.get('team'))
            .set('market_type', 'Moneyline')   // TODO: change this
            .set('odds', bet.get('odds'))
            .set('stake', bet.get('price'))
            .set('profit', '0')                // TODO: change this
            .set('liability', '0');            // TODO: change this
  });
}

const EditableBetTable = (props) => {
  const { data } = props;
  const backBets = data.hasIn(['unconfirmedBets', 'back']) ?
                    data.getIn(['unconfirmedBets', 'back']) : Immutable.List();
  const layBets = data.hasIn(['unconfirmedBets', 'lay']) ?
                    data.getIn(['unconfirmedBets', 'lay']) : Immutable.List();
  return (
    <div className='editable-bet-table-wrapper'>
      <div className='header'>
        <span className='title'>{ data.get('name') }</span>
        <span className='icon'>
          <Icon
            type='close-circle'
            onClick={ deleteAllPanels }
          />
        </span>
      </div>
      <div className='bet-table'>
        {
          !backBets.isEmpty() &&
          <div className='back'>
            <Table
              pagination={ false }
              columns={ backColumns }
              dataSource={ buildBetTableData(backBets).toJS() }
            />
          </div>
        }
        {
          !layBets.isEmpty() &&
          <div className='lay'>
            <Table
              pagination={ false }
              columns={ layColumns }
              dataSource={ buildBetTableData(layBets).toJS() }
            />
          </div>
        }
      </div>
    </div>
  );
}

export default EditableBetTable;
