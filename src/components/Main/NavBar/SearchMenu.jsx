import React, { Component } from 'react';
import { Menu } from 'antd';
import _ from 'lodash';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import './SearchMenu.less';

import { NavigateActions } from '../../../actions';
import { CommunicationService } from '../../../services';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import Immutable from 'immutable';
import { findKeyPathOf } from '../../../utility/TreeUtils'

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

    let isMoneyLineFound = false;

    if ( this.props.completeTree){
      const nested = Immutable.fromJS(this.props.completeTree);
      var keyPath = findKeyPathOf(nested, 'children', (node => node.get('id') === event.id) );

      const moneyline = nested.getIn(keyPath).get('children').filter(function(mktGroup) {
        //NOTE if type id is not in string format please change it
        return mktGroup.get('market_type_id') === 'Moneyline';
      })

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

  getEvents (input) {

  	if (!input) {
  		return Promise.resolve({ options: [] });
  	}

    //API search call
    return CommunicationService.searchEvents(input).then((events) => {

      // console.log(events)
      events = events.toJS();
      // console.log(events)

      return { options: events };
    });

  }

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

            <Select.Async
              multi={ this.state.multi }
              value={ this.state.value }
              onChange={ this.onChange }
              onValueClick={ this.gotoEvent }
              valueKey='id'
              labelKey='name'
              loadOptions={ this.getEvents }
              backspaceRemoves={ this.state.backspaceRemoves }
              placeholder='Search Team' />

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
  return {
    completeTree: sidebar.get('complete_tree'),
  };
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchMenu);
