import axios from 'axios';
import {
  FETCH_COUNTRIES_PENDING,
  FETCH_COUNTRIES_SUCCESS,
  FETCH_COUNTRIES_ERROR,
  REMOVE_COUNTRY,
  FILTER_COUNTRIES,
  SORT_COUNTRIES,
  FILTER_COUNTRIES_BY_COORDS,
} from '../constants/types';
import { getCountriesList } from '../selectors/countries';
import { isBetweenOrEqual } from '../utils';
import _ from 'lodash';

export const fetchCountriesPending = () => ({
  type: FETCH_COUNTRIES_PENDING,
});

export const fetchCountriesSuccess = (countries) => ({
  type: FETCH_COUNTRIES_SUCCESS,
  countries,
});

export const fetchCountriesError = (error) => ({
  type: FETCH_COUNTRIES_ERROR,
  error,
});

export const removeCountrySuccess = (countries) => ({
  type: REMOVE_COUNTRY,
  countries,
});

export const filterCountriesSuccess = (countries) => ({
  type: FILTER_COUNTRIES,
  countries,
});

export const sortCountriesSucces = (countries) => ({
  type: SORT_COUNTRIES,
  countries,
});

export const filterCountriesByCoordsSuccess = (countries) => ({
  type: FILTER_COUNTRIES_BY_COORDS,
  countries,
});

export const fetchCountries = () => (dispatch) => {
  dispatch(fetchCountriesPending());
  return axios
    .get(process.env.REACT_APP_FETCH_COUNTRIES_URL)
    .then(({ data }) => {
      dispatch(fetchCountriesSuccess(data.data));
    })
    .catch((error) => {
      dispatch(fetchCountriesError(error));
    });
};

export const removeCountry = (country) => (dispatch, getState) => {
  const state = getState();
  const remainingCountries = getCountriesList(state).filter(
    (el) => el.iso2 !== country.iso2
  );
  return dispatch(removeCountrySuccess(remainingCountries));
};

export const filterCountries = (country) => (dispatch, getState) => {
  const state = getState();
  const remainingCountries = getCountriesList(state).filter((el) =>
    el.name.toLowerCase().includes(country.toLowerCase())
  );

  return dispatch(filterCountriesSuccess(remainingCountries));
};

export const filterCountriesByCoords = (coords) => (dispatch, getState) => {
  const state = getState();
  let remainingCountries = [];

  if (coords.lat.length === 1 && coords.long.length === 1) {
    console.log('in if 1 1');
    remainingCountries = getCountriesList(state).filter((el) => {
      return (
        el.lat === parseFloat(coords.lat[0]) &&
        el.long === parseFloat(coords.long[0])
      );
    });
  }

  if (coords.lat.length === 2 && coords.long.length === 1) {
    console.log('in if 2 1');
    remainingCountries = getCountriesList(state).filter((el) => {
      return (
        isBetweenOrEqual(
          el.lat,
          parseFloat(coords.lat[0]),
          parseFloat(coords.lat[1])
        ) && el.long === parseFloat(coords.long[0])
      );
    });
  }

  if (coords.lat.length === 1 && coords.long.length === 2) {
    console.log('in if 1 2');
    remainingCountries = getCountriesList(state).filter((el) => {
      return (
        el.lat === parseFloat(coords.lat[0]) &&
        isBetweenOrEqual(
          el.long,
          parseFloat(coords.long[0]),
          parseFloat(coords.long[1])
        )
      );
    });
  }

  if (coords.lat.length === 2 && coords.long.length === 2) {
    console.log('in if 2 2');
    remainingCountries = getCountriesList(state).filter((el) => {
      return (
        isBetweenOrEqual(
          el.lat,
          parseFloat(coords.lat[0]),
          parseFloat(coords.lat[1])
        ) &&
        isBetweenOrEqual(
          el.long,
          parseFloat(coords.long[0]),
          parseFloat(coords.long[1])
        )
      );
    });
  }

  return dispatch(filterCountriesByCoordsSuccess(remainingCountries));
};

export const sortCountries = (type) => (dispatch, getState) => {
  const state = getState();
  const sortedCountries = _.orderBy(getCountriesList(state), ['name'], [type]);

  return dispatch(sortCountriesSucces(sortedCountries));
};
