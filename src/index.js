import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import App from './components/App';
import BlockchainTestPage from './components/BlockchainTestPage';
import EmptyPage from './components/EmptyPage';
import InitError from './components/InitError';
import Home from './components/Home';
import MyAccount from './components/MyAccount';
import MyWager from './components/MyWager';
import Signup from './components/Signup';
import Login from './components/Login';
import Main from './components/Main';
import Localize from './components/Localize';
import configureStore from './store/configureStore';
import { syncHistoryWithStore } from 'react-router-redux';
import localforage from 'localforage';
import { Apis, ChainConfig } from 'graphenejs-ws';
import { Config } from './constants';


const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);

// On enter handler
const onEnter = (nextState, replace, callback) => {

  let connectionString = Config.blockchainUrls[0];

  // Reset connection if we are going to init-error page
  if (nextState.location.pathname === "/init-error") {
    return Apis.reset(connectionString, true).init_promise.then(() => {
      console.log('Reset connection to  blockchain success');
      return callback();
    }).catch((error) => {
      console.error('Fail to reset connection to blockchain', error);
      return callback();
    });
  }

  // Connecting to blockchain
  // Mark connecting to blockchain
  Apis.instance(connectionString, true).init_promise.then((res) => {
    console.log('Connected to:', res[0] ? res[0].network_name : 'Undefined Blockchain');
    // TODO: find better place to set this
    // This is set to TEST since Peerplays Blockchain is currently using TEST prefix
    ChainConfig.setPrefix("TEST");
    callback();
  }).catch((error) => {
    console.error('Fail to connect to blockchain', error);
    // Go to init error page
    replace('/init-error');
    callback();
  })


}

// Add new page here
const routes = (
  <Route path='/' component={ App } onEnter={ onEnter } >
      <IndexRoute component={ Login }  />
      <Route path='/login' component={ Login } />
      <Route path='/signup' component={ Signup } />
      <Route path='/init-error' component={ InitError } />
      <Route component={ Main }>
        <Route path='/blockchain-test-page' component={ BlockchainTestPage } />
        <Route path='/empty-page' component={ EmptyPage } />
        <Route path='/home' component={ Home } />
        <Route path='/my-account' component={ MyAccount } />
        <Route path='/my-wager' component={ MyWager } />
        <Route path='/localize' component={ Localize } />
      </Route>
    </Route>
);



ReactDOM.render(
  <Provider store={ store }>
    <Router history={ history } routes={ routes } />
  </Provider>,
  document.getElementById('root')
);
