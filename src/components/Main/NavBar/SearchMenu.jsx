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
    this.gotoUser = this.gotoUser.bind(this);
  }

  onChange (event) {

    this.setState({
      value: event,
    });

    //NOTE please update the url if  it is not valid
    this.props.navigateTo('/market-screen/Event/' + event.id );
  }

  getUsers (input) {

  	if (!input) {
  		return Promise.resolve({ options: [] });
  	}

    //--- method 1 API search call
    return FakeApi.searchEvents(input).then((events) => {
      return { options: events };
    });

    //--- method 2 LOCAL search call
    //--- indexeddb callback using dexie
    //--- each keyword is stored in a _teamWords table, with 'word'' indexed
    //--- schema : _teamWords: "++,word,teamId"
    // https://github.com/dfahlander/Dexie.js/blob/master/samples/full-text-search/FullTextSearch.js
    // var foundIds = {};
    // console.log("data  "  +db._teamWords.where('word').startsWith(input ) );
    // var result = [];
    //   return db._teamWords.where('word').startsWith(input)
    //   .each(function (wordToEmailMapping) {
    //     foundIds[wordToEmailMapping.teamId.toString()] = true;
    //
    // }).then(function () {
    //     // Now we got all email IDs in the keys of foundIds object.
    //     // Convert to array if IDs.
    //     var teamIds = Object.keys(foundIds).map(function (idStr) { return parseInt(idStr); });
    //     console.log("Found " + teamIds.length + " emails containing a word starting with " + input);
    //     // Now query all items from the array:
    //
    //     return db.teams.where('id').anyOf(teamIds).each(function (email) {
    //         console.log ("Found email:  "  + JSON.stringify(email));
    //         result.push(email);
    //
    //     });
    //
    //
    // }).then(function (){
    //   console.log (result);
    //   return { options: result };
    //
    // });




  }

  gotoUser (value, event) {
  }

  render() {

    //valueKey and labelKey are the keys in options: [] provieded to loadOptions
    // ref: https://github.com/JedWatson/react-select
    return (
      <Menu
        className='search-menu'
        theme='dark'
      >
        <Menu.Item>

          <Select.Async
            multi={ this.state.multi }
            value={ this.state.value }
            onChange={ this.onChange }
            onValueClick={ this.gotoUser }
            valueKey='id'
            labelKey='name'
            loadOptions={ this.getUsers }
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
