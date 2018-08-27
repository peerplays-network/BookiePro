import Immutable from 'immutable';

// Function to get the path to a certain node in the tree
export function findKeyPathOf(tree, childrenKey, predicate) {
  var path;

  if (Immutable.List.isList(tree)) {
    childrenKey = tree.findKey((child) => (path = findKeyPathOf(child, childrenKey, predicate)));
  } else if (predicate(tree)) {
    return [];
  } else {
    path = findKeyPathOf(tree.get(childrenKey), childrenKey, predicate);
  }

  return path && [childrenKey].concat(path);
}

// Function to compare two trees
export function differences(tree1, tree2, childrenKey) {
  if (Immutable.List.isList(tree1)) {
    return tree1.reduce(function(diffs, child, i) {
      return diffs.concat(differences(child, tree2.get(i), childrenKey));
    }, []);
  }

  return (tree1 !== tree2 ? [tree1] : []).concat(
    differences(tree1.get(childrenKey), tree2.get(childrenKey), childrenKey)
  );
}
