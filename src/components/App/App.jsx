import React, { Component } from 'react';
import InitError from '../InitError';
import { LoadingStatus } from '../../constants';
import { SoftwareUpdateActions, NavigateActions, AppActions } from '../../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SoftwareUpdateModal from '../Modal/SoftwareUpdateModal';
import { StringUtils } from '../../utility';

//TODO default version update text.
const defaultNewVersionText = 'New version found. Please update the version'

class App extends Component {
  constructor(props) {
    super(props);
    const currentVersion = '1.0.0'; // hardcode for testing hardupdate/softupdate
    this.state = {
      currentVersion,
      newVersionModalVisible: (this.props.needHardUpdate || this.props.needSoftUpdate) &&
                              (StringUtils.compareVersionNumbers(currentVersion, this.props.version) < 0)
    };
  }

  componentWillMount() {
    // Connect to blockchain
    this.props.connectToBlockchain();
  }

  componentWillReceiveProps(nextProps) {
    // Update new version modal visible
    const newVersionModalVisible = (nextProps.needHardUpdate || nextProps.needSoftUpdate) &&
                                    (StringUtils.compareVersionNumbers(this.state.currentVersion, nextProps.version) < 0);
    if (this.state.newVersionModalVisible !== newVersionModalVisible) {
      this.setState({ newVersionModalVisible });
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
          closable={ !this.props.needHardUpdate }
          visible={ this.state.newVersionModalVisible }
          onOk={ this.props.needHardUpdate ? () => this.okWillCloseApp(false) : () => this.okWillCloseModal(false) }
          onCancel={ this.props.needHardUpdate ? () => this.okWillCloseApp(false) : () => this.okWillCloseModal(false) }
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
  const needHardUpdate = softwareUpdate.get('needHardUpdate');
  const needSoftUpdate = softwareUpdate.get('needSoftUpdate');
  const version = softwareUpdate.get('version');
  const displayText = softwareUpdate.get('displayText');
  const locale = i18n.get('locale');
  const isLoggedIn = app.get('isLoggedIn');
  const connectToBlockchainLoadingStatus = app.get('connectToBlockchainLoadingStatus');

  return {
    connectToBlockchainLoadingStatus,
    isLoggedIn,
    needHardUpdate,
    needSoftUpdate,
    version,
    displayText,
    locale
    // uncomment below for software update modal testing
    // needHardUpdate: true,
    // needSoftUpdate: false,
    // version: "1.1.17",
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
    listenToSoftwareUpdate: SoftwareUpdateActions.listenToSoftwareUpdate,
    connectToBlockchain: AppActions.connectToBlockchain
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
