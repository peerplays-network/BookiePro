import React, { Component } from 'react';
import { Button } from 'antd';
import { Link } from 'react-router';

class SyncError extends Component {
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
          { 'Fail to Sync With Blockchain' }
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
        // window.remote.getCurrentWindow().reload();

        console.log("electron window");
  this.context.router.push('/home');
    } else {
      // window.location.href = '/'
      console.log("electron window else");

      this.context.router.push('/home');

    }
  }
}


export default SyncError;
