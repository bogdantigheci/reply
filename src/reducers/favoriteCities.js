import { ADD_CITY_TO_FAVORITES } from '../constants/types';

const defaultState = [];

export const favoriteCities = (state = defaultState, action) => {
  switch (action.type) {
    case ADD_CITY_TO_FAVORITES:
      return [...state, action.city];
    default:
      return state;
  }
};
