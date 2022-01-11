import React, { useState, useCallback } from 'react';
import {
  Table,
  ButtonDropdown,
  Button,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  InputGroup,
  Input,
  InputGroupText,
} from 'reactstrap';
import { connect } from 'react-redux';
import _ from 'lodash';
import './style.scss';

const Favorites = ({ favoriteCities }) => {
  const [sortType, setSortType] = useState('asc');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [favoriteCitiesList, setFavoriteCitiesList] = useState(favoriteCities);
  const sortTypes = ['asc', 'desc'];

  const handleSortFavoriteCities = (type) => {
    setSortType(type);
    const sortedFavoriteCities = _.orderBy(
      favoriteCitiesList,
      ['name'],
      [type]
    );
    console.log('asdasdasdadasdsasdasdasd', sortedFavoriteCities);
    setFavoriteCitiesList(sortedFavoriteCities);
  };

  const filterFavoriteCities = (cityName) => {
    const filteredFavoriteCities = favoriteCities.filter((city) => {
      return city.name.toLowerCase().includes(cityName.toLowerCase());
    });

    setFavoriteCitiesList(filteredFavoriteCities);
  };

  const handleDebounce = useCallback(_.debounce(filterFavoriteCities, 100), []);

  const handleFilterCities = (ev) => {
    const value = ev && ev.target && ev.target.value;
    return value !== ''
      ? handleDebounce(value)
      : setFavoriteCitiesList(favoriteCities);
  };

  const handleExport = () => {
    const replacer = (key, value) => (value === null ? '' : value);
    const header = Object.keys(favoriteCitiesList[0]);
    const csv = [
      header.join(','),
      ...favoriteCitiesList.map((row) =>
        header
          .map((fieldName) => JSON.stringify(row[fieldName], replacer))
          .join(',')
      ),
    ].join('\r\n');

    const blob = new Blob([csv], {
      type: 'text/csv',
    });

    const filename = 'Favorite cities list';

    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      const anchor = document.createElement('a');
      document.body.appendChild(anchor);
      const url = window.URL.createObjectURL(blob);
      anchor.href = url;
      anchor.download = filename;
      anchor.click();

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(anchor);
      }, 100);
    }
  };

  const toggleSortDropdown = () => setShowSortDropdown(!showSortDropdown);
  return (
    <div className="favorites container">
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
              onClick={() => handleSortFavoriteCities(type)}
            >
              Sort {type}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </ButtonDropdown>
      <Button onClick={() => handleExport()}>Export as CSV</Button>
      <Table bordered>
        <thead>
          <tr>
            <th>City name</th>
            <th>Country</th>
            <th>Date added</th>
          </tr>
        </thead>
        <tbody>
          {favoriteCitiesList.map((city) => {
            return (
              <tr key={city.name}>
                <td>{city.name}</td>
                <td>{city.country}</td>
                <td>{city.timestamp}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

const mapStateToProps = (state) => ({
  favoriteCities: state.favoriteCities,
});

export default connect(mapStateToProps)(Favorites);
