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
import ReactDOM from 'react-dom';
import createjs from 'createjs';
import TimeHelper from 'helpers/TimeHelper';
import moment from 'moment-timezone';
import {ChainStore} from 'peerplaysjs-lib';

class MoveTimerDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.currentExpirationTime = null;
    this.timeoutId = null;
    this.secondsRemaining = null;
    this.next_timeout = null;
    this.timeOffset = null;

    this.setTimeOffset();

    if (this.props.currentGame && this.props.currentGame.get('next_timeout')) {
      this.next_timeout = this.props.currentGame.get('next_timeout');
      this.currentExpirationTime = this.adjustTime(this.props.currentGame.get('next_timeout'));
    }
  }

  componentDidMount() {
    // Init CreateJS
    let canvas = ReactDOM.findDOMNode(this.refs.canvas);
    this.stage = new createjs.Stage(canvas);

    // The largest circle that can be drawn in the canvas
    this.maxCanvasDiameter = Math.min(this.props.width, this.props.height);

    this.draw();

    if (this.currentExpirationTime) {
      this.timerCallback();
    }
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  componentWillReceiveProps(nextProps) {
    let nextExpirationTime = null,
      gameState = nextProps.currentGame.get('state');

    if (
      gameState === 'expecting_commit_moves' &&
      nextProps.currentGame &&
      nextProps.currentGame.get('next_timeout') &&
      this.next_timeout !== nextProps.currentGame.get('next_timeout')
    ) {
      this.setTimeOffset();
      this.next_timeout = nextProps.currentGame.get('next_timeout');
      nextExpirationTime = this.adjustTime(nextProps.currentGame.get('next_timeout'));

      if (nextExpirationTime !== this.currentExpirationTime) {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
          this.timeoutId = null;
        }

        this.currentExpirationTime = nextExpirationTime;
        this.timerCallback();
      }
    }
  }

  setTimeOffset() {
    this.timeOffset = ChainStore.getEstimatedChainTimeOffset();
  }

  adjustTime(next_timeout) {
    let MAX_TIMER_SECONDS = 20,
      diffSeconds = moment.utc(next_timeout).diff(
        moment(new Date(new Date().getTime() - this.timeOffset)).utc(), 'seconds'
      );

    if (diffSeconds > MAX_TIMER_SECONDS) {
      return TimeHelper.timeStringToDate(
        moment(next_timeout).subtract(diffSeconds - MAX_TIMER_SECONDS, 'seconds')
          .format('YYYY-MM-DDTHH:mm:ss')
      );
    }

    return TimeHelper.timeStringToDate(moment(next_timeout).format('YYYY-MM-DDTHH:mm:ss'));
  }

  timerCallback() {
    let secondsRemaining = null;
    /**
         * This will fix itself if the user changes their clock
         */

    let now = new Date(new Date().getTime() - this.timeOffset);
    // let now = new Date();

    if (this.currentExpirationTime) {
      if (this.currentExpirationTime > now) {
        let millisecondsRemaining = this.currentExpirationTime - now;
        secondsRemaining = Math.floor(millisecondsRemaining / 1000);
        let millisecondsUntilNextSecond = millisecondsRemaining % 1000;

        this.timeoutId = setTimeout(this.timerCallback.bind(this), millisecondsUntilNextSecond);
      } else {
        secondsRemaining = 0;
      }
    }

    if (this.secondsRemaining !== secondsRemaining) {
      if (secondsRemaining !== null) {
        this.counterLabel.set({
          text: secondsRemaining.toString()
        });
        this.counter.set({scaleX: 1, scaleY: 1});
      } else {
        this.counterLabel.set({text: ''});
        this.counter.set({scaleX: 0, scaleY: 0});
      }

      this.stage.update();
      this.secondsRemaining = secondsRemaining;
    }
  }

  draw() {
    //counter
    this.counter = new createjs.Container().set({scaleX: 0, scaleY: 0, alpha: 1});

    let circle = new createjs.Shape();
    circle.graphics.beginFill('#ffffff').drawCircle(
      this.maxCanvasDiameter / 2, this.maxCanvasDiameter / 2, this.maxCanvasDiameter / 2
    );
    this.counter.addChild(circle);

    this.counterLabel = new createjs.Text.set({
      font: (this.maxCanvasDiameter / 2) + 'px \'Squada One\'',
      color: '#1981a0',
      text: '',
      x: this.maxCanvasDiameter / 2,
      y: this.maxCanvasDiameter / 2,
      textAlign: 'center',
      textBaseline: 'middle'
    });

    this.counter.addChild(this.counterLabel);
    this.stage.addChild(this.counter);
    this.stage.update();
  }

  render() {
    return <canvas width={ this.props.width } height={ this.props.height } ref='canvas'></canvas>;
  }
}

export default MoveTimerDisplay;