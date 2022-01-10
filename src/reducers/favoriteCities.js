import {
  ADD_CITY_TO_FAVORITES,
  SORT_FAVORITE_CITIES,
} from '../constants/types';

const defaultState = [];

export const favoriteCities = (state = defaultState, action) => {
  switch (action.type) {
    case ADD_CITY_TO_FAVORITES:
      return [...state, action.city];
    case SORT_FAVORITE_CITIES:
      return [...action.cities];
    default:
      return state;
  }
};
