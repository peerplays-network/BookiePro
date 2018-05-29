import React, { PureComponent } from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import Ps from 'perfect-scrollbar';
import ReactDOM from 'react-dom';
import { I18n } from 'react-redux-i18n';

class RulesModalScrollableContent extends PureComponent {
  componentDidMount() {
    Ps.initialize(ReactDOM.findDOMNode(this.refs.scrollableSection));
  }
  componentDidUpdate() {
    Ps.update(ReactDOM.findDOMNode(this.refs.scrollableSection));
  }

  render() {
    
    const rules = this.props.rules.get('description');
    const pattern = /([A-Z]+\s[A-Z]+(?=\s))\s([^\.]+\.)\s(.+)\s(?=Please note)(.+)/g;
    const parts = pattern.exec(rules);

    let output = rules;

    // If we've matched all the pieces that we are expecting.
    if (parts && parts.length === 5) {
      output = <div>
        <p>
          {parts[1]}
        </p>
        <p>
          {parts[2]}
        </p>
        <p>
          {parts[3]}
        </p>
        <p>
          {parts[4]}
        </p>
      </div>;
    }

    return (
      <div className='rules-modal-content' ref='scrollableSection'>
        { output }
      </div>
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
        title={ I18n.t('rules_dialogue.buttonTitle') }
        wrapClassName={ 'vertical-center-modal rules-modal' }
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
