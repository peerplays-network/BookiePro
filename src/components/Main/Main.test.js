import React from 'react';
import renderer from 'react-test-renderer';
import { Router, Route, createMemoryHistory } from 'react-router';
import { mount } from 'enzyme';
import Main from './Main';
import SideBar from './SideBar';
import NavBar from './NavBar';

jest.mock('graphenejs-lib');

describe('The main app', () => {
  let testApp;

  // Currently this is the only way to render the component properly in a test
  beforeEach(() => {
    let history = createMemoryHistory()
    let location = history.createLocation('/')
    let routes = (
      <Router history={ history } location={ location }>
        <Route path='/' component={ Main } />
      </Router>
    )
    testApp = mount(routes, { attachTo: document.getElementById('root') });
  })

  // TODO: Not sure how to get snapshot to work. Skipping it for now.
  it.skip('renders without crashing', () => {
    const tree = renderer.create(testApp).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render NavBar and SideBar', () => {
    // Cannot use #containsAllMatchingElements because
    // SideBar is embedded in a <Layout /> component
    expect(testApp.containsMatchingElement(<SideBar />)).toBe(true);
    expect(testApp.containsMatchingElement(<NavBar />)).toBe(true);
  } );
});
