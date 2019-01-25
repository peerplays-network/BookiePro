import React, {Component} from 'react';
import {FormattedRelative} from 'react-intl';

class TimeRelativeOnce extends Component {
  componentWillReceiveProps(next_props) {
    if (next_props.time !== this.props.time) {
      return true;
    }

    return false;
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.time !== this.props.time;
  }

  render() {
    return (<FormattedRelative
      updateInterval={ 500 }
      value={ this.props.time }
      initialNow={ Date.now() }/>);
  }
}

export default TimeRelativeOnce;