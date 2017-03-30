import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, hashHistory, IndexRoute, IndexRedirect } from 'react-router';
import App from './components/App';
import BlockchainTestPage from './components/BlockchainTestPage';
import EmptyPage from './components/EmptyPage';
import MyAccount from './components/MyAccount';
import MyWager from './components/MyWager';
import Signup from './components/Signup';
import Login from './components/Login';
import Main from './components/Main';
import SportMarket from './components/SportMarket';
import Exchange from './components/Exchange';
import AllSports from './components/AllSports';
import Sport from './components/Sport';
import EventGroup from './components/EventGroup';
import BettingMarketGroup from './components/BettingMarketGroup';
import Localize from './components/Localize';
import configureStore from './store/configureStore';
import { syncHistoryWithStore } from 'react-router-redux';
import Deposit from './components/Deposit'
import ChangePassword from './components/ChangePassword'
import Welcome from './components/Welcome'


const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store, {
  selectLocationState (state) {
    // Custom selector for immutable redux state
    return state.get('routing').toJS();
  }
});

// Add new page here
const routes = (
  <Route path='/' component={ App }  >
      <IndexRedirect to='login' />
      <Route path='/login' component={ Login } />
      <Route path='/signup' component={ Signup } />
      <Route path='/welcome' component={ Welcome } />
      <Route path='/deposit' component={ Deposit } />
      <Route component={ Main }>
        <Route path='/blockchain-test-page' component={ BlockchainTestPage } />
        <Route path='/empty-page' component={ EmptyPage } />
        <Route path='/exchange' component={ Exchange } >
          <IndexRoute component={ AllSports }/>
          <Route path='Sport/:objectId' component={ Sport }/>
          <Route path='EventGroup/:objectId' component={ EventGroup }/>
          <Route path='Event/:objectId' component={ SportMarket }/>
          <Route path='BettingMarketGroup/:objectId' component={ BettingMarketGroup }/>
          {/* TODO perhaps we just need objectID, objectId itself tells the type of object */}
          <Route path=':objectId' component={ SportMarket }/>
        </Route>
        <Route path='/my-account' component={ MyAccount } />
        <Route path='/change-password' component={ ChangePassword } />
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
