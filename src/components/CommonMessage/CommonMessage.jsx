import React, {PureComponent} from 'react';
import './CommonMessage.less';
import MessageType from '../../constants/MessageTypes';

//const msgClass = 'message-background ' + props.type;

class CommonMessage extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {isHidden: false};
    this.isHidden = this.isHidden.bind(this);
  }

  isHidden() {
    console.log(this.state);
    this.setState({isHidden: !this.state.isHidden});
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
        <div className={ msgClass }>
          <div className='message-content'>
            <span>{this.props.message} <p onClick={ this.isHidden }>X</p></span>
          </div>
        </div>
      </div >
    );
  }
}

export default CommonMessage;
