import React, { PureComponent } from 'react';
import { Modal, Checkbox } from 'antd';
import { I18n } from 'react-redux-i18n';
import PropTypes from 'prop-types';

class LogoutModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isSkipLogoutPopupNextTime: false
    };

    this.onClickConfirm = this.onClickConfirm.bind(this);
    this.onClickCancel = this.onClickCancel.bind(this);
    this.onChangeSkipLogoutPopupNextTime = this.onChangeSkipLogoutPopupNextTime.bind(this);
  }

  onChangeSkipLogoutPopupNextTime(event) {
    const checked = event.target.checked;
    this.setState({
      isSkipLogoutPopupNextTime: checked
    })
  }

  onClickConfirm() {
    // Call parent handler
    this.props.onConfirmLogout(this.state.isSkipLogoutPopupNextTime);
  }

  onClickCancel() {
    // Call parent handler
    this.props.onCancelLogout();
  }

  render() {
    // TODO: Currently sharing SoftwareUpdateModal styling
    return (
      <Modal
        title={ I18n.t('logoutModal.title') }
        wrapClassName={ 'vertical-center-modal' }
        maskClosable={ this.props.closable }
        visible={ this.props.visible }
        onOk={ this.onClickConfirm }
        onCancel={ this.onClickCancel }
        okText={ I18n.t('logoutModal.confirm') }
        cancelText={ I18n.t('logoutModal.cancel') }
        width={ 428 }
      >
        <p>{ I18n.t('logoutModal.explanation') }</p>
        <p>{ I18n.t('logoutModal.confirmation') }</p>
        <Checkbox onChange={ this.onChangeSkipLogoutPopupNextTime }>{ I18n.t('logoutModal.skipLogoutPopupNextTime') }</Checkbox>
      </Modal>
    );
  }
}

LogoutModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onConfirmLogout: PropTypes.func.isRequired,
  onCancelLogout: PropTypes.func.isRequired
};

LogoutModal.defaultProps = {
  visible: false,
  onConfirmLogout: () => {},
  onCancelLogout: () => {}
};

export default LogoutModal;
