import {
  COUNTRIES_ERROR,
  COUNTRIES_SUCCESS,
  COUNTRIES_PENDING,
} from '../constants/types';

const defaultState = { countries: [] };

export const countries = (state = defaultState, action) => {
  switch (action.type) {
    case COUNTRIES_PENDING:
      return state;
    case COUNTRIES_ERROR:
      return { ...state, ...action.error };
    case COUNTRIES_SUCCESS:
      return { ...state, ...{ countries: action.countries } };
    default:
      return state;
  }
};
