import {
  FETCH_CITIES_ERROR,
  FETCH_CITIES_SUCCESS,
  FETCH_CITIES_PENDING,
  FILTER_CITIES,
} from '../constants/types';

const defaultState = [];

export const cities = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_CITIES_PENDING:
      return state;
    case FETCH_CITIES_ERROR:
      return action.error;
    case FETCH_CITIES_SUCCESS:
    case FILTER_CITIES:
      return [...action.cities];
    default:
      return state;
  }
};
