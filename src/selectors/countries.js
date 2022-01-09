import _ from 'lodash';

export const getCountriesList = (state) => _.get(state, 'countries', []);

