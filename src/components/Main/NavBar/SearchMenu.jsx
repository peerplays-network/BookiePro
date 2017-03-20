import React, { Component } from 'react';
import { Menu } from 'antd';
import _ from 'lodash';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import './SearchMenu.less';

import FakeApi from '../../../communication/FakeApi';
import { NavigateActions } from '../../../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'

class SearchMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
    this.onChange = this.onChange.bind(this);
    this.gotoEvent = this.gotoEvent.bind(this);
  }

  onChange (event) {

    this.setState({
      value: event,
    });

    //NOTE please update the url if  it is not valid
    this.props.navigateTo('/market-screen/Event/' + event.id );
  }

  getEvents (input) {

  	if (!input) {
  		return Promise.resolve({ options: [] });
  	}

    //API search call
    return FakeApi.searchEvents(input).then((events) => {
      return { options: events };
    });

  }

  gotoEvent (value, event) {
  }

  render() {

    //valueKey and labelKey are the keys in options: [] provieded to loadOptions
    // ref: https://github.com/JedWatson/react-select
    return (
      <Menu
        className='search-menu'
        theme='dark'
      >
        <Menu.Item className='search-menu-item'>

          <Select.Async
            multi={ this.state.multi }
            value={ this.state.value }
            onChange={ this.onChange }
            onValueClick={ this.gotoEvent }
            valueKey='id'
            labelKey='name'
            loadOptions={ this.getEvents }
            backspaceRemoves={ this.state.backspaceRemoves } />

        </Menu.Item>

      </Menu>
    );
  }
}

SearchMenu.propTypes = {
  label: React.PropTypes.string,
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
  }, dispatch);
}

export default connect(
  null,
  mapDispatchToProps
)(SearchMenu);
