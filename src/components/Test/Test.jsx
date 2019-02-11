//unused
import React from 'react';
import {connect} from 'react-redux';
import InnerTest from './InnerTest';
import {AccountVestingPageActions} from '../../actions';
import {connectComponentWrapper} from '../Wrappers/ConnectComponentWrapper';
import {bindActionCreators} from 'redux';

class Test extends React.Component {
  componentWillMount() { }

  render() {
    console.log('TEST', connectComponentWrapper(InnerTest));
    let Comp = connectComponentWrapper(InnerTest, (state) => {
      return {
        accountId: state.app.accountId
      };
    },
    {}
    );

    return (
      <div className='main'>
        <Comp testVar='1' asset='1.3.0'/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    balances: state.accountVestingPageReducer.balances
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    fetchData: AccountVestingPageActions.fetchData,
    claimVestingBalance: AccountVestingPageActions.claimVestingBalance
  },
  dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(Test);