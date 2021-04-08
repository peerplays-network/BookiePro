import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {ConnectedRouter} from 'connected-react-router/immutable';
import App from './components/App';
import configureStore, {history} from './store/configureStore';
import {ConfigProvider} from 'antd';
import {I18n} from 'react-redux-i18n';
import log from 'loglevel';
import {AppUtils} from './utility';

// Configure store
const store = configureStore();

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

ReactDOM.render(
  <ConfigProvider locale={ I18n.t('application.locale') }>
    <Provider store={ store }>
      <ConnectedRouter history={ history }>
        <App />
      </ConnectedRouter>
    </Provider>
  </ConfigProvider>,
  document.getElementById('root')
);
