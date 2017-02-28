import React from 'react';
import { Row, Col, Icon } from 'antd';

const renderOffer = (odds, price) => (
  <div>
    <div className='odds'>{ odds }</div>
    <div className='price'>B { price }</div>
  </div>
)

const renderControl = () => (
  <div>
    <a href='/' onClick={ e => e.preventDefault() }>
      <Icon type='left' />
    </a>
    <a href='/' onClick={ e => e.preventDefault() }>
      <Icon type='right' />
    </a>
  </div>
)

const MarketTable = () => (
  <div className='market-table-wrapper'>
    <Row className='market-type-header'>
      <Col span={ 15 } className='market-type'>MONEYLINE</Col>
      <Col span={ 3 } push={ 4 }>
        <span className='matched'>Matched: B 4.65</span>
      </Col>
      <Col span={ 2 } push={ 4 }>
        <span className='rules'>
          <Icon type='info-circle-o' /> Rules
        </span>
      </Col>
    </Row>
    <Row className='all-header'>
      <Col span={ 2 } push={ 15 } className='back all'>
        <span>Back all</span>
      </Col>
      <Col span={ 2 } push={ 15 } className='lay all'>
        <span>Lay all</span>
      </Col>
    </Row>
    <Row className='event'>
      <Col span={ 10 } className='team'>CLEMSON</Col>
      <Col span={ 1 } className='control'>
        { renderControl() }
      </Col>
      <Col span={ 2 } className='offer'>OFFER</Col>
      <Col span={ 2 } className='back'>
        { renderOffer(3.10, 0.018) }
      </Col>
      <Col span={ 2 } className='back best'>
        { renderOffer(3.15, 0.185) }
      </Col>
      <Col span={ 2 } className='lay best'>
        { renderOffer(3.35, 0.12) }
      </Col>
      <Col span={ 2 } className='lay'>
        { renderOffer(3.40, 0.024) }
      </Col>
      <Col span={ 2 } className='lay'>
        { renderOffer(3.45, 0.026) }
      </Col>
      <Col span={ 1 } className='control'>
        { renderControl() }
      </Col>
    </Row>
    <Row className='event'>
      <Col span={ 10 } className='team'>ALABAMA</Col>
      <Col span={ 1 } className='control'>
        { renderControl() }
      </Col>
      <Col span={ 2 } className='back'>
        { renderOffer(1.40, 0.015) }
      </Col>
      <Col span={ 2 } className='back'>
        { renderOffer(1.41, 0.04) }
      </Col>
      <Col span={ 2 } className='back best'>
        { renderOffer(1.42, 1.952) }
      </Col>
      <Col span={ 2 } className='lay best'>
        { renderOffer(1.48, 1.467) }
      </Col>
      <Col span={ 2 } className='lay'>
        { renderOffer(1.49, 0.012) }
      </Col>
      <Col span={ 2 } className='lay'>
        { renderOffer(1.50, 0.032) }
      </Col>
      <Col span={ 1 } className='control'>
        { renderControl() }
      </Col>
    </Row>
  </div>
);

export default MarketTable;
