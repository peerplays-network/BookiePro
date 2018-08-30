import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route, hashHistory, IndexRoute, IndexRedirect} from 'react-router';

// Components
import AllSports from './components/AllSports';
import App from './components/App';
import BettingMarketGroup from './components/BettingMarketGroup';
import ChangePassword from './components/ChangePassword';
import Deposit from './components/Deposit';
import EventGroup from './components/EventGroup';
import Exchange from './components/Exchange';
import Landing from './components/Landing';
import LicenseScreen from './components/LicenseScreen';
import Login from './components/Login';
import HelpAndSupport from './components/HelpAndSupport';
import Main from './components/Main';
import MyAccount from './components/MyAccount';
import MyWager from './components/MyWager';
import Signup from './components/Signup';
import Sport from './components/Sport';
import SportsBook from './components/SportsBook';
import SportsBookEvent from './components/SportsBookEvent';
import Welcome from './components/Welcome';

import configureStore from './store/configureStore';
import {syncHistoryWithStore} from 'react-router-redux';

import {LocaleProvider} from 'antd';
import {I18n} from 'react-redux-i18n';
import log from 'loglevel';
import {AppUtils} from './utility';

// Configure store
const store = configureStore();
// Configure history
const history = syncHistoryWithStore(hashHistory, store, {
  selectLocationState(state) {
    // Custom selector for immutable redux state
    return state.get('routing').toJS();
  },
});

// Configure log
// Level of log is TRACE > DEBUG > INFO > WARN > ERROR
// (i.e. if you set it to INFO, you won't logging for TRACE and DEBUG)
// Use log.levels.DEBUG to see most of the API communication logging
// We should turn this off in the production build.
log.setLevel(log.levels.SILENT);

// are we in an electron window?
let electron;
const isRunningInsideElectron = AppUtils.isRunningInsideElectron();

if (isRunningInsideElectron) {
  electron = window.require('electron');
  // add a listener to handle all clicks
  document.addEventListener('click', (event) => {
    // act on any clicks that are hyperlinks preceeded by http
    if (event.target.tagName.toLowerCase() === 'a' && event.target.href.indexOf('http') >= 0) {
      event.preventDefault();
      electron.shell.openExternal(event.target.href);
    }
  });
  const {remote} = electron;
  const {Menu, MenuItem} = remote;

  const menu = new Menu();
  menu.append(
    new MenuItem({
      label: 'Copy',
      click() {
        document.execCommand('copy');
      },
    })
  );
  menu.append(
    new MenuItem({
      label: 'Paste',
      click() {
        document.execCommand('paste');
      },
    })
  );

  document.addEventListener(
    'contextmenu',
    (e) => {
      e.preventDefault();
      menu.popup({window: remote.getCurrentWindow()});
    },
    false
  );
}

// Add new page here
const routes = (
  <Route path='/' component={ App }>
    <IndexRedirect to='landing' />
    <Route path='/login' component={ Login } />
    <Route path='/signup' component={ Signup } />
    <Route path='/license' component={ LicenseScreen } />
    <Route path='/welcome' component={ Welcome } />
    <Route path='/deposit' component={ Deposit } />
    <Route path='/landing' component={ Landing } />
    <Route component={ Main }>
      <Route path='/help-and-support' component={ HelpAndSupport } />

      <Route path='/betting' component={ Exchange }>
        <Route path='exchange'>
          <IndexRoute component={ AllSports } />
          <Route path='Sport/:objectId' component={ Sport } />
          <Route path='EventGroup/:objectId' component={ EventGroup } />
          <Route
            path=':eventName/:eventId/BettingMarketGroup/:objectId/'
            component={ BettingMarketGroup }
          />
          <Route path='BettingMarketGroup/:objectId' component={ BettingMarketGroup } />
        </Route>

        <Route path='sportsbook'>
          <IndexRoute component={ SportsBook } />
          <Route path='events/:eventId' component={ SportsBookEvent } />
        </Route>
      </Route>
      <Route path='/my-account' component={ MyAccount } />
      <Route path='/change-password' component={ ChangePassword } />
      <Route path='/my-wager' component={ MyWager } />
    </Route>
    <Route path='/my-account' component={ MyAccount } />
    <Route path='/change-password' component={ ChangePassword } />
    <Route path='/my-wager' component={ MyWager } />
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
