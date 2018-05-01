import React, { PureComponent } from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';

class SoftwareUpdateModal extends PureComponent {

  render() {
    console.log('---- SoftwareUpdateModal()')
    console.log(this.props)
    return (
      <Modal
        title={ 'New Version : ' + this.props.version }
        wrapClassName={ 'vertical-center-modal' }
        closable={ this.props.closable }
        maskClosable={ this.props.closable }
        visible={ this.props.visible }
        onOk={ this.props.onOk }
        onCancel={ this.props.onCancel }
        okText={ 'OK' }
        cancelText={ 'Ignore it' }
        width={ 428 }
      >
        <p dangerouslySetInnerHTML={ { __html:this.props.modalTitle} } />
        <p>{ I18n.t('notification.version')} : <a target='_blank' href={ this.props.link }>{ this.props.version }</a></p>
        <p>{ moment(Number.parseInt(this.props.date,10)).fromNow() }</p>
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
  link: PropTypes.string,
  date: PropTypes.string,
  version: PropTypes.string
};

export default SoftwareUpdateModal;
