import React from 'react';
import { shallow  }  from 'enzyme';
import { TestListContainer  }  from './TestList';
import { InputArea, TestList  }  from './TestList';
import renderer from 'react-test-renderer';

//describe - creates a block that groups together several related tests in one "test suite"
describe('TestListContainer', () => {
  it('renders correctly', () => {
    //renderer renders UI component for snapshot testing
    const tree = renderer.create(<TestListContainer/>).toJSON();
    //renedered snapshot matched with initial snapshot file under __snapshots__ folder
    //run "jest --updateSnapshot command to update snapshot
    expect(tree).toMatchSnapshot();
  });

  //it is test method to run test (name, function)
  it('should render InputArea and TestList', () => {
    //shallow returns wrapper instance around the rendered output
    const wrapper = shallow(<TestListContainer/>);
    //exect used to test a value
    expect(wrapper.containsAllMatchingElements([
      <InputArea/>,
      <TestList/>
    ])).toBe(true);
  } );

  it('should start with an empty list', () => {
    const wrapper = shallow(<TestListContainer/>);
    expect(wrapper.state('beers').length).toBe(0);
  } );

  it('adds items to the list', () => {
    const wrapper = shallow(<TestListContainer/>);
    wrapper.instance().addItem('Sam Adams');
    expect(wrapper.state('beers')).toEqual(['Sam Adams']);
  } );

  it('passes addItem to InputArea', () => {
    const wrapper = shallow(<TestListContainer/>);
    const inputArea = wrapper.find(InputArea);
    const addItem = wrapper.instance().addItem;
    expect(inputArea.prop('onSubmit')).toBe(addItem);
  } );

  it('passes a bound addItem function to InputArea', () => {
    const wrapper = shallow(<TestListContainer/>);
    const inputArea = wrapper.find(InputArea);
    inputArea.prop('onSubmit')('Sam Adams');
    expect(wrapper.state('beers')).toEqual(['Sam Adams']);
  } );

} );

describe('InputArea', () => {
  it('should contain an input and a button', () => {
    const wrapper = shallow(<InputArea/>);
    expect(wrapper.containsAllMatchingElements([
      <input/>,
      <button>Add</button>
    ])).toBe(true);
  } );
} );

describe('TestList', () => {
  it('should render zero items', () => {
    const wrapper = shallow(<TestList items={ [] } />);
    expect(wrapper.find('li').length).toBe(0);
  } );

  it('should render undefined items', () => {
    const wrapper = shallow(<TestList items={ undefined } />);
    expect(wrapper.find('li').length).toBe(0);
  } );

  it('should render the items', () => {
    const items = ['Sam Adams', 'Resin', 'Octoberfest'];
    const wrapper = shallow(<TestList items={ items } />);
    expect(wrapper.find('li').length).toBe(3);
  } );
} );
