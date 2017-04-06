import React, { Component } from 'react';
import InfinityMenu from "react-infinity-menu";
import "react-infinity-menu/src/infinity-menu.css";
import Immutable from 'immutable';
import { NavigateActions } from '../../actions';

import BettingMarketGroup from './BettingMarketGroup';
import Event from './Event';
import EventGroup from './EventGroup';
import Sport from './Sport';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { findKeyPathOf, differences } from '../../utility/TreeUtils'

// for customComponent in InfinityMenu : https://www.bountysource.com/issues/30555786-having-trouble-with-search
class SideBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tree: this.props.completeTree.toJS()
    }

    this.updateSider = this.updateSider.bind(this);
  }

  componentDidMount(){
    this.updateSider(this.props.completeTree.toJS(), this.props.objectId);

  }
  componentWillReceiveProps(nextProps) {
    this.updateSider(nextProps.completeTree.toJS(), nextProps.objectId);
  }

  updateSider(completeTree, targetObjectId) {
      //immutable-js to update tree
      //http://stackoverflow.com/questions/41298577/how-to-get-altered-tree-from-immutable-tree-maximising-reuse-of-nodes?rq=1
    const nested = Immutable.fromJS(completeTree);

    if ( !targetObjectId){
      // id of 'all sports'
      targetObjectId = '0'
    }

    if ( !targetObjectId) {
      console.log('No Id ! ', targetObjectId);

      this.setState({
        tree: completeTree
      });
    } else {
      var keyPath = findKeyPathOf(nested, 'children', (node => node.get('id') === targetObjectId) );

      // Found path?
      if (keyPath) {
        var newTree = nested;
          //for sport
        if ( keyPath.length === 1){
          newTree = newTree.updateIn(keyPath.slice(0,1), node =>
            node.set('isSelected', true)
            .set('isOpen', true)
          );
        }

          //for event group
        else if ( keyPath.length === 3){
          newTree = newTree.updateIn(keyPath.slice(0,1), node =>
            node.set('isSelected', true)
            .set('isOpen', true)
          ).updateIn(keyPath.slice(0,3), node =>
            node.set('isSelected', true)
            .set('isOpen', true)
          );
        }

          //for event
        else if ( keyPath.length === 5){
          newTree = newTree.updateIn(keyPath.slice(0,1), node =>
            node.set('isOpen', true)
          ).updateIn(keyPath.slice(0,3), node =>
            node.set('isSelected', true)
            .set('isOpen', true)
          ).updateIn(keyPath.slice(0,5), node =>
            node.set('isSelected', true)
            .set('isOpen', true)
          );
        }

          //for betting market group
        else if ( keyPath.length === 7){
          newTree = newTree.updateIn(keyPath.slice(0,1), node =>
            node.set('isOpen', true)
          ).updateIn(keyPath.slice(0,3), node =>
            node.set('isOpen', true)
          ).updateIn(keyPath.slice(0,5), node =>
            node.set('isSelected', true)
            .set('isOpen', true)
          ).updateIn(keyPath.slice(0,7), node =>
            node.set('isSelected', true)
            .set('isOpen', true)
          );
        }

          // Compare all nodes to see which ones were altered:
        var altered = differences(nested, newTree, 'children').map(x => x.get('id'));

        if ( keyPath.length >= 3){
          newTree = newTree.setIn(keyPath.slice(0,2),
            newTree.getIn(keyPath.slice(0,2)).filter(function(metric) {
              return metric.get('id') === altered[1];
            })
          )
        }

        if ( keyPath.length >= 5){
          newTree = newTree.setIn(keyPath.slice(0,4),
            newTree.getIn(keyPath.slice(0,4)).filter(function(metric) {
              return metric.get('id') === altered[2];
            })
          )
        }

        var updatedTree = newTree.toJS();


        if (keyPath[0] !== 0){
          updatedTree = updatedTree.filter(function(p) {
            return (p.id === "0" || p.isOpen === true);
          });
        }

        this.setState({
          tree: updatedTree
        });
      } else {
        console.log('Not found! ', targetObjectId);
        this.setState({
          tree: completeTree
        });
      }
    }
  }

  onNodeMouseClick(event, tree, node, level, keyPath) {
    // this.setState({
    //   tree: tree
    // });

    if ( node.id === '0'){
      this.props.navigateTo('/exchange/');

    // commented for including  node.customComponent in url
    // } else if ( this.props.level && this.props.level === 3){
    //   this.props.navigateTo('/market-screen/' + node.id);

    } else {

      if ( node.customComponent.toLowerCase() === 'event'){
        const moneyline = node.children.filter(function(mktGroup) {
          //NOTE if type id is not in string format please change it
          return mktGroup.market_type_id === 'Moneyline';
        })

        if ( moneyline.length > 0){
          this.props.navigateTo('/exchange/bettingmarketgroup/' + moneyline[0].id );
        } else {
          this.props.navigateTo('/exchange/' + node.customComponent.toLowerCase() + '/' + node.id);
        }
      } else {
        this.props.navigateTo('/exchange/' + node.customComponent.toLowerCase() + '/' + node.id);
      }

    }

  }

  render() {
    return (
    <InfinityMenu
      disableDefaultHeaderContent={ true }
      tree={ this.state.tree }
      onNodeMouseClick={ this.onNodeMouseClick.bind(this) }
      customComponentMappings={ {
        "Sport" : Sport,
        "EventGroup" : EventGroup,
        "Event" : Event,
        "BettingMarketGroup" : BettingMarketGroup
      } }
  />

    );
  }
}

SideBar.propTypes = {
  completeTree: React.PropTypes.instanceOf(Immutable.List).isRequired,
  objectId: React.PropTypes.string.isRequired,
  level: React.PropTypes.number.isRequired,
};

SideBar.defaultProps = {
  objectId: ''
};


const mapStateToProps = (state) => {
  const sidebar = state.get('sidebar');
  return {
    sidebarObjectId: sidebar.get('objectId'),
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
