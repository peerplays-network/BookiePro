import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import './CommonMessage.less';
import MessageType from '../../constants/MessageTypes';
import CommonMessageActions from '../../actions/CommonMessageActions';

class CommonMessage extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {isHidden: false};
    this.isHidden = this.isHidden.bind(this);
  }

  isHidden(e) {
    debugger;
    // Get the id of the message component to hide.
    const id = e.target.parentElement.parentElement.parentElement.id;
    this.setState({isHidden: !this.state.isHidden});
    this.props.hideMessage(id);
  }

  render() {
    let msgClass = 'message-background ';

    if (!this.state.isHidden) {
      msgClass += this.props.type;
    } else {
      msgClass += MessageType.NONE;
    }

    return(
      <div>
        <div className={ msgClass } id={ this.props.id }>
          <div className='message-content'>
            <span>{this.props.message} <p onClick={ this.isHidden }>X</p></span>
          </div>
        </div>
      </div >
    );
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    hideMessage: CommonMessageActions.hideMessage
  },
  dispatch
);

export default connect(mapDispatchToProps)(CommonMessage);
