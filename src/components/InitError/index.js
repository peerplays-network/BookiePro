import React, { Component } from 'react';
import { Button } from 'antd';

class InitError extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);

    this._onReloadClick = this._onReloadClick.bind(this);
  }
  render() {
    return (
      <div>
        <div>
          { 'Fail to Connect to Blockchain' }
        </div>
        <Button type='primary' size='large' onClick={ this._onReloadClick }>
          { 'Click here to retry' }
        </Button>
      </div>
    );
  }

  _onReloadClick(e) {
    if (e) {
      e.preventDefault();
    }

    if (window.electron) {
      window.remote.getCurrentWindow().reload();
    } else {
      window.location.href = '/'
    }
  }
}


export default InitError;
