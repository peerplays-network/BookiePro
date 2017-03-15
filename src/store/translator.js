import translate from 'translatr';
import { dictionaries } from './dictionaries';

//translates the key and returns the translated word/sentence
export default function translateIt(key, defaultValue=null) {
  //TODO: pick the language from the state. We can store the language in the state and pick it from there
  var selectedLanguage = 'en-US';
  //check if key exists, if not returns the defaultvalue
  if(dictionaries[selectedLanguage][key]== undefined){
    if(defaultValue == null){
      return key
    }
    else{
      return defaultValue
    }
  }
  else{
    translate( dictionaries[selectedLanguage], selectedLanguage, key )
  }
}
