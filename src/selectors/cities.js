import _ from 'lodash';

export const getCitiesList = (state) => _.get(state, 'cities', []);
export const getFavoriteCitiesList = (state) =>
  _.get(state, 'favoriteCities', []);
