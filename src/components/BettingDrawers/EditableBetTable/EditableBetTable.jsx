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
      <div className='pos-rel'>
        <input
          type='text'
          value={ text === undefined? '' : text }
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
        <a className='arrow-icon-main icon-up' onClick={ () => {} }><i className='icon-arrow icon-up-arrow'></i></a>
        <a className='arrow-icon-main icon-down' onClick={ () => {} }><i className='icon-arrow icon-down-arrow'></i></a>
      </div>
    );
  }
}

// TODO: Need styling work on the special buttons in the input box
//       So we are just calling the same method right now
const renderInputWithControl = renderInput;

const renderDeleteButton = (deleteOne) => {
  return (text, record) => (
    <Button className='btn'
      onClick={ () => deleteOne(Immutable.fromJS(record)) }
    ><Icon type='close'/></Button>
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
    // TODO: change hard-coded market type
    return bet.set('key', idx).set('market_type', 'Moneyline');
  });
}

const getRowClassName = (record, index) => (
  record.updated ? 'updated' : ''
)

const EditableBetTable = (props) => {
  const { data } = props;
  const backBets = data.get('back') || Immutable.List();
  const layBets = data.get('lay') || Immutable.List();
  return (
    <div className={ `editable-bet-table-wrapper ${props.dimmed ? 'dimmed' : '' }` }>
      <div className='header'>
        <span className='title'>{ props.title }</span>
        <span className='icon'>
          <i className='trash-icon' onClick={ () => props.deleteMany(backBets.concat(layBets)) }></i>
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
              rowClassName={ getRowClassName }
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
              rowClassName={ getRowClassName }
            />
          </div>
        }
      </div>
    </div>
  );
}

export default EditableBetTable;
