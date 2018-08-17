import React, {PureComponent} from 'react';
import {Modal} from 'antd';
import Ps from 'perfect-scrollbar';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Faq from '../../HelpAndSupport/Faq';

class FaqModalScrollableContent extends PureComponent {
  componentDidMount() {
    Ps.initialize(ReactDOM.findDOMNode(this.refs.scrollableSection));
  }
  componentDidUpdate() {
    Ps.update(ReactDOM.findDOMNode(this.refs.scrollableSection));
  }

  render() {
    return (
      <div style={ {height: '100%', position: 'relative'} } ref='scrollableSection'>
        <Faq />
      </div>
    );
  }
}

class FaqModal extends PureComponent {
  constructor(props) {
    super(props);
    this.onCancel = this.onCancel.bind(this);
  }

  onCancel(event) {
    event.preventDefault();
    this.props.onCancelClick();
  }

  render() {
    return (
      <Modal
        title={ <div className='banner' /> }
        wrapClassName={ 'faq-modal' }
        visible={ this.props.visible }
        footer={ null }
        width={ 1200 }
        onCancel={ this.onCancel }
      >
        <FaqModalScrollableContent />
      </Modal>
    );
  }
}

FaqModal.propTypes = {
  visible: PropTypes.bool,
  onCancelClick: PropTypes.func
};

FaqModal.defaultProps = {
  onCancelClick: () => {}
};

export default FaqModal;
