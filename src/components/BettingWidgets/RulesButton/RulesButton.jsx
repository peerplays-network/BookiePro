import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { Button } from 'antd';
import RulesModal from '../../Modal/RulesModal';
import { I18n } from 'react-redux-i18n';

class RulesButton extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rulesModalVisible: false
    };

    this.onClick = this.onClick.bind(this);
    this.onCancelRulesModal = this.onCancelRulesModal.bind(this);
  }

  onClick(event) {
    event.preventDefault();
    this.setState({
      rulesModalVisible: true
    })
  }

  onCancelRulesModal() {
    this.setState({
      rulesModalVisible: false
    })
  }

  render() {
    const { rules } = this.props;
    if (rules && !rules.isEmpty()) {
      return (
          <Button className='rules-button' onClick={ this.onClick }>
            <i className='info-icon'></i>
            { I18n.t('rules_dialogue.buttonTitle') }
            <RulesModal rules={ rules } visible={ this.state.rulesModalVisible } onCancel={ this.onCancelRulesModal } />
          </Button>
      )
    } else {
      return null;
    }
  }
}

RulesButton.propTypes = {
  rules: PropTypes.instanceOf(Immutable.Map),
}

RulesButton.defaultProps = {
  rules: Immutable.Map(),
}

export default RulesButton;
