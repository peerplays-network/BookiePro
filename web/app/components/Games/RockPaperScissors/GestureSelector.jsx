import React from 'react';
import ReactDOM from 'react-dom';
import createjs from 'createjs';
import machina from 'machina';

let GestureSelectorFsm = machina
  .Fsm
  .extend({
    initialize: function (gestureSelector) {
      this.gestureSelector = gestureSelector;
    },
    initialState: 'hidden',
    currentGesture: null,
    states: {
      hidden: {
        // All elements are hidden
        displayGestureSelector: function () {
          createjs.Tween.get(this.gestureSelector.circle).to({
            scaleX: 1,
            scaleY: 1
          }, 400, createjs.Ease.backIn).wait(200).call(() => {
            this.transition('displayingGestureSelector');
          });

          this.gestureSelector.buttons.forEach((button, buttonIndex) => {
            button.set({
              x: this.gestureSelector.shapes[buttonIndex].x,
              y: this.gestureSelector.shapes[buttonIndex].y,
              scaleX: 0,
              scaleY: 0,
              alpha: 1
            });

            if (button.name !== 'question') {
              // waiting animation
              createjs.Tween.get(button).wait(400).to({
                scaleX: 1,
                scaleY: 1
              }, 200, createjs.Ease.backIn).call(() => {
                createjs.Tween.get(button, {loop: true}).to({
                  scaleX: 0.95,
                  scaleY: 0.95
                }, 600, createjs.Ease.sineIn).to({
                  scaleX: 1,
                  scaleY: 1
                }, 600, createjs.Ease.sineOut);
              });
              // waiting animation for the shadow
              createjs.Tween.get(button.getChildByName('circle').shadow).wait(600).call(() => {
                createjs.Tween.get(button.getChildByName('circle').shadow, {
                  loop: true,
                  paused: true
                }).to({
                  offsetX: this.gestureSelector.shadowOffset.x * 0.75,
                  offsetY: this.gestureSelector.shadowOffset.y * 0.75
                }, 600, createjs.Ease.sineIn).to({
                  offsetX: this.gestureSelector.shadowOffset.x,
                  offsetY: this.gestureSelector.shadowOffset.y
                }, 600, createjs.Ease.sineOut);
              });
            }
          });
          this.transition('transitioningToDisplayGestureSelector');
        },
        displaySelectedGesture: function () {
          createjs.Tween.get(this.gestureSelector.circle).to({
            scaleX: 1,
            scaleY: 1
          }, 400, createjs.Ease.backIn).wait(200).call(() => {
            this.transition('displayingSelectedGesture');
          });
          this.gestureSelector.buttons.forEach((button) => {
            if (button.name === this.gestureSelector.gestureToDisplay) {
              button.set({
                x: this.gestureSelector.maxCircleCenter.x,
                y: this.gestureSelector.maxCircleCenter.y,
                scaleX: 0,
                scaleY: 0
              });
              createjs.Tween.get(button).wait(400).to({
                scaleX: 1,
                scaleY: 1
              }, 200, createjs.Ease.backIn);
            } else {
              button.set({scaleX: 0, scaleY: 0});
            }
          });
          this.transition('transitioningToDisplayingSelectedGesture');
        },
        displayCommittedGesture: function (gestureToDisplay) {
          this.gestureSelector.buttons.forEach((button) => {
            // only one of the buttons should have been visible, but it is easiest to hide them all
            button.set({
              alpha: 0
            }, 200);
          });
          this.gestureSelector.icons.forEach((icon) => {
            icon.set({alpha: 0, scaleX: 1, scaleY: 1});
          });
          this.gestureSelector.circle.set({scaleX: 0, scaleY: 0});
          createjs.Tween.get(this.gestureSelector.circle).to({
            scaleX: 1,
            scaleY: 1
          }, 600, createjs.Ease.backIn).call(() => {
            this.transition('displayingCommittedGesture');
          });
          this.gestureSelector.icons.forEach((icon) => {
            if (icon.name === gestureToDisplay) {
              icon.set({alpha: 1, scaleX: 0, scaleY: 0});
              createjs.Tween.get(icon).wait(200).to({
                scaleX: 1,
                scaleY: 1
              }, 400, createjs.Ease.backIn);
            }
          });
          this.currentGesture = gestureToDisplay;
          this.transition('transitioningToDisplayingCommittedGesture');
        }
      },
      transitioningToDisplayingGestureSelector: {
        _onEnter: function () {
          console.log(
            'Entering transitioningToDisplayingGestureSelector, player %d',
            this.gestureSelector.props.playerIndex
          );
        },
        _onExit: function () {
          console.log(
            'Exiting transitioningToDisplayingGestureSelector, player %d',
            this.gestureSelector.props.playerIndex
          );
        },
        '*': function (eventObject) {
          console.log(
            'Defering event %s until transition is finished, player %d',
            eventObject.inputType,
            this.gestureSelector.props.playerIndex
          );
          this.deferUntilTransition('displayingGestureSelector');
        }
      },
      displayingGestureSelector: {
        _onEnter: function () {
          console.log(
            'Entering displayingGestureSelector, player %d', this.gestureSelector.props.playerIndex
          );
        },
        _onExit: function () {
          console.log(
            'Exiting displayingGestureSelector, player %d', this.gestureSelector.props.playerIndex
          );
        },
        // three buttons are spaced around the circle, pulsing question button is zero
        // size in the center icons are all alpha zero in the center
        gestureSelected: function (gestureToDisplay) {
          this.gestureSelector.props.getActiveKeyFromState().then(() => {
            this.gestureSelector.buttons.forEach((button, buttonIndex) => {
              createjs.Tween.removeTweens(button);
              createjs.Tween.removeTweens(button.getChildByName('circle').shadow);

              if (button.name === this.gestureSelector.gestureToDisplay) {
                // zoom it to the center of the circle
                createjs.Tween.get(button).to({
                  x: (this.gestureSelector.shapes[buttonIndex].x
                      + this.gestureSelector.maxCircleCenter.x) / 2,
                  y: (this.gestureSelector.shapes[buttonIndex].y
                    + this.gestureSelector.maxCircleCenter.y) / 2,
                  scaleX: 1.2,
                  scaleY: 1.2
                }, 400, createjs.Ease.sineIn).to({
                  x: this.gestureSelector.maxCircleCenter.x,
                  y: this.gestureSelector.maxCircleCenter.y,
                  scaleX: 1,
                  scaleY: 1
                }, 400, createjs.Ease.sineOut).call(() => {
                  // We broadcast the commit move after all of the animations are done because the
                  // crypto causes the animations to stutter.
                  this.props.commitMove(
                    this.props.tournament_id,
                    this.gestureSelector.props.currentGame.get('id'),
                    this.gestureSelector.props.currentGame.getIn(['players',
                      this.gestureSelector.props.playerIndex]
                    ), gestureToDisplay
                  );

                  this.transition('displayingSelectedGesture');
                });
              } else if (button.name === 'question') {
                // should already be hidden
                button.set({scaleX: 0, scaleY: 0});
              } else {
                // shrink it away
                createjs.Tween.get(button).to({
                  scaleX: 0,
                  scaleY: 0
                }, 350, createjs.Ease.backIn);
              }
            });

            this.currentGesture = gestureToDisplay;
            this.transition('transitioningToDisplayingSelectedGesture');
          }).catch((err) => {
            console.log('CANCEL INNER', err);
          });
        },
        displayCommittedGesture: function (gestureToDisplay) {
          // we never saw the user select their gesture, so disappear all of the buttons
          // in place and show the selected gesture
          this.gestureSelector.buttons.forEach((button) => {
            createjs.Tween.removeTweens(button);
            createjs.Tween.removeTweens(button.getChildByName('circle').shadow);

            createjs.Tween.get(button).to({
              scaleX: 0,
              scaleY: 0
            }, 350, createjs.Ease.backIn);
          });
          this.gestureSelector.icons.forEach((icon) => {
            if (icon.name === gestureToDisplay) {
              icon.set({alpha: 0, scaleX: 1, scaleY: 1});
              createjs.Tween.get(icon).to({
                alpha: 1
              }, 200).call(() => {
                this.transition('displayingCommittedGesture');
              });
            }
          });
          this.currentGesture = gestureToDisplay;
          this.transition('transitioningToDisplayingCommittedGesture');
        },
        displayWinLoseTie: function (gestureName) {
          // we never saw the opponent commit their move as a distinct step, so fake it
          // here
          this.deferUntilTransition('displayingCommittedGesture');
          this.handle('displayCommittedGesture', gestureName);
        },
        hideDisplay: function () {}
      },
      transitioningToDisplayingSelectedGesture: {
        _onEnter: function () {
          console.log(
            'Entering transitioningToDisplayingSelectedGesture, player %d',
            this.gestureSelector.props.playerIndex
          );
        },
        _onExit: function () {
          console.log(
            'Exiting transitioningToDisplayingSelectedGesture, player %d',
            this.gestureSelector.props.playerIndex
          );
        },
        '*': function (eventObject) {
          console.log(
            'Defering event %s until transition is finished, player %d',
            eventObject.inputType, this.gestureSelector.props.playerIndex
          );
          this.deferUntilTransition('displayingSelectedGesture');
        }
      },
      displayingSelectedGesture: {
        // We're displaying a selected gesture, one button is in the middle of the
        // circle, all icons are hidden
        _onEnter: function () {
          console.log(
            'Entering displayingSelectedGesture, player %d',
            this.gestureSelector.props.playerIndex
          );
        },
        displayCommittedGesture: function (gestureToDisplay) {
          this.gestureSelector.buttons.forEach((button) => {
            // only one of the buttons should have been visible, but it is easiest to hide
            // them all
            createjs.Tween.get(button).to({
              alpha: 0
            }, 200);
          });
          this.gestureSelector.icons.forEach((icon) => {
            if (icon.name === gestureToDisplay) {
              icon.set({alpha: 0, scaleX: 1, scaleY: 1});
              createjs.Tween.get(icon).to({
                alpha: 1
              }, 200).call(() => {
                this.transition('displayingCommittedGesture');
              });
            }
          });
          this.currentGesture = gestureToDisplay;
          this.transition('transitioningToDisplayingCommittedGesture');
        },
        displayWinLoseTie: function (gestureName) {
          // we never saw the opponent commit their move as a distinct step, so fake it
          // here
          this.deferUntilTransition('displayingCommittedGesture');
          this.handle('displayCommittedGesture', gestureName);
        },
        _onExit: function () {
          console.log(
            'Exiting displayingSelectedGesture, player %d',
            this.gestureSelector.props.playerIndex
          );
        }
      },
      transitioningToDisplayingCommittedGesture: {
        _onEnter: function () {
          console.log(
            'Entering transitioningToDisplayingCommittedGesture, player %d',
            this.gestureSelector.props.playerIndex
          );
        },
        _onExit: function () {
          console.log(
            'Exiting transitioningToDisplayingCommittedGesture, player %d',
            this.gestureSelector.props.playerIndex
          );
        },
        '*': function (eventObject) {
          console.log(
            'Defering event %s until transition is finished, player %d',
            eventObject.inputType, this.gestureSelector.props.playerIndex
          );
          this.deferUntilTransition('displayingCommittedGesture');
        }
      },
      displayingCommittedGesture: {
        _onEnter: function () {
          console.log('Entering displayingCommittedGesture');
        },
        displayGestureSelector: function () {
          this.gestureSelector.icons.forEach((icon) => {
            // only one of the icons should have been visible, but it is easiest to hide
            // them all
            createjs.Tween.get(icon).to({
              alpha: 0
            }, 200);
          });
          this.gestureSelector.buttons.forEach((button, buttonIndex) => {
            button.set({
              x: this.gestureSelector.shapes[buttonIndex].x,
              y: this.gestureSelector.shapes[buttonIndex].y,
              scaleX: 0, scaleY: 0, alpha: 1
            });

            if (button.name !== 'question') {
              // waiting animation
              createjs.Tween.get(button).wait(200).to({
                scaleX: 1,
                scaleY: 1
              }, 200, createjs.Ease.backIn).call(() => {
                createjs.Tween.get(button, {loop: true}).to({
                  scaleX: 0.95,
                  scaleY: 0.95
                }, 600, createjs.Ease.sineIn).to({
                  scaleX: 1,
                  scaleY: 1
                }, 600, createjs.Ease.sineOut);
              });
              // waiting animation for the shadow
              createjs.Tween.get(button.getChildByName('circle').shadow).wait(400).call(() => {
                createjs.Tween.get(button.getChildByName('circle').shadow, {
                  loop: true,
                  paused: true
                }).to({
                  offsetX: this.gestureSelector.shadowOffset.x * 0.75,
                  offsetY: this.gestureSelector.shadowOffset.y * 0.75
                }, 600, createjs.Ease.sineIn).to({
                  offsetX: this.gestureSelector.shadowOffset.x,
                  offsetY: this.gestureSelector.shadowOffset.y
                }, 600, createjs.Ease.sineOut);
              });
            }
          });
          createjs.Tween.get(this.gestureSelector.circle).wait(400).call(() => {
            this.transition('displayingGestureSelector');
          });
          this.transition('transitioningToDisplayGestureSelector');
        },
        displaySelectedGesture: function () {
          this.gestureSelector.icons.forEach((icon) => {
            // only one of the icons should have been visible, but it is easiest to hide
            // them all
            createjs.Tween.get(icon).to({
              alpha: 0
            }, 200);
          });
          this.gestureSelector.buttons.forEach((button, ) => {
            // all buttons are hidden, only need to un-hide the one we're concerned with
            if (button.name === this.gestureSelector.gestureToDisplay) {
              button.set({
                x: this.gestureSelector.maxCircleCenter.x,
                y: this.gestureSelector.maxCircleCenter.y,
                scaleX: 0,
                scaleY: 0,
                alpha: 1
              });
              createjs.Tween.get(button).wait(200).to({
                scaleX: 1,
                scaleY: 1
              }, 200, createjs.Ease.backIn).call(() => {
                this.transition('displayingSelectedGesture');
              });
            }
          });
          this.transition('transitioningToDisplayingSelectedGesture');
        },
        displayCommittedGesture: function (gestureName) {
          // we are already displaying the committed gesture, but in the unlikely chance
          // it has changed, jump to it now
          this.gestureSelector.icons.forEach((icon) => {
            if (icon.name === gestureName) {
              icon.set({alpha: 1, scaleX: 1, scaleY: 1});
            } else {
              icon.set({alpha: 0, scaleX: 1, scaleY: 1});
            }
          });
          this.currentGesture = gestureName;
          // remain in this state
        },
        displayWinLoseTie: function (gestureName, winLoseTie) {
          this.gestureSelector.icons.forEach((icon) => {
            if (icon.name === gestureName) {
              // if we somehow got here with the wrong icon displayed, force it to the correct
              // icon immediately
              icon.set({alpha: 1});

              if (winLoseTie === 'win') {
                createjs.Tween.get(icon).to({
                  scaleX: 2.25,
                  scaleY: 2.25
                }, 400).wait(400).call(() => {
                  this.transition('displayingWinLoseTie');
                });
              } else if (winLoseTie === 'lose') {
                createjs.Tween.get(icon).to({
                  scaleX: .75,
                  scaleY: .75
                }, 400).wait(400).call(() => {
                  this.transition('displayingWinLoseTie');
                });
              } else {
                createjs.Tween.get(icon).to({
                  rotation: 90
                }, 100).to({
                  rotation: 180
                }, 100).to({
                  rotation: 270
                }, 100).to({
                  rotation: 0
                }, 100).wait(400).call(() => {
                  this.transition('displayingWinLoseTie');
                });
              }
            } else {
              icon.set({alpha: 0});
            }

            this.transition('transitioningToDisplayingWinLoseTie');
          });
        },
        _onExit: function () {
          console.log('Exiting displayingCommittedGesture');
        }
      },
      transitioningToDisplayingWinLoseTie: {
        _onEnter: function () {
          console.log(
            'Entering transitioningToDisplayingWinLoseTie, player %d',
            this.gestureSelector.props.playerIndex
          );
        },
        _onExit: function () {
          console.log(
            'Exiting transitioningToDisplayingWinLoseTie, player %d',
            this.gestureSelector.props.playerIndex
          );
        },
        '*': function (eventObject) {
          console.log(
            'Defering event %s until transition is finished, player %d',
            eventObject.inputType,
            this.gestureSelector.props.playerIndex
          );
          this.deferUntilTransition('displayingWinLoseTie');
        }
      },
      displayingWinLoseTie: {
        _onEnter: function () {
          console.log('Entering displayingWinLoseTie');
        },
        displayGestureSelector: function () {
          this.gestureSelector.icons.forEach((icon) => {
            // only one of the icons should have been visible, but it is easiest to hide them all
            createjs.Tween.get(icon).to({
              alpha: 0
            }, 200);
          });
          this.gestureSelector.buttons.forEach((button, buttonIndex) => {
            button.set({
              x: this.gestureSelector.shapes[buttonIndex].x,
              y: this.gestureSelector.shapes[buttonIndex].y,
              scaleX: 0, scaleY: 0, alpha: 1
            });

            if (button.name !== 'question') {
              // waiting animation
              createjs.Tween.get(button).wait(200).to({
                scaleX: 1,
                scaleY: 1
              }, 200, createjs.Ease.backIn).call(() => {
                createjs.Tween.get(button, {loop: true}).to({
                  scaleX: 0.95,
                  scaleY: 0.95
                }, 600, createjs.Ease.sineIn).to({
                  scaleX: 1,
                  scaleY: 1
                }, 600, createjs.Ease.sineOut);
              });
              // waiting animation for the shadow
              createjs.Tween.get(button.getChildByName('circle').shadow).wait(400).call(() => {
                createjs.Tween.get(button.getChildByName('circle').shadow, {
                  loop: true,
                  paused: true
                }).to({
                  offsetX: this.gestureSelector.shadowOffset.x * 0.75,
                  offsetY: this.gestureSelector.shadowOffset.y * 0.75
                }, 600, createjs.Ease.sineIn).to({
                  offsetX: this.gestureSelector.shadowOffset.x,
                  offsetY: this.gestureSelector.shadowOffset.y
                }, 600, createjs.Ease.sineOut);
              });
            }
          });
          createjs.Tween.get(this.gestureSelector.circle).wait(400).call(() => {
            this.transition('displayingGestureSelector');
          });
          this.transition('transitioningToDisplayGestureSelector');
        },
        displaySelectedGesture: function () {
          this.gestureSelector.icons.forEach((icon) => {
            // only one of the icons should have been visible, but it is easiest to hide
            // them all
            createjs.Tween.get(icon).to({
              alpha: 0
            }, 200);
          });
          this.gestureSelector.forEach((button) => {
            // all buttons are hidden, only need to un-hide the one we're concerned with
            if (button.name === this.gestureSelector.gestureToDisplay) {
              button.set({
                x: this.gestureSelector.maxCircleCenter.x,
                y: this.gestureSelector.maxCircleCenter.y,
                scaleX: 0,
                scaleY: 0,
                alpha: 1
              });
              createjs.Tween.get(button).wait(200).to({
                scaleX: 1,
                scaleY: 1
              }, 200, createjs.Ease.backIn).call(() => {
                this.transition('displayingSelectedGesture');
              });
            }
          });
          this.transition('transitioningToDisplayingSelectedGesture');
        },
        _onExit: function () {
          console.log('Exiting displayingWinLoseTie');
        }
      },
      displayingOpponentGestureSelector: {}
    },
    displayGestureSelector: function () {
      console.log(
        'Triggering displayGestureSelector, player %d', this.gestureSelector.props.playerIndex
      );
      this.handle('displayGestureSelector');
    },
    displayCommittedGesture: function (gesture) {
      console.log(
        'Triggering displayCommittedGesture, player %d', this.gestureSelector.props.playerIndex
      );
      this.handle('displayCommittedGesture', gesture);
    },
    displaySelectedGesture: function () {
      console.log(
        'Triggering displaySelectedGesture, player %d', this.gestureSelector.props.playerIndex
      );
      this.handle('displaySelectedGesture');
    },
    gestureSelected: function (gestureName) {
      console.log(
        'Triggering gestureSelected, player %d', this.gestureSelector.props.playerIndex
      );
      this.handle('gestureSelected', gestureName);
    },
    displayWinLoseTie: function (gestureName, winLoseTie) {
      console.log(
        'Triggering displayWinLoseTie, player %d', this.gestureSelector.props.playerIndex
      );
      this.handle('displayWinLoseTie', gestureName, winLoseTie);
    },
    hideDisplay: function () {
      console.log('Triggering hideDisplay, player %d', this.gestureSelector.props.playerIndex);
      this.handle('hideDisplay');
    }
  });

class GestureSelector extends React.Component {
  constructor(props) {
    super(props);
    this.playerId = null;
    this.isMyAccount = false;
    this.displayState = 'hidden';
    this.committed = false;
    this.revealed = false;
    this.previousGameId = null;
    this.previousGameResult = null;
    this.reveal_moves = [];
    this.fsm = new GestureSelectorFsm(this);
  }

  componentDidMount() {
    // Init CreateJS
    let canvas = ReactDOM.findDOMNode(this.refs.canvas);
    this.stage = new createjs.Stage(canvas);

    // The largest circle that can be drawn in the canvas
    this.maxCanvasDiameter = Math.min(this.props.width, this.props.height);
    this.shadowDirection = 7 * Math.PI / 4;
    this.shadowDistance = this.maxCanvasDiameter / 50;
    this.shadowOffset = {
      x: Math.cos(this.shadowDirection) * this.shadowDistance,
      y: Math.sin(this.shadowDirection) * this.shadowDistance
    };
    this.maxShadowOffset = Math.max(this.shadowOffset.x, this.shadowOffset.y);

    // the largest circle that can be drawn in the canvas, allowing for a shadow
    this.maxCircleDiameter = this.maxCanvasDiameter - this.maxShadowOffset;
    this.maxCircleCenter = {
      x: (this.maxCanvasDiameter - this.shadowOffset.x) / 2,
      y: (this.maxCanvasDiameter - this.shadowOffset.y) / 2
    };

    this.maxGestureCircleDiameter = this.maxCircleDiameter / 3;
    this.gestureCircleDiameter = this.maxGestureCircleDiameter * 0.8;
    this.selectorCircleDiameter = this.maxCircleDiameter - this.gestureCircleDiameter;

    let gestures = ['rock', 'paper', 'scissors', 'question'];
    this.shapes = gestures.map((gesture, gestureIndex) => {
      let centerX = this.maxCircleCenter.x
        + this.selectorCircleDiameter * Math.cos(gestureIndex * 2 * Math.PI / 3 - Math.PI / 2) / 2;
      let centerY = this.maxCircleCenter.y
        + this.selectorCircleDiameter * Math.sin(gestureIndex * 2 * Math.PI / 3 - Math.PI / 2) / 2;

      if (gesture === 'question') {
        centerX = this.maxCircleCenter.x;
        centerY = this.maxCircleCenter.x;
      }

      let bmp = new createjs.Bitmap('images/games/rps/' + gesture + '-red.png');
      bmp.image.onload = function () {
        this.stage.update();
      }.bind(this);

      let bmpWhite = new createjs.Bitmap('images/games/rps/' + gesture + '-white.png');

      bmpWhite.image.onload = () => {
        let bounds = this.shapes[gestureIndex].bitmapWhite.getBounds();
        let scale = this.gestureCircleDiameter / bounds.width;
        this.shapes[gestureIndex].bitmapWhite.set({scaleX: scale, scaleY: scale});
        this.stage.update();
      }; //.bind(this);

      return {name: gesture, x: centerX, y: centerY, bitmap: bmp, bitmapWhite: bmpWhite};
    });

    createjs.Ticker.on('tick', this.stage);

    this.buttons = [];
    this.icons = [];
    this.draw();
    this.processProps(this.props);
    this.drawCurrentState();
  }

  componentWillReceiveProps(nextProps) {
    if (this.processProps(nextProps)) {
      this.drawCurrentState();
    }
  }

  processProps(props) {
    let playerId = null;
    let currentGameId = null;

    if (props.currentGame) {
      playerId = props.currentGame.getIn(['players', props.playerIndex]);
      currentGameId = props.currentGame.get('id');
    }

    let isMyAccount = props.isMyAccount;
    this.isMyAccount = isMyAccount;

    // default to hiding the display when we don't have any info about the game
    let displayState = 'hidden';
    let committed = false;
    let revealed = false;
    let gestureToDisplay = 'question';

    if (this.previousGameId && this.previousGameId !== currentGameId) {
      let previousGameGesture = this.gestureToDisplay;
      let previousGameResult = 'tie';

      if (props.previousGame) {
        let previousRevealMove = props.previousGame.getIn([
          'game_details', 1, 'reveal_moves', props.playerIndex
        ]);

        if (previousRevealMove) {
          previousGameGesture = previousRevealMove.get('gesture');
        }

        let winners = props.previousGame.get('winners');

        if (winners.includes(playerId)) {
          previousGameResult = 'win';
        } else if (!winners.isEmpty()) {
          previousGameResult = 'lose';
        }
      }

      this.fsm.displayWinLoseTie(previousGameGesture, previousGameResult);
    }

    this.previousGameId = currentGameId;

    if (playerId) {
      let gameDetails = props.currentGame.getIn(['game_details', 1]);
      let gameState = props.currentGame.get('state');
      let revealMove = gameDetails.getIn(['reveal_moves', props.playerIndex]);

      if (revealMove) {
        // we have a reveal move; it could have been a commit we broadcast or it could
        // be an autogenerated one, regardless, we display it
        gestureToDisplay = revealMove.get('gesture');
        revealed = true;

        if (gameState === 'expecting_reveal_moves') {
          // we've revealed our move, we're waiting for our opponent reveal theirs
          displayState = 'displaySelectedGesture';
          this.gestureToDisplay = gestureToDisplay;
          this.fsm.displayCommittedGesture(gestureToDisplay);
        } else if (gameState === 'game_complete') {
          // we've either won or lost
          displayState = 'displaySelectedGesture';
          this.gestureToDisplay = gestureToDisplay;
          this.fsm.displayCommittedGesture(gestureToDisplay);
        }
      } else {
        // if there is a commit move, we should show the move the player committed (if
        // possible)
        let commitMove = gameDetails.getIn(['commit_moves', props.playerIndex]);

        if (commitMove) {
          committed = true;

          if (isMyAccount) {
            displayState = 'displaySelectedGesture';

            let reveal_moves = this.props.reveal_moves,
              gameId = props.currentGame.get('id');

            if (
              reveal_moves &&
              reveal_moves[gameId] &&
              reveal_moves[gameId][playerId] &&
              reveal_moves[gameId][playerId][commitMove.get('nonce1')]
            ) {
              revealMove = reveal_moves[gameId][playerId][commitMove.get('nonce1')];
            }

            if (revealMove) {
              gestureToDisplay = revealMove.gesture;
            } else {
              if (this.lastClickedGesture) {
                gestureToDisplay = this.lastClickedGesture;
              }
            }

            this.gestureToDisplay = gestureToDisplay;
            this.fsm.displayCommittedGesture(gestureToDisplay);
          } else {
            displayState = 'displaySelectedGesture';
            this.gestureToDisplay = gestureToDisplay;
            this.fsm.displayCommittedGesture(gestureToDisplay);
          }
        } else {
          // no commit, no reveal, allow the user to select their move
          if (gameState === 'expecting_commit_moves') {
            if (isMyAccount) {
              displayState = 'displayGestureSelector';
              this.gestureToDisplay = gestureToDisplay;
              this.fsm.displayGestureSelector();
            } else {
              displayState = 'displaySelectedGesture';
              this.gestureToDisplay = gestureToDisplay;
              this.fsm.displaySelectedGesture();
            }
          } else if (gameState === 'expecting_reveal_moves') {
            // we didn't commit a move but the other player did, we're waiting on them to
            // reveal before we find out what our automatic move was
            displayState = 'displaySelectedGesture';
            this.fsm.displaySelectedGesture();
          }
        }
      }
    } else {
      displayState = 'hidden';
      this.fsm.hideDisplay();
    }

    if (
      isMyAccount !== this.isMyAccount ||
      playerId !== this.playerId ||
      displayState !== this.displayState ||
      gestureToDisplay !== this.gestureToDisplay ||
      committed !== this.committed ||
      revealed !== this.revealed ||
      this.props.reveal_moves !== props.reveal_moves
    ) {
      this.playerId = playerId;
      this.isMyAccount = isMyAccount;
      this.displayState = displayState;
      this.gestureToDisplay = gestureToDisplay;
      this.committed = committed;
      this.revealed = revealed;
      return true;
    } else {

      return false;
    }
  }

  drawCurrentState() {
    this.stage.update();
  }

  draw() {
    // Create the main circle in the center of the canvas
    this.circle = new createjs.Container().set({
      name: 'circle',
      x: this.maxCircleCenter.x,
      y: this.maxCircleCenter.y,
      scaleX: 0,
      scaleY: 0,
      regX: this.maxCircleCenter.x,
      regY: this.maxCircleCenter.y
    });
    let circle = new createjs.Shape();
    circle.graphics.beginFill('#d63230')
      //.drawCircle(0, 0, this.selectorCircleDiameter / 2)
      .drawCircle(this.maxCircleCenter.x, this.maxCircleCenter.y, this.selectorCircleDiameter / 2);
    this.circle.shadow = new createjs.Shadow(
      '#881b1b', this.shadowOffset.x, this.shadowOffset.y, 0
    );
    this.circle.addChild(circle);
    this.stage.addChild(this.circle);

    this.shapes.forEach((shape, shapeIndex) => {
      // Create the clickable red-on-white buttons for the three gestures and a
      // non-clickable question mark
      this.buttons[shapeIndex] = new createjs.Container().set({
        name: shape.name,
        x: shape.x,
        y: shape.y,
        scaleX: 0,
        scaleY: 0,
        regX: this.gestureCircleDiameter / 2,
        regY: this.gestureCircleDiameter / 2
      });

      circle = new createjs.Shape();
      circle.name = 'circle';
      circle.graphics.beginFill('#ffffff').drawCircle(
        this.gestureCircleDiameter / 2,
        this.gestureCircleDiameter / 2,
        this.gestureCircleDiameter / 2
      );

      circle.shadow = new createjs.Shadow('#881b1b', this.shadowOffset.x, this.shadowOffset.y, 0);
      this.buttons[shapeIndex].addChild(circle);
      this.buttons[shapeIndex].addChild(shape.bitmap);

      if (shape.name !== 'question') {
        // question mark is non-clickable
        this.buttons[shapeIndex].addEventListener('click', (ev) => {
          let shape = ev.currentTarget.name;
          this.gestureClicked(shape);
        });
      }

      this.stage.addChild(this.buttons[shapeIndex]);

      // create white-on-red icons for each of the gestures
      this.icons[shapeIndex] = new createjs.Container().set({
        name: this.shapes[shapeIndex].name,
        x: this.maxCircleCenter.x,
        y: this.maxCircleCenter.x,
        scaleX: 0,
        scaleY: 0,
        regX: this.gestureCircleDiameter / 2,
        regY: this.gestureCircleDiameter / 2
      });
      circle = new createjs.Shape();
      circle.name = 'circle';
      circle.graphics.beginFill('#d63230').drawCircle(
        this.gestureCircleDiameter / 2,
        this.gestureCircleDiameter / 2,
        this.gestureCircleDiameter / 2
      );
      this.icons[shapeIndex].addChild(circle);
      this.icons[shapeIndex].addChild(this.shapes[shapeIndex].bitmapWhite);
      this.stage.addChild(this.icons[shapeIndex]);
    });
    this.stage.update();
  }

  gestureClicked(gesture) {
    this.gestureToDisplay = gesture;
    this.lastClickedGesture = gesture;
    this.fsm.gestureSelected(gesture);
  }

  render() {
    return (
      <canvas width={ this.props.width } height={ this.props.height } ref='canvas'></canvas>
    );
  }
}

export
default GestureSelector;