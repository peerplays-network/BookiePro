import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import './CommonMessage.less';
import CommonMessageActions from '../../actions/CommonMessageActions';

const compileMessage = (props) => {
  // Compile and render the exchange messages.
  const remove = (e) => {
    const msgParent = e.target.parentElement.parentElement.parentElement;
    // remove the message
    //msgParent.remove();
    //extract the id to pass to reducer so that we can remove the message from state.
    const id = msgParent.id;
    
    props.hideMessage(id);
  };

  const eM = props.exchangeMessages.map((pair, key) => (
    <div className={ 'message-background ' + pair.get('messageType') } key={ key } id={ 'e'+key }>
      <div className='message-content'>
        <span>{pair.get('content') } <p onClick={ remove }>X</p></span>
      </div>
    </div>
  ));
  return <div>{eM}</div>;
};

class CommonMessage extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {isHidden: false};
  }

  render() {
    return (
      <div>
        {compileMessage(this.props)}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const messageO = ownProps.message;
  const messages = state.get('commonMessage');
  const exchangeMessages = messages.get('exchangeMessages');
  const betslipMessages = messages.get('betslipMessages');
  return {
    messageO,
    exchangeMessages,
    betslipMessages
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    hideMessage: CommonMessageActions.hideMessage
  },
  dispatch
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommonMessage);
