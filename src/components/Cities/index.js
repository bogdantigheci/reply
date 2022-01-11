import React, { useEffect, useCallback, useState } from 'react';
import {
  Button,
  InputGroup,
  Input,
  Table,
  ButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  InputGroupText,
} from 'reactstrap';
import { connect } from 'react-redux';
import {
  fetchCities,
  filterCities,
  sortCities,
  addCityToFavorites,
} from '../../actions/cities';
import _ from 'lodash';
import './style.scss';

const Cities = ({
  cities,
  countryName,
  goBack,
  fetchCities,
  filterCities,
  sortCities,
  addCityToFavorites,
}) => {
  const [sortType, setSortType] = useState('asc');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortTypes = ['asc', 'desc'];

  useEffect(() => {
    fetchCities(countryName);
  }, [countryName]);

  const handleDebounce = useCallback(_.debounce(filterCities, 1000), []);

  const handleFilterCities = (ev) => {
    const value = ev && ev.target && ev.target.value;

    return value !== '' ? handleDebounce(value) : fetchCities(countryName);
  };

  const handleCityClick = (cityName) => {};

  const handleAddToFavorite = (cityName, countryName) => {
    addCityToFavorites(cityName, countryName);
  };

  const toggleSortDropdown = () => setShowSortDropdown(!showSortDropdown);

  const handleSortCities = (type) => {
    setSortType(type);
    sortCities(type);
  };

  return (
    <div className="cities container">
      <Button onClick={() => goBack()}>Back</Button>
      <div>
        <InputGroup>
          <InputGroupText>Search by</InputGroupText>
          <Input
            onChange={(ev) => handleFilterCities(ev)}
            placeholder="City name..."
          />
        </InputGroup>
        <ButtonDropdown
          isOpen={showSortDropdown}
          toggle={() => toggleSortDropdown()}
        >
          <DropdownToggle caret>Sorted {sortType}</DropdownToggle>
          <DropdownMenu>
            {sortTypes.map((type) => (
              <DropdownItem
                id={type}
                key={type}
                onClick={() => handleSortCities(type)}
              >
                Sort {type}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </ButtonDropdown>
      </div>
      <Table bordered>
        <thead>
          <tr>
            <th>Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cities.map((city) => {
            return (
              <tr key={city}>
                <td onClick={() => handleCityClick(city)}>{city}</td>
                <td>
                  <Button
                    onClick={() => handleAddToFavorite(city, countryName)}
                    color="success"
                  >
                    Add Favorite
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

const mapStateToProps = (state) => ({
  cities: state.cities,
});

const mapDispatchToProps = (dispatch) => ({
  fetchCities: (countryName) => dispatch(fetchCities(countryName)),
  filterCities: (cityName) => dispatch(filterCities(cityName)),
  sortCities: (type) => dispatch(sortCities(type)),
  addCityToFavorites: (cityName, countryName) =>
    dispatch(addCityToFavorites(cityName, countryName)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Cities);
