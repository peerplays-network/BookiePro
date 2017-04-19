import React, { Component } from 'react';
import { Menu } from 'antd';
import _ from 'lodash';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import './SearchMenu.less';

import { NavigateActions, EventActions } from '../../../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import Immutable from 'immutable';
import { findKeyPathOf } from '../../../utility/TreeUtils'
import { LoadingStatus } from '../../../constants';

class SearchMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  onInputChange(searchText) {

    //TODO options shown still exist when search text is empty
    if ( searchText.length > 0){
      setTimeout(this.props.searchEvents(searchText), 2000)
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


  onChange (event) {

    //to update the value props in Select component
    this.setState({
      value: event,
    });

    let isMoneyLineFound = false;

    if ( this.props.completeTree){
      const nested = Immutable.fromJS(this.props.completeTree);
      const keyPath = findKeyPathOf(nested, 'children', (node => node.get('id') === event.id) );
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
    if ( isMoneyLineFound === false){
      this.props.navigateTo('/exchange/event/' + event.id );
    }

  }

  //onClick of the event shown in Search Menu
  gotoEvent (value, event) {
  }

  render() {

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
                  value={ this.state.value }
                  onChange={ this.onChange }
                  onValueClick={ this.gotoEvent }
                  valueKey='id'
                  labelKey='name'
                  onInputChange={ this.onInputChange }
                  isLoading={ this.state.isLoading }
                  options={ this.props.searchResult === undefined ? [] : this.props.searchResult.toJS() }
                  backspaceRemoves={ this.state.backspaceRemoves }
                  placeholder='Search Team'
                />

            }
          </Menu.Item>

        </Menu>
      </div>
    );
  }
}

SearchMenu.propTypes = {
  label: React.PropTypes.string,
};

const mapStateToProps = (state) => {
  const sidebar = state.get('sidebar');
  const event = state.get('event');
  return {
    completeTree: sidebar.get('complete_tree'),
    searchResult: event.get('searchResult'),
    getSearchEventsLoadingStatus: event.get('getSearchEventsLoadingStatus'),
  };
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
    searchEvents: EventActions.searchEvents,
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchMenu);
