import _ from 'lodash';

//merge data from relationalCollection to collection by foreign key relationId
//mergeColumns is key value pair in which key is new column name to be set collection
//value represent source column of relationalCollection, value of which to be copied to collection
const mergeRelationData = (collection, relationalCollection, relationId, mergeColumns) => {
  collection.forEach((d, index) => {
    //get object from relationalCollection on the basis of foreign key value from collection
    var matchObj = relationalCollection.get(d.get(relationId));
    //iterate through mergeColumns to set value from relational object to specific object in collection
    matchObj && Object.keys(mergeColumns).forEach(function(r){
      //set column value
      d = d.set(mergeColumns[r], matchObj.get(r));
    });
    //replacing updated object in collection
    collection[index] = d;
  });
  return collection;
}

//merge betting market group data to bets for display
//created seperate function otherwise column data with the same column name will be replaced in main data;
const mergeBettingMarketGroup = (data, relData, col) => {
  data.forEach((row, index) => {
    var matchObj = relData.get(row.get(col));
    if(matchObj){
      row = row.set('event_id', matchObj.get('event_id'));
      row = row.set('market_type_id', matchObj.get('market_type_id'));
      if(matchObj.get('market_type_id') === 'Moneyline'){
        row = row.set('options', '');
      }
      else if(matchObj.get('market_type_id') === 'Spread'){
        if(matchObj.get('options').get('margin') > 0)
          row = row.set('options', ('+' + matchObj.get('options').get('margin')));
        else
          row = row.set('options', matchObj.get('options').get('margin'));
      }
      else{
        row = row.set('options', matchObj.get('options').get('score'));
      }
      data[index] = row;
    }
  })
  return data;
}

const MergeObjectUtils = {
  mergeRelationData,
  mergeBettingMarketGroup
}

export default MergeObjectUtils;
