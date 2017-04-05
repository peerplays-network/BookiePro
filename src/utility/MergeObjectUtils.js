import _ from 'lodash';

//merge immutable object columns based on relation
export function mergeRelationData(collection, relationalCollection, relationId, mergeColumns){
  collection.forEach((d, index) => {
    var matchObj = relationalCollection.get(d.get(relationId));
    matchObj && Object.keys(mergeColumns).forEach(function(r){
      d = d.set(mergeColumns[r], matchObj.get(r));
    });
    collection[index] = d;
  });
  return collection;
}
