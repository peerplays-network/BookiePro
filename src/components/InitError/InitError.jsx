import React, { Component } from 'react';
import { Button } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AppActions } from '../../actions';

class InitError extends Component {

  constructor(props) {
    super(props);
    this.onReloadClick = this.onReloadClick.bind(this);
  }
  render() {
    return (
      <div className='sportsbg'>
        <div>
          { 'Fail to Connect to Blockchain' }
        </div>
        <Button type='primary' size='large' onClick={ this.onReloadClick }>
          { 'Click here to retry' }
        </Button>
      </div>
    );
  }

  onReloadClick() {
    this.props.connectToBlockchain();
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    connectToBlockchain: AppActions.connectToBlockchain
  }, dispatch);
}
export default connect(null, mapDispatchToProps)(InitError);
