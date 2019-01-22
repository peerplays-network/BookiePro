import React from 'react';
import Select from 'react-select';
import counterpart from 'counterpart';
import Side from '../Dashboard/Balances/Side';

class DepositWithdrawContainer extends React.Component {
  render() {
    return (
      <div className='main'>
        <Side hideDepositWithdrawButton={ true }/>
        <section className='content content-aside'>
          <div className='box'>
            <div className='clearfix'>
              <div className='col col-6 deposit__col left'>
                <div className='title'>
                  {counterpart.translate('deposit_with_draw.deposit')}
                </div>
                <form action='#' className=''>
                  <div className='row2 col-8 mb-90'>
                    <label className='label label-lg'>
                      {counterpart.translate('deposit_with_draw.deposit_select_label')}
                    </label>
                    <Select
                      value='BTC'
                      options={ [{
                        value: 'BTC',
                        label: 'BTC'
                      }
                      ] }/>
                  </div>
                  <div className='row2'>
                    <div className='label label-lg'>
                      {counterpart.translate('deposit_with_draw.deposit_address')}
                    </div>
                    <div className='qr'>
                      <img src='images/img_cont/qrcode.png' alt=''/>
                    </div>
                  </div>
                  <div className='row2'>
                    <div className='fieldWrap'>
                      <input
                        type='text'
                        className='field field-type2 field-btnFloated110'
                        readOnly
                        value='1BsiAznWdMYRHPNXfH6ZHDfVHuVAZNKkPJ'/>
                      <button type='button' className='btn btn-floatedRight btn-whiteListAdd'>
                        {counterpart.translate('deposit_with_draw.copy_btn')}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className='col col-6 deposit__col right'>
                <div className='title'>
                  {counterpart.translate('deposit_with_draw.withdraw')}
                </div>
                <form action='#' className=''>
                  <div className='row2 col-8 mb-90'>
                    <label className='label label-lg'>
                      {counterpart.translate('deposit_with_draw.withdraw_select_label')}
                    </label>

                    <Select
                      value='BTC'
                      options={ [{
                        value: 'BTC',
                        label: 'BTC'
                      }
                      ] }/>

                    <div className='fieldNote stack'>
                      <b className='mark'>0 BTC</b>
                      {counterpart.translate('deposit_with_draw.available')}</div>
                  </div>
                  <div className='row2'>
                    <label className='label'>
                      {counterpart.translate('deposit_with_draw.amount_withdraw')}
                    </label>
                    <input type='text' className='field field-type3' placeholder='000'/>
                  </div>
                  <div className='row2'>
                    <label className='label'>
                      {counterpart.translate('deposit_with_draw.withdraw_address')}
                    </label>
                    <input type='text' className='field field-type3'/>
                  </div>
                  <div className='sendForm__btns'>
                    <button type='button' className='btn btn-sendForm'>
                      {counterpart.translate('deposit_with_draw.withdraw_btn')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className='delimiter full'></div>
            <div className='table__wrap'>
              <h3 className='h3'>
                {counterpart.translate('deposit_with_draw.history.title')}
              </h3>
              <div className='table table2 table-history'>
                <div className='table__head tableRow'>
                  <div className='tableCell'>
                    {counterpart.translate('deposit_with_draw.history.action')}
                  </div>
                  <div className='tableCell text_r'>
                    {counterpart.translate('deposit_with_draw.history.date')}
                  </div>
                  <div className='tableCell'>
                    {counterpart.translate('deposit_with_draw.history.status')}
                  </div>
                  <div className='tableCell'>
                    {counterpart.translate('deposit_with_draw.history.coin')}
                  </div>
                  <div className='tableCell text_r'>
                    {counterpart.translate('deposit_with_draw.history.amount')}
                  </div>
                </div>
                <div className='table__body'>
                </div>
              </div>
            </div>
            <div className='h100'></div>
          </div>
        </section>
      </div>
    );
  }
}

export default DepositWithdrawContainer;