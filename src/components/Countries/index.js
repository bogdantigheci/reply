import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchCountries } from '../../actions/countries';
import { Table, PaginationItem, PaginationLink, Pagination } from 'reactstrap';

const Countries = ({ countries, fetchCountries }) => {
  useEffect(() => {
    fetchCountries();
  }, []);

  const [currentPage, setCurrentPage] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(30);

  const [pagesNo, setPagesNo] = useState(0);

  useEffect(() => {
    setPagesNo(parseInt(countries.countries.length / 30));
  }, [countries]);

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

  return (
    <>
      <Table bordered>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {countries.countries
            .slice(
              currentPage * resultsPerPage,
              (currentPage + 1) * resultsPerPage
            )
            .map((country) => {
              return (
                <tr key={country.iso2}>
                  <td>{country.name}</td>
                </tr>
              );
            })}
        </tbody>
      </Table>
      <Pagination aria-label="Page navigation example">
        <PaginationItem>
          <PaginationLink
            first
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
          />
        </PaginationItem>
      </Pagination>
    </>
  );
};

const mapStateToProps = (state) => ({
  countries: state.countries,
});

const mapDispatchToProps = (dispatch) => ({
  fetchCountries: (url) => dispatch(fetchCountries(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Countries);
