/**
 * The Sidebar allow users to navigate to different active sports and events
 *
 * AllSport -> Sport -> Event Group -> Event -> Betting MarketGroup.
 * InfinityMenu widget : https://github.com/JedWatson/react-select
 * customComponent in InfinityMenu :
 * https://www.bountysource.com/issues/30555786-having-trouble-with-search
 *
 * - Under different level
 * landed on home screen / click on all sports -> display sports
 * click on sport name -> show divisions under the selected sport
 * click on division -> show events under the selected division
 * click on event -> show markets under the selected, go to moneyline if moneyline exist, else go
 * to first market based on default ordering
 * click on market -> no change in menu item, only highlight selected market
 *
 * Selector : selectors/SidebarSelector.js
 */
import React, {PureComponent} from 'react';
import InfinityMenu from 'react-infinity-menu';
import 'react-infinity-menu/src/infinity-menu.css';
import Immutable from 'immutable';
import {NavigateActions} from '../../actions';
import BettingMarketGroup from './BettingMarketGroup';
import Event from './Event';
import EventGroup from './EventGroup';
import Sport from './Sport';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {findKeyPathOf, differences} from '../../utility/TreeUtils';
import PropTypes from 'prop-types';
import {SidebarSelector} from '../../selectors';
import log from 'loglevel';
import {DateUtils} from '../../utility';

class SideBar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tree: this.createCurrentStateTree(props.completeTree, props.objectId)
    };
    this.createCurrentStateTree = this.createCurrentStateTree.bind(this);
    this.onNodeMouseClick = this.onNodeMouseClick.bind(this);
  }

  //  only re-render sidebar component when there is change
  componentWillReceiveProps(nextProps) {
    if (
      this.props.completeTree !== nextProps.completeTree ||
      this.props.objectId !== nextProps.objectId
    ) {
      this.setState({
        tree: this.createCurrentStateTree(nextProps.completeTree, nextProps.objectId)
      });
    }
  }

  setNodeSelected(node) {
    return node.set('isSelected', true).set('isOpen', true);
  }

  setNodeOpen(node) {
    return node.set('isOpen', true);
  }

  /**
   * update tree based on current navigation
   * idea is to reuse a base completeTree and contrucut the base tree based on currrent navigation.
   * i.e. removing nodes from completeTree
   *
   * for findKeyPathOf() and differences(), please refer to
   
   * for detailed explanation.
   */
  /* https://stackoverflow.com/questions/41298577/how-to-get-altered-tree-from-immutable-tree-maximising-reuse-of-nodes*/  //eslint-disable-line
  createCurrentStateTree(
    completeTree,
    targetObjectId
  ) {
    if (!targetObjectId || targetObjectId === 'exchange') {
      //hardcode id for all-sports node,
      targetObjectId = '0';
    }

    const keyPath = findKeyPathOf(
      completeTree,
      'children',
      (node) => node.get('id') === targetObjectId
    );

    // Found path?
    if (keyPath) {
      let newTree = completeTree;

      // For sport
      if (keyPath.length === 1) {
        newTree = newTree.updateIn(keyPath.slice(0, 1), this.setNodeSelected);
      } else if (keyPath.length === 3) {
        // For event group
        newTree = newTree
          .updateIn(keyPath.slice(0, 1), this.setNodeOpen)
          .updateIn(keyPath.slice(0, 3), this.setNodeSelected);
      } else if (keyPath.length === 5) {
        // For event
        newTree = newTree
          .updateIn(keyPath.slice(0, 1), this.setNodeOpen)
          .updateIn(keyPath.slice(0, 3), this.setNodeSelected)
          .updateIn(keyPath.slice(0, 5), this.setNodeSelected);
      } else if (keyPath.length === 7) {
        // For betting market group
        newTree = newTree
          .updateIn(keyPath.slice(0, 1), this.setNodeOpen)
          .updateIn(keyPath.slice(0, 3), this.setNodeOpen)
          .updateIn(keyPath.slice(0, 5), this.setNodeSelected)
          .updateIn(keyPath.slice(0, 7), this.setNodeSelected);
      }

      // Compare all nodes to see which ones were altered:
      // find the 'id' path of the newTree
      const altered = differences(completeTree, newTree, 'children').map((x) => x.get('id'));

      if (keyPath.length >= 5) {
        newTree = newTree.setIn(
          keyPath.slice(0, 4),
          newTree.getIn(keyPath.slice(0, 4)).filter((metric) => metric.get('id') === altered[2])
        );
      }

      if (keyPath.length >= 3) {
        newTree = newTree.setIn(
          keyPath.slice(0, 2),
          newTree.getIn(keyPath.slice(0, 2)).filter((metric) => metric.get('id') === altered[1])
        );
      }

      if (keyPath[0] !== 0) {
        // '0' is hardcode id for all-sports node,
        newTree = newTree.filter((p) => p.get('id') === '0' || p.get('isOpen'));
      }

      return newTree.toJS();
    } else {
      log.debug('Sidebar - object id not found! ', targetObjectId);
      return completeTree.toJS();
    }
  }

  /**
   * onClick function to be cosumed by props in react-infinity-menu
   * https://github.com/socialtables/react-infinity-menu#properties
   *
   * i) Event  -> show Moneyline if ACTITVE Moneyline exists. Else it will show the first
   * descendant ACTIVE BMG
   * ii) BMG -> show corresponding BMG
   * iii) SPORT / Event Group -> show ACTIVE descendants
   *
   *  navgiation path name is related to value of customComponentMappings props provided to
   * InfinityMenu
   *
   * @param event - is the mouse click event.
   * @param tree -  is the updated tree, you should update your own tree accordingly.
   * @param node -  is the folder(node) the user clicked on. Including the id, name, isOpen
   * and children.
   * @param level - is the distance from the root.
   * @param keyPath - is the path from root to current node
   */
  onNodeMouseClick(event, tree, node) {
    const {navigateTo} = this.props;

    // '0' is hardcode id for all-sports node,
    if (node.id === '0') {
      navigateTo('/exchange/');
    } else {
      if (node.customComponent.toLowerCase() === 'event') {
        const moneyline = node.children.filter(
          (mktGroup) => mktGroup.description.toUpperCase() === 'MONEYLINE'
        );

        if (moneyline.length > 0) {
          navigateTo('/exchange/bettingmarketgroup/' + moneyline[0].id);
        } else {
          navigateTo('/exchange/bettingmarketgroup/' + node.children[0].id);
        }
      } else {
        navigateTo('/exchange/' + node.customComponent.toLowerCase() + '/' + node.id);
      }
    }
  }

  sortEventTree() {
    var tree = this.state.tree;

    for (var i = 0; i < tree.length; i++) {
      var branch = this.state.tree[i];

      for (var b = 0; b < branch.children.length; b++) {
        var node = branch.children[b];
        node.children = sortByDate(node.children);
        let currentDate = node.children[0].start_time;

        for (var c = 1; c < node.children.length; c++) {
          // This for loop removes the start_date property from the object if the previous
          // element has the same date
          if (
            DateUtils.getMonthAndDay(currentDate) ===
            DateUtils.getMonthAndDay(node.children[c].start_time)
          ) {
            node.children[c].start_time = null;
          } else {
            currentDate = node.children[c].start_time;
          }
        }
      }
    }

    function sortByDate(events) {
      return events.sort(function(a, b) {
        return new Date(a.start_time) - new Date(b.start_time);
      });
    }
  }

  /**
   *
   *  customComponentMappings is related to navigation path name.
   *  key in mapping inherits to customComponent value definied in selector/SidebarSelector
   *  value in mapping corresponds to customComponent class
   */
  render() {
    this.sortEventTree();
    return (
      <InfinityMenu
        disableDefaultHeaderContent={ true }
        tree={ this.state.tree }
        onNodeMouseClick={ this.onNodeMouseClick }
        customComponentMappings={ {
          Sport: Sport,
          EventGroup: EventGroup,
          Event: Event,
          BettingMarketGroup: BettingMarketGroup
        } }
      />
    );
  }
}

SideBar.propTypes = {
  /**
   * completeTree served as the base tree and sidebar get the tree data to be dispalyed after
   * filtering based on current navigation
   * Action : Main.jsx -> componentDidMount -> getDataForSidebar();
   * Store  : Main.jsx -> mapStateToProps -> completeTree
   */
  completeTree: PropTypes.instanceOf(Immutable.List).isRequired,
  objectId: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired
};

SideBar.defaultProps = {
  completeTree: Immutable.List(),
  objectId: ''
};

const mapStateToProps = (state) => {
  return {
    completeTree: SidebarSelector.getSidebarCompleteTree(state)
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    navigateTo: NavigateActions.navigateTo
  },
  dispatch
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideBar);
