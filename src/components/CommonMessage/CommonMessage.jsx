import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import CommonMessageActions from '../../actions/CommonMessageActions';//added
import Config from '../../../config/Config';//added
import MessageType from '../../constants/MessageTypes';//added
import _ from 'lodash';

const compileMessage = (props) => {
  let messageList;

  if (props.location === 'header') {
    messageList = props.headerMessages;
  }

  if (props.location === 'sideBar') {
    messageList = props.sideBarMessages;
  }

  // Filter the message list to only show the number of messages configured.
  messageList = messageList.slice(0, props.numOfCommonMessageToDisplay);

  const messages = messageList.map((pair, key) => {
    let messageType = pair.get('messageType');
    let id = pair.get('id');

    return (
      <div
        className={ 'c-common-message__background ' + messageType }
        key={ key }
        id={ id }
      >
        <div className='c-common-message__content'>
          <span>{pair.get('content') }
            <p onClick={ () => props.clearMessage(id) }>X</p>
          </span>
        </div>
      </div>
    );
  });
  return <div>{messages}</div>;
};

class CommonMessage extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      timeout: null
    };

    this.checkToAssignTimer = this.checkToAssignTimer.bind(this);
  }

  setTimer(id) {
    const {timeout} = this.state;
    clearTimeout(timeout);

    this.setState({
      timeout: setTimeout(
        this.props.clearMessage.bind(this, id), Config.commonMessageModule.timeout
      )
    });
  }

  checkToAssignTimer(messages) {
    messages.forEach((msg) => {
      let msgType = msg.get('messageType');

      if (msgType === MessageType.SUCCESS || msgType === MessageType.INFO) {
        this.setTimer(msg.get('id'));
      }
    });
  }

  componentDidUpdate(prevProps) {
    let propsMerged = this.props.headerMessages.concat(this.props.sideBarMessages);
    let prevPropsMerged = prevProps.headerMessages.concat(prevProps.sideBarMessages);

    // Use lodash for a deep comparison of the merged messages.
    if (!_.isEqual(propsMerged, prevPropsMerged)) {
      this.checkToAssignTimer(propsMerged);
    }
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

  const messages = state.commonMessage;
  let headerMessages = messages.get('headerMessages');
  let sideBarMessages = messages.get('sideBarMessages');
  const numOfCommonMessageToDisplay = Config.commonMessageModule.numOfCommonMessageToDisplay;

  if (reverse) {
    headerMessages = headerMessages.reverse();
    sideBarMessages = sideBarMessages.reverse();
  }

  // Determine the number of messages for calculating the heigh offset needed.
  let numOfheaderMessages = headerMessages.size;
  let numOfsideBarMessages = sideBarMessages.size;

  if (numOfheaderMessages > numOfCommonMessageToDisplay) {
    numOfheaderMessages = numOfCommonMessageToDisplay;
  }

  if (numOfsideBarMessages > numOfCommonMessageToDisplay) {
    numOfsideBarMessages = numOfCommonMessageToDisplay;
  }

  //Calculate the heights of the exchange child div and the betslip child div.
  const exchangeMessagingHeight = 36 * numOfheaderMessages;


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
    headerMessages,
    sideBarMessages,
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
