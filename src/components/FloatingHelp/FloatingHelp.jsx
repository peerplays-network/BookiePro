/**
 * The FloatingHelp is an help icon that appears at the lower right corner of the
 * screen in the following screens: Landing, Login, SignUp and Welcome.
 *
 * When a user clicks on the icon, a modal containing the Bookie FAQ will be displayed.
 */
import React, {PureComponent} from 'react';
import FaqModal from '../Modal/FaqModal';
import helpIcon from '../../assets/icons/landing_help_icon.png';

class FloatingHelp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false
    };
    this.onIconClick = this.onIconClick.bind(this);
    this.onCancelClick = this.onCancelClick.bind(this);
  }

  onIconClick(event) {
    event.preventDefault();
    this.setState({
      modalVisible: true
    });
  }

  onCancelClick() {
    this.setState({
      modalVisible: false
    });
  }

  render() {
    return (
      <div>
        <div className='floating-help'>
          <a onClick={ this.onIconClick }>
            <img className='help-icon' src={ helpIcon } alt='' />
          </a>
        </div>
        <FaqModal visible={ this.state.modalVisible } onCancelClick={ this.onCancelClick } />
      </div>
    );
  }
}

export default FloatingHelp;
