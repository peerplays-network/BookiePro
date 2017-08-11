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
    const { option } = this.props;

    return (
      <div className={ option.id !== '0' ? 'Select-option-holder' : 'Select-option-holder Select-result' } onClick={ option.id !== '0' ? this.handleMouseDown : null }>
        {  option.isLiveMarket &&  <span className='badge' />  }
        <div className={ option.id !== '0' ? 'Select-option' : 'Select-option Select-result' }>
          { option.name }
        </div>
        <div className='match-start-on'>
          { option.id !== '0' ? moment(option.start_time).format('ddd, DD/MM/YYYY HH:mm') : '' }
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

  onRouteChangeHandle(){
    this.select.blurInput();
  }

  onInputChange(searchText) {

    if ( searchText){
      this.onSearch$.next(searchText);
    } else {
      this.setState({
        debounced: searchText,
      });

    }

    this.setState({
      searchText: searchText,
    });

    return searchText
  }

  filterOptions( options, filter, currentValues){
    return options
  }

  onClose (){
    // 1: the result wont be cleaered after choosing an option. i.e. time > 0
    // 2: time between user clicking elsewhere and focusing on search input again is small enough to update the time < 100ms
    setTimeout( () => {
      if (!this.state.value){
        this.props.clearSearchResult();
        this.setState({
          searchText: '',
          debounced: ''
        });
      }
    }, 100);
  }

  onChange (event) {
    //Clear the search results when there is no search data
    if(!event ){
      this.props.clearSearchResult();
      this.setState({
        searchText: '',
        debounced: '',
      });
    } else if (event === RESULT_COUNT_ID ){
      //  event === RESULT_COUNT_ID when resetValue is trigerred i.e. cross button is clicked
      this.props.clearSearchResult();
      this.setState({
        searchText: '',
        debounced: '',
        value: null
      });
      return;
    } else if ( event.id === RESULT_COUNT_ID ){
      //do nothing when clicking on the result description text
      return;
    }



    //to update the value props in Select component
    this.setState({
      value: event && event.id !== RESULT_COUNT_ID ?  event.id : null
    });

    if ( this.props.completeTree && event ){
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
    const { searchText, debounced, value } = this.state;

    //append match date time to each result
    //appending 'number of search result text' into the first row
    const results = this.props.searchResult.splice( 0, 0,
      { 'id': '0',
        'name': I18n.t('searchMenu.no_of_result', {count: this.props.searchResult.size, searchText: searchText })
      }
    );

    const shouldShowOptions =

    //dun show any result when no input in search / cross button is clicked
    ( this.state.isLoading && this.props.searchResult.size === 0 ) || ( value === RESULT_COUNT_ID ) || ( searchText && searchText.length === 0 ) ? [] :

      //show search result when there is search result
      debounced && debounced.length > 0 && results.size > 1 ? results.toJS() :

      //show 'no result' when debounce text is not empty and there is no search result
      debounced && debounced.length > 0 ? [
        { 'id': '0',
          'name': I18n.t('searchMenu.no_of_result_0')
        }
      ] :  [] ;

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
                  options={ shouldShowOptions }
                  backspaceRemoves={ this.state.backspaceRemoves }
                  placeholder={ I18n.t('searchMenu.search_place_holder') }
                  filterOptions={ this.filterOptions }
                  autofocus
                  resetValue={ RESULT_COUNT_ID }
                  noResultsText={ null }
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
