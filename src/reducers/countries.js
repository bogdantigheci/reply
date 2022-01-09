import {
  FETCH_COUNTRIES_ERROR,
  FETCH_COUNTRIES_SUCCESS,
  FETCH_COUNTRIES_PENDING,
  REMOVE_COUNTRY,
  FILTER_COUNTRIES,
  SORT_COUNTRIES,
} from '../constants/types';

const defaultState = [];

export const countries = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_COUNTRIES_PENDING:
      return state;
    case FETCH_COUNTRIES_ERROR:
      return action.error;
    case FETCH_COUNTRIES_SUCCESS:
    case REMOVE_COUNTRY:
    case FILTER_COUNTRIES:
    case SORT_COUNTRIES:
      return [...action.countries];
    default:
      return state;
  }
};
