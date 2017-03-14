import React, { Component } from 'react';
import InfinityMenu from "react-infinity-menu";
import "react-infinity-menu/src/infinity-menu.css";
import Immutable from 'immutable';

import BettingMarket from './BettingMarket';
import Event from './Event';
import EventGroup from './EventGroup';
import Sport from './Sport';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { findKeyPathOf, differences } from '../../utility/TreeUtils'
//http://stackoverflow.com/questions/33479866/js-change-object-inside-array-in-for-each-loop
//http://stackoverflow.com/questions/41298577/how-to-get-altered-tree-from-immutable-tree-maximising-reuse-of-nodes?rq=1

//https://www.toptal.com/react/react-redux-and-immutablejs
//http://thomastuts.com/blog/immutable-js-101-maps-lists.html

//https://www.bountysource.com/issues/30555786-having-trouble-with-search
// for customComponent doc : https://www.bountysource.com/issues/30555786-having-trouble-with-search
// good https://github.com/sitepoint-editors/immutable-redux-todo/blob/master/src/actions.js

// to update the keypath of isOpen
//http://stackoverflow.com/questions/41298577/how-to-get-altered-tree-from-immutable-tree-maximising-reuse-of-nodes



class TestNewSideBar extends Component {

  static propTypes = {
    complete_tree: React.PropTypes.array, //bind to redux
    tree: React.PropTypes.array,
    level: React.PropTypes.string,
    object_id: React.PropTypes.string,


  };

  constructor(props) {
    super(props);
    // this.findKeyPathOf = this.findKeyPathOf.bind(this);
    // this.differences = this.differences.bind(this);
  }


  static callback(key) {
    window.console.log('callcack', key);
  }

  static deleteAllPanels(event) {
    event.preventDefault();
    // this stops the event from bubbling up to the Collapse header
    event.stopPropagation();
    window.console.log('clicked delete all panels', event);
  }

  componentWillMount() {




		  this.setState({
  			tree: this.props.complete_tree
  		});

	 }
   componentDidMount() {

    //  const { sportObjectId, eventGpObjectId, eventObjectId } = this.props.params
      // console.log( this.props.params );
      // Sample data

      const nested = Immutable.fromJS(this.props.complete_tree);
      // const nested = Immutable.fromJS(tree);

      var keyPath = findKeyPathOf(nested, 'children', (node => node.get('objectId') == '1.C.85') );
      var updatedTree = this.props.complete_tree;

      // Found it?
      if (keyPath) {
          // Set 'name' to 'Hello' in that node:
          var newTree = nested.updateIn(keyPath, node => node.set('name', 'Hello').set('isOpen', true));
          // Print the new tree:
          console.log(JSON.stringify(newTree.toJS(), null, 2));
          // Compare all nodes to see which ones were altered:
          var altered = differences(nested, newTree, 'children').map(x => x.get('id'));
          console.log('IDs of nodes that were replaced: ', altered);

          updatedTree = newTree.toJS();
      } else {
          console.log('Not found!');
      }

      updatedTree.forEach(function(item) {
        item.isOpen = false;//setting the value
        delete item.num;//deleting the num from the object
      });
      console.log( 'dd' + updatedTree);


      var newPeople = [];
      newTree.forEach(function(p){
          if(p.length <= 4){
              newPeople.push(p);
          }
      });

      this.setState({
  			tree: updatedTree
  		});

   }

  onNodeMouseClick(event, tree, node, level, keyPath) {
    this.setState({
      tree: tree
    });

  }

  onLeafMouseClick(event, leaf) {
    console.log( leaf.id ); // Prints the leaf id
    console.log( leaf.name ); // Prints the leaf name
  }

  onLeafMouseUp(event, leaf) {
    console.log( leaf.id ); // Prints the leaf id
    console.log( leaf.name ); // Prints the leaf name
  }

  onLeafMouseDown(event, leaf) {
    console.log( leaf.id ); // Prints the leaf id
    console.log( leaf.name ); // Prints the leaf name
  }


  render() {

    return (
          <InfinityMenu
              disableDefaultHeaderContent={ true }
              tree={ this.state.tree }
              onNodeMouseClick={ this.onNodeMouseClick.bind(this) }
              onLeafMouseClick={ this.onLeafMouseClick.bind(this) }/*optional*/
              onLeafMouseDown={ this.onLeafMouseDown.bind(this) }/*optional*/
              onLeafMouseUp={ this.onLeafMouseUp.bind(this) }/*optional*/
              customComponentMappings={
              {
                "Sport" : Sport,
                "EventGroup" : EventGroup,
                "Event" : Event,
                "BettingMarket" : BettingMarket
              }
            }
          />

    );
  }
}

const mapStateToProps = (state) => {
  const { sidebar } = state;
  return {
    complete_tree: sidebar.complete_tree,
    level: sidebar.level,
    object_id: sidebar.object_id
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TestNewSideBar);
