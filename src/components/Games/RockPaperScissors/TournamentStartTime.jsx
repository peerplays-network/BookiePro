import React from 'react';
import TimeHelper from 'helpers/TimeHelper';
import moment from 'moment-timezone';
import counterpart from 'counterpart';

class TournamentStartTime extends React.Component {
  render() {
    if (!this.props.start_time && !this.props.start_delay) {
      return null;
    }

    let startTimeString = this.props.start_time;

    if (this.props.start_time_tournament) {
      return (
        <span>{
          moment.utc(this.props.start_time_tournament).tz(moment.tz.guess())
            .format('MMMM D, YYYY hh:mm A Z')}
        </span>
      );
    } else if (startTimeString) {
      let startTime = TimeHelper.timeStringToDate(startTimeString);
      return (
        <div className='mark-pink'>
          <span>{moment(startTime).fromNow()}</span>
        </div>
      );
    } else {
      let startDelaySeconds = this.props.start_delay;
      let startDelayDuration = moment.duration(startDelaySeconds, 'seconds');
      let startDelayString = counterpart.translate('games.rps_game.seconds_after_join_title', {
        seconds: startDelayDuration.asSeconds()
      });
      return (
        <span title={ startDelayString }>
          {counterpart.translate('games.rps_game.humanize_time_after_full', {
            humanize_time: startDelayDuration.humanize()
          })}
        </span>
      );
    }
  }
}

export default TournamentStartTime;