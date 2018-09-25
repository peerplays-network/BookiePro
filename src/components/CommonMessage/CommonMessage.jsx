import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import './CommonMessage.less';
import CommonMessageActions from '../../actions/CommonMessageActions';
import {Config} from '../../constants';

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

  // Filter the message list to only show the number of messages configured.
  messageList = messageList.slice(0, props.numOfCommonMessageToDisplay);

  const messages = messageList.map((pair, key) => (
    <div
      className={ 'c-message__background ' + pair.get('messageType') }
      key={ key }
      id={ idPrefix + key }
    >
      <div className='c-message__content'>
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

const mapStateToProps = (state) => {
  const reverse = Config.commonMessageModule.sortingMethod === 'oldest';
  const messages = state.get('commonMessage');
  let exchangeMessages = messages.get('exchangeMessages');
  let betslipMessages = messages.get('betslipMessages');
  const numOfCommonMessageToDisplay = Config.commonMessageModule.numOfCommonMessageToDisplay;

  if (reverse) {
    exchangeMessages = exchangeMessages.reverse();
    betslipMessages = betslipMessages.reverse();
  }

  // Determine the number of messages for calculating the heigh offset needed.
  let numOfExchangeMessages = exchangeMessages.size;
  let numOfBetslipMessages = betslipMessages.size;

  if (numOfExchangeMessages > numOfCommonMessageToDisplay) {
    numOfExchangeMessages = numOfCommonMessageToDisplay;
  }

  if (numOfBetslipMessages > numOfCommonMessageToDisplay) {
    numOfBetslipMessages = numOfCommonMessageToDisplay;
  }

  //Calculate the heights of the exchange child div and the betslip child div.
  const exchangeMessagingHeight = 36 * numOfExchangeMessages;


  // Dynamically apply a style to the split panes.
  const messagingDivExist = document.getElementsByClassName('messaging').length > 0;

  if (messagingDivExist) {
    const messagingExchange = document.getElementsByClassName('messaging')[0]
      .children[1].children[0];
    
    const messagingBetslip = document.getElementsByClassName('messaging')[0]
      .children[1].children[2];

    messagingExchange.style.height = 'calc(100% - ' + exchangeMessagingHeight + 'px)';
    messagingBetslip.style.height = 'calc(100% - ' + exchangeMessagingHeight + 'px)';
  }

  return {
    exchangeMessages,
    betslipMessages,
    numOfCommonMessageToDisplay
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
