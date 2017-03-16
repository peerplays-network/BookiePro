import React from 'react';
import { Icon, Table } from 'antd';

const bitcoinSymbol = '\u0243';
// We cannot use CSS to override antd Table column width using CSS
// This can only be done via the code
const eventTimeColumnWidth = 90;
const offerColumnWidth = 70;

// betType: [ back | lay ]
// index: [ 1 | 2]
const renderOffer = (betType, index) => {
  return (text, record) => {
    console.log(record, betType, index);
    if (record.offers.length === 0) {
      return '';
    }
    const offer = record.offers[index-1][betType];
    console.log('renderOffer', offer);
    return (
      <div className='offer'>
        <div className='odds'>{ offer.odds }</div>
        <div className='price'>{ bitcoinSymbol } { offer.price }</div>
      </div>
    );
  };
};

const columns = [{
  dataIndex: 'time',
  key: 'time',
  width: eventTimeColumnWidth,
  className: 'event-time'
}, {
  dataIndex: 'name',
  key: 'name',
  // Do not specify width so the column
  // will grow/shrink with the size of the table
  className: 'team'
}, {
  title: '1',
  children: [{
    dataIndex: 'back_offer_1',
    key: 'back_offer_1',
    width: offerColumnWidth,
    className: 'back-offer',
    render: renderOffer('back', 1)
  }, {
    dataIndex: 'lay_offer_1',
    key: 'lay_offer_1',
    width: offerColumnWidth,
    className: 'lay-offer',
    render: renderOffer('lay', 1)
  }]
}, {
  title: '2',
  children: [{
    dataIndex: 'back_offer_2',
    key: 'back_offer_2',
    width: offerColumnWidth,
    className: 'back-offer',
    render: renderOffer('back', 2)
  }, {
    dataIndex: 'lay_Offer_2',
    key: 'lay_offer_2',
    width: offerColumnWidth,
    className: 'lay-offer',
    render: renderOffer('lay', 2)
  }]
}];

const renderTitle = (sport) => (
  <div className='title'>
    <div className='sport'>{ sport.name }</div>
    <div className='rules'>
      <Icon type='info-circle-o' /> Rules
    </div>
  </div>
);

const renderFooter = (sport) => (
  <div className='footer'>
    <a href='/' onClick={ e => e.preventDefault() }>
      More { sport.name }
    </a>
  </div>
)

const SimpleBettingWidget = (props) => (
  <div className='simple-betting'>
    <Table
      bordered
      pagination={ false }
      columns={ columns }
      dataSource={ props.sport.events }
      title={ () => renderTitle(props.sport) }
      footer={ () => renderFooter(props.sport) }
    />
  </div>
);

export default SimpleBettingWidget;
