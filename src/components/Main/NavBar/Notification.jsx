import React, {Component} from 'react';
import {
  Card,
  Alert
} from 'antd';
class Notification extends Component{
  render(){
    let notifications = [];
    this.props.notifications.forEach((row, index) => {
      notifications.push(<Alert className='bookie-alert' message={ row.get('content') } closable />);
    });
    return(
      <Card className={ this.props.cardClass }>
        { notifications }
      </Card>
    )
  }
}

export default Notification;
