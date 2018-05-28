import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, hashHistory, IndexRoute, IndexRedirect } from 'react-router';
import App from './components/App';
import BlockchainTestPage from './components/BlockchainTestPage';
import MyAccount from './components/MyAccount';
import MyWager from './components/MyWager';
import Signup from './components/Signup';
import Login from './components/Login';
import Main from './components/Main';
import Exchange from './components/Exchange';
import AllSports from './components/AllSports';
import Sport from './components/Sport';
import EventGroup from './components/EventGroup';
import BettingMarketGroup from './components/BettingMarketGroup';
import configureStore from './store/configureStore';
import { syncHistoryWithStore } from 'react-router-redux';
import Deposit from './components/Deposit';
import ChangePassword from './components/ChangePassword';
import Welcome from './components/Welcome';
import Landing from './components/Landing';
import HelpAndSupport from './components/HelpAndSupport';
import { LocaleProvider } from 'antd';
import { I18n } from 'react-redux-i18n';
import log from 'loglevel';
import LicenseScreen from './components/LicenseScreen';
import { AppUtils } from './utility';

// Configure store
const store = configureStore();
// Configure history
const history = syncHistoryWithStore(hashHistory, store, {
  selectLocationState (state) {
    // Custom selector for immutable redux state
    return state.get('routing').toJS();
  }
});

// Configure log
// Level of log is TRACE > DEBUG > INFO > WARN > ERROR
// (i.e. if you set it to INFO, you won't logging for TRACE and DEBUG)
// Use log.levels.DEBUG to see most of the API communication logging
// We should turn this off in the production build.
log.setLevel(log.levels.SILENT);

//open links externally by default
// are we in an electron window?
const isRunningInsideElectron = AppUtils.isRunningInsideElectron();
if (isRunningInsideElectron){
  let electron;
  // add a listener to handle all clicks
  document.addEventListener("click", (e) => {
    // act on any clicks that are hyperlinks preceeded by http
    if(e.target.tagName.toLowerCase() === "a" && e.target.href.indexOf("http") >= 0){
      event.preventDefault();
      electron = window.require('electron');
      electron.shell.openExternal(e.target.href);
    }
  });
}

// Add new page here
const routes = (
  <Route path='/' component={ App }  >
      <IndexRedirect to='landing' />
      <Route path='/login' component={ Login } />
      <Route path='/signup' component={ Signup } />
      <Route path='/license' component={ LicenseScreen } />
      <Route path='/welcome' component={ Welcome } />
      <Route path='/deposit' component={ Deposit } />
      <Route path='/landing' component={ Landing } />
      <Route component={ Main }>
        <Route path='/blockchain-test-page' component={ BlockchainTestPage } />
        <Route path='/help-and-support' component={ HelpAndSupport } />
        <Route path='/exchange' component={ Exchange } >
          <IndexRoute component={ AllSports }/>
          <Route path='Sport/:objectId' component={ Sport }/>
          <Route path='EventGroup/:objectId' component={ EventGroup }/>
          <Route path=':eventName/:eventId/BettingMarketGroup/:objectId/' component={ BettingMarketGroup }/>
          <Route path='BettingMarketGroup/:objectId' component={ BettingMarketGroup }/>
        </Route>
        <Route path='/my-account' component={ MyAccount } />
        <Route path='/change-password' component={ ChangePassword } />
        <Route path='/my-wager' component={ MyWager } />
      </Route>
    </Route>
);



ReactDOM.render(
  <LocaleProvider locale={ I18n.t('application.locale') }>
    <Provider store={ store }>
        <Router history={ history } routes={ routes } />
    </Provider>
  </LocaleProvider>,
  document.getElementById('root')
);
