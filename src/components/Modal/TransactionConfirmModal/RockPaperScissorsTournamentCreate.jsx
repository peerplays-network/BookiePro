import React from 'react';
import Translate from 'react-translate-component';
import moment from 'moment';
import {connect} from 'react-redux';
import asset_utils from 'common/asset_utils';
import counterpart from 'counterpart';

class RockPaperScissorsTournamentCreate extends React.Component {
  render() {
    let rows = [],
      whitelist_records = [],
      operation = this.props.operation,
      transaction = this.props.transaction,
      whiteList = this.props.whiteList;

    if (whiteList && whiteList.length) {
      for(var i=0; i < whiteList.length;i++) {
        whitelist_records.push(whiteList[i]['text']);
      }
    }

    let trx = transaction.serialize();

    if (trx.operations.length && trx.operations[0][1]) {
      operation = trx.operations[0][1];
    } else {
      return null;
    }

    let key = 0;
    let payer = this.props.payer;
    let asset = this.props.asset;
    let amountValue = asset && operation.options.buy_in.amount
      ? operation.options.buy_in.amount / Math.pow(10, asset.precision)
      : 0;
    let amountFeeValue = asset && operation.fee.amount
      ? operation.fee.amount / Math.pow(10, asset.precision)
      : 0;

    rows.push(
      <div key={ key++ } className='mConf__tableRow'>
        <div className='mConf__tableLeft'><Translate content='games.rps_game.game' /></div>
        <div className='mConf__tableRight'>
          <Translate className='mark2' content='games.rps_game.name' />
        </div>
      </div>
    );
    rows.push(
      <div  key={ key++ } className='mConf__tableRow'>
        <div className='mConf__tableLeft'><Translate content='games.rps_game.creator' /></div>
        <div className='mConf__tableRight'>
          <span className='mark2'>
            {payer ? payer.name : operation.creator}
          </span>
        </div>
      </div>
    );
    rows.push(
      <div key={ key++ } className='mConf__tableRow'>
        <div className='mConf__tableLeft'>
          <Translate content='games.rps_game.number_of_players' />
        </div>
        <div className='mConf__tableRight'>
          <span className='mark2'>
            {operation.options.number_of_players}
          </span>
        </div>
      </div>
    );
    rows.push(
      <div  key={ key++ } className='mConf__tableRow'>
        <div className='mConf__tableLeft'>
          <Translate content='games.rps_game.number_of_wins' />
        </div>
        <div className='mConf__tableRight'>
          <span className='mark2'>
            {operation.options.number_of_wins}
          </span>
        </div>
      </div>
    );

    if (operation.options.start_time) {
      rows.push(
        <div key={ key++ } className='mConf__tableRow'>
          <div className='mConf__tableLeft'><Translate content='games.rps_game.start_time' /></div>
          <div className='mConf__tableRight'>
            <span className='mark2'>
              {
                moment.utc(
                  operation.options.start_time).tz(moment.tz.guess())
                  .format('MMMM D, YYYY hh:mm A Z')
              }
            </span>
          </div>
        </div>
      );
    } else {
      let startDelayDuration = moment.duration(operation.options.start_delay, 'seconds');
      let startDelayString = counterpart.translate(
        'games.rps_game.seconds_after_join_title',
        {seconds: startDelayDuration.asSeconds()}
      );
      rows.push(
        <div  key={ key++ } className='mConf__tableRow'>
          <div className='mConf__tableLeft'><Translate content='games.rps_game.start_delay' /></div>
          <div className='mConf__tableRight'>
            <span className='mark2'>
              <span title={ startDelayString }>{startDelayDuration.humanize() }</span>
            </span>
          </div>
        </div>
      );
    }

    rows.push(
      <div  key={ key++ } className='mConf__tableRow'>
        <div className='mConf__tableLeft'>
          <Translate content='games.rps_game.registration_deadline' />
        </div>
        <div className='mConf__tableRight'>
          <span className='mark2'>
            {
              moment.utc(operation.options.registration_deadline).tz(moment.tz.guess())
                .format('MMMM D, YYYY hh:mm A Z')
            }
          </span>
        </div>
      </div>

    );
    rows.push(
      <div  key={ key++ } className='mConf__tableRow'>
        <div className='mConf__tableLeft'><Translate content='games.rps_game.buy_in' /></div>
        <div className='mConf__tableRight'>
          <span className='mark2'>
            {
              amountValue
                ? amountValue
                : operation.options.buy_in.amount
            } / {
              asset
                ? asset_utils.getSymbol(asset.symbol)
                : operation.options.buy_in.asset_id
            }
          </span>
        </div>
      </div>
    );
    rows.push(
      <div  key={ key++ } className='mConf__tableRow'>
        <div className='mConf__tableLeft'><Translate content='transfer.fee' /></div>
        <div className='mConf__tableRight'>
          <span className='mark2'>
            {
              amountFeeValue
                ? amountFeeValue
                : operation.fee.amount
            } / {
              asset
                ? asset_utils.getSymbol(asset.symbol)
                : operation.fee.asset_id
            }
          </span>
        </div>
      </div>
    );

    if (whitelist_records.length) {
      rows.push(
        <div  key={ key++ } className='mConf__tableRow'>
          <div className='mConf__tableLeft'><Translate content='games.rps_game.whitelist' /></div>
          <div className='mConf__tableRight'>
            <span className='mark2'>
              {
                whitelist_records.reduce((elementList, account) => {
                  return (
                    elementList
                      ? [...elementList, ', ', account]
                      : [account]
                  );
                }, null)
              }
            </span>
          </div>
        </div>
      );
    } else{
      rows.push(
        <div  key={ key++ } className='mConf__tableRow'>
          <div className='mConf__tableLeft'><Translate content='games.rps_game.whitelist' /></div>
          <div className='mConf__tableRight'>
            <Translate className='mark2' content='games.rps_game.no_whitelist' />
          </div>
        </div>
      );
    }

    return (
      <div className='mConf__content'>
        <div className='mConf__table'>
          {rows}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    transaction: state.transactionConfirm.transaction.transactionObject,
    operation: state.transactionConfirm.transaction.operation,
    whiteList: state.transactionConfirm.transaction.whiteList,
    payer: state.transactionConfirm.transaction.payer,
    asset: state.transactionConfirm.transaction.asset
  };
};

export default connect(mapStateToProps)(RockPaperScissorsTournamentCreate);
