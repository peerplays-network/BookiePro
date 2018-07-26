/**
 * Credit to react desktop for this component https://github.com/gabrielbull/react-desktop
 */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Close from './Close';
import Minimize from './Minimize';
import Resize from './Resize';

var styles = {
  controls: {
    WebkitUserSelect: 'none',
    userSelect: 'none',
    cursor: 'default',
    display: 'flex',
    width: '61px'
  },

  inset: {
    marginLeft: '5px'
  }
};

class MacControls extends PureComponent {

  constructor() {
    super();
    this.state = {
      isOver: false
    };
  }

  render() {
    return (
      <div
        className='mac-controls'
        style={ {...styles.controls} }
        onMouseEnter={ () => this.setState({isOver: true}) }
        onMouseLeave={ () => this.setState({isOver: false}) }
      >
        <Close
          onClick={ this.props.onCloseClick }
          showIcon={ this.state.isOver }
          isWindowFocused={ this.props.isWindowFocused }
        />
        <Minimize
          onClick={ this.props.onMinimizeClick }
          showIcon={ this.state.isOver }
          isWindowFocused={ this.props.isWindowFocused }
        />
        <Resize
          isFullscreen={ this.props.isFullscreen }
          onClick={ this.props.onResizeClick }
          onMaximizeClick={ this.props.onMaximizeClick }
          showIcon={ this.state.isOver }
          isWindowFocused={ this.props.isWindowFocused }
        />
      </div>
    );
  }
}

MacControls.propTypes = {
  inset: PropTypes.bool,
  isFullscreen: PropTypes.bool,
  onCloseClick: PropTypes.func,
  onMinimizeClick: PropTypes.func,
  onMaximizeClick: PropTypes.func,
  onResizeClick: PropTypes.func,
  isWindowFocused: PropTypes.bool
};


export default MacControls;
