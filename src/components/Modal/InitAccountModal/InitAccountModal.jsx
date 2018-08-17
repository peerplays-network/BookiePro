import React, {PureComponent} from 'react';
import {Modal} from 'antd';
import PropTypes from 'prop-types';
import {I18n} from 'react-redux-i18n';
import Loading from '../../Loading';

class InitAccountModal extends PureComponent {
  render() {
    return (
      <Modal
        wrapClassName={ 'vertical-center-modal' }
        visible={ this.props.visible }
        footer={ null }
        closable={ false }
      >
        <div className='initAccountModal'>
          <p>{I18n.t('initAccountModal.loading')}</p>
          <Loading />
        </div>
      </Modal>
    );
  }
}

InitAccountModal.propTypes = {
  visible: PropTypes.bool.isRequired
};

InitAccountModal.defaultProps = {
  visible: false
};

export default InitAccountModal;
