import axios from 'axios';
import {
  FETCH_CITIES_ERROR,
  FETCH_CITIES_PENDING,
  FETCH_CITIES_SUCCESS,
  FILTER_CITIES,
  SORT_CITIES,
  FETCH_CITY_POPULATION_ERROR,
  FETCH_CITY_POPULATION_PENDING,
  FETCH_CITY_POPULATION_SUCCESS,
  ADD_CITY_TO_FAVORITES,
} from '../constants/types';
import { fetchCountriesPending } from './countries';
import { getCitiesList, getFavoriteCitiesList } from '../selectors/cities';
import _ from 'lodash';

export const fetchCitiesPending = () => ({
  type: FETCH_CITIES_PENDING,
});

export const fetchCitiesSuccess = (cities) => ({
  type: FETCH_CITIES_SUCCESS,
  cities,
});

export const fetchCitiesError = (error) => ({
  type: FETCH_CITIES_ERROR,
  error,
});

export const fetchCityPopulationPending = () => ({
  type: FETCH_CITY_POPULATION_PENDING,
});

export const fetchCityPopulationSuccess = (city) => ({
  type: FETCH_CITY_POPULATION_SUCCESS,
  city,
});

export const fetchCityPopulationError = (error) => ({
  type: FETCH_CITY_POPULATION_ERROR,
  error,
});

export const filterCitiesSuccess = (cities) => ({
  type: FILTER_CITIES,
  cities,
});

export const sortCitiessSucces = (cities) => ({
  type: SORT_CITIES,
  cities,
});

export const addCityToFavoritesSuccess = (city) => ({
  type: ADD_CITY_TO_FAVORITES,
  city,
});

export const fetchCities = (countryName) => (dispatch) => {
  dispatch(fetchCountriesPending());
  const params = { country: countryName };

  return axios
    .post(process.env.REACT_APP_FETCH_CITIES_URL, params)
    .then(({ data }) => dispatch(fetchCitiesSuccess(data.data)))
    .catch((error) => dispatch(fetchCitiesError(error.msg)));
};

export const filterCities = (cityName) => (dispatch, getState) => {
  const state = getState();
  const remainingCities = getCitiesList(state).filter((el) =>
    el.toLowerCase().includes(cityName.toLowerCase())
  );

  return dispatch(filterCitiesSuccess(remainingCities));
};

export const sortCities = (type) => (dispatch, getState) => {
  const state = getState();
  const citiesList = getCitiesList(state);
  const sortedCities =
    type === 'asc' ? citiesList.sort() : citiesList.sort().reverse();

  return dispatch(sortCitiessSucces(sortedCities));
};

export const fetchCityPopulation = (cityName) => (dispatch) => {
  dispatch(fetchCityPopulationPending());
  const params = { city: cityName };

  return axios
    .post(process.env.REACT_APP_FETCH_CITY_POPULATION_URL, params)
    .then(({ data }) => dispatch(fetchCityPopulationSuccess(data.data)))
    .catch((error) => dispatch(fetchCityPopulationError(error.msg)));
};

export const addCityToFavorites =
  (cityName, countryName) => (dispatch, getState) => {
    let cityPopulation = null;
    const favoriteCities = getFavoriteCitiesList(getState());

    const isFavorite = _.find(favoriteCities, (city) => city.name === cityName);

    if (!_.isEmpty(isFavorite)) {
      return;
    }

    dispatch(fetchCityPopulation(cityName))
      .then(({ city }) => {
        cityPopulation = city.populationCounts;
      })
      .catch((error) => dispatch(fetchCityPopulationError(error.msg)));

    const city = {
      country: countryName,
      name: cityName,
      population: cityPopulation ? cityPopulation : [],
      timestamp: Date.now(),
    };

    return dispatch(addCityToFavoritesSuccess(city));
  };
