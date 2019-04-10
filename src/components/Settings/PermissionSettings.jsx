import React from 'react';
import {connect} from 'react-redux';
import AccountImage from '../Account/AccountImage';
import {RSettingsActions} from '../../actions';
import {bindActionCreators} from 'redux';

class PermissionSettings extends React.Component {
  onClickAdd(e){
    console.log(e.target);
    this.props.addOwnerKeyPermissions();
  }
  render() {
    let accountImage = (
      <AccountImage size={ {height: 33, width: 33} }
        account={ this.props.currentAccount ? this.props.currentAccount : null }
        custom_image={ null }
      />
    );
    let {ownerKeyPermissions} = this.props;
    let ownerKeys = ownerKeyPermissions ? ownerKeyPermissions.map((entry) => {
      return (
        <div className='tableRow'>
          <div className='tableCell'>
            <span className='picH32'>
              <AccountImage size={ {height: 33, width: 33} }
                account={ entry.account ? entry.account : null }
                custom_image={ null }
              />
            </span>
          </div>
          <div className='tableCell'>{entry.account}</div>
          <div className='tableCell text_r'>{entry.weight}</div>
          <div className='tableCell text_r'>
            <button className='btn btn-remove'>Remove</button>
          </div>
        </div>
      );
    }) : null;
    return (
      <div id='permissions' className='tab__deploy permissions__tab block'>
        <div className='tab__deployHead'>
          <div className='title'>
                        Owner Key Permissions
            <span className='tooltip icon-help tooltip-def'
              title="<span className='tooltipsterIcon icon-help'></span>">
            </span>
          </div>
          <form onSubmit={ this.onClickAdd.bind(this) }>
            <div className='row'>
              <div className='col-2'>
                <label className='label'>Permission Treshold</label>
                <input type='text' className='field field-type2' defaultValue='1'/>
              </div>
            </div>
            <div className='row clearfix'>
              <div className=''>
                <label className='label'>Enter Account Name / Key and Weight</label>
              </div>
              <div className='col col-5 pr-30'>
                <div className='fieldWrap'>
                  <span className='fieldPic2'>
                    {accountImage}
                  </span>
                  <input type='text' className='field field-type2 field-pic'
                    placeholder='Account Name or Key'/>
                </div>
              </div>
              <div className='col col-5 pr-30'>
                <input type='text' className='field field-type2' placeholder='Weight'/>
              </div>
              <div className='col col-2'>
                <button type='submit' className='btn btn-add'>Add</button>
              </div>
            </div>
          </form>
        </div>
        <div className='box-inner box-inner-2'>
          { ownerKeys ?
            <div>
              <div className='table table2'>
                <div className='table__head tableRow'>
                  <div className='tableCell'>&nbsp;</div>
                  <div className='tableCell'>Account / Key / Address</div>
                  <div className='tableCell text_r'>Weight</div>
                  <div className='tableCell text_r'>
                    <div className='table__thAction'>Action</div>
                  </div>
                </div>
                <div className='table__body'>
                  {ownerKeys}
                </div>
              </div>
              <div className='table2__btns text_r'>
                <button className='btn btn-neutral'>Reset Changes</button>
                <button className='btn btn-success'>Pubich Changes</button>
              </div>
            </div>
            : null
          }

          <div className='box-white-inside'>
            <div className='title'>
                            Active Key Permissions
              <span className='tooltip icon-help tooltip-def'
                title=" <span className='tooltipsterIcon icon-help'></span>">
              </span>
            </div>
            <form action='#'>
              <div className='row'>
                <div className='col-2'>
                  <label className='label'>Permission Treshold</label>
                  <input type='text' className='field field-type2' defaultValue='1'/>
                </div>
              </div>
              <div className='row clearfix'>
                <div className=''>
                  <label className='label'>Enter Account Name / Key and Weight</label>
                </div>
                <div className='col col-5 pr-30'>
                  <div className='fieldWrap'>
                    <span className='fieldPic2'>
                      {accountImage}
                    </span>
                    <input type='text' className='field field-type2 field-pic'
                      placeholder='Account Name or Key'/>
                  </div>
                </div>
                <div className='col col-5 pr-30'>
                  <input type='text' className='field field-type2' placeholder='Weight'/>
                </div>
                <div className='col col-2'>
                  <button className='btn btn-green btn-add'>Add</button>
                </div>
              </div>
            </form>
          </div>

          <div className='table table2'>
            <div className='table__head tableRow'>
              <div className='tableCell'>&nbsp;</div>
              <div className='tableCell'>Account / Key / Address</div>
              <div className='tableCell text_r'>Weight</div>
              <div className='tableCell text_r'>
                <div className='table__thAction'>Action</div>
              </div>
            </div>
            <div className='table__body'>
              <div className='tableRow'>
                <div className='tableCell'>
                  <span className='picH32'>
                    {accountImage}
                  </span>
                </div>
                <div className='tableCell'>bymaster</div>
                <div className='tableCell text_r'>1</div>
                <div className='tableCell text_r'>
                  <button className='btn btn-remove'>Remove</button>
                </div>
              </div>
              <div className='tableRow'>
                <div className='tableCell'>
                  <span className='picH32'>
                    {accountImage}
                  </span>
                </div>
                <div className='tableCell'>bymaster</div>
                <div className='tableCell text_r'>1</div>
                <div className='tableCell text_r'>
                  <button className='btn btn-remove'>Remove</button>
                </div>
              </div>
              <div className='tableRow'>
                <div className='tableCell'>
                  <span className='picH32'>
                    {accountImage}
                  </span>
                </div>
                <div className='tableCell'>bymaster</div>
                <div className='tableCell text_r'>1</div>
                <div className='tableCell text_r'>
                  <button className='btn btn-remove'>Remove</button>
                </div>
              </div>
            </div>
          </div>
          <div className='table2__btns text_r'>
            <button className='btn btn-neutral'>Reset Changes</button>
            <button className='btn btn-success'>Pubich Changes</button>
          </div>


          <div className='row clearfix col-5'>
            <i className='memoKeyIcon icon-key'></i>

            <div className='row2 memoFieldRow'>
              <label className='label'>Memo Public Key</label>
              <input type='text' className='field field-type3' readOnly
                defaultValue='NCJNNCsPODFMCkr4985kjlsjKHDD{VMSjd66KGSOBMWBU'/>
            </div>
          </div>
          <h2 className='h2'>
            Recent Activity:
          </h2>

          <div className='table table2'>
            <div className='table__head tableRow'>
              <div className='tableCell'>Operation</div>
              <div className='tableCell'>Info</div>
            </div>
            <div className='table__body'>
              <div className='tableRow'>
                <div className='tableCell'>
                  <div className='btn btn-mark btn-transfer'>Transfer</div>
                </div>
                <div className='tableCell'>
                  Bitcoin anonymity: there's a way for hackers to find out your ip address
                </div>
              </div>
              <div className='tableRow'>
                <div className='tableCell'>
                  <div className='btn btn-mark btn-transfer'>Transfer</div>
                </div>
                <div className='tableCell'>
                  if I make even a single transaction people can easily find
                  out my IP, isn't that bad considering they could use the ip to plant a virus into
                  your pc and get your keys or even put trojans.
                </div>
              </div>
              <div className='tableRow'>
                <div className='tableCell'>
                  <div className='btn btn-mark btn-transfer'>Transfer</div>
                </div>
                <div className='tableCell'>
                  So to use a IP adress to allocate someone, would be
                  difficult} It would not make sense to use static IP addresses, if you have 10 000
                  subscribers for example.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    currentAccount: state.account.currentAccount,
    ownerKeyPermissions: state.settings.ownerKeyPermissions,
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    addOwnerKeyPermissions: RSettingsActions.addOwnerKeyPermissions
  },
  dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(PermissionSettings);