import React, { Component } from 'react';
import { Menu } from 'antd';
import _ from 'lodash';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import PropTypes from 'prop-types';
import './SearchMenu.less';
import { I18n } from 'react-redux-i18n';
import Immutable from 'immutable';
import { findKeyPathOf } from '../../../utility/TreeUtils'
import { LoadingStatus } from '../../../constants';
import createClass from 'create-react-class';

const RESULT_COUNT_ID = '0';
const SELECT_OPTION_STYLE = {
  display: 'inline-block',
};

const SearchOption = createClass({

  handleMouseDown (event){
    event.preventDefault();
    event.stopPropagation();
    this.props.onSelect(this.props.option, event);
  },

  render () {
    return (
      <div className='Select-option-holder' onClick={ this.handleMouseDown }>
        <div className='Select-option' style={ SELECT_OPTION_STYLE }>
          {this.props.option.event_name}
        </div>
        <div style={ SELECT_OPTION_STYLE }>
          {this.props.option.matchStartOn}
        </div>
      </div>
    );
  }
});

class SearchMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isEmpty: true,

    };
    this.onChange = this.onChange.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.filterOptions = this.filterOptions.bind(this);
    this.onRouteChangeHandle = this.onRouteChangeHandle.bind(this);
  }

  onRouteChangeHandle(){
    this.select.blurInput();
  }

  onInputChange(searchText) {
    //TODO options shown still exist when search text is empty
    if ( searchText.length > 0){
      setTimeout(this.props.searchEvents(searchText), 2000)
    }

    this.setState({
      searchText: searchText,
      isEmpty: searchText.length === 0
    });
  }

  filterOptions( options, filter, currentValues){
    return options
  }

  componentWillReceiveProps(nextProps) {

    if ( nextProps.getSearchEventsLoadingStatus !== this.props.getSearchEventsLoadingStatus){

      switch(nextProps.getSearchEventsLoadingStatus) {
        case LoadingStatus.ERROR: {
          this.setState({ isLoading: false})
          break;
        }
        case LoadingStatus.DONE: {
          this.setState({ isLoading: false})
          break;
        }
        case LoadingStatus.LOADING: {
          this.setState({ isLoading: true})
          break;
        }
        default: {
          this.setState({ isLoading: false})
          break;
        }
      }
    }

  }


  onChange (event) {

    //Clear the search results when there is no search data
    if(!event){
      this.props.clearSearchResult();
    } else {
      //do nothing when clicking on the result description text
      if ( event.event_id === RESULT_COUNT_ID ){
        return;
      }
    }
    //to update the value props in Select component
    this.setState({
      value: event,
    });

    let isMoneyLineFound = false;

    if ( this.props.completeTree && event){
      const nested = Immutable.fromJS(this.props.completeTree);
      const keyPath = findKeyPathOf(nested, 'children', (node => node.get('id') === event.event_id) );
      const moneyline = nested.getIn(keyPath).get('children').filter((mktGroup) =>
        //NOTE if type id is not in string format please change it
        mktGroup.get('market_type_id') === 'Moneyline'
      )

      if ( moneyline.size > 0 ){
        isMoneyLineFound =  true;
        this.props.navigateTo('/exchange/bettingmarketgroup/' + moneyline.get(0).get('id') );
      }

    }

    //NOTE navigateTo money line bettingmarketgroup instead
    if ( isMoneyLineFound === false && event){
      this.props.navigateTo('/exchange/event/' + event.event_id );
    }

  }

  //onClick of the event shown in Search Menu
  gotoEvent (value, event) {
  }

  render() {

    //append match date time to each result
    //appending 'number of search result text' into the first row
    //TODO retrieve match date time from blocckchain once it is ready
    const results = this.props.searchResult.map( item => {
      return item.set('matchStartOn', I18n.t('searchMenu.match_start_on'))
    }).splice( 0, 0,
      { 'event_id': '0',
        'event_name': I18n.t('searchMenu.no_of_result', {count: this.props.searchResult.size, searchText: this.state.searchText })
      }
    );

    //valueKey and labelKey are the keys in options: [] provieded to loadOptions
    // ref: https://github.com/JedWatson/react-select
    return (

      <div className='search-menu'>
        <Menu
          theme='dark'
        >
          <Menu.Item className='search-menu-item'>
            {
                this.props.completeTree.size === 0 ? null :

                <Select
                  ref={ (ref) => this.select = ref }
                  value={ this.state.value }
                  onChange={ this.onChange }
                  optionComponent={ SearchOption }
                  onValueClick={ this.gotoEvent }
                  valueKey='event_id'
                  labelKey='event_name'
                  cache={ false }
                  onInputChange={ this.onInputChange }
                  isLoading={ this.state.isLoading }
                  options={ this.state.isEmpty? [] : results.toJS() }
                  backspaceRemoves={ this.state.backspaceRemoves }
                  placeholder={ I18n.t('searchMenu.search_place_holder') }
                  filterOptions={ this.filterOptions }
                />
            }
          </Menu.Item>

        </Menu>
      </div>
    );
  }
}

SearchMenu.propTypes = {
  label: PropTypes.string,
};

export default SearchMenu
