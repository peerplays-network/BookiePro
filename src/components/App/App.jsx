import React, { Component } from 'react';
import InitError from '../InitError';
import { LoadingStatus } from '../../constants';
import { NavigateActions, AppActions } from '../../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SoftwareUpdateModal from '../Modal/SoftwareUpdateModal';
import { StringUtils } from '../../utility';

//NOTE default version update text.
const defaultNewVersionText = 'New version found. Please update the version'

class App extends Component {
  constructor(props) {
    super(props);

    //NOTE current version of the app, should be sync to version definied in package.json
    const currentVersion = '1.0.0';
    this.state = {
      currentVersion,
      needHardUpdate : false,
      newVersionModalVisible: (StringUtils.compareVersionNumbers(currentVersion, this.props.version) < 0)
    };
  }

  componentWillMount() {
    // Connect to blockchain
    this.props.connectToBlockchain();
  }

  componentDidUpdate(prevProps, prevState){

    //check if the version stored in props changed
    //we dun want to show the modal to notify the same version upon every route change
    if ( prevProps && this.props.version && this.props.version !== prevProps.version){

      const newVerNum = this.props.version.split('.');
      const currentVernNum = this.state.currentVersion.split('.');
      const needHardUpdate = newVerNum[0] > currentVernNum[0]

      this.setState({ needHardUpdate });

      const needSoftUpdate = ( newVerNum[0] ===  currentVernNum[0] ) && ( newVerNum[1] > currentVernNum[1] )

      this.setState({
        newVersionModalVisible : (needHardUpdate || needSoftUpdate) &&
           (StringUtils.compareVersionNumbers(this.state.currentVersion, this.props.version) < 0)
      });

    }

  }

  okWillCloseModal(modalVisible) {
    this.setState({
      newVersionModalVisible: modalVisible
    });
  }

  okWillCloseApp(modalVisible) {
    this.setState({
      newVersionModalVisible: modalVisible
    });

    if ( this.props.needHardUpdate){
      const remote = require('electron').remote;

      var window = remote.getCurrentWindow();
      window.close();
    }
  }

  render() {

    let softwareUpdateModal = (

        <SoftwareUpdateModal
          modalTitle={ this.props.displayText ? this.props.displayText.get(this.props.locale) : defaultNewVersionText }
          closable={ !this.state.needHardUpdate }
          visible={ this.state.newVersionModalVisible }
          onOk={ this.state.needHardUpdate ? () => this.okWillCloseApp(false) : () => this.okWillCloseModal(false) }
          onCancel={ this.state.needHardUpdate ? () => this.okWillCloseApp(false) : () => this.okWillCloseModal(false) }
          latestVersion={ this.props.version }
        />

    );

    let content = null;
    // Show page based on blockchain connection loading status
    switch(this.props.connectToBlockchainLoadingStatus) {
      case LoadingStatus.ERROR: {
        content = <InitError/>
        break;
      }
      case LoadingStatus.DONE: {
        content = this.props.children;
        break;
      }
      default: {
        content = (
          <div className='sportsbg'>
            <span>{ 'Connecting to blockchain...' }</span>
          </div>
        );
      }
    }

    return (
      <div>
        { content }
        { softwareUpdateModal }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const app = state.get('app');
  const softwareUpdate = state.get('softwareUpdate');
  const i18n = state.get('i18n');
  const version = softwareUpdate.get('version');
  const displayText = softwareUpdate.get('displayText');
  const locale = i18n.get('locale');
  const isLoggedIn = app.get('isLoggedIn');
  const connectToBlockchainLoadingStatus = app.get('connectToBlockchainLoadingStatus');

  return {
    connectToBlockchainLoadingStatus,
    isLoggedIn,
    version,
    displayText,
    locale
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
    connectToBlockchain: AppActions.connectToBlockchain
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
