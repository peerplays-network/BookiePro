import React, { PureComponent } from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import Ps from 'perfect-scrollbar';
import ReactDOM from 'react-dom';

class RulesModalScrollableContent extends PureComponent {
  componentDidMount() {
    Ps.initialize(ReactDOM.findDOMNode(this.refs.scrollableSection));
  }
  componentDidUpdate() {
    Ps.update(ReactDOM.findDOMNode(this.refs.scrollableSection));
  }

  render() {
    return (
      <div
        className='rules-modal-content'
        ref='scrollableSection'
        dangerouslySetInnerHTML={ { __html: this.props.rules.get('description') } }
      />
    )
  }
}



class RulesModal extends PureComponent {
  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
  }
  handleCancel(event) {
    event.preventDefault();
    this.props.onCancel();
  };
  render() {
    return (
      <Modal
        title={ this.props.rules.get('name') }
        wrapClassName='rules-modal'
        visible={ this.props.visible }
        footer=''
        width={ 747 }
        onCancel={ this.handleCancel }
      >
        <RulesModalScrollableContent rules={ this.props.rules } />
      </Modal>
    );
  }
}

RulesModal.propTypes = {
  rules: PropTypes.instanceOf(Immutable.Map),
  visible: PropTypes.bool,
  onCancel: PropTypes.func
}

RulesModal.defaultProps = {
  rules: Immutable.Map(),
  visible: false,
  onCancel: () => {}
}

export default RulesModal;
