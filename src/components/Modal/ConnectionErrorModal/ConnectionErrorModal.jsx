import React, {PureComponent} from 'react';
import {Modal} from 'antd';
import {I18n} from 'react-redux-i18n';
import PropTypes from 'prop-types';
import {LoadingStatus} from '../../../constants';

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
        <p>{this.props.error}</p>

        <button className='btn btn-regular try-again' onClick={ this.onClickTryAgain }>
          {this.props.error === LoadingStatus.ERROR_DISCONNECTED
            ? I18n.t('connectionErrorModal.reconnect')
            : I18n.t('connectionErrorModal.confirm')}
        </button>
      </Modal>
    );
  }
}

ConnectionErrorModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClickTryAgain: PropTypes.func.isRequired,
  error: PropTypes.any
};

ConnectionErrorModal.defaultProps = {
  visible: false,
  onClickTryAgain: () => {}
};

export default ConnectionErrorModal;
