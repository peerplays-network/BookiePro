import React, { Component } from 'react';
import {  Icon,Table } from 'antd';
import './MyWager.less';
const dataSource = [
  {
    key: '1',
    eventName: '15/01/2017 18:05',
    event: 'Pittsburgh Steelers vs Kansas City Chiefs',
    type: 'Back | Pittsburgh Steelers +5.5 | Spreads',
    sport: <Icon type='search' />,
    odds: 2.07,
    stake: 3.14,
    profit: 3.36,
    cancel: <a className='btn cancel-btn' href=''>cancel</a>
  },
  {
    key: '2',
    eventName: '15/01/2017 18:05',
    event: 'Pittsburgh Steelers vs Kansas City Chiefs',
    type: 'Back | Pittsburgh Steelers +5.5 | Spreads',
    sport: <Icon type='search' />,
    odds: 2.07,
    stake: 3.14,
    profit: 3.36,
    cancel: <a className='btn cancel-btn' href=''>cancel</a>
  },
  {
    key: '3',
    eventName: '15/01/2017 18:05',
    event: 'Pittsburgh Steelers vs Kansas City Chiefs',
    type: 'Back | Pittsburgh Steelers +5.5 | Spreads',
    sport: <Icon type='search' />,
    odds: 2.07,
    stake: 3.14,
    profit: 3.36,
    cancel: <a className='btn cancel-btn' href=''>cancel</a>
  },
  {
    key: '4',
    eventName: '15/01/2017 18:05',
    event: 'Pittsburgh Steelers vs Kansas City Chiefs',
    type: 'Back | Pittsburgh Steelers +5.5 | Spreads',
    sport: <Icon type='search' />,
    odds: 2.07,
    stake: 3.14,
    profit: 3.36,
    cancel: <a className='btn cancel-btn' href=''>cancel</a>
  }
];

const columns = [
  {
    title: 'Event Time',
    dataIndex: 'eventName',
    key: 'eventName',
  },
  {
    title: 'Event',
    dataIndex: 'event',
    key: 'event',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'Sport',
    dataIndex: 'sport',
    key: 'sport',
  },
  {
    title: 'Odds',
    dataIndex: 'odds',
    key: 'odds',
  },
  {
    title: 'Stake()',
    dataIndex: 'stake',
    key: 'stake',
  },
  {
    title: 'Profit / Liability()',
    dataIndex: 'profit',
    key: 'profit',
  },
  {
    title: '',
    dataIndex: 'cancel',
    key: 'cancel',
  }
];

class MatchedBets extends Component {
  state = {
    startValue: null,
    endValue: null,
    endOpen: false,
  };
  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  }

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }
  render() {
    return (
      <div>
        <div className='top-data clearfix'>
          <div className='float-left'>
            <p className='font18 padding-tb-5'>TOTAL: Ƀ20.71</p>
          </div>

          <div className='right-left'></div>
        </div>
        <Table className='bookie-table' pagination={ false } dataSource={ dataSource } columns={ columns } />
      </div>
    )
  }
}

export default MatchedBets;
