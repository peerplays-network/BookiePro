import React, { PureComponent } from 'react';
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
import moment from 'moment';
import Rx from 'rxjs/Rx';

const RESULT_COUNT_ID = '0';

class SearchOption extends PureComponent {
  constructor(props) {
    super(props);
    this.handleMouseDown = this.handleMouseDown.bind(this);
  }

  handleMouseDown (event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.onSelect(this.props.option, event);
  }

  render () {
    return (
      <div className='Select-option-holder' onClick={ this.handleMouseDown }>
        {
          this.props.option.isLiveMarket &&
          <span className='badge' />
        }
        <div className='Select-option'>
          {this.props.option.name}
        </div>
        <div className='match-start-on'>
          { moment(this.props.option.start_time).format('ddd, DD/MM/YYYY HH:mm') }
        </div>
      </div>
    );
  }

}

class SearchMenu extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isEmpty: true,
      search: '',
      debounced: '',
    };
    this.onChange = this.onChange.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.filterOptions = this.filterOptions.bind(this);
    this.onRouteChangeHandle = this.onRouteChangeHandle.bind(this);
    this.onSearch$ = new Rx.Subject();
  }

  componentDidMount(){
    this.subscription = this.onSearch$
      .debounceTime(300)
      .subscribe(debounced => {
        this.props.searchEvents(debounced)
        this.setState({ debounced })
      });
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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

  onClose (){
    this.props.clearSearchResult();
  }

  onRouteChangeHandle(){
    this.select.blurInput();
  }

  onInputChange(searchText) {
    if ( searchText.length > 0){
      this.onSearch$.next(searchText);
    }

    this.setState({
      searchText: searchText,
      isEmpty: searchText.length === 0
    });
  }

  filterOptions( options, filter, currentValues){
    return options
  }

  onChange (event) {

    //Clear the search results when there is no search data
    if(!event){
      this.props.clearSearchResult();
    } else {
      //do nothing when clicking on the result description text
      if ( event.id === RESULT_COUNT_ID ){
        return;
      }
    }
    //to update the value props in Select component
    this.setState({
      value: event.id,
    });

    if ( this.props.completeTree && event){
      const nested = Immutable.fromJS(this.props.completeTree);
      const keyPath = findKeyPathOf(nested, 'children', (node => node.get('id') === event.id) );
      const moneyline = nested.getIn(keyPath).get('children').filter((mktGroup) =>
        //NOTE if type id is not in string format please change it
        mktGroup.get('description').toUpperCase() === 'MONEYLINE'
      )

      if ( moneyline.size > 0 ){
        this.props.navigateTo('/exchange/bettingmarketgroup/' + moneyline.get(0).get('id') );
      } else {
        this.props.navigateTo('/exchange/bettingmarketgroup/' + nested.getIn(keyPath).getIn(['children', 0 , 'id']) );
      }

    }

  }

  render() {

    //append match date time to each result
    //appending 'number of search result text' into the first row
    const results = this.props.searchResult.splice( 0, 0,
      { 'id': '0',
        'name': I18n.t('searchMenu.no_of_result', {count: this.props.searchResult.size, searchText: this.state.searchText })
      }
    );

    //NOTE about valueKey and labelKey
    // ref: https://github.com/JedWatson/react-select#further-options
    // valueKey and labelKey are the keys in options definied in props:
    // removing either one in Select props may BREAK the selected options shown in search menu

    return (

      <div className='search-menu'>
        <Menu
          theme='dark'
        >
          <Menu.Item className='search-menu-item'>
            {
                this.props.sidebarLoadingStatus !== LoadingStatus.DONE ? null :

                <Select
                  ref={ (ref) => this.select = ref }
                  autoBlur={ true }
                  value={ this.state.value }
                  onChange={ this.onChange }
                  onClose={ this.onClose }
                  optionComponent={ SearchOption }
                  cache={ false }
                  valueKey='id'
                  labelKey='name'
                  onInputChange={ this.onInputChange }
                  isLoading={ this.state.isLoading }
                  options={ this.state.isEmpty? [] : results.toJS() }
                  backspaceRemoves={ this.state.backspaceRemoves }
                  placeholder={ I18n.t('searchMenu.search_place_holder') }
                  filterOptions={ this.filterOptions }
                  autofocus
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
