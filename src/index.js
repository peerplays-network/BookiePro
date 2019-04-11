import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {
  Router, 
  Route, 
  hashHistory, 
  IndexRoute
} from 'react-router';
import App from './components/App';
import MyAccount from './components/MyAccount';
import MyWager from './components/MyWager';
import Signup from './components/Signup';
import Login from './components/Login';
import Main from './components/Main';
import Exchange from './components/Exchange';
import AllSports from './components/AllSports';
import Sport from './components/Sport';
import SportsBook from './components/SportsBook';
import SportsBookEvent from './components/SportsBookEvent';
import SportsBookEventGroup from './components/SportsBookEventGroup';
import SportsBookSport from './components/SportsBookSport';
import EventGroup from './components/EventGroup';
import BettingMarketGroup from './components/BettingMarketGroup';
import configureStore from './store/configureStore';
import {syncHistoryWithStore} from 'react-router-redux';
import Deposit from './components/Deposit';
import ChangePassword from './components/ChangePassword';
import Welcome from './components/Welcome';
import HelpAndSupport from './components/HelpAndSupport';
import {LocaleProvider} from 'antd';
import {I18n} from 'react-redux-i18n';
import log from 'loglevel';
import LicenseScreen from './components/LicenseScreen';
import {AppUtils} from './utility';

// Configure store
const store = configureStore();
// Configure history
const history = syncHistoryWithStore(hashHistory, store, {
  selectLocationState(state) {
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
      }
    })
  );
  menu.append(
    new MenuItem({
      label: 'Paste',
      click() {
        document.execCommand('paste');
      }
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
    <Route path='/login' component={ Login } />
    <Route path='/signup' component={ Signup } />
    <Route path='/license' component={ LicenseScreen } />
    <Route path='/welcome' component={ Welcome } />
    <Route path='/deposit' component={ Deposit } />
    <Route component={ Main }>
      <Route path='/help-and-support' component={ HelpAndSupport } />
      <Route path='/exchange' component={ Exchange }>
        <IndexRoute component={ AllSports } />
        <Route path='Sport/:objectId' component={ Sport } />
        <Route path='EventGroup/:objectId' component={ EventGroup } />
        <Route
          path=':eventName/:eventId/BettingMarketGroup/:objectId/'
          component={ BettingMarketGroup }
        />
        <Route path='BettingMarketGroup/:objectId' component={ BettingMarketGroup } />
      </Route>
      
      <Route path='sportsbook' component={ Exchange }>
        <IndexRoute component={ SportsBook } />
        <Route path='Sport/:objectId' component={ SportsBookSport } />
        <Route path='EventGroup/:objectId' component={ SportsBookEventGroup } />
        <Route path='events/:eventId' component={ SportsBookEvent } />
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
