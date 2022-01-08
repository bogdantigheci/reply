import axios from 'axios';
import {
  COUNTRIES_PENDING,
  COUNTRIES_SUCCESS,
  COUNTRIES_ERROR,
} from '../constants/types';

export const fetchCountriesPending = () => ({
  type: COUNTRIES_PENDING,
});

export const fetchCountriesSuccess = (countries) => ({
  type: COUNTRIES_SUCCESS,
  countries,
});

export const fetchCountriesError = (error) => ({
  type: COUNTRIES_ERROR,
  error,
});

export const fetchCountries = (url) => (dispatch) => {
  dispatch(fetchCountriesPending());
  return axios
    .get(process.env.REACT_APP_GET_COUNTRIES_URL)
    .then((response) => {
      dispatch(fetchCountriesSuccess(response.data.data));
    })
    .catch((error) => {
      dispatch(fetchCountriesError(error));
    });
};
