import React, {PureComponent} from 'react';
import moment from 'moment';
import {I18n} from 'react-redux-i18n';

class Clock extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      time: moment()
    };
  }

  componentDidMount() {
    this.timer = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  tick() {
    this.setState({
      time: moment()
    });
  }

  render() {
    return (
      <div { ...this.props }>
        {I18n.t('titleBar.clock')} <span>{this.state.time.format('HH:mm')}</span>
      </div>
    );
  }
}

export default Clock;
