import React from 'react';
import renderer from 'react-test-renderer';
import { Router, Route, createMemoryHistory } from 'react-router';
import { mount } from 'enzyme';
import App from './App';
import SideBar from './SideBar';
import NavBar from './NavBar';

jest.mock('graphenejs-lib');

describe('The main app', () => {
  let app;

  beforeEach(() => {
    let history = createMemoryHistory()
    let location = history.createLocation('/')
    let routes = (
      <Router history={ history } location={ location }>
        <Route path='/' component={ App } />
      </Router>
    )
    app = mount(routes, { attachTo: document.getElementById('root') });
  })

  // TODO: Not sure how to get snapshot to work. Skipping it for now.
  it.skip('renders without crashing', () => {
    const tree = renderer.create(app).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render NavBar and SideBar', () => {
    // Cannot use #containsAllMatchingElements because
    // SideBar is embedded in a <Layout /> component
    expect(app.containsMatchingElement(<SideBar />)).toBe(true);
    expect(app.containsMatchingElement(<NavBar />)).toBe(true);
  } );
});
