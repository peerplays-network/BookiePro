import React, { PureComponent } from 'react';
import HelpAndSupportModal from '../Modal/HelpAndSupportModal';
import helpIcon from '../../assets/icons/help_s.png';

class FloatingHelp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      helpAndSupportModalVisible: false
    }
    this.onHelpAndSupportClick = this.onHelpAndSupportClick.bind(this);
    this.onHelpAndSupportCancelClick = this.onHelpAndSupportCancelClick.bind(this);
  }

  onHelpAndSupportClick(event) {
    event.preventDefault();
    this.setState( {
      helpAndSupportModalVisible: true
    });
  }

  onHelpAndSupportCancelClick() {
    this.setState( {
      helpAndSupportModalVisible: false
    });
  }

  render() {
    return (
      <div>
        <div className='floating-help'>
          <a onClick={ this.onHelpAndSupportClick }><img className='help-icon' src={ helpIcon } alt=''/></a>
        </div>
        <HelpAndSupportModal
          visible={ this.state.helpAndSupportModalVisible }
          onCancelClick={ this.onHelpAndSupportCancelClick }
        />
      </div>
    )
  }
}

export default FloatingHelp;
