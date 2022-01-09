import { combineReducers } from 'redux';
import { countries } from './countries';
import { cities } from './cities';
import { favoriteCities } from './favoriteCities';

const reducer = combineReducers({ countries, cities, favoriteCities });

export default reducer;
