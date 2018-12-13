import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import classNames from 'classnames';
import NotificationsActions from 'actions/NotificationsActions';
import Translate from 'react-translate-component';

@connect((state) => {
  return {messages: state.notificationsReducer.messages, language: state.settings.locale};
}, {closeMessage: NotificationsActions.closeMessage})
class Notices extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick);
  }

  handleDocumentClick(e) {
    let area = ReactDOM.findDOMNode(this.refs.area);

    if (!area.contains(e.target) && !this.notClose) {
      this.setState({open: false});
    }

    this.notClose = false;
  }

  onClickNotices(e) {
    this.setState({
      open: !this.state.open
    });
    e.preventDefault();
  }

  onClickCloseMessage(id, e) {
    this.notClose = true;
    this.props.closeMessage(id);
    let size = this.props.messages.size;

    if (size === 1) {
      this.setState({open: false});
    }

    e.preventDefault();
  }

  render() {
    let {messages, language} = this.props;
    let noticesCount = 0;
    let notices = messages.map((message) => {
      if (!message.isRead) {
        noticesCount++;
      }

      return (
        <div
          key={ message.id }
          className={ classNames({'notice__item': true, 'active': this.state.open}) }>
          <a href='#close' onClick={this.onClickCloseMessage.bind(this, message.id)} className='notice__itemClose icon-close' /> {/* eslint-disable-line */}
          <div
            dangerouslySetInnerHTML={ {
              __html: message.getText(language)
            } }/>
        </div>
      );
    });

    return (
      <div className='notice__wrap' ref='area'>
        <a
          href='#/notices'
          className='nav__link nav__link-notice'
          onClick={ this.onClickNotices.bind(this) }>
          <span className='nav__linkAlign'>
            {noticesCount
              ? <span className='notice__num'>{noticesCount}</span>
              : null}
            <span className='nav__linkIcon nav__linkIcon-blank icon-clock'></span>
            <span className='nav__linkIcon nav__linkIcon-filled icon-clock-filled'></span>
            <Translate className='nav__linkText' content='header.notices'/>
          </span>
        </a>
        <div className='notice__itemsBox'>

          {notices.size
            ? notices
            : (
              <div className={ classNames({'notice__item': true, 'active': this.state.open}) }>
                <Translate component='h1' content='header.no_notices_message'/>
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

export default Notices;
