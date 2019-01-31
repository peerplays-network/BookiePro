import React from 'react';
import Translate from 'react-translate-component';
import classNames from 'classnames';
import {FormattedDate} from 'react-intl';
import {saveAs} from 'common/filesaver.js';
import {connect} from 'react-redux';
import {backup, processIncomingBuffer} from 'actions/RBackupActions';
import {setBackupDate} from 'actions/RWalletDataActions';
import {ChainConfig} from 'peerplaysjs-ws';

const mapStateToProps = (state) => {
  return {
    walletData: state.walletData.wallet,
    currentWallet : state.wallet.currentWallet,
    backup : state.backup
  };
};

@connect(
  mapStateToProps,
  {
    processIncomingBuffer,
    setBackupDate
  }
)
export class Create extends React.Component {

  getBackupName() {
    var name = this.props.currentWallet;
    var addressPrefix = ChainConfig.address_prefix.toLowerCase();

    if (name.indexOf(addressPrefix) !== 0){
      name = addressPrefix + '_' + name;
    }

    let date =  new Date();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let stampedName = `${name}_${date.getFullYear()}${month >= 10 ? month : '0' + month}${day >= 10 ? day : '0' + day}`; // eslint-disable-line

    name = stampedName + '.bin';

    return name;
  }

  onCreateBackup(){
    backup(this.props.walletData.password_pubkey).then( (contents) => {
      let name = this.getBackupName();
      this.props.processIncomingBuffer({name, contents});
    });
  }

  render(){
    let hasBackup = !!this.props.backup.contents;

    if (hasBackup){
      return this.renderDownloading();
    } else {
      return this.renderCreation();
    }
  }

  renderDownloading(){
    let {sha1, name, size, content, lastModified} = this.props.backup, // eslint-disable-line
      callback = ()=>{
        setBackupDate();

        if (this.props.downloadCb){
          this.props.downloadCb();
        }
      };

    return (
      <div>
        <NameSizeModified backup={ this.props.backup }/>
        {this.props.noText ? null :
          <div>
            <pre className='no-overflow'>{sha1} * SHA1</pre>
            <br/>
          </div>
        }
        <Download fileDescription={ this.props.backup } callback={ callback }/>
      </div>
    );
  }

  renderCreation(){
    let ready = !!this.props.walletData;
    let wallet = this.props.currentWallet;
    let newAccount = this.props.location ? this.props.location.query.newAccount : null;

    return (
      <div style={ {maxWidth: '40rem'} }>
        {this.props.noText ? null :
          <div style={ {textAlign: 'left'} }>
            {newAccount ? <Translate component='p' content='wallet.backup_new_account'/> : null}
            <Translate component='p' content='wallet.backup_explain'/>
          </div>}
        <div
          onClick={ this.onCreateBackup.bind(this) }
          className={ classNames('button', {disabled: !ready}) }
          style={ {marginBottom: 10} }
        >
          <Translate content='wallet.create_backup_of' name={ wallet } />
        </div>
        <LastBackupDate/>
      </div>
    );
  }
}

@connect(
  mapStateToProps,
  null
)
class LastBackupDate extends React.Component {
  render() {
    if (!this.props.walletData) {
      return null;
    }

    let backupDate = this.props.walletData.backup_date,
      lastModified = this.props.walletData.last_modified;

    var backupTime;

    if (backupDate){
      backupTime = <h4><Translate content='wallet.last_backup' /> <FormattedDate value={ backupDate }/></h4>; // eslint-disable-line
    } else {
      backupTime = <Translate style={ {paddingTop: 20} } className='facolor-error' component='p' content='wallet.never_backed_up' />; // eslint-disable-line
    }

    var needBackup;

    if (backupDate ) {
      if (lastModified.getTime() > backupDate.getTime()){
        needBackup = <h4 className='facolor-error'><Translate content='wallet.need_backup' /></h4>;
      } else {
        needBackup = <h4 className='success'><Translate content='wallet.noneed_backup' /></h4>;
      }
    }

    return (
      <span>
        {backupTime}
        {needBackup}
      </span>
    );
  }
}

class NameSizeModified extends React.Component {
  render() {
    let {name, size, lastModified} = this.props.backup;

    return (
      <span>
        <h5><b>{name}</b> ({size} bytes)</h5>
        {lastModified ? <div>{lastModified}</div> : null }
        <br/>
      </span>
    );
  }
}

class Download extends React.Component {
  componentWillMount() {
    try {
      this.isFileSaverSupported = !!new Blob();
    } catch (e) {}
  }

  componentDidMount() {
    if (! this.isFileSaverSupported ){
      console.error('File saving is not supported');
    }
  }

  onDownload() {
    let {name, size, contents} = this.props.fileDescription;

    var blob = new Blob([ contents ], {
      type: 'application/octet-stream; charset=us-ascii'});

    if (blob.size !== size) {
      throw new Error('Invalid backup to download conversion');
    }

    saveAs(blob, name);

    if (this.props.callback) {
      this.props.callback();
    }
  }

  render() {
    return (
      <div className='button' onClick={ this.onDownload.bind(this) }>
        <Translate content='wallet.download' />
      </div>
    );
  }
}