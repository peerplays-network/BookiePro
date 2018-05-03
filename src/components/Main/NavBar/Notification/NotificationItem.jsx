/**
 * This component displays notification with cancel button.
 * NotificationItem is used in {@link Notification}
 */
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

  /**
   * Click is handled in {@link TopMenu} - handleNotificationCardItemClick
   * It will navigate user to respective screen on the basis of notification type
   */
  onClick(e) {
    e.preventDefault();
    if (typeof this.props.onClick === 'function') {
      this.props.onClick();
    }
  }

  /**
   * Click is handled in {@link TopMenu} - handleNotificationCardItemClickClose
   * This will remove notification from state 'notifications' under 'notification' store
   */
  onClickClose(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onClickClose();
  }

  /** This will render close button next to notification content */
  renderCloseButton() {
    if (this.props.isCloseButtonVisible) {
      return (
       <i className='close-button' onClick={ this.onClickClose } />
      );
    }
  }

  /** This will render notification content with date */
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
    console.log(this.onClick)
    return(
      <div className={ `notification-item ${!this.props.onClick ? 'disabled' : ''}` } onClick={ this.onClick }>
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
  onClick: null,
  onClickClose: null,
  isDateVisible: true,
  isCloseButtonVisible: true
}

export default NotificationItem;
