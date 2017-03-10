import translate from 'translatr';
import { dictionaries } from './dictionaries';

//translates the key and returns the translated word/sentence
export default function translateIt(language, key) {
  //TODO: pick the language from the state. We can store the language in the state and pick it from there
  var selectedLanguage = language;
  return translate( dictionaries[selectedLanguage], selectedLanguage, key )
}
