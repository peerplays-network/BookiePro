import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

export class NotificationItem extends PureComponent{
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.onClickClose = this.onClickClose.bind(this);
    this.renderCloseButton = this.renderCloseButton.bind(this);
    this.renderContent = this.renderContent.bind(this);
  }

  onClick(e) {
    e.preventDefault();
    this.props.onClick();
  }

  onClickClose(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onClickClose();
  }

  renderCloseButton() {
    if (this.props.isCloseButtonVisible) {
      return (
       <i className='close-button' onClick={ this.onClickClose } />
     );
    }
  }

  renderContent() {
    let date, messageStyle;
    if (this.props.isDateVisible) {
      date = (
        <div className='date'>
          { moment(this.props.date).fromNow() }
        </div>
      );
    } else {
      messageStyle = { 'paddingTop': '0px' };
    }

    return (
      <div className='content'>
        <div className='message' style={ messageStyle }>
          { this.props.message }
        </div>
        { date }
      </div>
    )
  }

  render(){
    return(
      <div className='notification-item' onClick={ this.onClick }>
        { this.renderContent() }
        { this.renderCloseButton() }
      </div>
    )
  }
}

NotificationItem.propTypes = {
  message: PropTypes.string,
  date: PropTypes.instanceOf(Date),
  onClick: PropTypes.func,
  onClickClose: PropTypes.func,
  isDateVisible: PropTypes.bool,
  isCloseButtonVisible: PropTypes.bool
}

NotificationItem.defaultProps = {
  message: '',
  date: new Date(),
  onClick: () => { },
  onClickClose: () => { },
  isDateVisible: true,
  isCloseButtonVisible: true
}

export default NotificationItem;
