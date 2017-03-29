import _ from 'lodash';

//merge immutable object columns based on relation
export function mergeRelationData(data, relData, col, relCol, relNames){
  _.forEach(data, function(d){
    var matchObj = relData.find(o => (o.get(relCol) === d[col]))
    _.forEach(relNames, function(r){
      _.merge(d, {[r] : matchObj.get(r)})
    });
  })
  return data;
}

//merge betting market group data to bets for display
//created seperate function otherwise column data with the same column name will be replaced in main data;
export function mergeBettingMarketGroup(data, relData, col, relCol){
  _.forEach(data, function(d){
  	var matchObj = relData.find(o => (o.get(relCol) === d[col]))
    _.merge(d, {'event_id' : matchObj.get('event_id')})
    _.merge(d, {'market_type_id' : matchObj.get('market_type_id')})
    if(matchObj.get('market_type_id') === 'Moneyline'){
      _.merge(d, {'options' : ''});
    }
    else if(matchObj.get('market_type_id') === 'Spread'){
      if(matchObj.get('options').get('margin') > 0)
        _.merge(d, {'options' : ('+' + matchObj.get('options').get('margin'))});
      else
        _.merge(d, {'options' : matchObj.get('options').get('margin')});
    }
    else{
  	  _.merge(d, {'options' : matchObj.get('options').get('score')});
    }
  })
  return data;
}

//merge event data to bets for display
//created seperate function otherwise column data with the same column name will be replaced in main data
export function mergeEventData(data, relData, col, relCol){
  	_.forEach(data, function(d){
  		var matchObj = relData.find(o => (o.get(relCol) === d[col]))
    _.merge(d, {'event_name' : matchObj.get('name')})
    _.merge(d, {'event_time' : matchObj.get('start_time')})
    _.merge(d, {'sport_id' : matchObj.get('sport_id')})
  })
  return data;
}

//merge sport data to bets for display
//created seperate function otherwise column data with the same column name will be replaced in main data
export function mergeSport(data, relData, col, relCol, relName){
  _.forEach(data, function(d){
  	var matchObj = relData.find(o => (o.get(relCol) === d[col]))
  	_.merge(d, {[relName] : matchObj.get('name')})
  })
  return data;
}
