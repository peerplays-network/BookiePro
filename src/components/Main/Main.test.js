import React from 'react';
import renderer from 'react-test-renderer';
import { Router, Route, createMemoryHistory } from 'react-router';
import { mount } from 'enzyme';
import Main from './Main';
import SideBar from './../SideBar';
import NavBar from './../Main/NavBar';
import { Provider } from 'react-redux';
import configureStore from './../../store/configureStore';

jest.mock('peerplaysjs-lib');

describe('The main app', () => {
  let testApp;

  // Currently this is the only way to render the component properly in a test
  beforeEach(() => {
    let history = createMemoryHistory()
    let location = history.createLocation('/')
    const store = configureStore();

    let routes = (
      <Provider store={ store }>
        <Router history={ history } location={ location }>
          <Route path='/' component={ Main } />
        </Router>
      </Provider>
    )
    testApp = mount(routes, { attachTo: document.getElementById('root') });
    console.warn( ' testApp is', testApp)

  })

  // TODO: Not sure how to get snapshot to work. Skipping it for now.
  it.skip('renders without crashing', () => {
    const tree = renderer.create(testApp).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // it('should render NavBar and SideBar', () => {
  //   console.warn( ' testApp dd', testApp)
  //
  //   // Cannot use #containsAllMatchingElements because
  //   // SideBar is embedded in a <Layout /> component
  //   // expect(testApp.containsMatchingElement(<SideBar />)).toBe(true);
  //   expect(testApp.containsMatchingElement(<NavBar />)).toBe(true);
  // } );
  //
  // it('should render a message if items are empty', () => {
  //
  // })
});
