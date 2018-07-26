import React, {PureComponent} from 'react';
import {Modal} from 'antd';
import {I18n} from 'react-redux-i18n';
import PropTypes from 'prop-types';

class ConnectionErrorModal extends PureComponent {
  constructor(props) {
    super(props);
    this.onClickTryAgain = this.onClickTryAgain.bind(this);
  }

  onClickTryAgain(event) {
    event.preventDefault();
    // Call parent handler
    this.props.onClickTryAgain();
  }

  render() {
    // TODO: Currently sharing SoftwareUpdateModal styling
    return (
      <Modal
        title={ I18n.t('connectionErrorModal.title') }
        wrapClassName={ 'vertical-center-modal connection-error-modal' }
        closable={ false }
        visible={ this.props.visible }
        footer={ null }
        cancelText={ null }
        width={ 428 }
      >
        <p>{this.props.isConnectedToBlockchain && I18n.t('connectionErrorModal.explanation')}</p>
        <p>{!this.props.isConnectedToBlockchain && I18n.t('connectionErrorModal.noInternet')}</p>
        <button className='btn btn-regular try-again' onClick={ this.onClickTryAgain }>
          {I18n.t('connectionErrorModal.confirm')}
        </button>
      </Modal>
    );
  }
}

ConnectionErrorModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClickTryAgain: PropTypes.func.isRequired
};

ConnectionErrorModal.defaultProps = {
  visible: false,
  onClickTryAgain: () => {}
};

export default ConnectionErrorModal;
