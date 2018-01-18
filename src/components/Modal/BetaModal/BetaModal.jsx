import React, { PureComponent } from 'react';
import { Modal } from 'antd';
import { I18n } from 'react-redux-i18n';
import PropTypes from 'prop-types';
import moment from 'moment'

class BetaModal extends PureComponent {

  constructor(props) {
    super(props)
    this.closeDate = moment(new Date(Date.UTC(2018, 1, 8))).format('MMMM, Do, YYYY')
  }

  render() {
    let buttonStyle = {
      "margin-left": "40%",
      "width": "20%"
    }

    return (
      <Modal
        title={ I18n.t('bookieBetaModal.title') }
        wrapClassName={ 'vertical-center-modal connection-error-modal' }
        closable={ true }
        visible={ this.props.visible }
        footer={ null }
        width={ 768 }
      >
        <p>{ I18n.t('bookieBetaModal.text1') }</p>
        <br />
        <p>{ I18n.t('bookieBetaModal.text2') }</p>
        <br />
        <p>{ I18n.t('bookieBetaModal.text3', { closeDate: this.closeDate }) }</p>
        <br />
        <button style={ buttonStyle } className='btn btn-regular' onClick={ this.props.onCancelClick }>{ I18n.t('bookieBetaModal.buttonText') }</button>
      </Modal>
    );
  }
}

BetaModal.propTypes = {
  visible: PropTypes.bool.isRequired,
};

BetaModal.defaultProps = {
  visible: true,
};

export default BetaModal;
