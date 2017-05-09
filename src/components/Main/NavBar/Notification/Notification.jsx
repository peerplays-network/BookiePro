import React, { PureComponent } from 'react';
import NotificationItem from './NotificationItem';
import Ps from 'perfect-scrollbar';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { I18n } from 'react-redux-i18n';

class Notification extends PureComponent{

  componentDidMount() {
    Ps.initialize(ReactDOM.findDOMNode(this.refs.notification));
  }

  componentDidUpdate(prevProps, prevState){
    Ps.update(ReactDOM.findDOMNode(this.refs.notification));
  }

  render(){
    let children = [];
    if (this.props.notifications.size > 0) {
      this.props.notifications.forEach((notification, index) => {
        const child = (
          <NotificationItem
            key={ index }
            message={ notification.get('content') }
            date={ notification.get('date') }
            onClick={ () => { this.props.onClickItem(notification) } }
            onClickClose={ () => { this.props.onClickCloseItem(notification) } }
          />
        );
        children.push(child);
      });
    } else {
      const child = (
        <NotificationItem
          key='placeholder'
          message={ I18n.t('notification.empty') }
          isDateVisible={ false }
          isCloseButtonVisible={ false }
        />
      );
      children.push(child);
    }

    return(
      <div className='notification-card' ref='notification'>
        { children }
      </div>
    )
  }
}

Notification.propTypes = {
  onClickItem: PropTypes.func,
  onClickCloseItem: PropTypes.func,
  notifications: React.PropTypes.instanceOf(Immutable.List)
}

Notification.defaultProps = {
  onClickItem: () => {},
  onClickCloseItem: () => {}
}

export default Notification;
