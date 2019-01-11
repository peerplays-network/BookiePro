import React from 'react';
import Translate from 'react-translate-component';

//@connect()
class Table extends React.Component {
  render() {
    let rows = this.props.rows.map((row) => {
      if ([
        'asset_update_bitasset',
        'asset_update_feed_producers',
        'asset_settle',
        'asset_global_settle',
        'asset_publish_feed',
        'premium_fee',
        'account_upgrade',
        'committee_member_update_global_parameters',
        'worker_create',
        'custom',
        'assert',
        'proposal_create',
        'proposal_update',
        'proposal_delete',
        'vesting_balance_create',
        'vesting_balance_withdraw',
        'transfer_to_blind',
        'blind_transfer'
      ].indexOf(row.operation_name) !== -1) {
        return null;
      }

      let fees = row.fee.map((fee, index) => {
        let key = `${index} ${row.operation}`;
        let standartFee = fee.standartFee
          ? <div key={ `${key} standartFee` } className='tableCell text_r'>{fee.standartFee}</div>
          : <div key={ `${key} standartFee` } className='tableCell text_r'>-
            <sup>*</sup>
          </div>;

        if (fee.feeKey === 'premium_fee') {
          return [];
        }

        return ([
          <div key = {
            `${key} type`
          }
          className = 'tableCell' > {
              fee.feeType
            } </div>,
          standartFee]); //,
        // <div key={ `${key} memberFee` } className='tableCell text_r'>{fee.memberFee}</div >]);
      });
      return fees.map((fee, index) => {

        if (!fee.length) {
          return null;
        }

        return (
          <div key={ `${index} ${row.operation}` } className='tableRow'>
            {
              index !== 0
                ? <div className='tableCell'></div>
                : <div className='tableCell'>
                  <div className='btn btn-mark btn-mark-explore'>{row.operation}</div>
                </div>
            }
            {fee}
          </div>
        );
      });
    });
    return (
      <div className='table__section'>
        <h2 className='h2'>{this.props.title}</h2>
        <div className='table table2 table-explore-freeSchedule'>
          <div className='table__head tableRow'>
            <div className='tableCell'>
              <Translate content='explore.feeSchedule.table.operation'/>
            </div>
            <div className='tableCell'>
              <Translate content='explore.feeSchedule.table.fee_type'/>
            </div>
            <div className='tableCell text_r'>
              <Translate content='explore.feeSchedule.table.standart_fee'/>
            </div>
            {/*<div className="tableCell text_r">
              <Translate content="explore.feeSchedule.table.lifetime_anual_member_fee" /></div>*/}
          </div>
          <div className='table__body'>
            {rows}
          </div>
        </div>
      </div>
    );
  }
}

export default Table;
