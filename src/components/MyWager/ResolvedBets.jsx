import React, { Component } from 'react';
import {  Icon,Table,DatePicker,Select } from 'antd';
import './MyWager.less';
const Option = Select.Option;
const dataSource = [
    {
        key: '1',
        eventName: '15/01/2017 18:05',
        event: 'Pittsburgh Steelers vs Kansas City Chiefs',
        type: 'Back | Pittsburgh Steelers +5.5 | Spreads',
        sport: <Icon type='search' />,
        odds: 2.07,
        stake: 3.14,
        profit: <span className='color-green'>+57.50</span>,
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
        profit: <span className='color-red'>-11.24</span>,
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
        profit: <span className='color-green'>+57.50</span>,
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
        profit: <span className='color-red'>-11.24</span>,
        cancel: <a className='btn cancel-btn' href=''>cancel</a>
    },
    {
        key: '5',
        eventName: '15/01/2017 18:05',
        event: 'Pittsburgh Steelers vs Kansas City Chiefs',
        type: 'Back | Pittsburgh Steelers +5.5 | Spreads',
        sport: <Icon type='search' />,
        odds: 2.07,
        stake: 3.14,
        profit: <span className='color-green'>+57.50</span>,
        cancel: <a className='btn cancel-btn' href=''>cancel</a>
    },
    {
        key: '6',
        eventName: '15/01/2017 18:05',
        event: 'Pittsburgh Steelers vs Kansas City Chiefs',
        type: 'Back | Pittsburgh Steelers +5.5 | Spreads',
        sport: <Icon type='search' />,
        odds: 2.07,
        stake: 3.14,
        profit: <span className='color-red'>-11.24</span>,
        cancel: <a className='btn cancel-btn' href=''>cancel</a>
    },
    {
        key: '7',
        eventName: '15/01/2017 18:05',
        event: 'Pittsburgh Steelers vs Kansas City Chiefs',
        type: 'Back | Pittsburgh Steelers +5.5 | Spreads',
        sport: <Icon type='search' />,
        odds: 2.07,
        stake: 3.14,
        profit: <span className='color-green'>+57.50</span>,
        cancel: <a className='btn cancel-btn' href=''>cancel</a>
    },
    {
        key: '8',
        eventName: '15/01/2017 18:05',
        event: 'Pittsburgh Steelers vs Kansas City Chiefs',
        type: 'Back | Pittsburgh Steelers +5.5 | Spreads',
        sport: <Icon type='search' />,
        odds: 2.07,
        stake: 3.14,
        profit: <span className='color-red'>-11.24</span>,
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

class ResolvedBets extends Component {
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
        const { startValue, endValue } = this.state;
        return (
            <div>
              <div className='top-data clearfix'>
                <div className='float-left'>
                  <p className='font18 padding-tb-5'>TOTAL: Ƀ20.71</p>
                </div>
                <div className='float-right'>
                  <div className='filter'>
                    <div className='ant-form-inline'>
                      <div className='ant-form-item'>
                        <label> Period</label>
                        <Select className='bookie-select' defaultValue='default' style={ {width: 150} } >
                          <Option value='default'> Last 14 days</Option>
                          <Option value='jack'>Jack</Option>
                          <Option value='lucy'>Lucy</Option>
                          <Option value='Yiminghe'>yiminghe</Option>
                        </Select>
                      </div>
                      <div className='ant-form-item'>
                        <label> Date</label>
                        <DatePicker
                            disabledDate={ this.disabledStartDate }
                            showTime
                            format='YYYY-MM-DD HH:mm:ss'
                            value={ startValue }
                            placeholder='From'
                        />
                        <span className='margin-lr-10 font16'>
                              -
                        </span>
                        <DatePicker
                            disabledDate={ this.disabledEndDate }
                            showTime
                            format='YYYY-MM-DD HH:mm:ss'
                            value={ endValue }
                            placeholder='To'
                        />
                      </div>
                      <div className='ant-form-item'>
                        <a className='btn btn-regular' href=''>Search</a>
                        <a className='btn btn-regular margin-lr-10' href=''>Export</a>
                      </div>
                    </div>

                  </div>
                </div>
                <div className='right-left'></div>
              </div>
              <Table className='bookie-table' pagination={ false } dataSource={ dataSource } columns={ columns } />
            </div>
        )
    }
}

export default ResolvedBets;
