import React from 'react';
import { Overlay, PlaceBetConfirm, Waiting } from './';
import { BettingDrawerStates } from '../../../constants'

const Utils = {
  render(classPrefix, props, submitBets, deleteBets, deleteBet) {
    switch (props.overlay) {
      case BettingDrawerStates.SUBMIT_BETS_CONFIRMATION:
        return (
          <PlaceBetConfirm
            className={ `${classPrefix}.confirmation` }
            goodBets={ props.numberOfGoodBets }
            badBets={ props.numberOfBadBets }
            amount={ props.totalBetAmountString }
            cancelAction={ props.hideOverlay }
            confirmAction={ submitBets }
          />
        )
      case BettingDrawerStates.SUBMIT_BETS_ERROR:
        return (
          <Overlay
            className={ `${classPrefix}.error` }
            cancelAction={ props.hideOverlay }
            confirmAction={ submitBets }
          />
        )
      case BettingDrawerStates.DELETE_BETS_CONFIRMATION:
        return (
          <Overlay
            className={ `${classPrefix}.delete_bets` }
            cancelAction={ props.hideOverlay }
            confirmAction={ deleteBets }
            replacements={ { event: props.eventNameInDeleteBetsConfirmation } }
          />
        )
      case BettingDrawerStates.DELETE_BET_CONFIRMATION:
        return (
          <Overlay
            className={ `${classPrefix}.delete_bet` }
            cancelAction={ props.hideOverlay }
            confirmAction={ deleteBet }
            replacements={ { event: props.eventNameInDeleteBetsConfirmation } }
          />
        )
      case BettingDrawerStates.INSUFFICIENT_BALANCE_ERROR:
        return (
          <Overlay
            className={ `${classPrefix}.insufficient_balance` }
            confirmAction={ props.hideOverlay }
          />
        )
      case BettingDrawerStates.DISCONNECTED_ERROR:
        return (
          <Overlay
            className={ `${classPrefix}.disconnected` }
            cancelAction={ props.hideOverlay }
          />
        )
      case BettingDrawerStates.SUBMIT_BETS_WAITING:
        return <Waiting />
      default:
        return;
    }
  }
}

export default Utils;
