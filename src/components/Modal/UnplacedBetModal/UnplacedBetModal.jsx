/**
 * If there exists unplaced bets in betting drawer when leaving current route,
 * UnplacedBetModal will appear and ask for user confirmation wether to leave without 
 * placing unplaced bets
 */
import React, {PureComponent} from 'react';
import {Modal} from 'antd';
import {I18n} from 'react-redux-i18n';
import PropTypes from 'prop-types';

class UnplacedBetModal extends PureComponent {
  render() {
    return (
      <Modal
        title={ I18n.t('unplacedBetModal.title') }
        wrapClassName={ 'vertical-center-modal' }
        closable={ true }
        maskClosable={ true }
        visible={ this.props.visible }
        onOk={ this.props.onLeave }
        onCancel={ this.props.onStay }
        okText={ I18n.t('unplacedBetModal.confirm') }
        cancelText={ I18n.t('unplacedBetModal.cancel') }
        width={ 428 }
      >
        <p>{I18n.t('unplacedBetModal.explanation')}</p>
      </Modal>
    );
  }
}

UnplacedBetModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onLeave: PropTypes.func,
  onStay: PropTypes.func
};

export default UnplacedBetModal;
