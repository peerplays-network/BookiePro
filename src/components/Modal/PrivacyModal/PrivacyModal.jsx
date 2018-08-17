import React, {PureComponent} from 'react';
import {Modal} from 'antd';
import Ps from 'perfect-scrollbar';
import ReactDOM from 'react-dom';
import {I18n, Translate} from 'react-redux-i18n';
import PropTypes from 'prop-types';

class PrivacyModalScrollableContent extends PureComponent {
  componentDidMount() {
    Ps.initialize(ReactDOM.findDOMNode(this.refs.scrollableSection));
  }
  componentDidUpdate() {
    Ps.update(ReactDOM.findDOMNode(this.refs.scrollableSection));
  }

  render() {
    return (
      <div style={ {height: '100%', position: 'relative'} } ref='scrollableSection'>
        <Translate value='privacy_dialogue.content' dangerousHTML />
      </div>
    );
  }
}

class PrivacyModal extends PureComponent {
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
        title={ I18n.t('landing.privacy_policy') }
        wrapClassName={ 'privacy-modal' }
        visible={ this.props.visible }
        footer={ null }
        width={ 747 }
        onCancel={ this.onCancel }
      >
        <PrivacyModalScrollableContent />
      </Modal>
    );
  }
}

PrivacyModal.propTypes = {
  visible: PropTypes.bool,
  onCancelClick: PropTypes.func
};

PrivacyModal.defaultProps = {
  onCancelClick: () => {}
};

export default PrivacyModal;
