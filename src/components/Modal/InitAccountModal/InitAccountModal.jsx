import React, { PureComponent } from 'react';
import { Modal, Spin } from 'antd';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';

class InitAccountModal extends PureComponent {

  render() {
    return (
      <Modal
        wrapClassName={ 'vertical-center-modal' }
        visible={ this.props.visible }
        footer={ null }
        closable={ false }
      >
        <p>{ I18n.t('initAccountModal.loading') }</p>
        <div style={ { display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '20px', paddingBottom: '20px' } }>
          <Spin size='large'/>
        </div>
      </Modal>
    );
  }
}

InitAccountModal.propTypes = {
  visible: PropTypes.bool.isRequired,
};

InitAccountModal.defaultProps = {
  visible: false,
};

export default InitAccountModal;
