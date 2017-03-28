import React, { Component } from 'react';
import { Modal } from 'antd';

class SoftwareUpdateModal extends Component {

  render() {
    return (
      <Modal
        title={ this.props.modalTitle }
        wrapClassName={ 'vertical-center-modal' }
        closable={ this.props.closable }
        maskClosable={ this.props.closable }
        visible={ this.props.visible }
        onOk={ this.props.onOk }
        onCancel={ this.props.onCancel }
        okText={ 'OK' }
        cancelText={ 'Ignore it' }
      >
        <p>New Version : {this.props.latestVersion}</p>
        <p>{ this.props.modalTitle }</p>
        <p>some contents...</p>
      </Modal>
    );
  }
}

SoftwareUpdateModal.propTypes = {
  modalTitle: React.PropTypes.string.isRequired,
  closable: React.PropTypes.bool.isRequired,
  visible: React.PropTypes.bool.isRequired,
  onOk: React.PropTypes.func,
  onCancel: React.PropTypes.func,

};

export default SoftwareUpdateModal;
