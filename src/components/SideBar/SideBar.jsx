import React, { PureComponent } from 'react';
import InfinityMenu from 'react-infinity-menu';
import 'react-infinity-menu/src/infinity-menu.css';
import Immutable from 'immutable';
import { NavigateActions } from '../../actions';
import BettingMarketGroup from './BettingMarketGroup';
import Event from './Event';
import EventGroup from './EventGroup';
import Sport from './Sport';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { findKeyPathOf, differences } from '../../utility/TreeUtils'
import PropTypes from 'prop-types';
import { SidebarSelector } from '../../selectors';
import log from 'loglevel';

// for customComponent in InfinityMenu : https://www.bountysource.com/issues/30555786-having-trouble-with-search
class SideBar extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      tree: this.createCurrentStateTree(props.completeTree, props.objectId)
    }
    this.createCurrentStateTree = this.createCurrentStateTree.bind(this);
    this.onNodeMouseClick = this.onNodeMouseClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.completeTree !== nextProps.completeTree || this.props.objectId !== nextProps.objectId) {
      this.setState({
        tree: this.createCurrentStateTree(nextProps.completeTree, nextProps.objectId)
      })
    }
  }

  createCurrentStateTree(completeTree, targetObjectId) {

    if (!targetObjectId){
      // id of 'all sports'
      targetObjectId = '0'
    }

    const keyPath = findKeyPathOf(completeTree, 'children', (node => node.get('id') === targetObjectId) );
    // Found path?
    if (keyPath) {
      let newTree = completeTree;
      // For sport
      if ( keyPath.length === 1){
        newTree = newTree.updateIn(keyPath.slice(0,1), node =>
          node.set('isSelected', true).set('isOpen', true)
        );
      }

      // For event group
      else if ( keyPath.length === 3) {
        newTree = newTree.updateIn(keyPath.slice(0,1), node =>
          node.set('isOpen', true)
        ).updateIn(keyPath.slice(0,3), node =>
          node.set('isSelected', true).set('isOpen', true)
        );
      }

      // For event
      else if ( keyPath.length === 5) {
        newTree = newTree.updateIn(keyPath.slice(0,1), node =>
          node.set('isOpen', true)
        ).updateIn(keyPath.slice(0,3), node =>
          node.set('isSelected', true).set('isOpen', true)
        ).updateIn(keyPath.slice(0,5), node =>
          node.set('isSelected', true).set('isOpen', true)
        );
      }

      // For betting market group
      else if ( keyPath.length === 7) {
        newTree = newTree.updateIn(keyPath.slice(0,1), node =>
          node.set('isOpen', true)
        ).updateIn(keyPath.slice(0,3), node =>
          node.set('isOpen', true)
        ).updateIn(keyPath.slice(0,5), node =>
          node.set('isSelected', true).set('isOpen', true)
        ).updateIn(keyPath.slice(0,7), node =>
          node.set('isSelected', true).set('isOpen', true)
        );
      }

      // Compare all nodes to see which ones were altered:
      // TODO: please put more explanation on the logic here
      const altered = differences(completeTree, newTree, 'children').map(x => x.get('id'));
      if ( keyPath.length >= 5){
        newTree = newTree.setIn(keyPath.slice(0,4),
          newTree.getIn(keyPath.slice(0,4)).filter((metric) => {
            return metric.get('id') === altered[2];
          })
        )
      }
      if ( keyPath.length >= 3){
        newTree = newTree.setIn(keyPath.slice(0,2),
          newTree.getIn(keyPath.slice(0,2)).filter((metric) => {
            return metric.get('id') === altered[1];
          })
        )
      }
      if (keyPath[0] !== 0){
        newTree = newTree.filter((p) => p.get('id') === '0' || p.get('isOpen'));
      }
      return newTree.toJS();
    } else {
      log.debug('Sidebar - object id not found! ', targetObjectId);
      return completeTree.toJS();
    }
  }

  onNodeMouseClick(event, tree, node, level, keyPath) {
    const { navigateTo } = this.props;

    if (node.id === '0') {
      navigateTo('/exchange/');
    // commented for including  node.customComponent in url
    // } else if ( this.props.level && this.props.level === 3){
    //   this.props.navigateTo('/market-screen/' + node.id);
    } else {
      if ( node.customComponent.toLowerCase() === 'event'){
        const moneyline = node.children.filter((mktGroup) => mktGroup.market_type_id === 'Moneyline');
        if ( moneyline.length > 0){
          navigateTo('/exchange/bettingmarketgroup/' + moneyline[0].id );
        } else {
          navigateTo('/exchange/' + node.customComponent.toLowerCase() + '/' + node.id);
        }
      } else {
        navigateTo('/exchange/' + node.customComponent.toLowerCase() + '/' + node.id);
      }
    }
  }

  render() {
    return (
      <InfinityMenu
        disableDefaultHeaderContent={ true }
        tree={ this.state.tree }
        onNodeMouseClick={ this.onNodeMouseClick }
        customComponentMappings={ {
          'Sport' : Sport,
          'EventGroup' : EventGroup,
          'Event' : Event,
          'BettingMarketGroup' : BettingMarketGroup
        } }
      />
    );
  }
}

SideBar.propTypes = {
  completeTree: PropTypes.instanceOf(Immutable.List).isRequired,
  objectId: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired,
};

SideBar.defaultProps = {
  completeTree: Immutable.List(),
  objectId: ''
};


const mapStateToProps = (state) => {
  return {
    completeTree: SidebarSelector.getSidebarCompleteTree(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideBar);
