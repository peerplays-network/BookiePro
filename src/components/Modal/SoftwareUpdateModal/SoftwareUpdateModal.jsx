import React, { Component } from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';

class SoftwareUpdateModal extends Component {

  render() {
    return (
      <Modal
        title={ 'New Version :' + this.props.latestVersion }
        wrapClassName={ 'vertical-center-modal' }
        closable={ this.props.closable }
        maskClosable={ this.props.closable }
        visible={ this.props.visible }
        onOk={ this.props.onOk }
        onCancel={ this.props.onCancel }
        okText={ 'OK' }
        cancelText={ 'Ignore it' }
      >
        <p dangerouslySetInnerHTML={ { __html:this.props.modalTitle} } />
      </Modal>
    );
  }
}

SoftwareUpdateModal.propTypes = {
  modalTitle: PropTypes.any,
  closable: PropTypes.bool.isRequired,
  visible: PropTypes.bool.isRequired,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,

};

export default SoftwareUpdateModal;
