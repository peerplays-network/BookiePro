import React, { PureComponent } from 'react';
import { Modal } from 'antd';
import Ps from 'perfect-scrollbar';
import ReactDOM from 'react-dom';
import { I18n } from 'react-redux-i18n';
import PropTypes from 'prop-types';

class HelpAndSupportModalScrollableContent extends PureComponent {
  componentDidMount() {
    Ps.initialize(ReactDOM.findDOMNode(this.refs.scrollableSection));
  }
  componentDidUpdate() {
    Ps.update(ReactDOM.findDOMNode(this.refs.scrollableSection));
  }

  render() {
    return (
      <div style={ { 'height' : '100%', 'position' : 'relative' } } ref='scrollableSection'>
        <div className='content'>
          {
            [...Array(13)].map((x, i) => (
              <div className='question-answer-pair'>
                <div className='question'>
                  { I18n.t('help.question' + (i+1)) }
                </div>
                <div className='answer'>
                  { I18n.t('help.answer' + (i+1)) }
                </div>
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}

class HelpAndSupportModal extends PureComponent {
  constructor(props) {
    super(props);
    this.onCancel = this.onCancel.bind(this);
  }

  onCancel(event) {
    event.preventDefault();
    this.props.onCancelClick();
  }

  render() {
    return (
      <Modal
        title={ I18n.t('landing.help_and_support') }
        wrapClassName={ 'help-and-support-modal' }
        visible={ this.props.visible }
        footer={ null }
        width={ 747 }
        onCancel={ this.onCancel }
      >
        <HelpAndSupportModalScrollableContent />
      </Modal>
    );
  }
}

HelpAndSupportModal.propTypes = {
  visible: PropTypes.bool,
  onCancelClick: PropTypes.func
}

HelpAndSupportModal.defaultProps = {
  onCancelClick: () => {}
}

export default HelpAndSupportModal;
