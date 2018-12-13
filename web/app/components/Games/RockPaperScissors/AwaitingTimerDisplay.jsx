import React from 'react';
import TimeHelper from 'helpers/TimeHelper';
import moment from 'moment-timezone';

class AwaitingTimerDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      time: null
    };

    if (this.props.start_time) {
      this.currentExpirationTime = TimeHelper.timeStringToDate(this.props.start_time);
    }

    this.timeoutId = null;
  }
  componentDidMount() {
    this.timerCallback();
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.start_time !== this.props.start_time) {
      return true;
    } else {
      return false;
    }
  }

  timerCallback() {
    var ms = moment().diff(moment(this.currentExpirationTime));

    if (ms < 0) {
      var d = moment.duration(ms);
      var s = d.humanize();

      this.setState({time: s});

      this.timeoutId = setTimeout(this.timerCallback.bind(this), 1000);
    } else {
      this.setState({time: 0});
    }
  }

  render() {
    return <h1>{this.state.time}</h1>;
  }
}

export default AwaitingTimerDisplay;