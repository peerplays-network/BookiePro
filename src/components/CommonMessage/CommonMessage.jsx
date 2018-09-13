import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import './CommonMessage.less';

class CommonMessage extends PureComponent {
  render() {
    return (
      <div className={ this.props.msgClass }>
        <div className='message-content'>
          {this.props.message}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const msgClass = 'message-background ' + ownProps.type;
  return {
    msgClass
  };
};

export default connect(mapStateToProps)(CommonMessage);
//export default connect(CommonMessage);
