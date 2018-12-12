/*
 *  Copyright (c) 2015 Cryptonomex, Inc., and contributors.
 *
 *  The MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

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
          moment
            .utc(this.props.start_time_tournament)
            .tz(moment.tz.guess())
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