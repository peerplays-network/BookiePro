import React, { Component } from 'react';
import {Icon } from 'antd'
import Controls from './Controls';
import PropTypes from 'prop-types';

class MacTitleBar extends Component {

  render() {
    return (
      <div className='mac-title-bar'>
        <div className='title'>Bookie</div>
        <div className='left'>
          <Controls isWindowFocused={ this.props.isWindowFocused }/>
        </div>
        <div className='right'>
          <Icon className='connection-icon' type='smile'/>
          <div className='clock'>
            {'Local Time 23:01'}
          </div>

        </div>

      </div>
    )
  }

}

MacTitleBar.propTypes = {
  isWindowFocused: PropTypes.bool
};

export default MacTitleBar;
