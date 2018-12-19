import React from 'react';
import Router from 'react-router';

import KeyGenComponent from './components/Wallet/KeyGenComponent';

const {Route, DefaultRoute} = Router;

require('./assets/loader');

class KeyGen {
  render() {
    return (<KeyGenComponent/>);
  }
}

let routes = (
  <Route handler={ KeyGen }>
    <Route name='keygen' path='keygen' handler={ KeyGenComponent }/>
    <DefaultRoute handler={ KeyGenComponent }/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('content'));
});
