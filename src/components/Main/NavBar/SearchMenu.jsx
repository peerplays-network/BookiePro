
/**
 * The Search Box is used to search for active betting market group using team names
 *
 * The main component is React-Select. https://github.com/JedWatson/react-select
 *
 *  User can click 'X' icon to clear the input text. It only appears when there is character inputted
 *
 *  Typing any character in input box will trigger debonunce ( see onChange() ),
 *  which will trim any empty space and conduct search.
 *  Result is not case sensitive.
 *
 *  Result lists:
 *  i. show nothing(no option shown) in idle state
 *  ii. when there exists result, it will displays result counter and list of events founded
 *  iii. when there doesnt exist any result, it will display 'no result found' text
 */
import React, { PureComponent } from 'react';
import { Menu, Modal } from 'antd';
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

// hardcode id in option object
const RESULT_COUNT_ID = '0';


/**
 * Custom component for option widget  ( optionComponent props used in react-select )
 *
 * i) displaying result counter or no results, and it is not clickable
 * ii) displaying Betting Market Group option,  triggering onChange upon clicking
 */
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
    let focus = '';

    if (this.props.isFocused) {
      focus = 'is-focused';
    }

    return (
      <div className={ option.id !== '0' ? `Select-option-holder ${focus}` : 'Select-option-holder Select-result' } onClick={ option.id !== '0' ? this.handleMouseDown : null }>
        {  option.is_live_market &&  <span className='badge' />  }
        <div className={ option.id !== '0' ? this.props.className : 'Select-option Select-result' }>
          {
            this.props.option.isLiveMarket &&
            <span className='indicator' />
          }
          {this.props.option.name}
        </div>
        <div className='match-start-on'>
          { option.id !== '0' ? moment(option.start_time).format('ddd, DD/MM/YYYY HH:mm') : '' }
        </div>
      </div>
    );
  }

}

/**
 * SearchMenu
 *
 * Selector : selectors/SidebarSelector.js
 */
class SearchMenu extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      debounced: '',
      modalIsOpen: false
    };
    this.closeModal = this.closeModal.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.filterOptions = this.filterOptions.bind(this);
    this.onRouteChangeHandle = this.onRouteChangeHandle.bind(this);
    this.onSearch$ = new Rx.Subject();
  }

  componentDidMount(){
    //subscribe input box debonunce
    this.subscription = this.onSearch$
      .debounceTime(300)
      .subscribe(debounced => {
        this.props.searchEvents(debounced)
        this.setState({ debounced })
      });
  }

  componentWillUnmount() {
    //unsubscribe input box debounce
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

  // To clear text input after route change and reusing Search Menu component
  onRouteChangeHandle(){
    this.select.blurInput();
  }

  // Trigger debounce on input change
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

  closeModal() {
    this.setState({
      modalIsOpen: false
    })
  }

  /**
   * overriding the filterOptions in react-select components.
   *
   * Make sure the filterOptions 'does nothing'
   * i.e. list all the options no matter what
   *
   * This is done in purpose to include result text in first option.
   */
  filterOptions( options, filter, currentValues){
    return options
  }

  //reset the searchText when leaving focus of searchmenu.
  onClose (){

    // 100ms is good enough to reset stuff after leaving the search box and before human interation.
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

  /**
   * Called upon selecting option shown below Select-menu
   *
   * Perform route navigation and updating the selected option in state.
   *
   * Navigation is same as navigation in sidebar
   * I.e. show MONEYLINE if moneyline exist, else show the first descendent in selected betting market group
   */
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

      if (!keyPath) {
        this.setState({
          modalIsOpen: true,
          eventName: event.name
        })
        return
      }

      const moneyline = nested.getIn(keyPath).get('children').filter((mktGroup) =>
        //NOTE if type id is not in string format please change it
        mktGroup.get('description').toUpperCase() === 'MONEYLINE' || mktGroup.get('description').toUpperCase() === 'MATCH ODDS'
      )

      if ( moneyline.size > 0 ){
        this.props.navigateTo('/exchange/bettingmarketgroup/' + moneyline.get(0).get('id') );
      } else {
        this.props.navigateTo('/exchange/bettingmarketgroup/' + nested.getIn(keyPath).getIn(['children', 0 , 'id']) );
      }
    }

  }

   /**
    *  Rendering reach-select widget
    *
    *  Overriding the options props in reach-select widget
    *  as we need to clear the options when focus is removed from react-select.
    *
    *  With Results : display the result counter ( index 0 in options[]) and list of active events found ( index >= 1 in options[]).
    *     for option attribute, please refer to valueKey and in labelKey in react-select props.
    *
    *  No Result: display no result text ( index 0 in options[])
    *            noResultsText in props is set as null as overriding the display condition of noResultsText is needed
    */
  render() {
    const { searchText, debounced, value, eventName } = this.state;

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

    return (

      <div className='search-menu'>
        <Modal
          visible={ this.state.modalIsOpen }
          footer={ null }
          onCancel={ this.closeModal }
          >
          <p>{ I18n.t('searchMenu.search_error', { event: eventName } ) }</p>
        </Modal>

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
