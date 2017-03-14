//const uid = () => Math.random().toString(34).slice(2);
import { ActionTypes } from '../constants';

class SidebarActions{

  static treeUpdate(tree) {
    return {
      type: ActionTypes.UPDATE_SIDEBAR_COMPLETE_TREE,
      tree
    }
  }

}

export default SidebarActions;
