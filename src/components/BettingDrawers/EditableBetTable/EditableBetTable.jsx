import React from 'react';
import { Button, Icon, Table } from 'antd';
import Immutable from 'immutable';

const renderTeam = (text, record) => (
  <div>
    <div className='team'>{ record.team }</div>
    <div className='market_type'>{ record.market_type }</div>
  </div>
);

const renderInput = (field, action) => {
  return (text, record) => {
    // antd table records are vanilla JS objects
    // we cannot use antd Input component here because we have problem
    // changing the value if user clicks on an offer from the same market
    return (
      <input
        type='text'
        value={ text }
        className='ant-input'
        onChange={
          (event) => {
            const delta = Immutable.Map()
                            .set('id', record.id)
                            .set('field', field)
                            .set('value', event.target.value);
            action(delta);
          }
        }
      />
    );
  }
}

// TODO: Need styling work on the special buttons in the input box
//       So we are just calling the same method right now
const renderInputWithControl = renderInput;

const renderDeleteButton = (deleteOne) => {
  return (text, record) => (
    <Button
      onClick={ () => deleteOne(Immutable.fromJS(record)) }
    >X</Button>
  );
}

const getBackColumns = (deleteOne, updateOne) => (
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
      render: renderInputWithControl('odds', updateOne),
    }, {
      title: 'STAKE(B)',
      dataIndex: 'stake',
      key: 'stake',
      width: '24%',
      className: 'numeric',
      render: renderInput('stake', updateOne), // price is the original name
    }, {
      title: 'PROFIT(B)',
      dataIndex: 'profit',
      key: 'profit',
      width: '24%',
      className: 'numeric'
    }, {
      title: '',
      dataIndex: 'delete',
      key: 'delete',
      className: 'delete-button',
      render: renderDeleteButton(deleteOne),
    }
  ]
);

const getLayColumns = (deleteOne, updateOne) => (
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
      render: renderInputWithControl('odds', updateOne),
    }, {
      title: "BACKER'S STAKE(B)",
      dataIndex: 'stake',
      key: 'stake',
      width: '24%',
      className: 'numeric',
      render: renderInput('stake', updateOne),
    }, {
      title: 'LIABILITY(B)',
      dataIndex: 'liability',
      key: 'liability',
      width: '24%',
      className: 'numeric'
    }, {
      title: '',
      dataIndex: 'delete',
      key: 'delete',
      className: 'delete-button',
      render: renderDeleteButton(deleteOne),
    }
  ]
);

// TODO: REVIEW This function applies to both Back and Lay bets for now.
const buildBetTableData = (bets) => {
  return bets.map((bet, idx) => {
    return Immutable.Map()
            .set('key', idx)
            .set('id', bet.get('id'))
            .set('team', bet.get('team'))
            .set('market_type', 'Moneyline')   // TODO: change this
            .set('odds', bet.get('odds'))

            .set('stake', bet.has('stake') ?  bet.get('stake') : bet.get('price')) // TODO: change this
            .set('profit', bet.has('profit') ?  bet.get('profit') : '0')                // TODO: change this
            .set('liability', bet.has('liability') ?  bet.get('liability') : '0');            // TODO: change this
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
            onClick={ () => props.deleteMany(backBets.concat(layBets)) }
          />
        </span>
      </div>
      <div className='bet-table'>
        {
          !backBets.isEmpty() &&
          <div className='back'>
            <Table
              pagination={ false }
              columns={ getBackColumns(props.deleteOne, props.updateOne) }
              dataSource={ buildBetTableData(backBets).toJS() }
            />
          </div>
        }
        {
          !layBets.isEmpty() &&
          <div className='lay'>
            <Table
              pagination={ false }
              columns={ getLayColumns(props.deleteOne, props.updateOne) }
              dataSource={ buildBetTableData(layBets).toJS() }
            />
          </div>
        }
      </div>
    </div>
  );
}

export default EditableBetTable;
