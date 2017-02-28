import React, { Component } from 'react';
import { ChainTypes, BindToChainState } from '../../utility';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import UnmatchedBets from './UnmatchedBets';
import './MyWager.less';

const TabPane = Tabs.TabPane;

class MyWager extends Component {
  static propTypes = {
      account: ChainTypes.ChainAccount.isRequired,
      accountName: React.PropTypes.string,
  };

  static defaultProps = {
      account: 'props.accountName',
  };

  constructor(props) {
    super(props);
    this._onTabChange = this._onTabChange.bind(this);
  }

  _onTabChange(key) {
    console.log(key);
  }

  render() {
    const allOpenOrders =  this.props.account.get('orders') ? this.props.account.get('orders').toJS() : [];
    return (
      <div className='my-wager'>
        <div className='title'>
          My Wager
        </div>
        <Tabs className='content' defaultActiveKey='unmatchedBets' onChange={ this._onTabChange }>
          <TabPane tab='UNMATCHED BETS' key='unmatchedBets'>
            <UnmatchedBets allOpenOrders={ allOpenOrders } />
          </TabPane>
          <TabPane tab='MATCHED BETS' key='matchedBets'>Content of Tab Pane 2</TabPane>
          <TabPane tab='RESOLVED BETS' key='resolvedBets'>Content of Tab Pane 3</TabPane>
        </Tabs>
      </div>
    );
  }
}

const BindedMyWager = BindToChainState()(MyWager);

const mapStateToProps = (state) => {
  //Mock implementation
  return {
    accountName: 'ii-5'
  }
}
export default connect(mapStateToProps)(BindedMyWager);
