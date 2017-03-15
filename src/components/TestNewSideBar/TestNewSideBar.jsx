import React, { Component } from 'react';
import InfinityMenu from "react-infinity-menu";
import "react-infinity-menu/src/infinity-menu.css";
import Immutable from 'immutable';

import BettingMarketGroup from './BettingMarketGroup';
import Event from './Event';
import EventGroup from './EventGroup';
import Sport from './Sport';

// import NavigateActions from '../../actions/NavigateActions';
import { push } from 'react-router-redux';
import { connect } from 'react-redux'

import { findKeyPathOf } from '../../utility/TreeUtils'

//http://stackoverflow.com/questions/33479866/js-change-object-inside-array-in-for-each-loop

//https://www.toptal.com/react/react-redux-and-immutablejs
//http://thomastuts.com/blog/immutable-js-101-maps-lists.html

// for customComponent doc : https://www.bountysource.com/issues/30555786-having-trouble-with-search

class TestNewSideBar extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentWillMount() {
    console.log('componentWillMount');
		  this.setState({
  			tree: this.props.completeTree
  		});
      this.updateSider = this.updateSider.bind(this);

	 }

   componentDidMount(){
     console.log('componentDidMount');

     this.updateSider(this.props) ;
   }

  updateSider(treeConfig) {
    console.log('updateSider');

      //to use immutable-js to update tree
      //http://stackoverflow.com/questions/41298577/how-to-get-altered-tree-from-immutable-tree-maximising-reuse-of-nodes?rq=1
    const nested = Immutable.fromJS(treeConfig.completeTree);

    if ( treeConfig.objectId){
      var keyPath = findKeyPathOf(nested, 'children', (node => node.get('objectId') === treeConfig.objectId) );
      // console.log('keyPath: ', keyPath); //[1, "children", 0, "children", 0, "children", 4]

      // Found it?
      if (keyPath) {
        var newTree = nested;
          // Sample code Set 'name' to 'Hello' in that node:
        // var newTree = nested.updateIn(keyPath, node =>
        //   node.set('name', 'Hello')
        //   .set('isOpen', true)
        // );

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

          // Print the new tree for debug:
          // console.log(JSON.stringify(newTree.toJS(), null, 2));
          // Compare all nodes to see which ones were altered:
          // var altered = differences(nested, newTree, 'children').map(x => x.get('id'));
          // console.log('IDs of nodes that were replaced: ', altered);
          //[1101111, 12222, 13333, 2305]

        var updatedTree = newTree.toJS();

        // updatedTree.forEach(function(item) {
        //   item.isOpen = false;//setting the value
        //   delete item.num;//deleting the num from the object
        // });
        // console.log('updatedTree:, ' + JSON.stringify(updatedTree, null, 2));


        var newPeople = [];
        newTree.forEach(function(p){
          if(p.length <= 4){
            newPeople.push(p);
          }
        });


        this.setState({
          tree: updatedTree
        });
      } else {
        console.log('Not found! ', treeConfig.objectId);
      }


    }

  }

  componentWillReceiveProps(nextProps) {

      this.updateSider(nextProps);

  }

  onNodeMouseClick(event, tree, node, level, keyPath) {
    // this.setState({
    //   tree: tree
    // });

    console.log( 'going to push: ', node.id);
    // this.updateSider() ;
    this.props.push('/market-screen/' + node.customComponent + '/' + node.id);

    // this.context.router.push('/market-screen/sport/' + node.id);
    // this.context.router.push('home');

    // console.log( node); // Prints the leaf name
    // console.log( tree[1].children); // Prints the leaf name

  }

  onLeafMouseClick(event, leaf) {
    // console.log( leaf.id ); // Prints the leaf id
    // console.log( leaf.name ); // Prints the leaf name
  }

  onLeafMouseUp(event, leaf) {
    // console.log( leaf.id ); // Prints the leaf id
    // console.log( leaf.name ); // Prints the leaf name
  }

  onLeafMouseDown(event, leaf) {
    // console.log( leaf.id ); // Prints the leaf id
    // console.log( leaf.name ); // Prints the leaf name
  }


  render() {
    console.log( 'render');
    console.log('location', this.props.location)
    // console.log(JSON.stringify(newTree.toJS(), null, 2));

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
                "BettingMarketGroup" : BettingMarketGroup
              }
            }
          />

    );
  }
}

TestNewSideBar.propTypes = {
  completeTree: React.PropTypes.array.isRequired,
  level: React.PropTypes.string,
  objectId: React.PropTypes.string,
};

const mapStateToProps = (state) => {
  const { sidebar } = state;
  return {
    sidebarObjectId: sidebar.objectId,
    sidebarLevel: sidebar.level,

  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    push: (url) => {
      dispatch(push(url))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestNewSideBar);
