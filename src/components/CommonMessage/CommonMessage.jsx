import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import './CommonMessage.less';
import CommonMessageActions from '../../actions/CommonMessageActions';

const compileMessage = (props) => {
  // Compile and render the exchange messages.
  const remove = (e) => {
    // extract the id to pass to reducer so that we can remove the message from state.
    const msgParent = e.target.parentElement.parentElement.parentElement;
    const id = msgParent.id;
    
    props.clearMessage(id);
  };

  let idPrefix, messageList;

  if (props.location === 'exchange') {
    idPrefix = 'e';
    messageList = props.exchangeMessages;
  }

  if (props.location === 'betslip') {
    idPrefix = 'b';
    messageList = props.betslipMessages;
  }

  const messages = messageList.map((pair, key) => (
    <div
      className={ 'message-background ' + pair.get('messageType') }
      key={ key }
      id={ idPrefix + key }
    >
      <div className='message-content'>
        <span>{pair.get('content') } <p onClick={ remove }>X</p></span>
      </div>
    </div>
  ));
  return <div>{messages}</div>;
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

  const numOfExchangeMessages = exchangeMessages.size;
  const messagingHeight = 36 * numOfExchangeMessages;
  // Dynamically apply a style to the split panes.
  const messagingDivExist = document.getElementsByClassName('messaging').length > 0;

  if (messagingDivExist) {
    const messagingExchange = document.getElementsByClassName('messaging')[0]
      .children[1].children[0];
    const messagingBetslip = document.getElementsByClassName('messaging')[0]
      .children[1].children[2];

    messagingExchange.style.height = 'calc(100% - ' + messagingHeight + 'px)';
    messagingBetslip.style.height = 'calc(100% - ' + messagingHeight + 'px)';
  }

  return {
    messageO,
    exchangeMessages,
    betslipMessages
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    clearMessage : CommonMessageActions.clearMessage
  },
  dispatch
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommonMessage);
