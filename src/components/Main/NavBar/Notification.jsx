import React, {Component} from 'react';
import {
  Card,
  Alert
} from 'antd';
let notificationMessage = <p> Congratulation, you just won a bet! <span>10 mins ago</span></p>;
class Notification extends Component{
  render(){
    return(
      <Card className={ this.props.cardClass }>
        <Alert className='bookie-alert' message={ notificationMessage } closable />
        <Alert className='bookie-alert' message={ notificationMessage } closable />
        <Alert className='bookie-alert' message={ notificationMessage } closable />
        <Alert className='bookie-alert' message={ notificationMessage } closable />
      </Card>
    )
  }
}

export default Notification;