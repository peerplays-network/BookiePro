import { dictionaries } from './dictionaries';
import { languages } from './languages';
import configureStore from './configureStore';
import { i18nActions, LocPresentational } from 'redux-react-i18n'
import { connect } from 'react-redux'

const store = configureStore();
//to change the language dispatch the setCurrent function
store.dispatch( i18nActions.setCurrent( 'ru-RU' ) )

//setting up dictionary file to use
store.dispatch( i18nActions.setDictionaries( dictionaries ) )

//setting up language file to use
store.dispatch( i18nActions.setLanguages( languages ) )

//setting up default language
//TODO: store and pick the default language from state/store
let currentLanguage = 'ru-RU';

//map state to properties if required
const mapStateToProps = ( { /*getting data from the state*/ }, ownProps ) => ({
  currentLanguage: currentLanguage,
  dictionary: dictionaries[currentLanguage]
});
//keep the const as Loc if changed it breaks the functionality.
export const Loc = connect( mapStateToProps )( LocPresentational )
