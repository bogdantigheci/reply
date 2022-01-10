import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import {
  fetchCountries,
  removeCountry,
  filterCountries,
  sortCountries,
  filterCountriesByCoords,
} from '../../actions/countries';
import { getCountriesList } from '../../selectors/countries';
import {
  Table,
  PaginationItem,
  PaginationLink,
  Pagination,
  Button,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  InputGroup,
  Input,
} from 'reactstrap';
import _ from 'lodash';
import Cities from '../Cities';
import { useDebouncedCallback } from 'use-debounce';
import './style.scss';

const Countries = ({
  countries,
  fetchCountries,
  removeCountry,
  filterCountries,
  sortCountries,
  filterCountriesByCoords,
}) => {
  useEffect(() => {
    fetchCountries();
  }, []);

  const [currentPage, setCurrentPage] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [showPageSizeOptions, setShowPageSizeOptions] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortType, setSortType] = useState('asc');
  const pageSizeOptions = [10, 20, 30, 50, 100];
  const sortOptions = ['asc', 'desc'];
  const [showCities, setShowCities] = useState(false);
  const [selectedCountryName, setSelectedCountryName] = useState('');
  const [lat, setLat] = useState('');
  const [long, setLong] = useState('');

  const [pagesNo, setPagesNo] = useState(1);

  useEffect(() => {
    setPagesNo(parseInt(countries.length / resultsPerPage));
  }, [countries, resultsPerPage]);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    setCurrentPage(index);
  };

  const handlePrevioustPageClick = (e, index) => {
    e.preventDefault();
    setCurrentPage(index - 1);
  };

  const handleNextPageClick = (e, index) => {
    e.preventDefault();
    setCurrentPage(index + 1);
  };

  const getPageNumbers = (numOfPages) => {
    return [...Array(numOfPages)].map((page, i) => (
      <PaginationItem key={i}>
        <PaginationLink onClick={(e) => handlePageClick(e, i)} href="#">
          {i + 1}
        </PaginationLink>
      </PaginationItem>
    ));
  };

  const handleRemoveCountry = (country) => removeCountry(country);

  const togglePageSizeDropdown = () =>
    setShowPageSizeOptions(!showPageSizeOptions);

  const toggleSortDropdown = () => setShowSortDropdown(!showSortDropdown);

  const handlePageSizeChange = (option) => setResultsPerPage(option);

  const handleDebounce = useCallback(_.debounce(filterCountries, 1000), []);
  const handleDebouncedLatValue = useCallback(_.debounce(setLat, 1000), []);
  const handleDebouncedLongValue = useCallback(_.debounce(setLong, 1000), []);

  const handleFilterCountries = (ev) => {
    const value = ev && ev.target && ev.target.value;

    return value !== '' ? handleDebounce(value) : fetchCountries();
  };

  const handleFilterCountriesByCoords = (ev, coordType) => {
    const value = ev && ev.target && ev.target.value;
    const parsedValue = value.toString().split(',');

    coordType === 'lat' && handleDebouncedLatValue(parsedValue);
    coordType === 'long' && handleDebouncedLongValue(parsedValue);
  };

  useEffect(() => {
    console.log('lat', lat, long);
    if (lat && lat[0] !== '' && long && long[0] !== '') {
      const coords = {
        lat: lat.toString().split(','),
        long: long.toString().split(','),
      };

      filterCountriesByCoords(coords);
    } else {
      fetchCountries();
    }
  }, [lat, long]);

  const handleSortCountries = (type) => {
    setSortType(type);
    sortCountries(type);
  };

  const handleSelectCountry = (countryName) => {
    setShowCities(true);
    setSelectedCountryName(countryName);
  };

  return showCities ? (
    <Cities
      countryName={selectedCountryName}
      goBack={() => setShowCities(false)}
    />
  ) : (
    <div className="countries container">
      <div className="d-flex flex-column">
        <InputGroup>
          <Input
            type="text"
            onChange={(ev) => handleFilterCountries(ev)}
            placeholder="Country name..."
          />
        </InputGroup>
        <InputGroup>
          <Input
            type="text"
            onChange={(ev) => handleFilterCountriesByCoords(ev, 'lat')}
            placeholder="Latitude"
          />
          <Input
            type="text"
            onChange={(ev) => handleFilterCountriesByCoords(ev, 'long')}
            placeholder="Longitude"
          />
        </InputGroup>
        <ButtonDropdown
          isOpen={showSortDropdown}
          toggle={() => toggleSortDropdown()}
        >
          <DropdownToggle caret>{sortType}</DropdownToggle>
          <DropdownMenu>
            {sortOptions.map((type) => (
              <DropdownItem
                id={type}
                key={type}
                onClick={() => handleSortCountries(type)}
              >
                {type}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </ButtonDropdown>
      </div>
      <Table bordered>
        <thead>
          <tr>
            <th>Name</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {countries
            .slice(
              currentPage * resultsPerPage,
              (currentPage + 1) * resultsPerPage
            )
            .map((country) => {
              return (
                <tr key={country.iso2}>
                  <td onClick={() => handleSelectCountry(country.name)}>
                    {country.name}
                  </td>
                  <td>{country.lat}</td>
                  <td>{country.long}</td>
                  <td>
                    <Button
                      onClick={() => handleRemoveCountry(country)}
                      color="danger"
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
      <div className="d-flex justify-content-center">
        <Pagination aria-label="Table pagination">
          <PaginationItem>
            <PaginationLink
              first
              disabled={currentPage === 0}
              onClick={(e) => handlePageClick(e, 0)}
              href="#"
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              previous
              onClick={(e) => handlePrevioustPageClick(e, currentPage)}
              href="#"
            />
          </PaginationItem>
          {getPageNumbers(pagesNo)}
          <PaginationItem>
            <PaginationLink
              next
              onClick={(e) => handleNextPageClick(e, currentPage)}
              href="#"
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              onClick={(e) => handlePageClick(e, pagesNo)}
              href="#"
              last
              disabled={currentPage === pagesNo}
            />
          </PaginationItem>
        </Pagination>
        <ButtonDropdown
          isOpen={showPageSizeOptions}
          toggle={() => togglePageSizeDropdown()}
        >
          <DropdownToggle caret>{resultsPerPage}</DropdownToggle>
          <DropdownMenu>
            {pageSizeOptions.map((option) => (
              <DropdownItem
                id={option}
                key={option}
                onClick={() => handlePageSizeChange(option)}
              >
                {option}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </ButtonDropdown>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  countries: getCountriesList(state),
});

const mapDispatchToProps = (dispatch) => ({
  fetchCountries: () => dispatch(fetchCountries()),
  removeCountry: (country) => dispatch(removeCountry(country)),
  filterCountries: (value) => dispatch(filterCountries(value)),
  sortCountries: (type) => dispatch(sortCountries(type)),
  filterCountriesByCoords: (countries) =>
    dispatch(filterCountriesByCoords(countries)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Countries);
